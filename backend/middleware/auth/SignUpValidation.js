const joi = require('joi');
const { signup } = require('../../cotroller/auth/AuthController');

const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required(),
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(400).json({message: "Bad Request", error})
    }

    next();
};

const signinValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required(),
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(400).json({message: "Bad Request", error})
    }

    next();
};

module.exports = {
    signupValidation,
    signinValidation
}