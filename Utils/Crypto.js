// Requiring module
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const Encrypte = async (password) => {
  return new Promise(async (res, rej) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let hash_password = await bcrypt.hash(password, salt);
      res(hash_password);
    } catch (err) {
      rej(err);
    }
  });
};
const compare = (password, hashedPassword) => {
  return new Promise(async (res, rej) => {
    bcrypt.compare(password, hashedPassword, async function (err, isMatch) {
      if (err) rej(err);
      res(isMatch);
    });
  });
};


const cipher = (str) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ACCESS_TOKEN_SECRET);
  let encrypted = cipher.update(str, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return (encrypted);
}

module.exports = { Encrypte, compare, cipher };
