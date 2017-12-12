const Joi = require('joi');


let unit = Joi.object({
    "name": Joi.string(),
    "short": Joi.string(),
    "_id": Joi.string()
});

let temperature = Joi.object({
    "_id": Joi.string(),
    "unit": unit,
    "value": Joi.number(),
    "timestamp": Joi.date().timestamp()
});

let humidity = Joi.object({
    "_id": Joi.string(),
    "unit": unit,
    "value": Joi.number(),
    "timestamp": Joi.date().timestamp()
});

let co2 = Joi.object({
    "_id": Joi.string(),
    "value": Joi.number(),
    "unit": unit,
});

let tvoc = Joi.object({
    "_id": Joi.string(),
    "value": Joi.number(),
    "unit": unit,
});

let airQuality = Joi.object({
    "_id": Joi.string(),
    "tvoc": Joi.array().items(tvoc),
    "co2": Joi.array().items(co2),
    "timestamp": Joi.date().timestamp()
});

let thingy = Joi.object({
    "_id": Joi.string(),
    "description": Joi.string(),
    "macAddress": Joi.string()
});



let thingyWithAll = Joi.object({
    "_id": Joi.string(),
    "description": Joi.string(),
    "macAddress": Joi.string(),
    "humidities": Joi.array().items(humidity),
    "airQualities": Joi.array().items(airQuality),
    "temperatures": Joi.array().items(temperature)
});

let thingyWithHumidities = Joi.object({
    "_id": Joi.string(),
    "description": Joi.string(),
    "macAddress": Joi.string(),
    "humidities": Joi.array().items(humidity),
});

let thingyWithAirQualities = Joi.object({
    "_id": Joi.string(),
    "description": Joi.string(),
    "macAddress": Joi.string(),
    "airQualities": Joi.array().items(airQuality),
});

let thingyWithTemperatures = Joi.object({
    "_id": Joi.string(),
    "description": Joi.string(),
    "macAddress": Joi.string(),
    "temperatures": Joi.array().items(temperature),
});

let terrarium = Joi.object({
    _id: Joi.string(),
    name: Joi.string()
});

module.exports = {
    unit: unit,
    temperature: temperature,
    humidity: humidity,
    airQuality: airQuality,
    co2: co2,
    tvoc: tvoc,
    thingy: thingy,
    thingyWithAll: thingyWithAll,
    thingyWithHumidities: thingyWithHumidities,
    thingyWithAirQualities: thingyWithAirQualities,
    thingyWithTemperatures: thingyWithTemperatures,
    terrarium: terrarium
};
