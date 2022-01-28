const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth.controller");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Invalid email format").isEmail(),
    check("password", "Password must be more than 6 characters").isLength({
      min: 6,
    }),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "Google token_id is required").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
