const express = require("express");
const router = express.Router();
const mailTokenController = require("../../Controllers/mailTokenController");

router.route("/rt/").post(mailTokenController.storeGmailRefreshToken);
router.route('/ph/').post(mailTokenController.handlePhoneNumber);
router.route("/:id").get(mailTokenController.retrieveRefreshToken);
module.exports = router;
