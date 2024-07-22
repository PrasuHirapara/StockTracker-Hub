const Joi = require('joi');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, success: false });
    }
    next();
  };
};

module.exports = validateBody;