const express = require("express");
const router = express.Router();
const mailTokenController = require("../../Controllers/mailTokenController");

router.route("/").get(mailTokenController.storeGmailRefreshToken);

module.exports = router;
