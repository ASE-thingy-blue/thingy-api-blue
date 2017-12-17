const Mongoose = require('mongoose');
const mailer = require('./mailer');

let ThresholdViolation = Mongoose.model('ThresholdViolation');

/**
 * Process new violations
 *
 * @param thingy: The Thingy the violation occured on.
 * @param usersMailAddress: Mail address of the user to whom the Thingy belongs.
 * @param violations: The list of new violations on that Thingy.
 */
let processNewViolation = function (thingy, usersMailAddress, violations) {
    const sensors = {
        0: 'No Sensor defined',
        1: 'Humidity Sensor',
        2: 'Temperature Sensor',
        3: 'TVOC Sensor',
        4: 'CO2 Sensor'
    };

    let message = 'A sensor of the Thingy "' + thingy.macAddress + '" (' + thingy.description + ') registered ' + violations.length + ' value(s) being outside of the defined range:\n\n';
    violations.forEach(v => {
        let sensorName = sensors[v.threshold.sensor];
        let description = v.threshold.ascending?'Value is too high':'Value is too low';
        message += '- ' + sensorName + ' (since: ' + v.since + ') \n';
        message += '--- Level: ' + v.threshold.severity + '\n';
        message += '--- ' + description + '\n';
        message += '\n';
    });
    message += '\nRegards\nTermon API Service';

    // Replace all occurrences of newlines
    let messageHtml = message.replace(/\n/g, '<br/>');
    mailer.sendMail(usersMailAddress, 'Termon: Measuring value(s) outside of range', message, messageHtml);
};

/**
 * Check the given Thingy for violations and update them.
 * Newly added violations will be passed to the processNewViolation function.
 */
let updateThresholds = function (thingy, usersMailAddress) {
    // unconfigured thingies can be ignored
    if (thingy.targetConfiguration === undefined) {
        return;
    }
    let thresholds = thingy.targetConfiguration.thresholds;

    let current = {
        temperature: thingy.temperatures[thingy.temperatures.length - 1],
        humidity: thingy.humidities[thingy.humidities.length - 1],
        co2: thingy.airQualities[thingy.airQualities.length - 1].co2,
        tvoc: thingy.airQualities[thingy.airQualities.length - 1].tvoc
    };

    let violated = [];
    let unviolated = [];

    // Iterate through thresholds
    for (let threshold of thresholds) {
        let ascending = threshold.ascending;
        let limit = threshold.arm;
        let hasbad = false;
        // Check temperature
        if (threshold.sensor === 2) {
            if (current.temperature.value < limit) {
                hasbad = !ascending || hasbad;
            } else if (current.temperature.value > limit) {
                hasbad = ascending || hasbad;
            }
        }
        // Check humidity
        if (threshold.sensor === 1) {
            if (current.humidity.value < limit) {
                hasbad = !ascending || hasbad;
            } else if (current.humidity.value > limit) {
                hasbad = ascending || hasbad;
            }
        }
        // Check CO2
        if (threshold.sensor === 4) {
            if (current.co2.value < limit) {
                hasbad = !ascending || hasbad;
            } else if (current.co2.value > limit) {
                hasbad = ascending || hasbad;
            }
        }
        // Check TVOC
        if (threshold.sensor === 3) {
            if (current.tvoc.value < limit) {
                hasbad = !ascending || hasbad;
            } else if (current.tvoc.value > limit) {
                hasbad = ascending || hasbad;
            }
        }
        // Analyze
        if (hasbad) {
            violated.push(threshold);
        } else {
            unviolated.push(threshold);
        }
    }

    // New Thingies have no threshold violation list defined, create one if it is missing
    if (thingy.thresholdViolations === undefined) {
        thingy.thresholdViolations = [];
    }
    // Ignore unviolated that do not occur on Thingy
    thingy.thresholdViolations.forEach( e => unviolated = unviolated.filter( u => u === e.threshold ) );
    // Remove unviolated from Thingy
    let filtered = thingy.thresholdViolations.filter( e => !unviolated.includes(e.threshold) );
    // Determine which violations already exist
    filtered.forEach( e => violated = violated.filter( v => v !== e.threshold ) );
    // Create violation objects
    violated = violated.map( e => new ThresholdViolation({threshold: e}) );
    // Add violations to Thingy
    violated.forEach( e => {
	e.save();
	thingy.thresholdViolations.push(e);
    });
    // Asynchronous violation processing
    if (violated.length > 0) {
        setTimeout(() => { processNewViolation(thingy, usersMailAddress, violated); }, 0);
    }
};

module.exports = {
    updateThresholds: updateThresholds
};
