import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { formatDate } from '@angular/common';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';

const S_F_S = "SAVE_FILTER_SESSION_BON_LIVRAISON"

@Component({
  selector: 'app-list-bon-livraison',
  templateUrl: './list-bon-livraison.component.html',
  styleUrls: ['./list-bon-livraison.component.scss']
})
export class ListBonLivraisonComponent implements OnInit {
  formBL: FormGroup


  apiDelete = "/bonLivraisons/deleteBonLivraison"
  apiList = "/bonLivraisons/listBonLivraisons"

  pageDetails = "/bonLivraison/details/"
  pageModifie = "/bonLivraison/modifier/"
  pageAjoute = "/bonLivraison/ajout"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  idItemSelected = ""

  setSaveFilterSession(){
    var request = {request:this.request, idItemSelected:this.idItemSelected }
    localStorage.setItem(S_F_S, JSON.stringify(request))
  }

  getSaveFilterSession(){
    var request:any = localStorage.getItem(S_F_S)

    if(request === undefined || !request){
      return
    }

    request = JSON.parse(request)
    console.log(request)

    this.request = request.request
    this.oldRequest = this.request
    this.idItemSelected = request.idItemSelected
    this.formBL.patchValue(this.request.search)

  }

  deleteItem() {

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiDelete + "/" + this.idDeleteModal, {}, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.getBonLivraisons(this.request)
          this.closeModalDelete()
          this.notificationToast.showSuccess("Votre BonLivraison est bien supprimée !")
        } else {
          this.notificationToast.showError(this.fonctionPartages.getMessageBackend(resultat.message))
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  openModalDelete(id, params2) {
    this.idDeleteModal = id
    this.isOpenModalDelete = true
    this.params1Delete = "Le BonLivraison"
    this.params2Delete = params2
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }

  isVenteContoire = false

  titreDocument = this.fonctionPartagesService.titreDocuments.bonLivraison
  format = this.fonctionPartagesService.format

  constructor(
    private utilite: UtiliteService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public informationGenerale: InformationsService,
    private tokenStorageService: TokenStorageService,
    private notificationToast: ToastNotificationService,
    public fonctionPartages: FonctionPartagesService,
    public fonctionPartagesService: FonctionPartagesService,
    public generationPdfFacture: GenerationPdfFactureService) {

    this.formBL = this.fb.group({
      numero: [''],
      date: [''],
      client: [''],
      totalRemise: [''],
      totalHT: [''],
      totalTVA: [''],
      totalRedevance :[''],
      tFiscale: [''],
      totalTTC: [''],
      totalGain: [''],
      isTransfert: ['non'],
      factureVente: [''],
      commande: [''],
      limit: 50
    })


  }

  ngOnInit(): void {
    if (this.router.url.indexOf("venteComptoire") > -1) {
      this.isVenteContoire = true
      this.pageDetails = "/venteComptoire/details/"
      this.pageModifie = "/venteComptoire/modifier/"
      this.pageAjoute = "/venteComptoire/ajout"
    }

    this.request.dateEnd =this.informationGenerale.idDateFinCurrent
    this.request.dateStart = this.informationGenerale.idDateAujourdCurrent

    this.oldRequest = this.request

    //this.getSaveFilterSession()

    this.getBonLivraisons(this.request)

  }


  gotToAdd() {
    this.router.navigate([this.pageAjoute]);
  }

  objectKeys = Object.keys;

  itemsNotShowInput = ["client", "date"]

  titreFile = "Liste Bon Livraison"
  nameFile = "liste_bon_livraison"

  items = {
    numero: "Numero",
    date: "Date",
    client: "Client",
    totalRemise: "Total Remise",
    totalRedevance : "Total Redevance",
    totalHT: "TotalHT",
    totalTVA: "Total TVA",
    tFiscale: "Timbre Fiscale",
    totalTTC: "Total TTC",
    totalGain: "Total Gain",
    factureVente: "Facture",
    commande: "Commande"
  };


  itemsVariable = {
    numero: "Numero",
    date: "Date",
    client: "Client",
    totalRemise: "Total Remise",
    totalHT: "TotalHT",
    totalTVA: "Total TVA",
    totalRedevance : "Total Redevance",
    tFiscale: "Timbre Fiscale",
    totalTTC: "Total TTC",
    totalGain: "Total Gain",
    factureVente: "Facture",
    commande: "Commande"
  };

  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin: "",
    search: {
      numero: "",
      client: "",
      date: "",
      tiers: "",
      totalRemise: "",
      totalRedevance : "",
      totalHT: "",
      totalTVA: "",
      tFiscale: "",
      totalTTC: "",
      totalGain: "",
      isTransfert: "non",
      factureVente: "",
      commande: ""
    },
    orderBy: {
      numero: 0,
      client: 0,
      date: 0,
      tiers: 0,
      totalRedevance :0,
      totalRemise: 0,
      totalHT: 0,
      totalTVA: 0,
      tFiscale: 0,
      totalTTC: 0,
      totalGain: 0,
      isTransfert: 0,
      factureVente: 0,
      commande: 0
    },
    limit: 50,
    page: 1,
    isVenteContoire: false
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin: "",
    search: {
      numero: "",
      client: "",
      date: "",
      tiers: "",
      totalRemise: "",
      totalRedevance : "",
      totalHT: "",
      totalTVA: "",
      tFiscale: "",
      totalTTC: "",
      totalGain: "",
      isTransfert: "non",
      factureVente: "",
      commande: ""
    },
    orderBy: {
      numero: 0,
      client: 0,
      date: 0,
      tiers: 0,
      totalRedevance :0,
      totalRemise: 0,
      totalHT: 0,
      totalTVA: 0,
      tFiscale: 0,
      totalTTC: 0,
      totalGain: 0,
      isTransfert: 0,
      factureVente: 0,
      commande: 0
    },
    limit: 50,
    page: 1,
    isVenteContoire: false
  }

