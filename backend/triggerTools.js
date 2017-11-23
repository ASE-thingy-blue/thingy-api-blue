const Mongoose = require('mongoose');

let ThresholdViolation = Mongoose.model('ThresholdViolation');

/**
 * process new violations
 * 
 * thingy: the thingy the violation occured on violations the list of new
 * violations on that thingy
 */
let processNewViolation = function(thingy, violations) {
    // TODO: mail and other triggers here
}

/**
 * Check the given thingy for violations and update them.
 * 
 * Newly added violations will be passed to the processNewViolation function
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
    
    // iterate through thresholds
    for(let threshold of thresholds) {
	let ascending = threshold.ascending;
	let lower = threshold.ascending ? threshold.disarm : threshold.arm;
	let upper = threshold.ascending ? threshold.arm : threshold.disarm;
	let hasbad = false;
	let hascentral = false;
	// check temperature
	if (current.temperature.value <= lower.temperature.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.temperature.value >= higher.temperature.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// check humidity
	if (current.humidity.value <= lower.humidity.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.humidity.value >= higher.humidity.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// check co2
	if (current.co2.value <= lower.co2.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.co2.value >= higher.co2.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// check tvoc
	if (current.tvoc.value <= lower.tvoc.value) {
	    hasbad = ascending ? hasbad : true;
	} else if (current.tvoc.value >= higher.tvoc.value) {
	    hasbad = ascending ? true : hasbad;
	} else {
	    hascentral = true;
	}
	// analyze
	if (hasbad) {
	    violated.push(threshold);
	}  else if (!hascentral) {
	    unviolated.push(threshold);
	}
    }
    
    // ignore unviolated that do not occur on thingy
    thingy.thresholdViolations.forEach( e => unviolated = unviolated.filter( u => u == e.threshold ) );
    // remove unviolated from thingy
    let filtered = thingy.thresholdViolations.filter( e => !unviolated.includes(e) );
    // determine which violations already exist
    filtered.forEach( e => violated = violated.filter( v => v != e.threshold ) );
    // create violation objects
    violated = violated.map( e => new ThresholdViolation({threshold: e}) );
    // add violations to thingy
    violated.forEach( e => thingy.thresholdViolations.push(e) );
    // asynchronous violation processing
    if (violated.length > 0) {
	setTimeout( () => processNewViolation(thingy, violated) , 0);
    }
}

module.exports = {
	updateThresholds : updateThresholds
}
