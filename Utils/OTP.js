const { client } = require("../database/index.js");
/**
 *
 * @param {String} Email
 * @description generate randome 6 degit key && store in redis cash
 * @returns return the stored key
 */
async function generateKeyAndstoreOtp(Email) {
  // generate randome 6 degit key
  let key = Math.floor(Math.random() * 90000) + 100000;
  // store in redis cash
  client.set(Email, key, {
    EX: 60 * 60 * 10,
    NX: true,
  });
  // await client.set(, );
  //return the stored key
  return key;
}
module.exports = { generateKeyAndstoreOtp };
