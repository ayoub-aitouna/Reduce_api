
/**
 *
 * @param {String} Email
 * @description generate randome 6 degit key && store in redis cash
 * @returns return the stored key
 */
async function generateKeyAndstoreOtp(Email) {
  return new Promise(async (res, rej) => {
    let key = Math.floor(Math.random() * 90000) + 100000;
    res(key);
  });
}

// Function to set OTP for an email in the session
function setOTPForEmail(req, email, otp) {
  req.session[email] = otp;
}

// Function to get OTP for an email from the session
function getOTPForEmail(req, email) {
  return req.session[email];
}

module.exports = { generateKeyAndstoreOtp, setOTPForEmail, getOTPForEmail };
