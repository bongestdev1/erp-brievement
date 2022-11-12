import { SessionCaisseService } from 'src/app/services/serviceBD_Commerce/sessionCaisse.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-charge-mode-regl',
  templateUrl: './charge-mode-regl.component.html',
  styleUrls: ['./charge-mode-regl.component.scss']
})
export class ChargeModeReglComponent implements OnInit {

  @Input() sessionCaisse

  @Input() id

  @Input() compteurChangeListReg

  @Input() utilisateur

  @Input() listTotalRegl

  @Input() changeVar

  formC: FormGroup

  allCreDebs = ['solde', 'caisse']
  allChargRets = ['charge', 'retrait']

  constructor(
    public fonctionPartagesService: FonctionPartagesService,
    private sessionCaisseSer: SessionCaisseService,
    private fb: FormBuilder,
    public informationGenerale: InformationsService,) {

    this.formC = this.fb.group({
      typeOperation: [''],
      solde: [''],
      charge: [''],
      retrait: [''],
      caisse: [''],

      limit: 5
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listReg = []
    if (this.compteurChangeListReg != 0 && this.id) {
      this.getChargees()
    }
  }

  objectKeys = Object.keys;

  items = {
    typeOperation: "active",
    solde: "active",
    charge: "active",
    retrait: "active",
    caisse: "active",
  };

  itemsVariable = {
    typeOperation: "active",
    solde: "active",
    charge: "active",
    retrait: "active",
    caisse: "active",
  };

  ngOnInit(): void {
  }

  listReg = []
  //Afficher la liste global
  isLoading = false
  getChargees() {

    if (!this.id) {
      return
    }

    this.listReg = []
    let sessionCaise = this.informationGenerale.getSessionCaisse()

    let request = {
      societe: this.informationGenerale.idSocieteCurrent,
      sessionCaisse: null,
      requestReglement: this.listTotalRegl.requestReglement,
    }

    try {
      request = {
        societe: this.informationGenerale.idSocieteCurrent,
        sessionCaisse: this.id,
        requestReglement: this.listTotalRegl.requestReglement,
      }
    } catch (e) {
      console.log(e)
    }

    this.sessionCaisseSer.charges(request)
      .subscribe(
        res => {
          this.isLoading = false
          let resultat: any = res
          if (resultat.status) {
            this.listReg = resultat.listReg
          }
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  //initialiser le completation de lignes si
  //les lignes de table est inferieur a 6
  emptyTable = []
  initialisationEmptyTable() {
    this.emptyTable = []
    if (this.listReg.length < 4) {
      for (let i = this.listReg.length; i < 4; i++) {
        this.emptyTable.push({})
      }
      return true
    }
    return false
  }



  async generatePDF() {
    console.log("liste regelement", this.listReg);
    console.log("liste total regelement", this.listTotalRegl);
    console.log(this.sessionCaisse);
    var dateOuverture = new Date(this.sessionCaisse.dateOuverture)
    const maDate = new Date()

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }

    var dataListTotalReglementtabI = []

    this.listTotalRegl.items.forEach(e => {
      dataListTotalReglementtabI.push({
        raisonSociale : (e.client===undefined)?check(e.fournisseur):check(e.client),
        codeClient : (e.codeClient===undefined)?check(e.codeFournisseur):check(e.codeClient),
        numero: check(e.numero),
        typeReglement: check(e.typeReglement),
        modeReglement: check(e.modeReglement),
        montant: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.montant)),
        dateReglement: check(e.dateReglement),
        numCheque: check(e.numCheque),
        dateEcheance:check( e.dateEcheance),
        debit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.debit)),
        credit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.credit)),
      })
    });


    var dataListeReglementTabII = []
    this.listReg.forEach((e) => {
      dataListeReglementTabII.push({
        caisse: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(Math.abs(e.caisse))),
        charge: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(Math.abs(e.charge))),
        retrait:check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(Math.abs(e.retrait))),
        solde: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(Math.abs(e.solde))),
        typeOperation: check(e.typeOperation)
      })
    })

    function buildTableBody(data, columns, showHeaders, headers, footerTable) {
      
      var body = [];
      for (let index = 0; index < headers.length; index++) {
        headers[index].text = headers[index].text.toUpperCase()
      }
      // Inserting headers

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

    function tableI(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'tableI',
        table: {
          heights: ['auto'],
          widths: [60, 70, 70, 80, 65, 65, 65, 70, 70,70,70,70],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    function tableII(data, columns, showHeaders, headers, footerTable) {
      //console.log(data);
      //console.log(columns);
      return {
        style: 'tableII',
        table: {
          heights: ['auto'],
          widths: [99, 99, 99, 99, 99],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()
    
    var dateStart = new Date(this.listTotalRegl.requestReglement.dateStart)
    var dateEnd = new Date(this.listTotalRegl.requestReglement.dateEnd)
    
    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pagesize: 'A4',
      pageMargins: [15, 80, 15, 80],

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
                    margin: [10, 10, 0, 0],
                  },
                  {
                    text: `Journal De Caisse de ${dateStart.toLocaleDateString("fr")} à ${dateEnd.toLocaleDateString("fr")}`,
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 12,
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
            tableI(
              dataListTotalReglementtabI,
              [
                'dateReglement',
                'codeClient',
                "raisonSociale",
                'typeReglement',
                'modeReglement',
                'montant',
                'numCheque',
                'dateEcheance',
                'debit',
                'credit',

              ],
              true,
              // Custom headers
              [
                { text: 'D. Reg', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Code Client', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Raison Sociale', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Type Reg', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Mode Reg', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Montant', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Num Pièce', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'D. Echeance', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Debit', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Credit', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des lignes :"+dataListTotalReglementtabI.length, alignment: 'left', blod: true, colSpan: 5, fontSize: 9 },
                {},
                {},
                {},
                {},
                { text:(sommeMontant(dataListTotalReglementtabI)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeMontant(dataListTotalReglementtabI)), blod: true, alignment: (sommeMontant(dataListTotalReglementtabI) === '-') ? "center" : "right", fontSize: 9,},

                {},
                {},
                { text:(sommeDebit(dataListTotalReglementtabI)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeDebit(dataListTotalReglementtabI)), blod: true, alignment: (sommeDebit(dataListTotalReglementtabI) === '-') ? "center" : "right", fontSize: 9, },
                { text: (sommeCredit(dataListTotalReglementtabI)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCredit(dataListTotalReglementtabI)), blod: true, alignment: (sommeCredit(dataListTotalReglementtabI) === '-') ? "center" : "right", fontSize: 9, },

              ],
            ),
          ]
        },
        {
          columns: [
            tableII(
              dataListeReglementTabII,
              [
                'typeOperation',
                'solde',
                'charge',
                'retrait',
                'caisse',
              ],
              true,
              // Custom headers
              [
                { text: 'Type Operation', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Solde', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Charge', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Retrait', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Caisse', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
              ],
              [
                { text: "Nombre des lignes :"+dataListeReglementTabII.length, alignment: 'left', blod: true, fontSize: 9 },
                {text: (sommeSolde(dataListeReglementTabII)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSolde(dataListeReglementTabII)), blod: true, alignment: (sommeSolde(dataListeReglementTabII) === '-') ? "center" : "right", fontSize: 9,},
                {text: (sommeCharge(dataListeReglementTabII)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCharge(dataListeReglementTabII)), blod: true, alignment: (sommeCharge(dataListeReglementTabII) === '-') ? "center" : "right", fontSize: 9,},
                {text: (sommeRetrait(dataListeReglementTabII)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeRetrait(dataListeReglementTabII)), blod: true, alignment: (sommeRetrait(dataListeReglementTabII) === '-') ? "center" : "right", fontSize: 9,},
                {text: (sommeCaisse(dataListeReglementTabII)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCaisse(dataListeReglementTabII)), blod: true, alignment: (sommeCaisse(dataListeReglementTabII) === '-') ? "center" : "right", fontSize: 9,},
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
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 837 - 10, y2: 10, lineWidth: 0.5 }] },

          {

            layout: 'noBorders',
            table: {
              headerRows: 1,
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'left', margin: [20, 15, 0, 0] },
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
        tableII: {
          fontSize: 9,
          alignment: 'center',
          margin:[150,20,0,20]
        },
        tableI: {
          fontSize: 9,
          alignment: 'center',
          margin:[7,20,0,20]
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

  exportexcel(){
    var dataListTotalReglementtabI = []
    this.listTotalRegl.items.forEach(e => {
      dataListTotalReglementtabI.push({
        dateReglement: e.dateReglement,
        codeClient: e.codeClient,
        raisonSociale : (e.client===undefined)?e.fournisseur:(e.client),

        typeReglement: e.typeReglement,
        modeReglement: e.modeReglement,
        montant: (e.montant===null||e.montant===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0): parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.montant)),
        numCheque: e.numCheque,
        dateEcheance: e.dateEcheance,
        debit:(e.debit===null||e.debit===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0): parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.debit)),
        credit:(e.credit===null||e.credit===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0): parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.credit)),
      })
    });

    dataListTotalReglementtabI.splice(dataListTotalReglementtabI.length, 0, {
      dateReglement:"Total",
      codeClient:"",
      raisonSociale: "",
      typeReglement: "",
      modeReglement: "",
      montant:(sommeMontant(dataListTotalReglementtabI)===undefined||sommeMontant(dataListTotalReglementtabI)===null||sommeMontant(dataListTotalReglementtabI)==='-')?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0): parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeMontant(dataListTotalReglementtabI))),

      numCheque: "",
      dateEcheance:"",
      debit: (sommeDebit(dataListTotalReglementtabI)===undefined||sommeDebit(dataListTotalReglementtabI)===null||sommeDebit(dataListTotalReglementtabI)==='-')?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeDebit(dataListTotalReglementtabI))),
      credit:(sommeCredit(dataListTotalReglementtabI)===undefined||sommeCredit(dataListTotalReglementtabI)===null||sommeCredit(dataListTotalReglementtabI)==='-')?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCredit(dataListTotalReglementtabI))),
    })

    var dataListeReglementTabII = []
    this.listReg.forEach((e) => {
      dataListeReglementTabII.push({
        caisse: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.caisse)),
        charge: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.charge)),
        retrait: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.retrait)),
        solde: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.solde)),
        typeOperation: e.typeOperation
      })
    })
    dataListeReglementTabII.splice(dataListeReglementTabII.length, 0, {
        caisse:(sommeCaisse(dataListeReglementTabII)==='-')?0: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCaisse(dataListeReglementTabII))),
        charge:(sommeCharge(dataListeReglementTabII)==='-')?0: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCharge(dataListeReglementTabII))),
        retrait:(sommeRetrait(dataListeReglementTabII)==='-')?0: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeRetrait(dataListeReglementTabII))),
        solde:(sommeSolde(dataListeReglementTabII)==='-')?0: parseFloat(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSolde(dataListeReglementTabII))),
        typeOperation:"Total"
    })



    var rslt = dataListTotalReglementtabI.concat(dataListeReglementTabII)
    var filename = 'JournalCaisse.xlsx';
    var ws = XLSX.utils.json_to_sheet(rslt);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }

}
function getFullYear(date: any): string {
  if (date == undefined||date == null || date == '') {
    return '-'
  } else {
    var d = new Date(date).toLocaleDateString();
  return d.toString()
  }
}
function sommeDebit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].debit === '-' || data[index].debit === null || data[index].debit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].debit)
    }
  }



  if (som === 0 || som ===NaN) {
    return '-'
  } else {
    return som
  }
}

function sommeCredit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].credit === '-' || data[index].credit === null || data[index].credit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].credit)
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

function sommeSolde(data: any) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].solde === '-' || data[index].solde === null || data[index].solde === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].solde)
    }
  }

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeCharge(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].charge === '-' || data[index].charge === null || data[index].charge === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].charge)
    }
  }

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeRetrait(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].retrait === '-' || data[index].retrait === null || data[index].retrait === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].retrait)
    }
  }

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeCaisse(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].caisse === '-' || data[index].caisse === null || data[index].caisse === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].caisse)
    }
  }

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

