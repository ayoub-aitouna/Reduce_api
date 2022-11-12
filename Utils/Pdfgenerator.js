const pdf = require("html-pdf");
const { UploadFile, UploadBuffer, UPLOAD } = require("../Utils/Files");
const fs = require("fs");
var s_path = require("path");

const { Pdf_contract_template } = require("./Templates.js");
const { BadRequestError } = require("../errors");
const Generate_contract_Pdf = async (partner_data) => {
  const { content } = Pdf_contract_template(partner_data);
  return new Promise((res, rej) => {
    const path = `contracr_${partner_data.id}_Result.pdf`;
    try {
      pdf
        .create(content, {})
        .toFile(`${s_path.resolve("./public")}/PDF/${path}`, async (err) => {
          if (err) {
            console.log(err);
            rej({ msg: err });
          } else {
            try {
              const url = await UPLOAD("/PDF/", `${path}`);
              fs.unlinkSync(s_path.resolve("./public") + "/PDF/" + path);
              res(url);
            } catch (error) {
              throw new BadRequestError(error);
            }
          }
        });
    } catch (err) {
      rej(err);
    }
  });
};

module.exports = { Generate_contract_Pdf };
