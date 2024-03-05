const mongoose = require("mongoose");
const refreshSchema = new mongoose.Schema({
  gmailID: {
    type: String,
    unique: true,
  },
  gmailRefreshToken: {
    type: String,
    required: true,
  },
});

module.exports=mongoose.model('RefreshStore',refreshSchema);