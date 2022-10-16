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
	return {
		content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Contrat</title>
    <style type="text/css">
      * {
        margin: 0;
        padding: 20px;
        text-indent: 0;
      }
      .s1 {
        color: #7f7f7f;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 8pt;
      }
      h2 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 9pt;
      }
      .a,
      a {
        color: #00c;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: underline;
        font-size: 9pt;
      }
      p {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9pt;
        margin: 0pt;
      }
      h1 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: bold;
        text-decoration: none;
        font-size: 15pt;
      }
      .s3 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9pt;
      }
      .s4 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9pt;
      }
      .s5 {
        color: black;
        font-family: "Times New Roman", serif;
        font-style: normal;
        font-weight: normal;
        text-decoration: none;
        font-size: 9pt;
      }
      table,
      tbody {
        vertical-align: top;
        overflow: visible;
      }
    </style>
  </head>
  <body>
    <p style="text-indent: 0pt; text-align: left" />
    <p
      class="s1"
      style="
        padding-top: 4pt;
        padding-left: 12pt;
        text-indent: 0pt;
        text-align: left;
      "
    >
      Image not found or type unknown
    </p>
    <h2 style="padding-left: 86pt; text-indent: 0pt; text-align: left">
      REDUCTE
    </h2>
    <p style="padding-left: 86pt; text-indent: 0pt; text-align: left">
      <a href="https://www.reducte.com/" class="a" target="_blank"
        >www.reducte.com</a
      ><a
        href="mailto:partenaires@reducte.ma"
        style="
          color: #00c;
          font-family: 'Times New Roman', serif;
          font-style: normal;
          font-weight: normal;
          text-decoration: none;
          font-size: 9pt;
        "
        target="_blank"
      >
      </a
      ><a href="mailto:partenaires@reducte.ma" target="_blank"
        >partenaires@reducte.ma</a
      >
    </p>
    <p style="padding-left: 86pt; text-indent: 0pt; text-align: left">
      zenith buisness center ETG 3 N14 40000 - Marrakech, Maroc
    </p>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <h1 style="padding-left: 45pt; text-indent: 0pt; text-align: center">
      Convention de Partenariat
    </h1>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <table
      style="border-collapse: collapse; margin-left: 6.141pt"
      cellspacing="0"
    >
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Detail de la société
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            PARTENAIRE
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            REDUCTE
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Nom de la société
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            KOOP MASTER
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Réducte
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            ICE
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            003104105000075
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            003030945000087
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Nom de représentant
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Youssef elabid
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            MDAGHRI ALAOUI Zakaria
          </p>
        </td>
      </tr>
      <tr style="height: 29pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              padding-right: 10pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Fonction du représentant
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s3"
            style="padding-left: 7pt; text-indent: 0pt; text-align: left"
          >
            Gérant
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
          <p
            class="s3"
            style="padding-left: 7pt; text-indent: 0pt; text-align: left"
          >
            CEO
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Téléphone
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            0648484838
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            0663 161 043
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Email
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            <a href="mailto:youssef@koop.ma" class="s4">youssef@koop.ma</a>
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            <a href="mailto:partenaires@reducte.ma" class="s4"
              >partenaires@reducte.ma</a
            >
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Adresse de la société
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Av dakhla massira 1c. N527 Marrakech
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Zenith buisness center etg3 n14
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Ville
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            MARRAKECH
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Marrakech
          </p>
        </td>
      </tr>
      <tr style="height: 19pt">
        <td
          style="
            width: 103pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            Offre
          </p>
        </td>
        <td
          style="
            width: 256pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
            border-bottom-style: solid;
            border-bottom-width: 1pt;
            border-right-style: solid;
            border-right-width: 1pt;
          "
        >
          <p
            class="s3"
            style="
              padding-top: 3pt;
              padding-left: 7pt;
              text-indent: 0pt;
              text-align: left;
            "
          >
            -10%
          </p>
        </td>
        <td
          style="
            width: 154pt;
            border-top-style: solid;
            border-top-width: 1pt;
            border-left-style: solid;
            border-left-width: 1pt;
          "
        >
          <p style="text-indent: 0pt; text-align: left"><br /></p>
        </td>
      </tr>
    </table>
    <p style="text-indent: 0pt; text-align: left" />
    <p
      style="
        padding-top: 13pt;
        padding-left: 29pt;
        text-indent: 0pt;
        text-align: left;
      "
    >
      Nous nous engageons à fournir au partenaire mentionné ci-dessus un
      affichage de son logo et informations de contact sur notre site web et
      notre application mobile gratuitement au niveau de la section réservée aux
      partenaires pour une durée indéterminée.
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire mentionné ci-dessus s’engage à accepter tout client
      provenant de la part de REDUCTE.
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire mentionné ci-dessus s’engage à respecter l&#39;offre
      mentionnée ci-dessus vis-à-vis de tous les clients provenant de la part de
      REDUCTE dont l&#39;abonnement est actif.
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire mentionné ci-dessus s’engage à afficher un autocollant
      fourni par REDUCTE mettant en avant son partenariat avec REDUCTE
      (dimensions de l’autocollant 10 cm x 15 cm).
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire s’engage à respecter la confidentialité des clients en
      s&#39;abstenant de divulguer les informations de ces derniers obtenu de
      l&#39;interface partenaires REDUCTE.
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire mentionné ci-dessus s’engage à ne pas appliquer l&#39;offre
      mentionné ci-dessus à des clients dont l’abonnement est expiré. L’accord
      qui lie les deux parties peut-être résilié à tout moment à condition de
      respecter la période de préavis de 15 jours, l&#39;envoi du préavis devra
      se faire par e-mail.
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Le partenaire mentionné ci-dessus s’oblige à communiquer toute information
      nécessaire au bon fonctionnement de REDUCTE et de respecter les conditions
      de travail de REDUCT
    </p>
    <p style="text-indent: 0pt; text-align: left" />
    <p style="text-indent: 0pt; text-align: left" />
    <p style="padding-left: 29pt; text-indent: 0pt; text-align: left">
      Tout point non traité sera traité par la législation en vigueur NB: Le
      retour de ce courriel vaut acceptation.
    </p>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <h2 style="text-indent: 0pt; text-align: right">
      A MARRAKECH Le 05/10/2022 16:44
    </h2>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <p
      style="
        padding-top: 4pt;
        padding-left: 45pt;
        text-indent: 0pt;
        text-align: center;
      "
    >
      ZAKARIA MDAGHRI ALAOUI
    </p>
    <p style="padding-left: 45pt; text-indent: 0pt; text-align: center">
      Représentant de REDUCTE
    </p>
    <p class="s1" style="text-indent: 0pt; line-height: 9pt; text-align: left">
      Image not found or type unknown
    </p>
    <p style="padding-left: 150pt; text-indent: 0pt; text-align: left" />
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <p style="text-indent: 0pt; text-align: left"><br /></p>
    <p style="padding-left: 45pt; text-indent: 0pt; text-align: center">
      <a href="mailto:partenaires@reducte.ma" class="s5" target="_blank"
        >Tel: 06 63 16 10 43 , Email: </a
      ><a href="http://www.reducte.com/" class="s5" target="_blank"
        >partenaires@reducte.ma web: www.reducte.com</a
      >
    </p>
    <p style="padding-left: 45pt; text-indent: 0pt; text-align: center">
      zenith buisness centre etg 3 n14 Marrakech maroc - ICE: 003030945000087
      RC: 123941 IF: 51832067 CNSS: 4089085
    </p>
  </body>
</html>
`,
	};
};

const EmailTemplate = (PartnerData) => {
	return `<h1>Email I sent${PartnerData.email}</h1>`;
};

module.exports = { Pdf_contract_template, EmailTemplate };
