"use client";

import React from "react";
import {
  Font,
  Image,
  StyleSheet,
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

// Registrare i font Arial
Font.register({
  family: "Arial",
  fonts: [
    { src: "/fonts/ARIAL.TTF", fontWeight: "normal", fontStyle: "normal" },
    { src: "/fonts/ARIALBD.TTF", fontWeight: "bold", fontStyle: "normal" },
    { src: "/fonts/ARIALI.TTF", fontWeight: "normal", fontStyle: "italic" },
    { src: "/fonts/ARIALBI.TTF", fontWeight: "bold", fontStyle: "italic" },
  ],
});

Font.register({
  family: "DejaVuSans",
  fonts: [
    {
      src: "/fonts/DejaVuSans.ttf",
      fontStyle: "normal",
    },
  ],
});

Font.register({
  family: "ArialNarrow",
  fonts: [
    {
      src: "/fonts/arialnarrow.ttf", // Regular
      fontStyle: "normal",
    },
    {
      src: "/fonts/arialnarrow_bold.ttf", // Regular
      fontStyle: "bold",
    },
  ],
});

// Stili per il documento PDF
const styles = StyleSheet.create({
  page: {
    paddingTop: "4cm",
    paddingBottom: "2cm",
    paddingLeft: "2cm",
    paddingRight: "2cm",
    fontSize: 10,
    position: "relative",
    fontStyle: "italic",
    lineHeight: "1.15",
    fontFamily: "Arial",
  },
  logo: {
    position: "absolute",
    top: 10,
    left: 0,
    width: 240,
    height: 95,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    textAlign: "left",
    fontSize: 9,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "#000000",
    opacity: 0.5,
    color: "rgba(0, 0, 0, 0.5)",
    paddingTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    fontFamily: "ArialNarrow",
    fontStyle: "normal",
    marginBottom: 16,
  },
  footerSection: {
    paddingHorizontal: 0,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 1,
    fontWeight: "light",
  },
  footerText: {},
  icon: {
    width: 8,
    height: 8,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  textRight: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 16,
  },
  inlineBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 0,
  },
  list: {
    paddingLeft: 10,
  },
  customParagraph: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
  },
  listItemBullet: {
    marginRight: 5,
    fontSize: 12,
    color: "#000",
    fontFamily: "DejaVuSans",
    fontStyle: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecoration: "underline",
  },
  b: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  i: {
    fontStyle: "italic",
  },
  u: {
    textDecoration: "underline",
  },
  boldText: {
    fontWeight: "bold",
    fontStyle: "normal", // Aggiungi questo per assicurarti che non sia in corsivo
  },
  strong: {
    fontWeight: "bold",
    fontStyle: "normal", // Aggiungi questo
  },
  dejaVuSans: {
    fontFamily: "DejaVuSans",
    fontStyle: "normal", // Aggiungi questo per assicurarti che non sia in corsivo
  },
  bullet: {
    fontFamily: "DejaVuSans",
    fontStyle: "normal",
    fontSize: 12,
    color: "#000",
    // marginRight: 3,
  },
  arrow: {
    fontFamily: "DejaVuSans",
    fontStyle: "normal", // Aggiungi questo per assicurarti che non sia in corsivo
    fontSize: 12,
    color: "#000",
    // marginRight: 3,
    // paddingRight: 4,
    // marginRight: 4,
  },
  requestedConfigurationRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    // marginBottom: 5,
  },
  requestedConfigurationText: {
    flex: 1,
    marginRight: 10,
  },
  requestedConfigurationPrice: {
    fontSize: 10,
    // fontWeight: "bold",
  },
  maxWidth80: {
    maxWidth: "85%",
  },
  trailerPriceText: {
    fontWeight: "bold",
    fontStyle: "normal", // Aggiungi questo per assicurarti che non sia in corsivo
    textDecoration: "underline", // Sottolineatura per il testo del prezzo
    textDecorationThickness: "2px",
    marginTop: 5,
  },
  watermark: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    fontSize: 70,
    color: "rgba(0, 0, 0, 0.05)", // Trasparenza
    transform: "rotate(-45deg)",
    zIndex: -1, // Assicura che la filigrana sia dietro il contenuto
  },
});

