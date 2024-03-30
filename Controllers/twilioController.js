const RefreshStore = require("../Model/RefreshStore");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const getPhoneNumber = async (id) => {
  const foundUser = await RefreshStore.findOne({ _id: id });

  if (foundUser) {
    return foundUser.phoneNumber;
  } else {
    return 0;
  }
};

const twilioHandler = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Please supply ID" });
  }

  const id = req.body.id;
  const phoneNumber = await getPhoneNumber(id);
  if (phoneNumber) {
    const { from, subject, body } = req.body;
    // console.log(from, subject, body);
    if (!from || !subject || !body) {
      return res.status(400).json({ message: "Please supply mail content" });
    }
    const message = `Hello User you have an new email\n From: ${from}\n Subject: ${subject}\n Message: ${body}`;
    client.messages
      .create({
        body: message,
        from: "whatsapp:+14155238886",
        to: `whatsapp:+91${phoneNumber}`,
      })
      .then((message) => {
        console.log("Message sent successfully");
        res.status(200).json({ message: "Message sent successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    return res.status(400).json({ message: "No phone number found in DB" });
  }
};
module.exports = {
  twilioHandler,
};
