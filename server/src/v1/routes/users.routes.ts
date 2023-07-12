import express from 'express'
import UserController from "../../controllers/userController"
import requireAuth from '../../middleware/requireAuth'

const router = express.Router()

router.route("/signup")
    .post(UserController.signup)

router.route("/login")
    .post(UserController.login)

router.route("/logout")
    .get(UserController.logout)

router.route("/users")
    .get(UserController.getUser)

router.route("/session")
    .get(UserController.getUserBySession)


export default router