function formatHtmlString(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Extract the first paragraph and retain its inner HTML to keep nested tags
  const paragraph = doc.querySelector("p");
  const paragraphInnerHTML = paragraph ? paragraph.innerHTML : "";
  // Extract paragraph styles and classes
  const paragraphStyle = paragraph ? paragraph.getAttribute("style") || "" : "";
  const paragraphClass = paragraph ? paragraph.getAttribute("class") || "" : "";

  // Extract the list items and filter out empty ones
  const listItems = doc.querySelectorAll("ul li");

  // Generate the formatted HTML by retaining inline styles, classes, and nested tags
  const formattedHtml = `
  <div>
    <div class="${paragraphClass} container" style="${paragraphStyle}; display: flex; flex-direction: row; align-items: baseline; gap: 5px;">
    <span style="font-family: DejaVuSans; font-size: 12px; padding-right: 5px;">&#10147;</span>
    <p class="containerText">${paragraphInnerHTML}</p>
  </div>

    <ul style="list-style-type: none; padding-left: 5px;"> <!-- Added padding -->
      ${Array.from(listItems)
        .map((li) => {
          const liInnerHTML = li.innerHTML.trim();
          if (!liInnerHTML) return ""; // Skip empty items

          return `
            <li style="display: flex; align-items: start; padding: 0;">
              <span style="font-family: DejaVuSans; font-size: 12px; margin-right: 5px;">&#10003;</span>
              ${liInnerHTML}
            </li>
          `;
        })
        .join("")}
    </ul>
  </div>
`;

  return formattedHtml;
}

const htmlStyles = StyleSheet.create({
  p: {
    margin: 0, // Rimuovi margini superiori e inferiori
    padding: 0, // Rimuovi padding, se necessario
    // Rimuovi 'display: flex' qui
  },
  ul: {
    marginTop: 0,
    marginBottom: 0,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "baseline", // Allinea gli elementi alla linea di base del testo
  },
});

const customRenders = {
  span: (node: any, style: any) => {
    // Controlla se il contenuto del <span> è il simbolo &#10147;
    if (node.children && node.children === "&#10147;") {
      return (
        <Text key={node.key} style={styles.arrow}>
          &#10147;
        </Text>
      );
    } else if (node.children === "&#10003;") {
      return (
        <Text key={node.key} style={styles.bullet}>
          &#10003;
        </Text>
      );
    }
    return (
      <Text key={node.key} style={style}>
        {node.children}
      </Text>
    );
  },
};

