const { Signup, Login, Logout } = require("../controllers/authController");
const { userVerification } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.get('/verify-auth', userVerification, (req, res) => {
    res.json({ status: true, message: "User is authenticated" });
});

module.exports = router;