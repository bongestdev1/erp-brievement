import { Injectable } from '@angular/core';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import jspdf from 'jspdf';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { InformationsService } from './informations.service';
var htmlToPdfmake = require("html-to-pdfmake");

//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class UtiliteService {

  constructor(
    private fonctionPartages: FonctionPartagesService,
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
  ) { }


  getDataToHtml(clients) {
    var chaine = ""

    chaine = `

    <html id="monitor">

    <head>
        <meta charset="utf-8">
        <title>liste Article</title>

        <style>
            th,
            td {
              margin-left:10px;
            }
            table{
              width:100%;
            }
            body {
                padding: 50px;
            }
            h1 {
                text-align: center;
                margin : 20px;
            }
            .align-right{
              float:left;
            }
            strong{
              margin: 10px;
            }
        </style>
    </head>

    <body>
        <h1> Tableaux des articles </h1>
        <table>
            `
    for (let i = 0; i < clients.length; i++) {
      chaine += `
        <tr>
          <td><strong>Article `+ (i + 1) + `: Réference: </strong>` + clients[i].reference + `</td>
          <td class="align-right"><strong>Code Barre: </strong>`+ clients[i].codeBarre + `</td>
        </tr>
        <tr>
          <td><strong>Désignation: </strong>`+ clients[i].designation + `</td>
          <td class="align-right"><strong>Type Article: </strong>`+ clients[i].typeArticle + `</td>
        </tr>
        <tr>
          <td><strong>PrixFourn: </strong>`+ clients[i].prixFourn + `</td>
          <td class="align-right"><strong>Catégorie: </strong>`+ clients[i].categorie + `</td>
        </tr>
        <tr>
          <td><strong>Famille: </strong>`+ clients[i].famille + `</td>
          <td class="align-right"><strong>SousFamille: </strong>`+ clients[i].sousFamille + `</td>
        </tr>
        <tr>
          <td><strong>Marque: </strong>`+ clients[i].marque + `</td>
          <td class="align-right"><strong>Modéle: </strong>`+ clients[i].modele + `</td>
        </tr>
        <tr>
          <td><strong>RemiseF: </strong>`+ clients[i].remiseF + `</td>
          <td class="align-right"><strong>PrixVenteHT: </strong>`+ clients[i].prixVenteHT + `</td>
        </tr>
        <tr>
          <td><strong>TauxTVA: </strong>`+ clients[i].tauxTVA + `</td>
          <td class="align-right"><strong>MontantTVA: </strong>`+ clients[i].montantTVA + `</td>
        </tr>
        <tr>
          <td><strong>PrixAchat: </strong>`+ clients[i].prixAchat + `</td>
          <td class="align-right"><strong>ValeurStock: </strong>`+ clients[i].valeurStock + `</td>
        </tr>
        <tr>
          <td><strong>QteEnStock: </strong>`+ clients[i].QteEnStock + `</td>
          <td class="align-right"><strong>PlafondRemise: </strong>`+ clients[i].plafondRemise + `</td>
        </tr>
        <tr>
          <td><strong>PVenteConseille: </strong>`+ clients[i].pVenteConseille + `</td>
          <td class="align-right"><strong>EnVente: </strong>`+ clients[i].enVente + `</td>
        </tr>
        <tr>
          <td><strong>EnAchat: </strong>`+ clients[i].enAchat + `</td>
          <td class="align-right"><strong>RefFournisseur: </strong>`+ clients[i].refFournisseur + `</td>
        </tr>
        <tr>
          <td><strong>Redevance: </strong>`+ clients[i].redevance + `</td>
          <td class="align-right"><strong>EnBalance: </strong>`+ clients[i].enBalance + `</td>
        </tr>
        <tr>
          <td><strong>EnPromotion: </strong>`+ clients[i].enPromotion + `</td>
          <td class="align-right"><strong>EnNouveau: </strong>`+ clients[i].enNouveau + `</td>
        </tr>
        <tr>
          <td><strong>Longueur: </strong>`+ clients[i].longueur + `</td>
          <td class="align-right"><strong>Largeur: </strong>`+ clients[i].largeur + `</td>
        </tr>
        <tr>
          <td><strong>Hauteur: </strong>`+ clients[i].hauteur + `</td>
          <td class="align-right"><strong>Surface: </strong>`+ clients[i].surface + `</td>
        </tr>
        <tr>
          <td><strong>Volume: </strong>`+ clients[i].volume + `</td>
          <td class="align-right"><strong>EnDisponible: </strong>`+ clients[i].enDisponible + `</td>
        </tr>
        <tr>
          <td><strong>EnArchive: </strong>`+ clients[i].enArchive + `</td>
          <td class="align-right"><strong>EnVedette: </strong>`+ clients[i].enVedette + `</td>
        </tr>
        <tr>
          <td><strong>EnLiquidation: </strong>`+ clients[i].enLiquidation + `</td>
          <td class="align-right"><strong>Description: </strong>`+ clients[i].description + `</td>
        </tr>
        <tr>
          <td><strong>Observations: </strong>`+ clients[i].observations + `</td>
          <td class="align-right"><strong>Poids: </strong>`+ clients[i].poids + `</td>
        </tr>
        <tr>
          <td><strong>Couleur: </strong>`+ clients[i].couleur + `</td>
          <td class="align-right"><strong>Unite1: </strong>`+ clients[i].unite1 + `</td>
        </tr>
        <tr>
          <td><strong>Unite2: </strong>`+ clients[i].unite2 + `</td>
          <td class="align-right"><strong>Coefficient: </strong>`+ clients[i].coefficient + `</td>
        </tr>
        <tr>
          <td><strong>Emplacement: </strong>`+ clients[i].emplacement + `</td>
          <td class="align-right"><strong>RaccourciPLU: </strong>`+ clients[i].raccourciPLU + `</td>
        </tr>
        <tr>
          <td><strong>PrixVenteHT2: </strong>`+ clients[i].prixVenteHT2 + `</td>
          <td class="align-right"><strong>PrixVenteHT3: </strong>`+ clients[i].prixVenteHT3 + `</td>
        </tr>
        <tr>
          <td><strong>SeuilAlerteQTS: </strong>`+ clients[i].seuilAlerteQTS + `</td>
          <td class="align-right"><strong>SeuilRearpQTS</strong>`+ clients[i].seuilRearpQTS + `</td>
        </tr>
        <tr>
          <td>
           <hr>
          </td>
          <td>
           <hr>
          </td>
        </tr>
        `
    }
    chaine += `
        </table>
    </body>
    </html>`

    return chaine;
  }

  getDataToHtml2(items, objet, titre) {
    var chaine = ""

    chaine = `

    <html id="tablepdf" style="width:2480px; height:3508px;">

    <head>
        <meta charset="utf-8">
        <title>liste Article</title>

        <style>
            table,
            th,
            td {
              padding: 10px;
              border: 1px solid black;
              border-collapse: collapse;
            }
            table{
              width:100%;
            }
            body {
                padding: 50px;
            }
            h1 {
                text-align: center;
                margin : 20px;
            }
            .align-right{
              float:left;
            }
            strong{
              margin: 10px;
            }
        </style>
    </head>

    <body>
        <h1>`+ titre + `</h1>
        <table>
        <thead>
           <tr>`
    for (let key in objet) {
      chaine += `
             <th>
              `+ objet[key].libelle + `
             </th>`
    }
    chaine += `
           </tr>
        </thead>
        <tbody
            `
    for (let i = 0; i < items.length; i++) {
      chaine += `
      <tr>`
      for (let key in objet) {
        chaine += `
        <th>
         `
        if (items[i][key] != undefined) {
          if (this.fonctionPartages.colonnesQuantites.includes(key)) {
            chaine += `<span style="float:right;">` + this.fonctionPartages.getFormaThreeAfterVerguleNomber(items[i][key]) + `</span>`
          } else if (this.fonctionPartages.colonnesPrix.includes(key)) {
            chaine += `<span style="float:right;">` + this.fonctionPartages.getFormaThreeAfterVerguleQuantite(items[i][key]) + `</span>`
          } else if (this.fonctionPartages.colonnesDates.includes(key)) {
            chaine += `<span style="text-align: center; display: block;">` + this.fonctionPartages.getDate(items[i][key], 'yyyy-MM-dd') + `</span>`
          } else if (this.fonctionPartages.colonnesOuiNon.includes(key)) {
            chaine += ` <span style="text-align: center; display: block;">` + items[i][key] + `</span>`
          } else if (!(this.fonctionPartages.colonnesDates.includes(key) || this.fonctionPartages.colonnesQuantites.includes(key) || this.fonctionPartages.colonnesPrix.includes(key) || this.fonctionPartages.colonnesOuiNon.includes(key))) {
            chaine += `<span>` + items[i][key] + `</span>`
          }
        }

        chaine += `
        </th>`
      }
      chaine += `
      </tr>
          `
    }

    chaine += `
          </tbody>
        </table>
    </body>
    </html>`

    return chaine;
  }

  printout(items, objet, titre) {
    var newWindow = window.open();
    var chaine = this.getDataToHtml2(items, objet, titre)
    newWindow.document.write(chaine);
    newWindow.print();
    // window.print();
  }

  stringToHtml(str) {
    const el = document.createElement('div');
    el.innerHTML = str;
    return el;
  };

  wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  products = [
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
    { name: "Pro1", price: 1.7, qty: 50 },
  ]

  async generatePDF(items, objet, titre, fileName) {
    console.log(items);
    console.log(objet);
    console.log(titre);
    console.log(fileName);

    switch (fileName) {
      case 'liste_Clients':
        this.makePdfListClient(items)
        break;
      case 'liste_Fournisseurs':
        this.makePdfListFournisseur(items)
        break;
      case 'liste_transporteurs':
        this.makePdfListTransporteurs(items)
        break;
      case 'liste_bon_transfert':
        this.makePdfListBonTransfert(items)
        break;
      case 'liste_bon_Casse':
        this.makePdfListBonCasse(items)
        break;
      case 'liste_corrections_des_stocks':
        this.makePdfListCorrectionStock(items)
        break;
      case 'liste_inventaires':
        this.makePdfListInventaires(items)
        break;
      case 'liste_bon_commande':
        this.makePdfListBonCommande(items)
        break;
      case 'liste_Devis_Achats':
        this.makePdfListDevisAchats(items)
        break;
      case 'liste_bon_retour_fournisseur':
        this.makePdfListBonRetourFournisseur(items)
        break;
      case 'liste_reglements_bon_reception':
        this.makePdfListReglementBonReception(items)
        break;
      case 'facture_achat_list':
        this.makePdfListFactureAchat(items)
        break;
      case 'liste_reglements_bon_reception_Client':
        this.makePdfListReglementClient(items)
        break;
      default:
        break;
    }
  }
  async makePdfListReglementClient(items: any) {
    console.log(items);

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        dateReglement: check(e.dateReglement),

        numero: check(e.numero),
        client: check(e.client),
        modeReglement: check(e.modeReglement),
        tresorerie: check(e.tresorerie),
        montant: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.montant)),
        reste: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.reste)),
        numCheque: check(e.numCheque),
        dateEcheance: check(e.dateEcheance),
        notes: check(e.notes)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [50, 80, 100, 60, 60, 60, 60, 60, 60, 100],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 80],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste Reglement",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "dateReglement",

                "numero",
                "client",
                "modeReglement",
                "tresorerie",
                "numCheque",
                "dateEcheance",

                "montant",
                "reste",
                "notes"
              ],
              true,
              // Custom headers
              [
                { text: 'Date Reglement', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Client', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Mode Reglement', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Tresorerie', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Num Cheque', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Date Echeance', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Montant', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Reste', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Notes', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Nombre des Lignes " + data.length, alignment: 'left', blod: true, colSpan: 7, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                { text: (sommeMontant(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeMontant(data)), blod: true, alignment: (sommeMontant(data) === '-') ? "center" : "right", fontSize: 9 },
                { text: (sommeReste(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeReste(data)), blod: true, alignment: (sommeReste(data) === '-') ? "center" : "right", fontSize: 9 },
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 833 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }

  async makePdfListFactureAchat(items: any) {
    console.log(items);

    function check(arg0: any): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        fournisseur: check(e.fournisseur),
        date: check(e.date),
        totalRemise: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        totalHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),
        netHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT) - parseFloat(e.totalRemise))),
        totalTVA: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        tFiscale: check(e.tFiscale),
        totalTTC: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        totalGain: check(e.totalGain),
        bonCommande: check(e.bonCommande)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [80, 70, 120, 72, 72, 72, 72, 72, 72],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 80],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste Devis Achat",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "date",

                "numero",
                "fournisseur",
                "bonCommande",

                "totalHT",
                "totalRemise",
                "netHT",


                "totalTVA",
                "totalTTC",
                //"tFiscale",
                //"totalGain",
              ],
              true,
              // Custom headers
              [
                { text: 'Date', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Bon Commande', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Total HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Remise', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'NET HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Montant TVA', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total TTC', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                //{ text: 'T Fiscale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                //{ text: 'Total Gain', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombres des Lignes : " + data.length, alignment: 'left', blod: true, colSpan: 4, fontSize: 9 },
                {},
                {},
                {},
                { text: (sommeTotalHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalHT(data)), bold: true, alignment: (sommeTotalHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalRemise(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data)), bold: true, alignment: (sommeTotalRemise(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalNETHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalNETHT(data)), bold: true, alignment: (sommeTotalNETHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTVA(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data)), bold: true, alignment: (sommeTotalTVA(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTTC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)), bold: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 8, },

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 833 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListReglementBonReception(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        fournisseur: check(e.fournisseur),
        modeReglement: check(e.modeReglement),
        tresorerie: check(e.tresorerie),
        montant: check(e.montant),
        reste: check(e.reste),
        dateReglement: check(e.dateReglement),
        numCheque: check(e.numCheque),
        dateEcheance: check(e.dateEcheance),
        notes: check(e.notes)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste Reglement Bon Réception",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "fournisseur",
                "modeReglement",
                "tresorerie",
                "montant",
                "reste",
                "dateReglement",
                "numCheque",
                "dateEcheance",
                "notes"
              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'mode Reglement', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'tresorerie', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'montant', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'reste', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'date Reglement', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'num Cheque', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date Echeance', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'notes', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total Bon Réception: " + data.length, alignment: 'left', blod: true, colSpan: 10, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center'
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListBonRetourFournisseur(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        fournisseur: check(e.fournisseur),
        date: check(e.date),
        totalRemise: check(e.totalRemise),
        totalHT: check(e.totalHT),
        totalTVA: check(e.totalTVA),
        tFiscale: check(e.tFiscale),
        totalTTC: check(e.totalTTC),
        totalGain: check(e.totalGain),
        bonReception: check(e.bonReception)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste Bon Retour Fournisseur",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "fournisseur",
                "date",
                "totalRemise",
                "totalHT",
                "totalTVA",
                "tFiscale",
                "totalTTC",
                "totalGain",
                "bonReception"
              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'total_Remise', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'total_HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'total_TVA', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 't_Fiscale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'total_TTC', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'total_Gain', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'bon_Reception', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total Bon Retour Fournisseur: " + data.length, alignment: 'left', blod: true, colSpan: 10, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center'
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListDevisAchats(items: any) {
    console.log(items);

    function check(arg0: any): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        fournisseur: check(e.fournisseur),
        date: check(e.date),
        totalRemise: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        totalHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),
        netHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT) - parseFloat(e.totalRemise))),
        totalTVA: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        tFiscale: check(e.tFiscale),
        totalTTC: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        totalGain: check(e.totalGain),
        bonCommande: check(e.bonCommande)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [80, 70, 120, 72, 72, 72, 72, 72, 72],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 80],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste Devis Achat",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "date",

                "numero",
                "fournisseur",
                "bonCommande",

                "totalHT",
                "totalRemise",
                "netHT",


                "totalTVA",
                "totalTTC",
                //"tFiscale",
                //"totalGain",
              ],
              true,
              // Custom headers
              [
                { text: 'Date', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Bon Commande', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Total HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Remise', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'NET HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Montant TVA', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total TTC', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                //{ text: 'T Fiscale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                //{ text: 'Total Gain', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombres des Lignes : " + data.length, alignment: 'left', blod: true, colSpan: 4, fontSize: 9 },
                {},
                {},
                {},
                { text: (sommeTotalHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalHT(data)), bold: true, alignment: (sommeTotalHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalRemise(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data)), bold: true, alignment: (sommeTotalRemise(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalNETHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalNETHT(data)), bold: true, alignment: (sommeTotalNETHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTVA(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data)), bold: true, alignment: (sommeTotalTVA(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTTC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)), bold: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 8, },

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 833 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListBonCommande(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        fournisseur: check(e.fournisseur),
        date: check(e.date),
        totalRemise: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        netHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT) - parseFloat(e.totalRemise))),

        totalHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),
        totalTVA: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        //tFiscale: check(e.tFiscale),
        totalTTC: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        //totalGain: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalGain)),
        bonReception: check(e.bonReception)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 9 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [55, 95, 120, 80, 70, 70, 70, 70, 70],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 80],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste Bon Commandes",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "date",

                "numero",
                "fournisseur",
                "bonReception",
                "totalHT",

                "totalRemise",
                "netHT",
                "totalTVA",
                "totalTTC",
              ],
              true,
              // Custom headers
              [
                { text: 'Date', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Bon Reception', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Total HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Total Remise', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Net HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Total TVA', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total TTC', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des Lignes: " + data.length, alignment: 'left', blod: true, colSpan: 4, fontSize: 9 },
                {},
                {},
                {},
                { text: (sommeTotalHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalHT(data)), bold: true, alignment: (sommeTotalHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalRemise(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data)), bold: true, alignment: (sommeTotalRemise(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalNETHT(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalNETHT(data)), bold: true, alignment: (sommeTotalNETHT(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTVA(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data)), bold: true, alignment: (sommeTotalTVA(data) === '-') ? "center" : "right", fontSize: 8, },

                { text: (sommeTotalTTC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)), bold: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 8, },

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 833 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListInventaires(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
        categorie: check(e.categorie),
        cloture: check(e.cloture),
        personne: check(e.personne)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 11 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [100, 100, 100, 100, 100],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste des Inventaires",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "date",
                "categorie",
                "cloture",
                "personne",

              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 10, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'categorie', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'cloture', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'personne', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Inventaires : " + data.length, alignment: 'left', blod: true, colSpan: 5, fontSize: 9 },
                {},
                {},
                {},
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListCorrectionStock(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
        personnel: check(e.personnel)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 11 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [166, 166, 168],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste Correction Stock",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "date",
                "personnel",

              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 10, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'personnel', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Correction Stock : " + data.length, alignment: 'left', blod: true, colSpan: 3, fontSize: 9 },
                {},
                {},

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [30, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }


  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");


        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });

  }
  exportexcel(items, objet, titre, fileName) {
    /* table id is passed over here */
    console.log(fileName);


    switch (fileName) {
      case 'liste_Clients':
        this.makeExelListClient(items)
        break;
      case 'liste_transporteurs':
        this.makeExelListTransporteur(items)
        break;
      case 'liste_Devis_Achats':
        this.makeExelListDevisAchats(items)
        break;
      case 'liste_bon_commande':
        this.makeExelListBonCommandes(items)
        break;
      case 'liste_reglements_bon_reception':
        this.makeExelListReglementBonReception(items)
        break;
      case 'liste_reglements_bon_reception_Client':
        this.makeExelListReglementBonReceptionClient(items)
        break;

      default:

        break;
    }
  }
  makeExelListReglementBonReceptionClient(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        dateReglement: (e.dateReglement),

        numero: (e.numero),
        client: (e.client),
        modeReglement: (e.modeReglement),
        tresorerie: (e.tresorerie),
        numCheque: (e.numCheque),
        dateEcheance: (e.dateEcheance),

        montant: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.montant))),
        reste: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.reste))),
        notes: (e.notes),

      })
    });

    let totalMonatnt = sommeMontant(data)
    let totalReste = sommeReste(data)
    data.splice(data.length, 0, {
      dateReglement: "Total",

      numero: "",
      client: "",
      modeReglement: "",
      tresorerie: "",
      numCheque: "",
      dateEcheance: "",

      montant: this.fonctionPartages.getFormaThreeAfterVerguleNomber(totalMonatnt),
      reste: this.fonctionPartages.getFormaThreeAfterVerguleNomber(totalReste),
      notes: "",
    })
    console.log(data);

    var filename = 'listeReglement.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }
  makeExelListReglementBonReception(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        dateReglement: (e.dateReglement),

        numero: (e.numero),
        fournisseur: (e.fournisseur),
        modeReglement: (e.modeReglement),
        tresorerie: (e.tresorerie),
        numCheque: (e.numCheque),
        dateEcheance: (e.dateEcheance),

        montant: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.montant))),
        reste: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.reste))),
        notes: (e.notes),

      })
    });

    let totalMonatnt = sommeMontant(data)
    let totalReste = sommeReste(data)
    data.splice(data.length, 0, {
      dateReglement: "Total",

      numero: "",
      fournisseur: "",
      modeReglement: "",
      tresorerie: "",
      numCheque: "",
      dateEcheance: "",

      montant: this.fonctionPartages.getFormaThreeAfterVerguleNomber(totalMonatnt),
      reste: this.fonctionPartages.getFormaThreeAfterVerguleNomber(totalReste),
      notes: "",
    })
    console.log(data);

    var filename = 'listeReglement.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }

  makeExelDefault(filename, table) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      table
    );

    /* new format */
    var fmt = "0.00";
    /* change cell format of range B2:D4 */
    var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
    for (var R = range.s.r; R <= range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell || cell.t != "n") continue; // only format numeric cells
        cell.z = fmt;
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var fmt = "@";
    wb.Sheets["Sheet1"]["F"] = fmt;

    /* save to file */
    XLSX.writeFile(wb, filename + ".xlsx");
  }

  makeExelListBonCommandes(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        date: (e.date),

        numero: (e.numero),
        fournisseur: (e.fournisseur),
        bonReception: (e.bonReception),

        totalHT: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),

        totalRemise: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        netHT: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT) - parseFloat(e.totalRemise))),

        totalTVA: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        //tFiscale: check(e.tFiscale),
        totalTTC: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        //totalGain: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalGain)),
      })
    });
    var filename = 'listeBonCommandes.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }

  makeExelListDevisAchats(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        date: (e.date),

        numero: (e.numero),
        fournisseur: (e.fournisseur),
        bonCommande: (e.bonCommande),

        totalHT: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),

        totalRemise: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        netHT: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT) - parseFloat(e.totalRemise))),
        totalTVA: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        totalTTC: (this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
      })
    });
    var filename = 'DevisAchats.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }
  makeExelListTransporteur(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        email: (e.email),
        gsm: (e.gsm),
        nom: (e.nom),
        numVehicule: (e.numVehicule),
        tel: (e.tel)
      })
    });
    console.log(data);
    var filename = 'Transporteur.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }
  makeExelListClient(items: any) {
    var data = []
    items.forEach(e => {
      data.push({
        email: (e.email),
        telephone: (e.telephone),
        code: (e.code),
        raisonSociale: (e.raisonSociale),
        matriculeFiscale: (e.matriculeFiscale),
        plafondCredit: (e.plafondCredit),
        mobiles: (e.mobiles),
        conditionReglement: (e.conditionReglement),
        modeReglement: (e.modeReglement),
        secteur: (e.secteur)
      })
    });
    var filename = 'clients.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }

  validateEmail(chaine) {
    let regex = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$');
    return regex.test(chaine)
  }

  async makePdfListBonCasse(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 11 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [250, 250],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste des Bon Casse",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "date",

              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 10, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Bon Casse : " + data.length, alignment: 'left', blod: true, colSpan: 2, fontSize: 9 },
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          margin: [40, 0, 0, 0],
          alignment: 'center'
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }

  async makePdfListBonTransfert(items: any) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
        magasinDepart: check(e.magasinDepart),
        magasinArrive: check(e.magasinArrive),
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 11 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [130, 100, 160, 160],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste des Bon Transferts",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "numero",
                "date",
                "magasinDepart",
                "magasinArrive",

              ],
              true,
              // Custom headers
              [
                { text: 'numero', blod: true, fontSize: 10, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'date', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'magasin Depart', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'magasin Arrive', fontSize: 10, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Bon Transferts : " + data.length, alignment: 'left', blod: true, colSpan: 4, fontSize: 9 },
                {},
                {},
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center'
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }


  async makePdfListClient(items) {
    console.log(items);

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        email: check(e.email),
        telephone: check(e.telephone),
        code: check(e.code),
        raisonSociale: check(e.raisonSociale),
        matriculeFiscale: check(e.matriculeFiscale),
        plafondCredit: check(e.plafondCredit),
        mobiles: check(e.mobiles),
        conditionReglement: check(e.conditionReglement),
        modeReglement: check(e.modeReglement),
        secteur: check(e.secteur)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 8 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [65, 50, 50, 60, 60, 60, 45, 52, 45],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'paysage',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste des Clients",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "email",
                "telephone",
                "mobiles",
                "code",
                "raisonSociale",
                "matriculeFiscale",

                "conditionReglement",
                "modeReglement",
                "secteur"
              ],
              true,
              // Custom headers
              [
                { text: 'email', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'telephone', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'mobiles', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'code', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'raison_Sociale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'matricule_Fiscale', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'condition_Reglement', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'mode_Reglement', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'secteur', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Clients : " + data.length, alignment: 'left', blod: true, colSpan: 9, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [10, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  async makePdfListFournisseur(items) {
    console.log(items);

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        email: check(e.email),
        telephone: check(e.telephone),
        code: check(e.code),
        raisonSociale: check(e.raisonSociale),
        matriculeFiscale: check(e.matriculeFiscale),
        plafondCredit: check(e.plafondCredit),
        mobiles: check(e.mobiles),
        conditionReglement: check(e.conditionReglement),
        modeReglement: check(e.modeReglement),
        secteur: check(e.secteur)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 8 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [75, 45, 45, 60, 60, 60, 45, 52, 45],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'portrait',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 80],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [5, 5, 0, 0],
                  },
                  {
                    text: "Liste des Fournisseurs",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "email",
                "telephone",
                "mobiles",
                "code",
                "raisonSociale",
                "matriculeFiscale",

                "conditionReglement",
                "modeReglement",
                "secteur"
              ],
              true,
              // Custom headers
              [
                { text: 'email', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'telephone', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'mobiles', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'code', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'raison_Sociale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'matricule_Fiscale', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'condition_Reglement', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'mode_Reglement', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'secteur', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Fournisseurs : " + data.length, alignment: 'left', blod: true, colSpan: 9, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},

              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [10, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }


  async makePdfListTransporteurs(items) {
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    items.forEach(e => {
      data.push({
        email: check(e.email),
        gsm: check(e.gsm),
        nom: check(e.nom),
        numVehicule: check(e.numVehicule),
        tel: check(e.tel)
      })
    });
    console.log(data);

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      //console.log(footerTable);

      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

      //console.log(headers);
      if (showHeaders) {
        body.push(headers);
      }
      // Inserting items from external data array

      data.forEach(function (row) {

        var dataRow = [];
        var i = 0;

        columns.forEach(function (column) {
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 10 });
          i++;
        })

        body.push(dataRow);

      });
      body.push(footerTable)
      //console.log(body);

      return body;
    }
    pdfMake.tableLayouts = {
      myCustomLayout: {
        hLineWidth: function (i, node) { return 1; },
        vLineWidth: function (i, node) { return 1; },
        fillColor: function (rowIndex, node, columnIndex) {
          // console.log(node);
          // console.log(columnIndex);
          return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
        },
        //paddingLeft: function (i, node) { return 0; }
      }
    };

    function table(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'table',
        table: {
          heights: ['auto'],
          widths: [135, 90, 90, 90, 90],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      // pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [3, 80, 1, 100],



      header: function (currentPage, pageCount, pageSize) {

        let date = `${new Date().toLocaleDateString('en-GB')}`
        return [
          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  {
                    image: image,
                    rowSpan: 3,
                    alignment: 'left',
                    height: 60,
                    width: 100,
                    margin: [0, 5, 0, 0],
                  },
                  {
                    text: "Liste des Transporteurs",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right', margin: [0, 10, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ]
      },

      content: [
        {
          columns: [
            table(
              data,
              [
                "email",
                "gsm",
                "nom",
                "numVehicule",
                "tel",

              ],
              true,
              // Custom headers
              [
                { text: 'email', blod: true, fontSize: 9, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'gsm', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'nom', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'numero Vehicule', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'matricule Fiscale', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Total des Transporteurs : " + data.length, alignment: 'left', blod: true, colSpan: 5, fontSize: 9 },
                {},
                {},
                {},
                {},
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let societeInformations =
          `${societe.raisonSociale}
           ${societe.adresse}
           Tel: ${societe.telephones} Fax: ${societe.fax}
           ${societe.rib}`
        let page = `\n${currentPage.toString()} of ${pageCount}`
        return [
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
                ],
                [],
                []
              ]
            }
          },
        ];
      },

      styles: {
        table: {
          fontSize: 9,
          alignment: 'center',
          margin: [25, 0, 0, 0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();
  }
}


function sommeTotalTTC(data: any[]): any {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].totalTTC === '-' || data[index].totalTTC === null || data[index].totalTTC === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].totalTTC)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeTotalTVA(data: any[]): any {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].totalTVA === '-' || data[index].totalTVA === null || data[index].totalTVA === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].totalTVA)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeTotalHT(data: any[]): any {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].totalHT === '-' || data[index].totalHT === null || data[index].totalHT === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].totalHT)
    }
  }

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeTotalRemise(data: any[]): any {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].totalRemise === '-' || data[index].totalRemise === null || data[index].totalRemise === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].totalRemise)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}



function sommeTotalNETHT(data: any[]): any {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].netHT === '-' || data[index].netHT === null || data[index].netHT === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].netHT)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeMontant(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].montant === '-' || data[index].montant === null || data[index].montant === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].montant)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeReste(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].reste === '-' || data[index].reste === null || data[index].reste === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].reste)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

