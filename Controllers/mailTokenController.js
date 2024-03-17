const RefreshStore = require("../Model/RefreshStore");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.REFRESH_ENCRYPTION);
const storeGmailRefreshToken = async (req, res) => {
  if (
    !req?.body?.id ||
    !req?.body?.gmailID ||
    !req?.body?.gmailID ||
    !req?.body?.phoneNumber ||
    !req?.body?.refresh
  )
    return res
      .status(400)
      .json({ message: "email and refresh token are required!" });

  try {
    const foundUser = await RefreshStore.findOne({ _id: req.body.id });
    const refresh = req.body.refresh;
    // const newRefreshToken = cryptr.encrypt(refresh);
    if (foundUser) {
      foundUser.gmailRefreshToken = refresh;
      await foundUser.save();
      res.status(201).json({ message: "refresh token updated" });
    } else {
      await RefreshStore.create({
        _id: req.body.id,
        gmailID: req.body.gmailID,
        gmailRefreshToken: req.body.refresh,
        phoneNumber: req.body.phoneNumber,
      });
      res.status(201).json({ message: "refresh token registered" });
    }
  } catch (error) {
    console.error(error);
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
      // const refresh = cryptr.decrypt(encryptRefresh);
      // working here for phoneNumber -

      return res.status(200).json({ refreshToken: refresh });
    } else {
      return res.status(400).json({ message: "refresh token not found" });
    }
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { storeGmailRefreshToken, retrieveRefreshToken };
