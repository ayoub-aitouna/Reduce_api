const Pdf_contract_template = (partner_data) => {
	const {
		email,
		nome_entreprise,
		identificateur_entreprise,
		representant_entreprise,
		role_dans_entriprise,
		numero_telephone_fix,
		ville,
		activity_entrprise,
		offer,
	} = partner_data;
	return { content: `<h1>Welcome to html-pdf-node</h1>` };
};

const EmailTemplate = (PartnerData) => {
	return `<h1>Email I sent${PartnerData.email}</h1>`;
};

module.exports = { Pdf_contract_template, EmailTemplate };
