import express from 'express'
import requireAuth from '../../middleware/requireAuth'
import ContactListController from '../../controllers/contactListController'

const router = express.Router()

router.use(requireAuth)
router.route("/")
    .get(ContactListController.getContactList)
    .post(ContactListController.addContact)


export default router