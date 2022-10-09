/**
 *
 * @param {String} PhoneNumber
 * @description generate randome 6 degit key && store in redis cash
 * @returns return the stored key
 */
async function generateKeyAndstoreOtp(PhoneNumber) {
	// generate randome 6 degit key
	const key = Math.floor(Math.random() * 9000) + 1000;
	// store in redis cash
	await client.set(PhoneNumber, key);
	//return the stored key
	return key;
}
module.exports = { generateKeyAndstoreOtp };
