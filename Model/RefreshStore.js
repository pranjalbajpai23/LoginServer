const mongoose = require("mongoose");
const refreshSchema = new mongoose.Schema({
  gmailData: {
    type: Map,
    of: {
      // gmailId: String,
      // gmailRefreshToken: String,
    },
  },
  phoneNumber: {
    type: String,
  },
  email_list:[String]
});

module.exports = mongoose.model("RefreshStore", refreshSchema);
