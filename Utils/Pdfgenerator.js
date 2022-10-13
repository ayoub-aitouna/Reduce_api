var html_to_pdf = require("html-pdf-node");
const { Pdf_contract_template } = require("./Templates.js");
let options = { format: "A4" };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

const Generate_contract_Pdf = async (partner_data) => {
	return new Promise((res, rej) => {
		try {
			html_to_pdf
				.generatePdf(Pdf_contract_template(partner_data), options)
				.then((pdfBuffer) => {
					console.log("PDF Buffer:-", pdfBuffer);
					const { url } = UploadBuffer(pdfBuffer);
					res(url);
				});
		} catch (err) {
			rej(err);
		}
	});
};

module.exports = { Generate_contract_Pdf };
