const express = require("express");
const router = express.Router();
const mailTokenController = require("../../Controllers/mailTokenController");

router.route("/").post(mailTokenController.storeGmailRefreshToken);

router.route("/:id").get(mailTokenController.retrieveRefreshToken);
module.exports = router;
