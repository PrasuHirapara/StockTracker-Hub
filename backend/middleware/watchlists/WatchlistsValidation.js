const Joi = require('joi');

const WatchlistSchema = Joi.object({
  email: Joi.string().email().required(),
  value: Joi.object().pattern(Joi.string(), Joi.array().items(Joi.string())).required()
});

module.exports = { WatchlistSchema };