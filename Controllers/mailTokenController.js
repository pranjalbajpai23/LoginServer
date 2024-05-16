const RefreshStore = require("../Model/RefreshStore");

// for adding phonenumber to database
const handlePhoneNumber = async (req, res) => {
  if (!req?.body?.id || !req?.body?.phoneNumber) {
    return res
      .status(400)
      .json({ message: "PhoneNumber and ID both are required!" });
  }
  try {
    const setUser = await RefreshStore.findByIdAndUpdate(
      { _id: req.body.id }, //checks if user with suplied user ID exists
      { $set: { phoneNumber: req.body.phoneNumber } }, //sets/updates phoneNumber
      { upsert: true, new: true } //upsert updates or sets the phoneNumber if not present, new returns the updated table
    );
    if (!setUser) {
      console.log("User ID not found, hence created new");
    }
    console.log(setUser);
    return res
      .status(200)
      .json({ message: "Phone Number updated Sucessfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in storing Phone Number" });
  }
};

//for stroing gmailId against the refresh token
const storeGmailRefreshToken = async (req, res) => {
  if (!req?.body?.id || !req?.body?.gmailID || !req?.body?.refresh)
    return res
      .status(400)
      .json({ message: "Email and refresh token are required!" });

  try {
    const foundUser = await RefreshStore.findById(req.body.id);
    if (foundUser) {
      const gmailId = req.body.gmailID;

      // Check if gmailData exists
      if (!foundUser.gmailData) {
        foundUser.gmailData = new Map();
      }

      foundUser.gmailData.set(gmailId, { gmailRefreshToken: req.body.refresh });
      // Save the updated document
      const updatedDoc = await foundUser.save();
      console.log(updatedDoc);
      return res
        .status(200)
        .json({ message: "Refresh Token Updated Successfully!" });
    } else {
      return res.status(404).json({
        message: "User not found. Please try again.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const retrieveRefreshToken = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(401).json({ message: "User id not found" });
  }

  const id = req.params.id;

  try {
    const foundUser = await RefreshStore.findOne({ _id: id });
    console.log(foundUser.gmailData);

    if (foundUser && foundUser.gmailData) {
      console.log("Gmail Data found");
      //********need to save in array */
      const gmailDataObject = {};
      for (const [key, value] of foundUser.gmailData.entries()) {
        gmailDataObject[key] = value;
      }
      return res.status(200).json({ data: gmailDataObject });
    } else {
      console.log("Gmail Data not found");
      return res.status(404).json({ message: "Gmail Data not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const add_email_list_handler = async (req, res) => {
  console.log("Email - ");
  if (!req?.body?.id || !req?.body?.email)
    return res.status(400).json({ message: "User Id and Email are required!" });
  
  const id = req.body.id;
  const emailId = req.body.email;
  RefreshStore.findByIdAndUpdate(
    { _id: id },
    { $push: { email_list: emailId } }
  )
    .then((updatedDocument) => {
      const emailArray = Object.values(updatedDocument.email_list);
      return res.status(200).json({ data: emailArray });
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      return res.status(404).json({
        message: "User not found. Please try again.",
      });
    });
};

const email_list_handler = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(401).json({ message: "User id not found" });
  }
  console.log("Email - ");
  const id = req.params.id;

  try {
    const foundUser = await RefreshStore.findOne({ _id: id });
    console.log(foundUser.gmailData);

    if (foundUser && foundUser.email_list) {
      console.log("Email list found");
      const emailArray = Object.values(foundUser.email_list);
      return res.status(200).json({ data: emailArray });
    } else {
      console.log("Email list not found");
      return res.status(404).json({ message: "Email list not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  handlePhoneNumber,
  storeGmailRefreshToken,
  retrieveRefreshToken,
  add_email_list_handler,
  email_list_handler,
};
