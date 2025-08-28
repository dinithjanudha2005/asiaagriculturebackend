"use strict";

const Joi = require("joi");

const authorizationHeaderObj = Joi.object({
  authorization: Joi.string()
    .required()
    .description("Bearer space accessToken : Bearer space accessToken"),
  timezone: Joi.string()
    .default("Asia/Kolkata")
    .optional()
    .description("time zone"),
  offset: Joi.number().default("0").optional().description("time zone offset"),
  language: Joi.string()
    .trim()
    .default("en")
    .required()
    .description("language code"),
}).unknown();

const headerObject = {
  required: Joi.object({
    timezone: Joi.string()
      .default("Asia/Kolkata")
      .optional()
      .description("time zone"),
    offset: Joi.number()
      .default("0")
      .optional()
      .description("time zone offset"),
    language: Joi.string()
      .trim()
      .default("en")
      .required()
      .description("language code"),
  }).unknown(),
};

const failActionFunction = async function (req, res, next) {
  try {
    // For Express.js, we'll use a simple validation middleware approach
    return next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Validation failed"
    });
  }
};

module.exports = { authorizationHeaderObj, headerObject, failActionFunction };
