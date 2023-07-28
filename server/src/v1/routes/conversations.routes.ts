import express from 'express'
import requireAuth from '../../middleware/requireAuth'
import ConversationController from '../../controllers/conversationController'

const router = express.Router()

router.use(requireAuth)
router.route("/")
    .get(ConversationController.getConversations)
    .post(ConversationController.createConversation)
    .delete(ConversationController.leaveConversation)
    
router.route("/history/:conversationUUID")
    .get(ConversationController.getConversationHistory)

export default router