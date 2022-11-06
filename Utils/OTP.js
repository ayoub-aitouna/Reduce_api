const { client } = require("../database/index.js");
/**
 *
 * @param {String} Email
 * @description generate randome 6 degit key && store in redis cash
 * @returns return the stored key
 */
async function generateKeyAndstoreOtp(Email) {
  return new Promise(async (res, rej) => {
    let key = Math.floor(Math.random() * 90000) + 100000;
    try {
      await client.set(Email, key, "EX", 60 * 10 * 1000);
    } catch (err) {
      console.log(err);
    }
    res(key);
  });
}
module.exports = { generateKeyAndstoreOtp };
