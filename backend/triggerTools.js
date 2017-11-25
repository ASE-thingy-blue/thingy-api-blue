const Mongoose = require('mongoose');

let ThresholdViolation = Mongoose.model('ThresholdViolation');

/**
 * Process new violations
 *
 * thingy: The Thingy the violation occured on
 * violations: The list of new violations on that Thingy
 */
let processNewViolation = function(thingy, violations) {
    // TODO: mail and other triggers here
}

/**
 * Check the given Thingy for violations and update them.
 * Newly added violations will be passed to the processNewViolation function.
 */
let updateThresholds = function(thingy) {
    let thresholds = thingy.targetConfiguration.thresholds;

    let current = {
	    temperature: thingy.temperatures[thingy.temperatures.length-1],
	    humidity: thingy.humidities[thingy.humidities.length-1],
	    co2: thingy.airQualities[thingy.airQualities.length-1].co2,
	    tvoc: thingy.airQualities[thingy.airQualities.length-1].tvoc
    }

    let violated = [];
    let unviolated = [];

    // Iterate through thresholds
    for(let threshold of thresholds) {
	let ascending = threshold.ascending;
	let lower = threshold.ascending ? threshold.disarm : threshold.arm;
	let upper = threshold.ascending ? threshold.arm : threshold.disarm;
	let hasbad = false;
	let hascentral = false;
	// Check temperature
	if (current.temperature.value <= lower.temperature.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.temperature.value >= higher.temperature.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// Check humidity
	if (current.humidity.value <= lower.humidity.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.humidity.value >= higher.humidity.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// Check CO2
	if (current.co2.value <= lower.co2.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.co2.value >= higher.co2.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// Check TVOC
	if (current.tvoc.value <= lower.tvoc.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.tvoc.value >= higher.tvoc.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// Analyze
	if (hasbad) {
	    violated.push(threshold);
	}  else if (!hascentral) {
	    unviolated.push(threshold);
	}
    }

    // Ignore unviolated that do not occur on Thingy
    thingy.thresholdViolations.forEach( e => unviolated = unviolated.filter( u => u == e.threshold ) );
    // Remove unviolated from Thingy
    let filtered = thingy.thresholdViolations.filter( e => !unviolated.includes(e) );
    // Determine which violations already exist
    filtered.forEach( e => violated = violated.filter( v => v != e.threshold ) );
    // Create violation objects
    violated = violated.map( e => new ThresholdViolation({threshold: e}) );
    // Add violations to Thingy
    violated.forEach( e => thingy.thresholdViolations.push(e) );
    // Asynchronous violation processing
    if (violated.length > 0) {
	setTimeout( () => processNewViolation(thingy, violated) , 0);
    }
}

module.exports = {
	updateThresholds : updateThresholds
}
