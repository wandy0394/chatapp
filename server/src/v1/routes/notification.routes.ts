import express from 'express'
import requireAuth from '../../middleware/requireAuth'
import { Response } from 'express'
import { NotificationService } from '../../services/notificationService'
import NotificationController from '../../controllers/notificationController'

const router = express.Router()



router.use(requireAuth)
router.route("/")
    .get(NotificationController.register)



export default router