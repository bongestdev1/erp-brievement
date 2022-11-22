import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import {formatDate} from '@angular/common';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { UtiliteService } from 'src/app/services/utilite.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-bon-reception',
  templateUrl: './list-bon-reception.component.html',
  styleUrls: ['./list-bon-reception.component.scss']
})
export class ListBonReceptionComponent implements OnInit {
  formBL:FormGroup

  apiDelete = "/bonReceptions/deleteBonReception"
  apiList = "/bonReceptions/listBonReceptions"

  pageDetails = "/bonReception/details/"
  pageModifie = "/bonReception/modifier/"
  pageAjoute = "/bonReception/ajout"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  deleteItem(){

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.apiDelete +"/"+this.idDeleteModal, {},this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
            this.getBonLivraisons(this.request)
            this.closeModalDelete()
            this.notificationToast.showSuccess("Votre BonLivraison est bien supprimée !")
         }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  openModalDelete(id, params2){
    this.idDeleteModal = id
    this.isOpenModalDelete = true
    this.params1Delete = "Le Bon Reception"
    this.params2Delete = params2
  }

  closeModalDelete(){
    this.isOpenModalDelete = false
  }

  titreDocument = this.fonctionPartages.titreDocuments.bonReception

  constructor(private fb:FormBuilder,
    private router:Router, private http: HttpClient,
    public informationGenerale: InformationsService,
    private notificationToast:ToastNotificationService,
    private tokenStorageService:TokenStorageService,
    public fonctionPartages:FonctionPartagesService,
    private utilite:UtiliteService,
    public generationPdfFacture: GenerationPdfFactureService) {

    this.formBL = this.fb.group({
      numero:[''],
      date:[''],
      totalRemise:[''],
      totalTVA:[''],
      tFiscale:[''],
      totalTTC:[''],
      totalHT:[''],
      totalGain:[''],
      fournisseur:[''],
      isTransfert: ['non'],
      factureAchat: [''],
      limit:50
    })

  }

  gotToAdd(){
    this.router.navigate([this.pageAjoute]);
  }

  objectKeys = Object.keys;

  titreFile = "Liste Devis"
  nameFile = "liste_devis"
  printout() {
    this.utilite.printout(this.bonLivraisons, this.items, this.titreFile)
  }

