const User = require("../Model/User");
const bcrypt = require("bcrypt");

//NOTE 
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.status(409).json({message:"Username already exist"}); //Conflict

  //if we come this far then the user needs to be created 
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user
    const newUser = await User.create({
      username: user,
      password: hashedPwd,
    });

    //**********************REMOVE BELOW CONSOLE LOG *****************/
    console.log(newUser);


    res.status(201).json({ success: `New user ${user} created!`,userId:newUser.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
