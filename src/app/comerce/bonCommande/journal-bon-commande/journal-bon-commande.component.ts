import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { InformationsService } from 'src/app/services/informations.service';
import { Commandes } from 'src/app/services/serviceBD_Commerce/commandes.service';
import { JournalVenteService } from 'src/app/services/serviceBD_Commerce/journal-vente.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { HttpClient } from '@angular/common/http';
import pdfMake from "pdfmake/build/pdfmake";
import * as XLSX from 'xlsx';
import pdfFonts from "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-journal-bon-commande',
  templateUrl: './journal-bon-commande.component.html',
  styleUrls: ['./journal-bon-commande.component.scss']
})
export class JournalBonCommandeComponent implements OnInit {
  formBC: FormGroup
  constructor(
    private utilite: UtiliteService,
    private fb: FormBuilder,
    private http: HttpClient,
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
    private journalVenteSer: JournalVenteService,
    private journalCommandes: Commandes,
    private tokenStorageService:TokenStorageService,
  ) {
    this.formBC = this.fb.group({
      numero : [''],
      date :[''],
      fournisseur: [''],
      totalRemise: [''],
      totalHT: [''],
      totalTVA: [''],
      totalGain: [''],
      tFiscale: [''],
      totalTTC: [''],
      bonReception: [''],
      isTransfert: [''],

      limit: 50
    })
    this.getBonCommandes(this.request)
   }
   objectKeys = Object.keys;
   items = {
    numero : "Numero",
    date : "Date",
    fournisseur : "Fournisseur",
    totalRemise : "Total Remise",
    totalHT: "Total HT",
    totalTVA : "Total TVA",
    totalGain : "Total Gain",
    tFiscale : "Timbre Fiscale",
    totalTTC : "Total TTC",
    bonReception : "Bon Reception",
    isTransfert : "Is Transfert"
   }
   itemsVariable = {
    numero : "Numero",
    date : "Date",
    fournisseur : "Fournisseur",
    totalRemise : "Total Remise",
    totalHT: "Total HT",
    totalTVA : "Total TVA",
    totalGain : "Total Gain",
    tFiscale : "Timbre Fiscale",
    totalTTC : "Total TTC",
    bonReception : "Bon Reception",
    isTransfert : "Is Transfert"
  };

  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      numero : "",
    date : "",
    fournisseur : "",
    totalRemise : "",
    totalHT: "",
    totalTVA : "",
    totalGain : "",
    tFiscale : "",
    totalTTC : "",
    bonReception : "",
    isTransfert : ""

    },
    orderBy: {
      numero : 0,
    date : 0,
    fournisseur :0,
    totalRemise : 0,
    totalHT: 0,
    totalTVA :0,
    totalGain :0,
    tFiscale : 0,
    totalTTC :0,
    bonReception :0,
    isTransfert :0
    },

    magasin: this.informationGenerale.idSocieteCurrent,
    fournisseur: "",
    limit: 50,
    page: 1
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      numero : "",
    date : "",
    fournisseur : "",
    totalRemise : "",
    totalHT: "",
    totalTVA : "",
    totalGain : "",
    tFiscale : "",
    totalTTC : "",
    bonReception : "",
    isTransfert : ""

    },
    orderBy: {
      numero : 0,
    date : 0,
    fournisseur :0,
    totalRemise : 0,
    totalHT: 0,
    totalTVA :0,
    totalGain :0,
    tFiscale : 0,
    totalTTC :0,
    bonReception :0,
    isTransfert :0
    },
    magasin: this.informationGenerale.idSocieteCurrent,
    fournisseur: "",
    limit: 50,
    page: 1
  }

  keySelectedFournisseur = "raisonSociale"

  objetFournisseur = {
    raisonSociale: "Raison-Sociale",
    matriculeFiscale: "Matricule-Fiscale",
    email: "Email",
    telephone: "Téléphone",
    code: "Code",
    plafondCredit: "Plafond-Credit",
    mobiles: "Mobiles",
    siteWeb: "Site-Web",
    conditionReglement: "Condition-Réglement",
    credit: "Crédit",
    fax: "Fax",
  }

  idFournisseur = ""
  isOpenModalAjoutFournisseur = false
  idAjoutFournisseurModal = ""
  typeElement
  setFournisseurID(id) {
    this.request.fournisseur = id
  }


  totalPage = 1
  isLoading = false
  apiList = "/fournisseurs/listFournisseurs"
  allFournisseurs = []
  getFournisseurs() {
    let request = { page: 1, limit: 0, search: {}, orderBy: {}, societe: this.informationGenerale.idSocieteCurrent }
    this.http.post(this.informationGenerale.baseUrl + this.apiList, request,this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res

        if (resultat.status) {
          this.allFournisseurs = resultat.resultat.docs
        }

      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  listGlEmpty = [{}, {}, {}, {}, {}, {}]
  bonCommandes=[]
  testSyncronisation(request1, request2) {
    for (let key in request1.search) {
      if (request1.search[key] != request2.search[key]) {
        return false
      }
    }

    for (let key in request1.orderBy) {
      if (request1.orderBy[key] != request2.orderBy[key]) {
        return false
      }
    }

    if (request1.dateStart != request2.dateStart || request1.dateEnd != request2.dateEnd) {
      return false
    }

    return true;
  }
  setLimitPage(newLimitPage: number) {
    this.request.limit = newLimitPage
    this.request.page = 1
    this.getBonCommandes(this.request)
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getBonCommandes(this.request)
  }

  changeCroissante(key) {
    console.log(key);

    var classStyle = key + "-croissante";
    var buttons = document.getElementsByClassName(classStyle);
    if (this.request.orderBy[key] == 1) {
      this.request.orderBy[key] = -1
      this.activationCroissante(buttons[0], buttons[1])
    } else {
      this.request.orderBy[key] = 1
      this.activationCroissante(buttons[1], buttons[0])
    }

    for (let varkey in this.request.orderBy) {
      if (key != varkey) {
        this.request.orderBy[varkey] = 0
      }
    }
    this.bonCommandes = this.fonctionPartagesService.orderByDocuments(this.request.orderBy, this.bonCommandes)
  }

  activationCroissante(buttons1, buttons2) {
    var buttons = document.getElementsByClassName("croissante");

    for (let i = 0; i < buttons.length; i++) {
      var classList = buttons[i].getAttribute("class")
      classList = classList.replace("active-buttons-croissante", "")
      buttons[i].setAttribute("class", classList)
    }

    classList = buttons2.getAttribute("class")
    classList = classList.replace("active-buttons-croissante", "")
    classList += " active-buttons-croissante"
    buttons2.setAttribute("class", classList)
  }
  clickDocument(id) {
    this.formBC.patchValue({'isTransfert': id})
    this.getBonCommandes(this.request)
  }
  getReleveDate(request) {
    for (let key in this.request.search) {
      this.request.search[key] = this.formBC.value[key]
    }
    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
  }

  getDate(date) {
    if (date == "") { return }
    else {
      return formatDate(new Date(date), 'dd/MM/yyyy', 'en')

    }
  }
  exportexcel() {
    var data = []
    this.bonCommandes.forEach(e => {
      data.push({
        date: (e.date),

        numero: (e.numero),
        fournisseur: (e.fournisseur),
        bonReception: (e.bonReception),
        isTransfert : (e.isTransfert),
        totalHT: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalHT)),

        totalRemise: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        totalTVA :(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        totalGain: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalGain)),
        tFiscale : (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.tFiscale)),
        totalTTC : (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalTTC)),


      })
    });

    data.splice(data.length, 0, {
      date: "Total",

      numero:"",
      fournisseur:"",
      bonReception:"",
      isTransfert :"",
      totalHT: ((sommeTotalHT(data)==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalHT(data))),

      totalRemise: ((sommeTotalRemise(data)==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data))),
      totalTVA :((sommeTotalTVA(data)==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data))),
      totalGain: ((sommeTotalGain(data)==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalGain(data))),
      tFiscale : "",
      totalTTC : ((sommeTotalTTC(data)==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data))),
    })

    var filename = 'journalBonCommande.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
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

  async generatePDF(){
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    this.bonCommandes.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
        fournisseur: check(e.fournisseur),
        totalRemise: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        totalHT: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalHT)),
        totalTVA :check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        totalGain: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalGain)),
        tFiscale : check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.tFiscale)),
        totalTTC : check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        bonReception: check(e.bonReception),
        isTransfert : check(e.isTransfert),
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
          widths: [55, 80, 60, 60, 60, 60, 60, 60, 60, 70,60,60],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var societe = this.informationGenerale.getSocieteCurrentObject()

    var dateStart = new Date(this.request.dateStart).toLocaleDateString('fr')
    var dateEnd = new Date(this.request.dateEnd).toLocaleDateString('fr')
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
                    text: `Journal Bon Commandes Fournisseur de ${dateStart} à ${dateEnd}`,
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
                "bonReception",
                "isTransfert",
                "fournisseur",
                "totalHT",
                "totalRemise",

                "totalTVA",
                "totalGain",
                "tFiscale",
                "totalTTC",

              ],
              true,
              // Custom headers
              [
                { text: 'Date', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 9, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Bon Reception', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Is Transfert', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Fournisseur', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Total HT', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total Remise', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Total TVA', blod: true, fontSize: 9, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total Gain', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Timbre Fiscale', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total TTC', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des Lignes : " + data.length, alignment: 'left', blod: true, colSpan: 5, fontSize: 9 },
                {},
                {},
                {},
                {},
                {text: (sommeTotalHT(data)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalHT(data)), blod: true, alignment: (sommeTotalHT(data) === '-') ? "center" : "right", fontSize: 9,},

                {text: (sommeTotalRemise(data)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data)), blod: true, alignment: (sommeTotalRemise(data) === '-') ? "center" : "right", fontSize: 9,},
                {text: (sommeTotalTVA(data)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data)), blod: true, alignment: (sommeTotalTVA(data) === '-') ? "center" : "right", fontSize: 9,},
                {text: (sommeTotalGain(data)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalGain(data)), blod: true, alignment: (sommeTotalGain(data) === '-') ? "center" : "right", fontSize: 9,},
                {},
                {text: (sommeTotalTTC(data)==='-')?'-': this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)), blod: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 9, },

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
                  { text: "", fontSize: 8, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: societeInformations, fontSize: 8, rowSpan: 3, alignment: 'center', margin: [0, 15, 0, 0] },
                  { text: page, fontSize: 8, rowSpan: 3, alignment: 'right', margin: [0, 15, 10, 0] }
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
          margin :[25,0,0,0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();

  }
  getBonCommandes(request) {
    console.log(this.request);

    if (this.isLoading) {
      return
    }
    for (let key in this.request.search) {
      this.request.search[key] = this.formBC.value[key]
    }

    this.request.limit = this.formBC.value.limit
    this.request.magasin = this.informationGenerale.idSocieteCurrent


    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.request.page = 1
    }

    this.isLoading = true
    //console.log(this.request);

    this.journalCommandes.getBonCommandes(this.request)
      .subscribe(
        res => {
          this.isLoading = false
          //console.log(res)
          let resultat: any = res

          var test = resultat.resultat.docs
          if (resultat.status) {
            let tab = []
            test.forEach(e => {
              tab.push({
                numero: e.numero,
                date: e.date,
                fournisseur: e.fournisseur,
                totalRemise: e.totalRemise,
                totalHT: e.totalHT,
                totalTVA: e.totalTVA,
                tFiscale : e.tFiscale,
                totalGain: e.totalGain,
                totalTTC : e.totalTTC,
                isTransfert: e.isTransfert,
                bonReception :e.bonReception
              })
            });
            //console.log(tab);
            this.bonCommandes=tab


            this.listGlEmpty = []

            if (this.bonCommandes.length < 6) {
              for (let i = this.bonCommandes.length; i < 6; i++) {
                this.listGlEmpty.push({})
              }
            }

            this.bonCommandes = this.fonctionPartagesService.orderByDocuments(this.request.orderBy, this.bonCommandes)

          }

        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  getAllParametresFunction() {

    //console.log("getALLParametresJournalCommandes")


    if (this.isLoading) {
      return
    }
    this.request.magasin = this.informationGenerale.idSocieteCurrent

    this.isLoading = true
    this.journalCommandes.getBonCommandes(this.request)
      .subscribe(
        res => {
          this.isLoading = false
          //console.log(res)
          let resultat: any = res.resultat.docs
          //console.log(resultat);
          resultat.forEach( async e => {
            //console.log(e.transfertBonLivraison);
            this.bonCommandes.push({
              numero: e.numero,
              date: e.date,
              fournisseur: e.fournisseur,
              totalRemise: e.totalRemise,
              totalHT: e.totalHT,
              totalTVA: e.totalTVA,
              tFiscale : e.tFiscale,
              totalGain: e.totalGain,
              totalTTC : e.totalTTC,
              isTransfert: e.isTransfert,
              bonReception :e.bonReception
            })
          });
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  ngOnInit(): void {
    this.getAllParametresFunction()
    this.getFournisseurs()
  }

}
function sommeTotalTTC(data: any[]) {
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

function sommeTotalHT(data: any[]) {
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
function sommeTotalGain(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].totalGain === '-' || data[index].totalGain === null || data[index].totalGain === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].totalGain)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeTotalTVA(data: any[]) {
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

function sommeTotalRemise(data: any[]) {
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

