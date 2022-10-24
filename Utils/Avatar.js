const AvatarGenerator = require("named-avatar-generator");
const Log = require("../log/index");
const { UploadFile, UploadBuffer } = require("../Utils/Files");

/**
 *
 * @param {String} name
 * @description create png avatar for user by initial letter from name and lastname
 * @returns   imag path
 */
async function GenrateAvaratByName(name) {
  return new Promise(async (resolve, reject) => {
    const path =
      __dirname +
      "/public/" +
      `/img/avatar-${name}-${new Date().getTime()}.jpg`;
    AvatarGenerator.generate({ name: name, size: 64 })
      .then((avatar) => {
        AvatarGenerator.writeAvatar(avatar, `./public${path}`);
        //  const { url } = UploadBuffer(avatar);
        resolve(path);
      })
      .catch((err) => {
        Log.error(
          `Error while Generating Avaate by Name : ${name} , err => ${err}`
        );
        reject(err);
      });
  });
}
module.exports = { GenrateAvaratByName };
