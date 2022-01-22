const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { isValidRole, emailExist, userExistsById } = require("../helpers/db-validators");
const {
  usersPost,
  usersGet,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/users.controller");
const router = Router();

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be more than 6 characters").isLength({
      min: 6,
    }),
    check("email", "Invalid email format").isEmail(),
    check("email").custom(emailExist),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPost
);

router.get("/", usersGet);

router.put("/:id", [
  check('id', 'Invalid MongoDB ID').isMongoId(),
  check('id').custom(userExistsById),
  check('role').custom(isValidRole),
  validateFields
], usersPut);

router.delete("/:id", [
  check('id', 'Invalid MongoDB ID').isMongoId(),
  check('id').custom(userExistsById),
  validateFields
],usersDelete);

router.patch("/:id", usersPatch);

module.exports = router;
