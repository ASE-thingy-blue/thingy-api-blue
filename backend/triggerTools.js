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
    // TODO: Mail and other triggers here
    var message = 'A sensor of the Thingy "' + thingy.macAddress + '" (' + thingy.description + ') registered ' + violations.length + ' value(s) being outside of the defined range:\n\n';
    violations.forEach(v => {
        message += '- ' + v.title + '\n';
    });
    message += '\nRegards\nTermon API Service';

    // Replace all occurrences of newlines
    var messageHtml = message.replace(/\n/g, '<br/>');
    mailer.sendMail(usersMailAddress, 'Termon: Measuring value(s) outside of range', message, messageHtml);
};

/**
 * Check the given Thingy for violations and update them.
 * Newly added violations will be passed to the processNewViolation function.
 */
let updateThresholds = function (thingy, usersMailAddress) {
    // unconfigured thingies can be ignored
    if (thingy.targetConfiguration === undefined)
    {
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
        let lower = threshold.ascending ? threshold.disarm : threshold.arm;
        let upper = threshold.ascending ? threshold.arm : threshold.disarm;
        let hasbad = false;
        let hascentral = false;
        // Check temperature
        if (threshold.sensor === 2) {
            if (current.temperature.value <= lower.temperature.value) {
                hasbad = !ascending || hasbad;
            } else if (current.temperature.value >= upper.temperature.value) {
                hasbad = ascending || hasbad;
            } else {
                hascentral = true;
            }
        }
        // Check humidity
        if (threshold.sensor === 1) {
            if (current.humidity.value <= lower.humidity.value) {
                hasbad = !ascending || hasbad;
            } else if (current.humidity.value >= upper.humidity.value) {
                hasbad = ascending || hasbad;
            } else {
                hascentral = true;
            }
        }
        // Check CO2
        if (threshold.sensor === 4) {
            if (current.co2.value <= lower.co2.value) {
                hasbad = !ascending || hasbad;
            } else if (current.co2.value >= upper.co2.value) {
                hasbad = ascending || hasbad;
            } else {
                hascentral = true;
            }
        }
        // Check TVOC
        if (threshold.sensor === 3) {
            if (current.tvoc.value <= lower.tvoc.value) {
                hasbad = !ascending || hasbad;
            } else if (current.tvoc.value >= upper.tvoc.value) {
                hasbad = ascending || hasbad;
            } else {
                hascentral = true;
            }
        }
        // Analyze
        if (hasbad) {
            violated.push(threshold);
        } else if (!hascentral) {
            unviolated.push(threshold);
        }
    }

    // New Thingies have no threshold violation list defined, create one if it is missing
    if (thingy.thresholdViolations === undefined) {
        thingy.thresholdViolations = [];
    }
    // Ignore unviolated that do not occur on Thingy
    thingy.thresholdViolations.forEach(e => { unviolated = unviolated.filter(u => { u === e.threshold; }); });
    // Remove unviolated from Thingy
    let filtered = thingy.thresholdViolations.filter(e => { !unviolated.includes(e); });
    // Determine which violations already exist
    filtered.forEach(e => { violated = violated.filter(v => { v !== e.threshold; }); });
    // Create violation objects
    violated = violated.map(e => { new ThresholdViolation({threshold: e}); });
    // Add violations to Thingy
    violated.forEach(e => { thingy.thresholdViolations.push(e); });
    // Asynchronous violation processing
    if (violated.length > 0) {
        setTimeout(() => { processNewViolation(thingy, usersMailAddress, violated); }, 0);
    }
};

module.exports = {
    updateThresholds: updateThresholds
};
