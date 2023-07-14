import express from 'express'
import requireAuth from '../../middleware/requireAuth'
import ContactListController from '../../controllers/contactListController'

const router = express.Router()

router.use(requireAuth)
router.route("/")
    .get(ContactListController.getContactList)
    .post(ContactListController.requestContact)
    .delete(ContactListController.removeContact)

router.route("/request")
    .post(ContactListController.acceptContactRequest)
    .delete(ContactListController.rejectRequestContact)

export default router