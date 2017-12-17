const Mongoose = require("mongoose");

var User = Mongoose.model("User");
var TargetConfiguration = Mongoose.model("TargetConfiguration");
var Threshold = Mongoose.model("Threshold");

module.exports = {

    configUpdate: function (request, reply) {
	User.findOne({name: request.auth.credentials.userName})
	.exec(function (err, user) {
	    let terra = user.terrariums.id(request.params.terrariumId);
            if (!terra) {
                return reply({
                    "Error": "User has no terrarium with the given ID",
                    id: request.params.terrariumId
                }).code(404);
            }

            let thingy = terra.thingies.id(request.params.thingyId);
            if (!thingy) {
                return reply({
                    "Error": "Terrarium has no Thingy with the given ID",
                    id: request.params.thingyId
                }).code(404);
            }

            if (err) {
                console.error(err);
                return reply({"Error": "User not found"}).code(404);
            }
            
            // create new configuration
            let raw = request.payload.config;
            let tconf = new TargetConfiguration({title:"default"});
            
            /*
             * The following code is duplicated 16 times.
             * This was necessary since iterating intelligently over the nested data structure would be hell.
             */
            // HUMIDITY
            if (raw.upper.danger.humidity.enabled) {
		let t =  new Threshold({severity: "danger", ascending: true, sensor: 1, arm: raw.upper.danger.humidity.arm});
		tconf.thresholds.push(t);
            }
            if (raw.upper.warning.humidity.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: true, sensor: 1, arm: raw.upper.warning.humidity.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.danger.humidity.enabled) {
        		let t =  new Threshold({severity: "danger", ascending: false, sensor: 1, arm: raw.lower.danger.humidity.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.warning.humidity.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: false, sensor: 1, arm: raw.lower.warning.humidity.arm});
        		tconf.thresholds.push(t);
            }
            // TEMP
            if (raw.upper.danger.temp.enabled) {
		let t =  new Threshold({severity: "danger", ascending: true, sensor: 2, arm: raw.upper.danger.temp.arm});
		tconf.thresholds.push(t);
            }
            if (raw.upper.warning.temp.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: true, sensor: 2, arm: raw.upper.warning.temp.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.danger.temp.enabled) {
        		let t =  new Threshold({severity: "danger", ascending: false, sensor: 2, arm: raw.lower.danger.temp.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.warning.temp.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: false, sensor: 2, arm: raw.lower.warning.temp.arm});
        		tconf.thresholds.push(t);
            }
            // tvoc
            if (raw.upper.danger.tvoc.enabled) {
		let t =  new Threshold({severity: "danger", ascending: true, sensor: 3, arm: raw.upper.danger.tvoc.arm});
		tconf.thresholds.push(t);
            }
            if (raw.upper.warning.tvoc.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: true, sensor: 3, arm: raw.upper.warning.tvoc.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.danger.tvoc.enabled) {
        		let t =  new Threshold({severity: "danger", ascending: false, sensor: 3, arm: raw.lower.danger.tvoc.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.warning.tvoc.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: false, sensor: 3, arm: raw.lower.warning.tvoc.arm});
        		tconf.thresholds.push(t);
            }
            // co2
            if (raw.upper.danger.co2.enabled) {
		let t =  new Threshold({severity: "danger", ascending: true, sensor: 4, arm: raw.upper.danger.co2.arm});
		tconf.thresholds.push(t);
            }
            if (raw.upper.warning.co2.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: true, sensor: 4, arm: raw.upper.warning.co2.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.danger.co2.enabled) {
        		let t =  new Threshold({severity: "danger", ascending: false, sensor: 4, arm: raw.lower.danger.co2.arm});
        		tconf.thresholds.push(t);
            }
            if (raw.lower.warning.co2.enabled) {
        		let t =  new Threshold({severity: "warning", ascending: false, sensor: 4, arm: raw.lower.warning.co2.arm});
        		tconf.thresholds.push(t);
            }
            
            // save configuration
            thingy.targetConfiguration = tconf;
           
            user.save((err) => {
                if (err) {
                    return reply({"message": "Something went wrong! Terrarium configuration not saved"}).code(500);
                }

                return reply({
                    "success": true,
                    message: "Thingy configuration updated",
                    id: request.params.terrariumId
                }).code(200);
            });
        });
    },
	
    thingyUpdate: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .exec(function (err, user) {
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
                    }).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({
                        "Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId
                    }).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                thingy.description = request.payload.description;

                user.save((err) => {
                    if (err) {
                        return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                    }

                    return reply({
                        "success": true,
                        message: "Thingy updated",
                        id: request.params.terrariumId
                    }).code(200);
                });
            });
    },

    thingyMove: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .exec(function (err, user) {
                let terraOld = user.terrariums.id(request.params.terrariumId);
                if (!terraOld) {
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId
                    }).code(404);
                }

                let thingy = terraOld.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({
                        "Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId
                    }).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                let terraNew = user.terrariums.id(request.payload.terrarium);
                if(!terraNew){
                    return reply({
                        "Error": "User has no terrarium with the given ID",
                        id: request.payload.terrarium
                    }).code(404);
                }

                terraOld.thingies.splice(terraOld.thingies.indexOf(thingy), 1);
                terraNew.thingies.push(thingy);

                user.save((err) => {
                    if (err) {
                        return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                    }

                    return reply({
                        "success": true,
                        message: "Thingy moved"
                    }).code(200);
                });
            });
    },

    thingyDelete: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
        .exec(function (err, user) {
            let terra = user.terrariums.id(request.params.terrariumId);
            if (!terra) {
                return reply({
                    "Error": "User has no terrarium with the given ID",
                    id: request.params.terrariumId
                }).code(404);
            }

            let thingy = terra.thingies.id(request.params.thingyId);
            if (!thingy) {
                return reply({
                    "Error": "Terrarium has no Thingy with the given ID",
                    id: request.params.thingyId
                }).code(404);
            }

            if (err) {
                console.error(err);
                return reply({"Error": "User not found"}).code(404);
            }

            terra.thingies.splice(terra.thingies.indexOf(thingy), 1);
            user.save((err) => {
                if (err) {
                    return reply({"message": "Something went wrong! Terrarium not saved"}).code(500);
                }

                return reply({
                    "success": true,
                    message: "Thingy was deleted",
                    id: request.params.terrariumId
                }).code(200);
            });
        });
    },

    thingyValues: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var airQs = [];
                    var hums = [];
                    var temps = [];

                    thingy.airQualities.forEach(function (airQ) {
                        if (airQ.timestamp >= from && airQ.timestamp <= to) {
                            airQs.push(airQ);
                        }
                    });

                    thingy.temperatures.forEach(function (temp) {
                        if (temp.timestamp >= from && temp.timestamp <= to) {
                            temps.push(temp);
                        }
                    });

                    thingy.humidities.forEach(function (hum) {
                        if (hum.timestamp >= from && hum.timestamp <= to) {
                            hums.push(hum);
                        }
                    });

                    thingy.airQualities = airQs;
                    thingy.temperatures = temps;
                    thingy.humidities = hums;

                    if (limit) {
                        thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                        thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                        thingy.humidities.splice(limit, thingy.humidities.length - limit);
                    }
                } else {
                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyConfiguration: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                } else {
                    let terra = user.terrariums.id(request.params.terrariumId);
                    if (!terra) {
                        return reply({"Error": "User has no terrarium with the given ID",
                            id: request.params.terrariumId}).code(404);
                    }

                    let thingy = terra.thingies.id(request.params.thingyId);
                    let config = thingy.targetConfiguration;
                    // base structure
                    let result = {
                	    	upper: {
                	    	    danger: {
                	    		humidity: { enabled: false, arm: 0 },
                	    		temp: { enabled: false, arm: 0 },
                	    		tvoc: { enabled: false, arm: 0 },
                	    		co2: { enabled: false, arm: 0 }},
                	    	    warning: {
                	    		humidity: { enabled: false, arm: 0 },
                	    		temp: { enabled: false, arm: 0 },
                	    		tvoc: { enabled: false, arm: 0 },
                	    		co2: { enabled: false, arm: 0 }}},
                	    	lower: {
                	    	    danger: {
                	    		humidity: { enabled: false, arm: 0 },
                	    		temp: { enabled: false, arm: 0 },
                	    		tvoc: { enabled: false, arm: 0 },
                	    		co2: { enabled: false, arm: 0 }},
                	    	    warning: {
                	    		humidity: { enabled: false, arm: 0 },
                	    		temp: { enabled: false, arm: 0 },
                	    		tvoc: { enabled: false, arm: 0 },
                	    		co2: { enabled: false, arm: 0 }}}};
                    // fill structure
                    if (config !== undefined) {
                		for (let threshold of config.thresholds) {
                		    let direction = threshold.ascending ? result.upper : result.lower;
                		    let block = (threshold.severity === "warning") ? direction.warning : direction.danger;
                		    // apply sensor (1: hum, 2: temp, 3: tvoc,
				    // 4: co2)
                		    switch(threshold.sensor) {
                		    case 1:
                			block.humidity.enabled = true;
                			block.humidity.arm = threshold.arm;
                			break;
                		    case 2:
                			block.temp.enabled = true;
                			block.temp.arm = threshold.arm;
                			break;
                		    case 3:
                			block.tvoc.enabled = true;
                			block.tvoc.arm = threshold.arm;
                			break;
                		    case 4:
                			block.co2.enabled = true;
                			block.co2.arm = threshold.arm;
                			break;
                		    default:
                			break;
                		    }
                		}
                    }
                    
                    let fullResult = {
                	    	_id: thingy._id,
                	    	macAddress: thingy.macAddress,
                	    	description: thingy.description,
                	    	config: result
                    };
                    
                    if (!thingy) {
                        return reply({"Error": "Terrarium has no Thingy with the given ID",
                            id: request.params.thingyId}).code(404);
                    }

                    reply(fullResult).code(200);
                }
        });
    },

    thingyViolations: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration")
            .exec(function (err, user) {
                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                } else {
                    let terra = user.terrariums.id(request.params.terrariumId);
                    if (!terra) {
                        return reply({"Error": "User has no terrarium with the given ID",
                            id: request.params.terrariumId}).code(404);
                    }

                    let thingy = terra.thingies.id(request.params.thingyId);
                    if (!thingy) {
                        return reply({"Error": "Terrarium has no Thingy with the given ID",
                            id: request.params.thingyId}).code(404);
                    }

                    reply(thingy).code(200);
                }
        });
    },

    thingyTemperature: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var temps = [];

                    thingy.temperatures.forEach(function (temp) {
                        if (temp.timestamp >= from && temp.timestamp <= to) {
                            temps.push(temp);
                        }
                    });

                    thingy.temperatures = temps;

                    if (limit) {
                        thingy.temperatures.splice(limit, thingy.temperatures.length - limit);
                    }
                } else {
                    thingy.temperatures = thingy.temperatures[thingy.temperatures.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyHumidity: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.temperatures -terrariums.thingies.airQualities -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var hums = [];

                    thingy.humidities.forEach(function (hum) {
                        if (hum.timestamp >= from && hum.timestamp <= to) {
                            hums.push(hum);
                        }
                    });

                    thingy.humidities = hums;

                    if (limit) {
                        thingy.humidities.splice(limit, thingy.humidities.length - limit);
                    }
                } else {
                    thingy.humidities = thingy.humidities[thingy.humidities.length - 1];
                }

                reply(thingy).code(200);
        });
    },

    thingyAirquality: function (request, reply) {
        User.findOne({name: request.auth.credentials.userName})
            .select("-terrariums.thingies.humidities -terrariums.thingies.temperatures -terrariums.thingies.targetConfiguration -terrariums.thingies.thresholdViolations")
            .exec(function (err, user) {
                var from = request.query.from;
                var to = request.query.to;
                var limit = request.query.limit;
                let terra = user.terrariums.id(request.params.terrariumId);
                if (!terra) {
                    return reply({"Error": "User has no terrarium with the given ID",
                        id: request.params.terrariumId}).code(404);
                }

                let thingy = terra.thingies.id(request.params.thingyId);
                if (!thingy) {
                    return reply({"Error": "Terrarium has no Thingy with the given ID",
                        id: request.params.thingyId}).code(404);
                }

                if (err) {
                    console.error(err);
                    return reply({"Error": "User not found"}).code(404);
                }

                if (from && to) {
                    var airQs = [];

                    thingy.airQualities.forEach(function (airQ) {
                        if (airQ.timestamp >= from && airQ.timestamp <= to) {
                            airQs.push(airQ);
                        }
                    });

                    thingy.airQualities = airQs;

                    if (limit) {
                        thingy.airQualities.splice(limit, thingy.airQualities.length - limit);
                    }
                } else {
                    thingy.airQualities = thingy.airQualities[thingy.airQualities.length - 1];
                }

                reply(thingy).code(200);
        });
    }
};
