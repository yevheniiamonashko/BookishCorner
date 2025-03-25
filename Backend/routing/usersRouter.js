import express from "express";
import us from "../controllers/usersController.js";

const router = express.Router();

router.post("/register", us.userRegister);
router.get("/user/:email", us.getUser);
router.get("/user/id/:id", us.getUserById);
router.put("/user/:userId", us.updateUserProfile);
router.get("/login", us.setLogin);

export default router;