  isLoading = false

  bonLivraisons = []

  getBonLivraisons(request) {

    if (this.isLoading) {
      return
    }

    for (let key in this.request.search) {
      this.request.search[key] = this.formBL.value[key]
    }

    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
    this.request.limit = this.formBL.value.limit
    this.request.magasin = this.informationGenerale.idSocieteCurrent
    this.request.isVenteContoire = this.isVenteContoire


    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.request.page = 1
    }

    this.setSaveFilterSession()

    this.isLoading = true
    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.bonLivraisons = resultat.resultat.docs

          console.log(this.bonLivraisons)

          this.totalPage = resultat.resultat.pages
          this.oldRequest = resultat.request
          if (this.totalPage < this.request.page && this.request.page != 1) {
            this.request.page = this.totalPage
            this.getBonLivraisons(this.request)
          }

          if (!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page)) {
            this.getBonLivraisons(this.request)
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

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

    if (request1.limit != request2.limit) {
      return false
    }

    if (request1.magasin != request2.magasin) {
      return false
    }

    return true;
  }

  totalPage = 1

  getDate(date) {
    return formatDate(new Date(date), 'yyyy-MM-dd', 'en');
  }

  setLimitPage(newLimitPage: number) {
    this.request.limit = newLimitPage
    this.request.page = 1
    this.getBonLivraisons(this.request)
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getBonLivraisons(this.request)
  }

  changeCroissante(key) {
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

    this.getBonLivraisons(this.request)
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
    this.formBL.patchValue({ 'isTransfert': id })
    this.getBonLivraisons(this.request)
  }

  //start transfert facture vente
  listCochee = []
  checkBonLivraison(idBonLivraison) {
    for (let i = 0; i < this.listCochee.length; i++) {
      if (idBonLivraison == this.listCochee[i].idBonLivraison) {
        this.listCochee = this.listCochee.filter(x => x.idBonLivraison != idBonLivraison)
        return
      }
    }
    this.listCochee.push({ idBonLivraison: idBonLivraison })
  }

  isCochedBonLivraison(idBonLivraison) {
    for (let i = 0; i < this.listCochee.length; i++) {
      if (idBonLivraison == this.listCochee[i].idBonLivraison) {
        return true
      }
    }
    return false
  }

  transfertFactureVente() {
    if (this.listCochee.length === 0) {
      this.notificationToast.showError("Veuillez cocher votres bons livraisons que les voulez transfert une facture de vente !!")
      return
    }
    var lien = ""
    for (let i = 0; i < this.listCochee.length; i++) {
      if (i == 0) {
        lien += this.listCochee[i].idBonLivraison
      } else {
        lien += "&&" + this.listCochee[i].idBonLivraison
      }
    }

    this.router.navigate(['/factureVente/transfert/' + lien])
  }
  //end transfert facture vente
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
    console.log(this.bonLivraisons);

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    this.bonLivraisons.forEach(e => {
      data.push({
        numero: check(e.numero),
        date: check(e.date),
        client: check(e.client),
        totalRemise: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRemise)),
        totalRedevance : check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalRedevance)),
        totalHT: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalHT)),
        totalTVA :check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTVA)),
        tFiscale : check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.tFiscale)),
        totalTTC : check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalTTC)),
        totalGain: check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(e.totalGain)),
        factureVente : check(e.factureVente),
        commande : check(e.commande),
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
          widths: [55, 80, 90, 60, 60, 60, 60, 60, 60,60],
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

        let date = `${new Date().toLocaleDateString('FR')}`
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
                    text: `Liste Bons Livraisons de ${dateStart} à ${dateEnd}`,
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 14,
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
                "client",
                "totalHT",

                "totalRemise",
                "totalTVA",
                "totalRedevance",
                "tFiscale",
                "totalGain",

                "totalTTC",
                // "factureVente",
                // "commande",
              ],
              true,
              // Custom headers
              [
                { text: 'Date', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'Numero', blod: true, fontSize: 9, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Client', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Total HT', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total Remise', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Total TVA', blod: true, fontSize: 9, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Redevance', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'T Fiscale', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Total Gain', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Total TTC', fontSize: 9, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                // { text: 'facture_Vente', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                // { text: 'commande', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

              ],
              [
                { text: "Nombre de Lignes: " + data.length, alignment: 'left', blod: true, colSpan: 3, fontSize: 9 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {text: this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)), blod: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 9, },
                // {},
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
          margin :[50,0,0,0]
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
