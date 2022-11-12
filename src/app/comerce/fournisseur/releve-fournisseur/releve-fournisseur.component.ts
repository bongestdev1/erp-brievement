import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-releve-fournisseur',
  templateUrl: './releve-fournisseur.component.html',
  styleUrls: ['./releve-fournisseur.component.scss']
})
export class ReleveFournisseurComponent implements OnInit {

  formC: FormGroup


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public informationGenerale: InformationsService,
    private tokenStorageService: TokenStorageService,
    public fonctionPartagesService: FonctionPartagesService,
    private notificationToast: ToastNotificationService,) {

    this.formC = this.fb.group({
      day1: [''],
      day2: [''],
      allFournisseurs: [''],

      dateEcheance: [''],
      dateReglement: [''],
      modeReglement: [''],
      montant: [''],
      notes: [''],
      numCheque: [''],
      tresorerie: [''],
      fournisseur: [''],


      numero: [''],
      tFiscale: [''],
      totalGain: [''],
      totalHT: [''],
      totalRemise: [''],
      totalTTC: [''],
      totalTVA: [''],

      limit: 10
    })
    this.getFournisseurs()
  }

  objectKeys = Object.keys;

  itemsG = {
    fournisseur: "Fournisseur",
    type: "Type",
    numero: "Numero",
    dateOperation: "Date Opération",
    modeReglement: "Mode Règlement",
    numCheque: "N° Chèque",
    debit: "Débit",
    credit: "Crédit",
    solde: "Solde",
    soldeDebit: "Solde Débit",
    soldeCredit: "Solde Crédit",
  };

  itemsVariableG = {
    fournisseur: "Fournisseur",
    type: "Type",
    numero: "Numero",
    dateOperation: "Date Opération",
    modeReglement: "Mode Règlement",
    numCheque: "N° Chèque",
    debit: "Débit",
    credit: "Crédit",
    soldeDebit: "Solde Débit",
    soldeCredit: "Solde Crédit",
  };

  itemsVariableGOrderby = {
    fournisseur: 0,
    type: 0,
    numero: 0,
    dateOperation: 0,
    modeReglement: 0,
    numCheque: 0,
    debit: 0,
    credit: 0,
    solde: 0,
  }

  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      dateEcheance: "",
      dateReglement: "",
      modeReglement: "",
      montant: "",
      notes: "",
      numCheque: "",
      tresorerie: "",
      fournisseur: "",

      numero: "",
      tFiscale: "",
      totalGain: "",
      totalHT: "",
      totalRemise: "",
      totalTTC: "",
      totalTVA: "",
    },
    orderBy: {
      dateEcheance: 0,
      dateReglement: 0,
      modeReglement: 0,
      montant: 0,
      notes: 0,
      numCheque: 0,
      tresorerie: 0,
      fournisseur: 0,

      numero: 0,
      tFiscale: 0,
      totalGain: 0,
      totalHT: 0,
      totalRemise: 0,
      totalTTC: 0,
      totalTVA: 0,
    },
    fournisseur:"",
    societe: this.informationGenerale.idSocieteCurrent,
    isCheckedWithFiltrage: "",
    limit: 3,
    page: 1
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      dateEcheance: "",
      dateReglement: "",
      modeReglement: "",
      montant: "",
      notes: "",
      numCheque: "",
      tresorerie: "",
      fournisseur: "",
    },
    orderBy: {
      dateEcheance: 0,
      dateReglement: 0,
      modeReglement: 0,
      montant: 0,
      notes: 0,
      numCheque: 0,
      tresorerie: 0,
      fournisseur: 0,
    },
    fournisseur:"",
    societe: this.informationGenerale.idSocieteCurrent,
    limit: 3,
    page: 1
  }

  listGl = []
  listGlEmpty = [{}, {}, {}, {}, {}, {}]
  soldeCurrente = 0
  soldeBefore = 0

  ngOnInit(): void {
  }

  isLoading = false

  getDate(date) {
    return formatDate(new Date(date), 'dd/MM/yyyy', 'en')
  }

  getReleveTout() {
    this.request.fournisseur=this.idFournisseur
    this.http.post(this.informationGenerale.baseUrl + this.apilistReglement, this.request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          this.listGl = response.tabReleveFournisseurs
          this.soldeCurrente = response.soldeCurrente
          this.soldeBefore = response.soldeBefore

          this.calculerSolde()

          this.listGlEmpty = []
          if (this.listGl.length < 6) {
            for (let i = this.listGl.length; i < 6; i++) {
              this.listGlEmpty.push({})
            }
          }

          if (!this.testSyncronisation(this.request, response.request)) {
            this.getReleveFournisseur()
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }
  getReleveParFA() {
    this.http.post(this.informationGenerale.baseUrl + this.apiListFA + this.idFournisseur, this.request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          this.listGl = response.tabReleveFournisseurs
          this.soldeCurrente = response.soldeCurrente
          this.soldeBefore = response.soldeBefore

          this.calculerSolde()

          this.listGlEmpty = []
          if (this.listGl.length < 6) {
            for (let i = this.listGl.length; i < 6; i++) {
              this.listGlEmpty.push({})
            }
          }

          if (!this.testSyncronisation(this.request, response.request)) {
            this.getReleveFournisseur()
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  getReleveParBR() {
    this.http.post(this.informationGenerale.baseUrl + this.apiListR + this.idFournisseur, this.request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          this.listGl = response.tabReleveFournisseurs
          this.soldeCurrente = response.soldeCurrente
          this.soldeBefore = response.soldeBefore

          this.calculerSolde()

          this.listGlEmpty = []
          if (this.listGl.length < 6) {
            for (let i = this.listGl.length; i < 6; i++) {
              this.listGlEmpty.push({})
            }
          }

          if (!this.testSyncronisation(this.request, response.request)) {
            this.getReleveFournisseur()
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  getReleveDate(request) {
    for (let key in this.request.search) {
      this.request.search[key] = this.formC.value[key]
    }
    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
  }

  apilistReglement = "/fournisseurs/listReglementsFournisseur"
  apiListFA = "/reglements/getByIdFournisseur/"
  apiListR = "/reglements/getByIdFournisseurRe/"
  isCheckedWithFiltrage = "factureAchat"
  getReleveFournisseur() {
    if (this.isLoading) {
      return
    }

    if (this.idFournisseur.length < 5) {
      this.listGl = []
      this.notificationToast.showError("choisissez un fournisseur !")
      return
    }
    this.isLoading = true

    if (this.isCheckedWithFiltrage === "factureAchat") {
      this.getReleveParFA()
    } else if (this.isCheckedWithFiltrage === "bonReception") {
      this.getReleveParBR()
    } else if(this.isCheckedWithFiltrage === "tout") {
      this.getReleveTout()
    }
  }

  getTotalOfKey(key) {
    var somme = 0
    for (let item of this.listGl) {
      somme += item[key]
    }
    return somme
  }

  calculerSolde() {
    if (this.listGl.length == 1) {
      for (let i = 0; i < 1; i++) {
        this.listGl[i].solde = this.soldeBefore + this.listGl[i].debit - this.listGl[i].credit
      }
    } else if (this.listGl.length > 1) {
      for (let i = 0; i < 1; i++) {
        this.listGl[i].solde = this.soldeBefore + this.listGl[i].debit - this.listGl[i].credit
      }
      for (let i = 1; i < this.listGl.length; i++) {
        this.listGl[i].solde = this.listGl[i - 1].solde + this.listGl[i].debit - this.listGl[i].credit
      }
    }

    for (let i = 0; i < this.listGl.length; i++) {
      this.listGl[i].soldeDebit = 0
      this.listGl[i].soldeCredit = 0

      if (this.listGl[i].solde > 0) {
        this.listGl[i].soldeDebit = Math.abs(this.listGl[i].solde)
      } else {
        this.listGl[i].soldeCredit = Math.abs(this.listGl[i].solde)
      }
    }

  }

  getOption(ch) {
    this.isCheckedWithFiltrage = ch
  }

  //Debut autocom Fournisseur
  apiList = "/fournisseurs/listFournisseurs"
  allFournisseurs = []
  getFournisseurs() {
    let request = { page: 1, limit: 0, search: {}, orderBy: {}, societe: this.informationGenerale.idSocieteCurrent }
    this.http.post(this.informationGenerale.baseUrl + this.apiList, request, this.tokenStorageService.getHeader()).subscribe(
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

  //autocomplete Fournisseur
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

  setFournisseurID(id) {
    this.idFournisseur = id
  }
  //open modal ajout Fournisseur
  isOpenModalAjoutFournisseur = false
  idAjoutFournisseurModal = ""
  typeElement
  closeModalAjoutFournisseur() {
    this.isOpenModalAjoutFournisseur = false
    this.getFournisseurs()
  }
  openModalAjoutFournisseur() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterFournisseur
    this.isOpenModalAjoutFournisseur = true
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

    return true;
  }

  changeCroissante(key) {
    var classStyle = key + "-croissante";
    var buttons = document.getElementsByClassName(classStyle);
    if (this.itemsVariableGOrderby[key] == 1) {
      this.itemsVariableGOrderby[key] = -1
      this.fonctionPartagesService.activationCroissante(buttons[0], buttons[1])

    } else {
      this.itemsVariableGOrderby[key] = 1
      this.fonctionPartagesService.activationCroissante(buttons[1], buttons[0])
    }

    for (let varkey in this.itemsVariableGOrderby) {
      if (key != varkey) {
        this.itemsVariableGOrderby[varkey] = 0
      }
    }

    this.listGl = this.fonctionPartagesService.orderByDocuments(this.itemsVariableGOrderby, this.listGl)
  }



  isLoadingIconPdf = false
  generatePDF(idFournisseur) {
    console.log(idFournisseur);
    if (idFournisseur == undefined || idFournisseur == null || idFournisseur == "") {
      this.isLoadingIconPdf = false
    } else {
      this.isLoadingIconPdf = true
    }
    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }

    this.http.post(this.informationGenerale.baseUrl + this.apiListR + idFournisseur, this.request, this.tokenStorageService.getHeader()).subscribe(
      async (res) => {
        //console.log(res);


        var data = []
        var resultat: any = res
        console.log(resultat);

        resultat.tabReleveFournisseurs.forEach(async element => {
          //console.log(element);
          data.push({
            fournisseur: element.fournisseur,
            numero: element.numero,
            details: this.detailsReglement(element.numBonLivraison, element.type, element.modeReglement, element.numCheque, getFullYear(element.dateEcheance)),
            dateOperation: getFullYear(element.dateOperation),
            dateEcheance: getFullYear(element.dateEcheance),
            numCheque: element.numCheque,
            modeReglement: element.modeReglement,
            debit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(element.debit)),
            credit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(element.credit)),
            solde: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(element.solde)),
            soldeCredit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(element.soldeCredit)),
            soldeDebit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(element.soldeDebit)),
            type: element.type
          })
        });
        var soldeBefore = resultat.soldeBefore
        var soldeCurrente = resultat.soldeCurrente
        console.log(soldeBefore);
        console.log(soldeCurrente);



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
              widths: [60, 60, 90, 200, 80, 80, 80, 80],
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
          pageSize: 'A4',
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
                        margin: [15, 5, 0, 0],
                      },
                      {
                        text: "Relevé Fournisseur " + data[0].fournisseur + "\nDe " + resultat.request.dateStart + " à " + resultat.request.dateEnd,
                        rowSpan: 3,
                        alignment: 'center',
                        italics: true,
                        fontSize: 14,
                        margin: [0, 30, 0, 0],
                      },
                      { text: date, rowSpan: 3, alignment: 'right', margin: [0, 10, 20, 0] }
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
                { text: (soldeBefore >= 0) ? `Solde Initial Debiteur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeBefore)}` : `Solde Initial Créditeur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeBefore * -1)}`, margin: [0, 10, 20, 5], italics: true, alignment: "right", }
              ]
            },
            {
              columns: [
                table(
                  data,
                  [
                    'dateOperation',
                    'type',
                    'numero',



                    'details',
                    // 'dateEcheance',
                    // 'modeReglement',
                    // 'numCheque',
                    'debit',
                    'credit',
                    'soldeDebit',
                    'soldeCredit'
                  ],
                  true,
                  // Custom headers
                  [
                    //{ text: 'client', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                    { text: 'Date Operation', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                    { text: 'Type', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                    { text: 'Numero', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                    // { text: 'Mode Reglement', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                    // { text: 'Num Cheque', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                    // { text: 'Date Echeance', fontSize: 7, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

                    { text: 'Details Type', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                    { text: 'Debit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                    { text: 'Credit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                    { text: 'S.Debit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                    { text: 'S.Credit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

                  ],
                  [
                    { text: "Nombre des Lignes: " + data.length, blod: true, alignment: 'left', colSpan: 4, fontSize: 9 },

                    {},
                    {},
                    {},
                    // {},
                    // {},

                    { text: (sommeDebit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeDebit(data)), bold: true, alignment: (sommeDebit(data) === '-') ? "center" : "right", fontSize: 9, blod: true },
                    { text: (sommeCredit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeCredit(data)), bold: true, alignment: (sommeCredit(data) === '-') ? "center" : "right", fontSize: 9, blod: true },
                    { text: (sommeSoldeDebit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSoldeDebit(data)), bold: true, alignment: (sommeSoldeDebit(data) === '-') ? "center" : "right", fontSize: 9, blod: true },
                    { text: (sommeSoldeCredit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSoldeCredit(data)), bold: true, alignment: (sommeSoldeCredit(data) === '-') ? "center" : "right", fontSize: 9, blod: true },
                  ],


                ),
              ]
            },
            {
              columns: [
                { text: (soldeBefore >= 0) ? `Solde Initial Debiteur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeBefore)}` : `Solde Initial Créditeur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeBefore * -1)}`, margin: [20, 10, 0, 5], italics: true, alignment: "left", },
                { text: (soldeCurrente >= 0) ? `Solde Finale Debiteur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeCurrente)}` : `Solde Finale Créditeur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeCurrente * -1)}`, margin: [10, 10, 0, 5], italics: true, alignment: "left", },
                { text: ((soldeBefore + soldeCurrente) >= 0) ? `Solde de la Periode Debiteur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeBefore + soldeCurrente)}` : `Solde de la Periode Créditeur :${this.fonctionPartagesService.getFormaThreeAfterVerguleNomber((soldeBefore + soldeCurrente) * -1)}`, margin: [0, 10, 20, 5], italics: true, alignment: "right", }
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
            table: {
              fontSize: 9,
              alignment: 'center',
              margin: [15, 0, 0, 0]

            },
            pageCount: {
              italics: true,
              alignment: 'right',

            },

          },
        };
        pdfMake.createPdf(documentDefinition).open();
        this.isLoadingIconPdf = false
      },
      (err) => {
        console.log(err);

      }
    )

  }

  detailsReglement(numBonLivraison, type, modeReglement: any, numCheque: any, arg2: string) {
    //console.log(type);
    // console.log(numCheque);
    // console.log(arg2);

    if (type === 'Reglement.BA') {
      return modeReglement + ' N°: ' + numCheque + ' /ECH: ' + arg2
    } else if (type === 'Bon Retour') {
      return 'SUR BR NUM: ' + numCheque
    } else {
      return '-'
    }
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
  loadingiconExportExel = false
  generateExel(idFournisseur) {

    console.log(idFournisseur);
    if (idFournisseur == undefined || idFournisseur == null || idFournisseur == "") {
      this.loadingiconExportExel = false
    } else {
      this.loadingiconExportExel = true
      let element = document.getElementById('output');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);


      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


      /* save to file */
      XLSX.writeFile(wb, 'releveClient.xlsx');
      this.loadingiconExportExel = false
    }


 }

}
function getFullYear(date: any): string {
  if (date == undefined || date == null || date == '') {
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



  if (som === 0 || som === NaN) {
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
  console.log(som);

  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeSoldeDebit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].soldeDebit === '-' || data[index].soldeDebit === null || data[index].soldeDebit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].soldeDebit)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeSoldeCredit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].soldeCredit === '-' || data[index].soldeCredit === null || data[index].soldeCredit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].soldeCredit)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