function formatNumberWithSeparators(number: number) {
  // Use Intl.NumberFormat to format the number
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

// Componente del documento PDF
const PdfPreventivoFormat = ({
  personState,
  personCity,
  personName,
  formattedDate,
  defaultConfigurations,
  trailerName,
  trailerDescription,
  requestConfigurations,
  showRequestedConfigurationsPrice,
  totalBasedTrailerPrice,
  showBasedTrailerPrice,
  totalPrice,
  numberDay = 30,
  optionalConfigurations,
}: {
  personState: string;
  personName: string;
  personCity: string;
  formattedDate: string;
  defaultConfigurations: string[];
  trailerName: string;
  trailerDescription: string;
  requestConfigurations: { text: string; price: number }[];
  showRequestedConfigurationsPrice?: boolean;
  totalBasedTrailerPrice: number;
  showBasedTrailerPrice?: boolean;
  totalPrice: number;
  numberDay: number;
  optionalConfigurations: { text: string; price: number }[];
}) => {
  return (
    <Document style={{ margin: 0, padding: 0 }}>
      <Page size="A4" style={styles.page}>
        {/* <View style={styles.watermark}>
          <Text>BOZZA - SENZA VALORE LEGALE</Text>
        </View> */}

        {/* Logo in alto */}
        <Image style={styles.logo} src="/logo.png" fixed />

        {/* Blocco con dati della persona */}
        <View>
          <View style={[styles.textRight]}>
            <View style={styles.inlineBlock}>
              <Text style={styles.textCenter}>{personState}</Text>
              <Text style={[styles.boldText, styles.textCenter]}>
                {personName}
              </Text>
              <Text style={styles.textCenter}>{personCity}</Text>
            </View>
          </View>

          <View style={styles.section}>
            {/* Cavour, {formattedDate} */}
            <Text>Cavour, {formattedDate}</Text>
          </View>

          <View style={styles.section}>
            {/* Oggetto: preventivo (prot. XXXX) */}
            <Text>Oggetto: preventivo (prot. XXXX)</Text>
          </View>

          <View style={styles.section}>
            {/* Testo relativo all'offerta */}
            <Text>
              Con la presente siamo a comunicare la ns. migliore offerta per la
              fornitura del rimorchio agricolo sotto indicato:
            </Text>
          </View>

          <View style={styles.section}>
            {/* <Text style={styles.bold}>Macchina base:</Text> */}
            <View style={[styles.customParagraph, { marginBottom: 3 }]}>
              <Text>01 x </Text>
              <Text style={{ fontSize: 10 }}>
                <Html style={{ fontSize: 10 }}>{trailerName}</Html>
              </Text>
            </View>
            <Html
              renderers={customRenders}
              stylesheet={htmlStyles}
              style={{ fontSize: 10 }}
            >
              {formatHtmlString(trailerDescription)}
            </Html>

            {/* Render the configurations */}
            {defaultConfigurations?.map((conf, index) => {
              return (
                <Html
                  renderers={customRenders}
                  stylesheet={htmlStyles}
                  key={index}
                  style={{ fontSize: 10 }}
                >
                  {formatHtmlString(conf)}
                </Html>
              );
            })}
          </View>

          {showBasedTrailerPrice && (
            <View style={styles.textRight}>
              <Html style={[styles.trailerPriceText, { fontSize: 10 }]}>
                {`<span style={text-underline-offset: 3px;}>Euro ${formatNumberWithSeparators(
                  totalBasedTrailerPrice
                )} + IVA</span>`}
              </Html>
            </View>
          )}

          {requestConfigurations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.bold}>Accessori richiesti:</Text>
              {requestConfigurations.map((requestedConfig, index) => {
                const isPositivePrice = requestedConfig.price >= 0;
                const priceSign = isPositivePrice ? "+" : "-";

                return (
                  <View key={index} style={styles.requestedConfigurationRow}>
                    <View
                      style={[
                        styles.requestedConfigurationText,
                        showRequestedConfigurationsPrice
                          ? styles.maxWidth80
                          : {},
                      ]}
                    >
                      {/* Visualizzazione del testo */}
                      <Html
                        renderers={customRenders}
                        stylesheet={htmlStyles}
                        key={index}
                        style={{ fontSize: 10 }}
                      >
                        {formatHtmlString(requestedConfig.text)}
                      </Html>
                    </View>

                    {/* Visualizzazione del prezzo */}
                    {showRequestedConfigurationsPrice && (
                      <View style={styles.requestedConfigurationPrice}>
                        <Text>
                          {priceSign}{" "}
                          {formatNumberWithSeparators(
                            Math.abs(requestedConfig.price)
                          )}{" "}
                          €
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.section}>
            <Text>
              Macchinario conforme alle normative C.E. per le macchine agricole
            </Text>
            <Text>
              Completo di manuale C.E. uso e manutenzione – Macchinario
              garantito 12 mesi
            </Text>
            <Text>
              Validità preventivo: {numberDay}{" "}
              {numberDay > 1 ? "giorni" : "giorno"}
            </Text>
          </View>

          <View style={styles.textRight}>
            <Html style={[styles.trailerPriceText, { fontSize: 10 }]}>
              {`<span style={text-underline-offset: 10px;}>Euro ${formatNumberWithSeparators(
                totalPrice
              )} + IVA</span>`}
            </Html>
          </View>

          {optionalConfigurations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.bold}>Accessori opzionali:</Text>
              {optionalConfigurations.map((optionalConfig, index) => {
                const isPositivePrice = optionalConfig.price >= 0;
                const priceSign = isPositivePrice ? "+" : "-";

                return (
                  <View key={index} style={styles.requestedConfigurationRow}>
                    <View
                      style={[
                        styles.requestedConfigurationText,
                        styles.maxWidth80,
                      ]}
                    >
                      {/* Visualizzazione del testo */}
                      <Html
                        renderers={customRenders}
                        stylesheet={htmlStyles}
                        key={index}
                        style={{ fontSize: 10 }}
                      >
                        {formatHtmlString(optionalConfig.text)}
                      </Html>
                    </View>

                    {/* Visualizzazione del prezzo */}
                    <View style={styles.requestedConfigurationPrice}>
                      <Text>
                        {priceSign}{" "}
                        {formatNumberWithSeparators(
                          Math.abs(optionalConfig.price)
                        )}{" "}
                        €
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.section}>
            <Text>
              Restiamo in attesa di ricevere Vs. riscontro in merito e con
              l&apos;occasione porgiamo distinti saluti.
            </Text>
          </View>
        </View>
        {/* Footer personalizzato */}
        <View style={styles.footer} fixed>
          <View style={styles.footerSection}>
            <Text
              style={[
                styles.footerText,
                { fontStyle: "bold", color: "rgba(0, 0, 0, 1)" },
              ]}
            >
              Ruetta s.r.l.
            </Text>
            <Text style={styles.footerText}>
              Via Camposanto, 5 - 10061 CAVOUR (TO)
            </Text>
            <Text style={styles.footerText}>TEL/FAX +39 0121 69069</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              info@ruetta.it - ruettasrl@legalmail.it
            </Text>
            <Text style={styles.footerText}>P.IVA 12014180017</Text>
            <Text style={styles.footerText}>REA: TO - 1258902</Text>
          </View>
          <View style={styles.footerSection}>
            {/* Riga con icona WhatsApp e numero Paolo */}
            <View style={styles.row}>
              <Image style={styles.icon} src="/images/whatsapp.png" />
              <Text style={styles.footerText}>Paolo 338 6229917</Text>
            </View>
            {/* Riga con icona WhatsApp e numero Maurizio */}
            <View style={styles.row}>
              <Image style={styles.icon} src="/images/whatsapp.png" />
              <Text style={styles.footerText}>Maurizio 333 9001753</Text>
            </View>
            {/* Riga con icone Facebook e Instagram */}
            <View style={styles.row}>
              <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                <Image
                  style={styles.icon}
                  src="/images/facebook-app-symbol.png"
                />
                <Image style={styles.icon} src="/images/instagram.png" />
              </View>
              <Text style={styles.footerText}>www.rimorchiruetta.com</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfPreventivoFormat;
