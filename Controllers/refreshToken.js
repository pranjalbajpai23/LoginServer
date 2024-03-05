const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.status(401).json({message:"not getting jwt cookies "});
  const refreshToken = cookies.jwt;
  console.log(refreshToken);
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403); 
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
