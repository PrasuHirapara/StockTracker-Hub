const Joi = require('joi');

const watchlistSchema = Joi.object({
  email: Joi.string().email().required(),
  value: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())).required()
});

module.exports = watchlistSchema;