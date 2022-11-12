import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InformationsService } from '../../../services/informations.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';

import { Articlelist } from 'src/app/model/modelComerce/article/Articlelist';
import { Articleshow } from 'src/app/model/modelComerce/article/Articleshow';
import { Articleform } from 'src/app/model/modelComerce/article/Articleform';

import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit {

  //start popup
  @Output() closeModal = new EventEmitter<string>();

  @Output() selectionLigne = new EventEmitter<string>();

  @Input() isPopup = false

  @Input() isOpenModal = false

  closeModalFunction(){
    console.log("close modal")
    this.closeModal.emit();
  }

  selectionLigneFunction(id){
    this.selectionLigne.emit(id)
  }
  //end popup

  formC: FormGroup

  apiDelete = "/articles/deleteArticle"
  apiList = "/articles/listArticlesSociete"

  pageDetails = "/article/details/"
  pageModifie = "/article/modifier/"
  pageAjoute = "/article/ajout"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  objetFile = {
    reference: "Référence",
    codeBarre: "Code_Barre",
    designation: "Désignation",
    qteEnStock: "Quantité en stock",
    qteTheorique: "Quantité théorique",
    prixFourn: "Prix fournisseur",
    remiseF: "Remise fournisseur (%)",
    marge: "Marge (%)",
    prixAchat: "PrixAchat",
    prixTTC: "Prix TTC",
    categorie: "Catégorie",
    marque: "Marque",
    modele: "Modele"
  }

  deleteItem() {

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiDelete + "/" + this.idDeleteModal, {},this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.getClients()
          this.closeModalDelete()
          this.notificationToast.showSuccess("Votre client est bien supprimée !")
        }else{
          this.notificationToast.showError( this.fonctionPartages.getMessageBackend(resultat.message))
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
    this.params1Delete = "L'article "
    this.params2Delete = params2
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }

  constructor(private utilite:UtiliteService,
    private tokenStorageService:TokenStorageService,
    private fb: FormBuilder,
     private router: Router,
    private http: HttpClient,
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
    private notificationToast: ToastNotificationService,
    public fonctionPartages:FonctionPartagesService) {

    var form = new Articleform()
    this.formC = this.fb.group(form.getForm())

    this.getClients()


  }

  gotToAdd() {
    this.router.navigate(['/article/ajout']);
  }

  objectKeys = Object.keys;

  items = new Articleshow()

  itemsVariable = new Articleshow()

  request = new Articlelist()

  oldRequest = new Articlelist()

  ngOnInit(): void {

  }

  isLoading = false

  clients = []

  getClients() {

    if (this.isLoading) {
      return
    }

    for (let key in this.request.search) {
      this.request.search[key] = this.formC.value[key]
    }

    this.request.limit = this.formC.value.limit
    this.request.societe = this.informationGenerale.idSocieteCurrent

    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.request.page = 1
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request,this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          console.log(resultat)
          this.clients = resultat.resultat.docs
          this.totalPage = resultat.resultat.pages
          this.oldRequest = resultat.request
          if (!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page)) {
            this.getClients()
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

    if (request1.limit != request2.limit) {
      return false
    }

    return true;
  }



  totalPage = 1

  setLimitPage(newLimitPage: number) {
    this.request.limit = newLimitPage
    this.request.page = 1
    this.getClients()
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getClients()
  }

  titreFile = "Liste d'articles"
  nameFile = "liste_article"
  printout() {
    this.utilite.printout(this.clients, this.objetFile, this.titreFile)
  }

  async generatePDF() {
    //this.utilite.generatePDF(this.clients, this.objetFile, this.titreFile, this.nameFile)
    console.log(this.clients);
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    this.clients.forEach((e) => {
      data.push({
        reference : check(e.reference),
        categorie : check(e.categorie),
        designation : check(e.designation),
        prixFourn : check(e.prixFourn),
        remiseF : check(e.remiseF),
        prixAchatHT : check(e.prixAchat),
        prixRevient : check(e.prixRevient),

        prixAchatTTC : check(e.prixAchatTTC),
        prixVenteTTC :check(e.prixTTC),
        marge :check(e.marge),
        tauxTVA:check(e.tauxTVA),
        famille : check(e.famille),
        qteEnStock : check(e.qteEnStock),

      })
    })
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
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 6 });
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
          widths: [65, 55, 70, 45, 25, 45, 20, 20, 45,45,30],
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
      pageMargins: [3, 80, 3, 80],



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
                    text: "Liste d'Articles",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right',margin: [0, 10, 10, 10] }
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
                'reference',
                'categorie',
                'designation',
                // 'remiseF',
                // 'prixFourn',
                'prixAchatHT',
                'remiseF',
                'prixRevient',
                'marge',
                'tauxTVA',


                'prixAchatTTC',
                'prixVenteTTC',



                //'famille',
                'qteEnStock',
              ],
              true,
              // Custom headers
              [
                { text: 'Reference', blod: true, fontSize: 6, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Categorie', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Designation', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                //{ text: 'Famille', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Prix Achat HT', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Remise', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Prix Revient', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Marge', fontSize: 5, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Taux TVA', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Prix Achat TTC', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                // { text: 'Remise Fourn', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                // { text: 'Prix Fourn', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Prix V TTC', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'Stock', fontSize: 6, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des Lignes : " + data.length, alignment: 'left', blod: true, colSpan: 3, fontSize: 9 },
                {},
                {},
                {text: sommePrixAchatHT(data), blod: true, alignment: (sommePrixAchatHT(data) === '-') ? "center" : "right", fontSize: 9,},
                {},
                {text: sommePrixRevient(data), blod: true, alignment: (sommePrixRevient(data) === '-') ? "center" : "right", fontSize: 9,},
                {},
                {},
                {text: sommeAchatTTC(data), blod: true, alignment: (sommeAchatTTC(data) === '-') ? "center" : "right", fontSize: 9,},
                {text: sommePrixVenteTTC(data), blod: true, alignment: (sommePrixVenteTTC(data) === '-') ? "center" : "right", fontSize: 9,},
                { text: sommeQte(data), blod: true, alignment: (sommeQte(data) === '-') ? "center" : "right", fontSize: 9, },

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
                  { text : "",fontSize: 10, rowSpan: 3, alignment: 'center',margin: [0,15,0,0]   /* { qr :'http://bongest.net', fit :70,fontSize: 10, rowSpan: 3, alignment: 'left', margin: [20,15,0,0] */},
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center',margin: [0,15,0,0]  },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right',margin: [0,15,10,0]  }
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
          margin : [13,0,15,0]
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

  async generatePDFInventaire(){
    console.log(this.clients)

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }
    var data = []
    this.clients.forEach((e) => {
      data.push({
        reference : check(e.reference),
        designation : check(e.designation),
      })
    })
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
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: 8});
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
          widths: [60, 90, 75, 75, 75, 130],
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
                    text: "Inventaire",
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    blod: true,
                    fontSize: 16,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, blod: true, rowSpan: 3, alignment: 'right',margin: [0, 10, 10, 0] }
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
                'reference',
                'designation',
                'inventaire 1',
                'inventaire 2',
                'inventaire 3',
                'remarque'
              ],
              true,
              // Custom headers
              [
                { text: 'reference', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},
                { text: 'designation', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},
                { text: 'inventaire 1', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},
                { text: 'inventaire 2', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},
                { text: 'inventaire 3', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},
                { text: 'remarque', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left'},

              ],
              [
                { text: "Total des Articles : " + data.length, alignment: 'left', blod: true, colSpan: 6, fontSize: 9 },
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
                  { text : "",fontSize: 10, rowSpan: 3, alignment: 'center',margin: [0,15,0,0]   /* { qr :'http://bongest.net', fit :70,fontSize: 10, rowSpan: 3, alignment: 'left', margin: [20,15,0,0] */},
                  { text: societeInformations, fontSize: 10, rowSpan: 3, alignment: 'center',margin: [0,15,0,0]  },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right',margin: [0,15,10,0]  }
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
          margin : [15,0,0,0]
        },
        pageCount: {
          italics: true,
          alignment: 'right',

        },

      },


    };
    pdfMake.createPdf(documentDefinition).open();

  }
  exportexcel() {
    /* table id is passed over here */
    //this.utilite.exportexcel(this.clients, this.objetFile, this.titreFile, this.nameFile)
    var data = []
    this.clients.forEach((e) => {
      data.push({
        reference : (e.reference),
        categorie : (e.categorie),
        designation : (e.designation),
        prixFourn : (e.prixFourn),
        remiseF : (e.remiseF),
        prixAchatHT : (e.prixAchat),
        prixRevient : (e.prixRevient),

        prixAchatTTC : (e.prixAchatTTC),
        prixVenteTTC :(e.prixTTC),
        marge :(e.marge),
        tauxTVA:(e.tauxTVA),
        famille : (e.famille),
        qteEnStock : (e.qteEnStock),

      })
    })
    var filename = 'Articles.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
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

    this.getClients()
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

  //open modal ajout Element
  isOpenModalAjoutElement = false
  idAjoutElementModal = ""
  typeElement

  closeModalAjoutElement(){
    this.isOpenModalAjoutElement = false
    this.getClients()
  }

  ajouterArticle(){
    if(!this.isPopup){
      this.router.navigate([this.pageAjoute])
      return
    }

    this.typeElement = this.fonctionPartages.titreOfModal.ajouterFournisseur
    this.isOpenModalAjoutElement = true
  }

  modifierArticle(idArticle){
    if(!this.isPopup){
      this.router.navigate([this.pageModifie+idArticle])
      return
    }

    this.typeElement = this.fonctionPartages.titreOfModal.modifierArticle
    this.isOpenModalAjoutElement = true
    this.idAjoutElementModal = idArticle
  }
  //end open modal ajout Element

}
function sommeQte(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].qteEnStock === '-' || data[index].qteEnStock === null || data[index].qteEnStock === undefined) {
      som += 0
    } else {
      som += parseInt(data[index].qteEnStock)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommePrixVenteTTC(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].prixVenteTTC === '-' || data[index].prixVenteTTC === null || data[index].prixVenteTTC === undefined) {
      som += 0
    } else {
      som += parseInt(data[index].prixVenteTTC)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeAchatTTC(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].prixAchatTTC === '-' || data[index].prixAchatTTC === null || data[index].prixAchatTTC === undefined) {
      som += 0
    } else {
      som += parseInt(data[index].prixAchatTTC)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommePrixRevient(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].prixRevient === '-' || data[index].prixRevient === null || data[index].prixRevient === undefined) {
      som += 0
    } else {
      som += parseInt(data[index].prixRevient)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommePrixAchatHT(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].prixAchatHT === '-' || data[index].prixAchatHT === null || data[index].prixAchatHT === undefined) {
      som += 0
    } else {
      som += parseInt(data[index].prixAchatHT)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