  async generatePDF() {
    //this.utilite.generatePDF(this.bonLivraisons, this.items, this.titreFile, this.nameFile)
    console.log(this.bonLivraisons)
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
        fournisseur: check(e.fournisseur),
        date: check(e.date),
        totalRemise: check(e.totalRemise),
        netHT :check(this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT)- parseFloat(e.totalRemise))),
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
          widths: [55, 95, 120, 80, 70, 70, 70, 70, 70],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartages.parametres.logo
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
                    text: "Liste Bon Reception",
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
                { text: 'date', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                { text: 'numero', blod: true, fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'fournisseur', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'bon Reception', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'total HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'total Remise', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Net HT', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                { text: 'total TVA', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'total TTC', fontSize: 7, blod: true, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des Lignes : " + data.length, alignment: 'left', blod: true, colSpan: 4, fontSize: 9 },
                {},
                {},
                {},
                {text: (sommeTotalHT(data)==='-')? '-':this.fonctionPartages.getFormaThreeAfterVerguleNomber(sommeTotalHT(data)) , bold: true, alignment: (sommeTotalHT(data) === '-') ? "center" : "right", fontSize: 8,},

                {text: (sommeTotalRemise(data)==='-')? '-':this.fonctionPartages.getFormaThreeAfterVerguleNomber(sommeTotalRemise(data)) , bold: true, alignment: (sommeTotalRemise(data) === '-') ? "center" : "right", fontSize: 8,},

                {text: (sommeTotalNETHT(data)==='-')? '-':this.fonctionPartages.getFormaThreeAfterVerguleNomber(sommeTotalNETHT(data)) , bold: true, alignment: (sommeTotalNETHT(data) === '-') ? "center" : "right", fontSize: 8,},

                {text: (sommeTotalTVA(data)==='-')?'-':this.fonctionPartages.getFormaThreeAfterVerguleNomber(sommeTotalTVA(data)) , bold: true, alignment: (sommeTotalTVA(data) === '-') ? "center" : "right", fontSize: 8,},

                {text: (sommeTotalTTC(data)==='-')? '-':this.fonctionPartages.getFormaThreeAfterVerguleNomber(sommeTotalTTC(data)) , bold: true, alignment: (sommeTotalTTC(data) === '-') ? "center" : "right", fontSize: 8,},

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
          margin:[25,0,0,0]
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
  exportexcel() {
    /* table id is passed over here */
    //this.utilite.exportexcel(this.bonLivraisons, this.items, this.titreFile, this.nameFile)

    var data = []
    this.bonLivraisons.forEach(e => {
      data.push({
        date: (e.date),

        numero: (e.numero),
        fournisseur: (e.fournisseur),
        bonReception: (e.bonReception),
        totalHT: (e.totalHT),

        totalRemise: (e.totalRemise),
        netHT :(this.fonctionPartages.getFormaThreeAfterVerguleNomber(parseFloat(e.totalHT)- parseFloat(e.totalRemise))),
        totalTVA: (e.totalTVA),
        totalTTC: (e.totalTTC),
      })
    });
    var filename = 'listBonReception.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }

  items = {
    numero:"Numero",
    date:"Date",
    fournisseur:"Fournisseur",
    totalRemise:"Total_Remise",
    totalHT:"Total_HT",
    totalTVA:"Total_TVA",
    tFiscale:"Timbre_Fiscale",
    totalTTC:"Total_TTC",
    totalGain:"Total_Gain",
    factureAchat:"Facture_Achat"
  };

  itemsVariable = {
    numero:"active",
    fournisseur:"active",
    date:"active",
    totalRemise:"active",
    totalHT:"active",
    totalTVA:"active",
    tFiscale:"active",
    totalTTC:"active",
    totalGain:"active",
    factureAchat:"Facture_Achat"
  };

  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin:"",
    search:{
      numero:"",
      fournisseur:"",
      date:"",
      tiers:"",
      totalRemise:"",
      totalHT:"",
      totalTVA:"",
      tFiscale:"",
      totalTTC:"",
      totalGain:"",
      isTransfert: "non",
      factureAchat:""
    },
    orderBy:{
      numero:0,
      fournisseur:0,
      date:0,
      tiers:0,
      totalRemise:0,
      totalHT:0,
      totalTVA:0,
      tFiscale:0,
      totalTTC:0,
      totalGain:0,
      isTransfert: 0,
      factureAchat:0
    },
    limit: 50,
    page:1,
    isAchatContoire: false
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    magasin:"",
    search:{
      numero:"",
      fournisseur:"",
      date:"",
      tiers:"",
      totalRemise:"",
      totalHT:"",
      totalTVA:"",
      tFiscale:"",
      totalTTC:"",
      totalGain:"",
      factureAchat:""
    },
    orderBy:{
      numero:0,
      fournisseur:0,
      date:0,
      tiers:0,
      totalRemise:0,
      totalHT:0,
      totalTVA:0,
      tFiscale:0,
      totalTTC:0,
      totalGain:0,
      factureAchat:0
    },
    limit: 50,
    page:1,
    isAchatContoire: false
  }

  isAchatContoire = false

  ngOnInit(): void {
    if (this.router.url.indexOf("achatComptoire") > -1) {
      this.isAchatContoire = true
      this.pageDetails = "/achatComptoire/details/"
      this.pageModifie = "/achatComptoire/modifier/"
      this.pageAjoute = "/achatComptoire/ajout"
    }
    this.getBonLivraisons(this.request)
  }

  isLoading = false

  bonLivraisons = []

  getBonLivraisons(request) {

    if (this.isLoading) {
      return
    }

    for(let key in this.request.search){
      this.request.search[key] = this.formBL.value[key]
    }

    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
    this.request.limit = this.formBL.value.limit
    this.request.magasin = this.informationGenerale.idSocieteCurrent

    if(!this.testSyncronisation(this.request, this.oldRequest)){
      this.request.page = 1
    }

    this.isLoading = true

    this.request.isAchatContoire = this.isAchatContoire

    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request,this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.bonLivraisons = resultat.resultat.docs
          this.totalPage = resultat.resultat.pages
          this.oldRequest = resultat.request
          if(this.totalPage < this.request.page && this.request.page != 1){
            this.request.page = this.totalPage
            this.getBonLivraisons(this.request)
          }

          if(!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page) ){
            this.getBonLivraisons(this.request)
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  testSyncronisation(request1, request2){
    for(let key in request1.search){
      if(request1.search[key] != request2.search[key]){
        return false
      }
    }

    for(let key in request1.orderBy){
      if(request1.orderBy[key] != request2.orderBy[key]){
        return false
      }
    }

    if(request1.dateStart != request2.dateStart || request1.dateEnd != request2.dateEnd){
      return false
    }

    if(request1.limit != request2.limit){
      return false
    }

    if(request1.magasin != request2.magasin){
      return false
    }

    return true;
  }

  totalPage = 1

  getDate(date){
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


  changeCroissante(key){
    var classStyle = key+"-croissante";
    var buttons = document.getElementsByClassName(classStyle);
    if(this.request.orderBy[key] == 1){
      this.request.orderBy[key] = -1
      this.activationCroissante(buttons[0], buttons[1])
    }else{
      this.request.orderBy[key] = 1
      this.activationCroissante(buttons[1], buttons[0])
    }

    for(let varkey in  this.request.orderBy){
      if(key != varkey){
         this.request.orderBy[varkey] = 0
      }
    }

    this.getBonLivraisons(this.request)
  }


  activationCroissante(buttons1, buttons2){
    var buttons = document.getElementsByClassName("croissante");

    for(let i = 0; i < buttons.length; i++){
      var classList = buttons[i].getAttribute("class")
      classList = classList.replace("active-buttons-croissante","")
      buttons[i].setAttribute("class", classList)
    }

    classList = buttons2.getAttribute("class")
    classList = classList.replace("active-buttons-croissante","")
    classList += " active-buttons-croissante"
    buttons2.setAttribute("class", classList)
  }

  clickDocument(id) {
    this.formBL.patchValue({'isTransfert': id})
    this.getBonLivraisons(this.request)
  }

  listCochee = []
  checkBonReception(idBonReception){
    for(let i = 0; i < this.listCochee.length; i++){
      if(idBonReception == this.listCochee[i].idBonReception){
        this.listCochee = this.listCochee.filter(x => x.idBonReception != idBonReception)
        return
      }
    }
    this.listCochee.push({idBonReception:idBonReception})
  }

  isCochedBonReception(idBonReception){
    for(let i = 0; i < this.listCochee.length; i++){
      if(idBonReception == this.listCochee[i].idBonReception){
        return true
      }
    }
    return false
  }

  transfertFactureAchat(){
    if(this.listCochee.length === 0){
      this.notificationToast.showError("Veuillez cocher votres bons livraisons que les voulez transfert une facture de vente !!")
      return
    }
    var lien = ""
    for(let i = 0; i < this.listCochee.length; i++){
      if(i == 0){
        lien += this.listCochee[i].idBonReception
      }else{
        lien += "&&"+this.listCochee[i].idBonReception
      }
    }

    this.router.navigate(['/factureAchat/transfert/'+lien])

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
