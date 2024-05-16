const express = require("express");
const router = express.Router();
const mailTokenController = require("../../Controllers/mailTokenController");

router.route("/rt/").post(mailTokenController.storeGmailRefreshToken);
router.route('/ph/').post(mailTokenController.handlePhoneNumber);
router.route("/:id").get(mailTokenController.retrieveRefreshToken);
router.route("/mail_list/").post(mailTokenController.add_email_list_handler);
router.route("/mail_list/:id").get(mailTokenController.email_list_handler);
module.exports = router;
