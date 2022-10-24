const pdf = require("html-pdf");
const { Pdf_contract_template } = require("./Templates.js");
const Generate_contract_Pdf = async (partner_data) => {
  const { content } = Pdf_contract_template(partner_data);
  return new Promise((res, rej) => {
    const path = `./public/pdf/contracr_${partner_data.id}_Result.pdf`;
    try {
      pdf.create(content, {}).toFile(path, (err) => {
        if (err) {
          console.log(err);
          rej({ msg: err });
        } else {
          console.log("OK");
          res(__dirname + path);
        }
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
};

module.exports = { Generate_contract_Pdf };
