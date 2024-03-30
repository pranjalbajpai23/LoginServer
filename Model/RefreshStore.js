const mongoose = require("mongoose");
const refreshSchema = new mongoose.Schema({
  gmailData: {
    type: Map,
    of: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model('RefreshStore',refreshSchema);