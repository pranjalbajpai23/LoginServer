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
    const foundUser = await RefreshStore.findOne({
      _id: req.body.id,
    });
    if (foundUser) {
      const gmailId = req.body.gmailID;
      const updatedDoc = await RefreshStore.findOneAndUpdate(
        { "gmailData.gmailId": gmailId },
        { $set: { "gmailData.$.gmailRefreshToken": req.body.refresh } },
        { new: true }
      );
      if (updatedDoc) {
        console.log(updatedDoc);
      } else {
        const updatedDoc = await RefreshStore.findOneAndUpdate(
          {},
          {
            $push: {
              gmailData: {
                gmailId: gmailId,
                gmailRefreshToken: req.body.refresh,
              },
            },
          },
          { new: true }
        );
        console.log(updatedDoc);
      }
      return res
        .status(200)
        .json({ message: "Refresh Token Updated Successfully!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      message: "User not found try updating your phone number again",
    });
  }
};

const retrieveRefreshToken = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(401).json({ message: "user id not found" });
  }
  const id = req.params.id;
  console.log(id);
  try {
    const foundUser = await RefreshStore.findOne({ _id: id });
    if (foundUser) {
      const refresh = foundUser.gmailRefreshToken;
      // console.log(encryptRefresh);

      return res.status(200).json({ refreshToken: refresh });
    } else {
      return res.status(400).json({ message: "refresh token not found" });
    }
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handlePhoneNumber,
  storeGmailRefreshToken,
  retrieveRefreshToken,
};
