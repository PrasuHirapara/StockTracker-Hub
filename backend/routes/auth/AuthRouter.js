const { signup, signin } = require("../../cotroller/auth/AuthController");
const { signupValidation, signinValidation } = require("../../middleware/auth/SignUpValidation");

const router = require("express").Router();

router.post('/signin', signinValidation, signin);
router.post('/signup', signupValidation, signup);

module.exports = router;