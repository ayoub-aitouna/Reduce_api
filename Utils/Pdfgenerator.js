const pdf = require("html-pdf");
const { Pdf_contract_template } = require("./Templates.js");
const Generate_contract_Pdf = async (partner_data) => {
  const { content } = Pdf_contract_template(partner_data);
  return new Promise((res, rej) => {
    try {
      pdf.create(content, {}).toFile("Result.pdf", (err) => {
        if (err) {
          console.log(err);
          rej(err);
        } else {
          console.log("OK");
          res("Result.pdf");
        }
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
};

module.exports = { Generate_contract_Pdf };
