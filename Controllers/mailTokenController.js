const RefreshStore = require("../Model/RefreshStore");

const storeGmailRefreshToken = async (req, res) => {
  if (!req?.body?.id || !req?.body?.gmailID || !req?.body?.refresh)
    return res
      .status(400)
      .json({ message: "email and refresh token are required!" });
    
  try {
    const foundUser=await RefreshStore.findOne({_id:req.body.id});
    const gmail = req.body.gmailID;
    const refresh=req.body.refresh;
    console.log(gmail,refresh)
    if(foundUser){
        foundUser.gmailID = gmail;
        foundUser.gmailRefreshToken = refresh;
        const result=await foundUser.save();
        console.log(result);
        res.status(201).json({ result });
    }
    else{
        const result = await RefreshStore.create({
          gmailID: req.body.gmailID,
          gmailRefreshToken: req.body.refresh,
        });
        res.status(201).json({ result });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports={storeGmailRefreshToken}


