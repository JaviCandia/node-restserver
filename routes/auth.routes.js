const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.controller");
const { emailExist } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Invalid email format").isEmail(),
    check("password", "Password must be more than 6 characters").isLength({min: 6}),
    // check("email").custom(emailExist),
    validateFields,
  ],
  login
);

// get
// put
// delete
// patch

module.exports = router;
