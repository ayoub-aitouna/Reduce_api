const pdf = require("html-pdf");
const { UploadFile, UploadBuffer } = require("../Utils/Files");

const { Pdf_contract_template } = require("./Templates.js");
const Generate_contract_Pdf = async (partner_data) => {
  const { content } = Pdf_contract_template(partner_data);
  return new Promise((res, rej) => {
    const path = `contracr_${partner_data.id}_Result.pdf`;
    try {
      pdf.create(content, {}).toFile(path, async (err) => {
        if (err) {
          console.log(err);
          rej({ msg: err });
        } else {
          const { url, message } = await UploadFile(path);
          console.trace({ url, message });
          res(url);
        }
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
};

module.exports = { Generate_contract_Pdf };
