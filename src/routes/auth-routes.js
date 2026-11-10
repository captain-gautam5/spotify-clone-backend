const express = require("express");
const authhandlers = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", authhandlers.registeruser);
router.post("/login", authhandlers.loginuser);
router.post("/logout", authhandlers.logoutuser);
module.exports = router;