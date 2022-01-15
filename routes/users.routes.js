const { Router } = require("express");
const {
  usersPost,
  usersGet,
  usersPut,
  usersDelete,
  usersPatch,
} = require("../controllers/users.controller");
const router = Router();

router.post("/", usersPost);

router.get("/", usersGet);

router.put("/:id", usersPut);

router.delete("/:id", usersDelete);

router.patch("/:id", usersPatch);

module.exports = router;
