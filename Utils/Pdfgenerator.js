var html_to_pdf = require("html-pdf-node");
const { Pdf_contract_template } = require("./Pdftemplates.js");
let options = { format: "A4" };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

const Generate_contract_Pdf = async ({
	email,
	nome_entreprise,
	identificateur_entreprise,
	representant_entreprise,
	role_dans_entriprise,
	numero_telephone_fix,
	ville,
	activity_entrprise,
	offer,
}) => {
	return new Promise((res, rej) => {
		try {
			html_to_pdf
				.generatePdf(Pdf_contract_template, options)
				.then((pdfBuffer) => {
					console.log("PDF Buffer:-", pdfBuffer);
					const { url } = UploadBuffer(pdfBuffer);
				});
		} catch (err) {
			rej(err);
		}
	});
};

module.exports = { Generate_contract_Pdf };
