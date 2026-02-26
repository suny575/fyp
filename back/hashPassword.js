import bcrypt from "bcryptjs";

const plainPassword = "yourSecurePassword"; // change this

const hashPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  console.log("Hashed password:\n", hashed);
};

hashPassword();