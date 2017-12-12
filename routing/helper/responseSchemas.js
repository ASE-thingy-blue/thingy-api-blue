const Joi = require('joi');


let unit = Joi.array().items(
    Joi.object({
        "name": Joi.string(),
        "short": Joi.string(),
        "_id": Joi.string()
    })
);

let temperature = Joi.array().items(
    Joi.object({
        "_id": Joi.string(),
        "unit": unit,
        "value": Joi.number(),
        "timestamp": Joi.date().timestamp()
    })
);

let humidity = Joi.array().items(
    Joi.object({
        "_id": Joi.string(),
        "unit": unit,
        "value": Joi.number(),
        "timestamp": Joi.date().timestamp()
    })
);

let co2 = Joi.array().items(
    Joi.object({
        "_id": Joi.string(),
        "value": Joi.number(),
        "unit": unit,
    }),
);

let tvoc = Joi.array().items(
    Joi.object({
        "_id": Joi.string(),
        "value": Joi.number(),
        "unit": unit,
    }),
);

let airQuality = Joi.array().items(
    Joi.object({
        "_id": Joi.string(),
        "tvoc": Joi.array().items(tvoc),
        "co2": Joi.array().items(co2),
        "timestamp": Joi.date().timestamp()
    })
);

let thingy = Joi.array().items(Joi.object({
        "_id": Joi.string(),
        "description": Joi.string(),
        "macAddress": Joi.string(),
        "humidities": Joi.array().items(humidity),
        "airQualities": Joi.array().items(airQuality),
        "temperatures": Joi.array().items(temperature)
    })
);

module.exports = {
    unit: unit,
    temperature: temperature,
    humidity: humidity,
    airQuality: airQuality,
    co2: co2,
    tvoc: tvoc,
    thingy: thingy
};
