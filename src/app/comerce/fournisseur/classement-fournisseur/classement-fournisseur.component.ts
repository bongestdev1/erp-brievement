import { Societe } from 'src/app/demo/dashboard/interface/Societe.interface';
import { Component, OnInit } from '@angular/core';
import { InformationsService } from 'src/app/services/informations.service';
import { FournisseurService } from "../../../services/achatsServices/fournisseur.service";
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { EtatTransport } from 'src/app/services/serviceBD_Commerce/etatTransport.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-classement-fournisseur',
  templateUrl: './classement-fournisseur.component.html',
  styleUrls: ['./classement-fournisseur.component.scss']
})
export class ClassementFournisseurComponent implements OnInit {
  formC: FormGroup
  apiListC = '/fournisseurs/listFournisseurs'
  apiList = "/fournisseurs/ClassementFour"



  constructor(
    private fb: FormBuilder,
    public informationsService: InformationsService,
    public informationGenerale: InformationsService,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient,
    public fonctionPartagesService: FonctionPartagesService,
    public etatTransport: EtatTransport,
  ) {
    this.formC = this.fb.group({
      code: [""],
      raisonSociale: [""],
      typeTiers: [""],
      //chiffreAffaire: [""],
      sdebit: [""],
      scredit: [""],
      enCours: [""],
      impaye: [""],
      soldeEnCours: [""],
      soldeImpaye: [""],
      soldeGlobal: [""],
      telephone: [""],
      limit: 50
    })
    this.getAllParametres()
  }





  keySelectedTypeTiers = "libelle"
  objetTypeTiers = {
    num: "Num",
    libelle: "Libelle",
    societeRacine: "Societe Racine"
  }
  idTypetiers = ""

  isOpenModalAjoutTypeTiers = false
  idAjoutTypeTiersModal = ""
  typeElementTypeTiers = ""
  setTypetiersID(id) {
    this.request.typeTiers = id
  }
  closeModalAjoutTypeTiers() {
    this.isOpenModalAjoutTypeTiers = false
    this.getAllParametres()
  }
  openModalTypeTiers() {
    this.typeElementTypeTiers = this.fonctionPartagesService.titreOfModal.ajouterTypeTier
    this.isOpenModalAjoutTypeTiers = true
  }

  apiListTypeTiers = "/typeTiers/listTypeTiers"
  allTypeTiers = []




  objectKeys = Object.keys;

  tabNumbers = ['sdebit', 'scredit', 'impaye', 'enCours', 'soldeEnCours', 'soldeImpaye', 'soldeGlobal']

  items = {
    // numero:"",
    code: "Code Fournisseur",
    raisonSociale: "Raison Sociale",
    typeTiers: "Type Tiers",
    sdebit: "Solde Debit",
    scredit: "Solde Credit",
    enCours: "En Cours",
    impaye: "Impaye",
    soldeEnCours: "Solde En Cours",
    soldeImpaye: "Solde Impaye",
    soldeGlobal: "Solde Global",
    telephone: "Telephone",
    //delai:"Delai"

  };

  itemsVariable = {
    //numero:"",
    code: "Code Fournisseur",
    raisonSociale: "Raison Sociale",
    typeTiers: "Type Tiers",
    sdebit: "Solde Debit",
    scredit: "Solde Credit",
    enCours: "En Cours",
    impaye: "Impaye",
    soldeEnCours: "Solde En Cours",
    soldeImpaye: "Solde Impaye",
    soldeGlobal: "Solde Global",
    telephone: "Telephone",
    //delai:"Delai"
  };
  request = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      num: "",
      code: "",
      raisonSociale: "",
      typeTiers: "",
      sdebit: "",
      scredit: "",
      enCours: "",
      impaye: "",
      soldeEnCours: "",
      soldeImpaye: "",
      soldeGlobal: "",
      telephone: "",
      delai: ""
    },
    orderBy: {
      codeFournisseur: 0,
      raisonSociale: 0,
      typeTiers: 0,
      sdebit: 0,
      scredit: 0,
      enCours: 0,
      impaye: 0,
      soldeEnCours: 0,
      soldeImpaye: 0,
      soldeGlobal: 0,
      telephone: 0,
    },
    typeTiers:"",
    societe: this.informationGenerale.idSocieteCurrent,
    fournisseur: "",
    limit: 50,
    page: 1
  }

  oldRequest = {
    dateStart: this.informationGenerale.idDateAujourdCurrent,
    dateEnd: this.informationGenerale.idDateFinCurrent,
    search: {
      num: "",
      code: "",
      raisonSociale: "",
      typeTiers: "",
      sdebit: "",
      scredit: "",
      enCours: "",
      impaye: "",
      soldeEnCours: "",
      soldeImpaye: "",
      soldeGlobal: "",
      telephone: "",
      delai: ""
    },
    orderBy: {
      code: 0,
      raisonSociale: 0,
      typeTiers: 0,
      sdebit: 0,
      scredit: 0,
      enCours: 0,
      impaye: 0,
      soldeEnCours: 0,
      soldeImpaye: 0,
      soldeGlobal: 0,
      telephone: 0,
    },
    typeTiers:"",
    societe: this.informationGenerale.idSocieteCurrent,
    fournisseur: "",
    limit: 50,
    page: 1
  }
  ngOnInit(): void {
  }
  isLoading = false
  fournisseurs = []


  listGlEmpty = [{}, {}, {}, {}, {}, {}]
  getFournisseurs(request) {

    this.getReleveDate(this.request)

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

    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        console.log(res);

        this.isLoading = false
        let resultat: any = res

        console.log(resultat)
        if (resultat.status) {
          this.fournisseurs = resultat.resultat.docs
          this.listGlEmpty = []
          if (this.fournisseurs.length < 6) {
            for (let i = this.fournisseurs.length; i < 6; i++) {
              this.listGlEmpty.push({})
            }
          }
          this.fournisseurs = this.fonctionPartagesService.orderByDocuments(this.request.orderBy, this.fournisseurs)

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
    this.request.fournisseur = id
  }
  isOpenModalAjoutFournisseur = false
  idAjoutFournisseurModal = ""
  typeElement = ""

  closeModalAjoutFournisseur() {
    this.isOpenModalAjoutFournisseur = false
    this.getAllParametres()
  }
  openModalAjoutFournisseur() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterFournisseur
    this.isOpenModalAjoutFournisseur = true
  }

  allFournisseurs = []
  getAllParametres() {
    this.isLoading = true

    let request = { page: 1, limit: 50, search: {}, orderBy: {}, societe: this.informationGenerale.idSocieteCurrent }
    this.http.post(this.informationGenerale.baseUrl + this.apiListC, request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(this.request);

        this.isLoading = false
        let resultat: any = res
        console.log("resultat", resultat);

        if (resultat.status) {
          this.allFournisseurs = resultat.resultat.docs
          console.log(this.request);
          this.getFournisseurs(this.request)
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }


    );
    this.http.post(this.informationGenerale.baseUrl + this.apiListTypeTiers, request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        console.log(resultat);

        if (resultat.status) {
          this.allTypeTiers = resultat.resultat.docs
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

    return true;
  }

  totalPage = 1

  setLimitPage(newLimitPage: number) {
    this.request.limit = newLimitPage
    this.request.page = 1
    this.getFournisseurs(this.request)
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getFournisseurs(this.request)
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

    this.getFournisseurs(this.request)
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




  async generatePDF() {

    function check(arg0: string): string {
      if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
        return '-'
      } else {
        return arg0
      }
    }

    var data = []
    this.fournisseurs.forEach((e) => {
      data.push({
        fournisseur: check(e.code),
        nom: check(e.raisonSociale),
        type: check(e.typeTiers),
        telephone: check(e.telephone),
        sdebit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sdebit)),
        enCours: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.enCours)),
        impaye: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.impaye)),
        scredit: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.scredit)),
        soldeEnCours: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeEnCours)),
        soldeImpaye: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeImpaye)),
        soldeGlobal: check(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeGlobal)),

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
          dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: headers[i].fontSize });
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
          widths: [55, 90, 50, 60, 60, 60, 60, 60, 60, 60, 50],
          headerRows: 1,
          body: buildTableBody(data, columns, showHeaders, headers, footerTable)
        },
        layout: 'myCustomLayout'
      };
    }
    var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
    var idSociete = this.informationGenerale.idSocieteCurrent
    console.log(idSociete);





    var dateStart = this.request.dateStart
    var dateEnd = this.request.dateEnd
    var image = await this.getBase64ImageFromURL(url)
    const documentDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      pageMargins: [3, 80, 1, 70],



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
                    text: `Classement Fournisseurs de ${dateStart} à ${dateEnd}`,
                    rowSpan: 3,
                    alignment: 'center',
                    italics: true,
                    fontSize: 14,
                    margin: [0, 30, 0, 0],
                  },
                  { text: date, rowSpan: 3, alignment: 'right',margin: [0, 10, 20, 0], }
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
                'fournisseur',
                'nom',
                'type',
                'sdebit',
                'scredit',
                'enCours',
                'impaye',
                'soldeEnCours',
                'soldeImpaye',
                'soldeGlobal',
                'telephone'
              ],
              true,
              // Custom headers
              [
                { text: 'Fournisseur', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Nom', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'Type', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
                { text: 'S.debit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'S.credit', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'EnCours', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Impaye', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Solde En Cours', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Solde Impaye', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Solde Global', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
                { text: 'Telephone', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

              ],
              [
                { text: "Nombre des Lignes : " + data.length, alignment: 'left', colSpan: 3, fontSize: 11 },
                {},
                {},
                { text: (sommeSdebit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSdebit(data)), alignment: (sommeSdebit(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeSCredit(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSCredit(data)), alignment: (sommeSCredit(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeEnCours(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeEnCours(data)), alignment: (sommeEnCours(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeImpaye(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeImpaye(data)), alignment: (sommeImpaye(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeSoldeEnCours(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSoldeEnCours(data)), alignment: (sommeSoldeEnCours(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeSoldeImpaye(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSoldeImpaye(data)), alignment: (sommeSoldeImpaye(data) === '-') ? "center" : "right", fontSize: 8, },
                { text: (sommeSoldeGlobal(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommeSoldeGlobal(data)), alignment: (sommeSoldeGlobal(data) === '-') ? "center" : "right", fontSize: 8, },
                {}
              ],
            ),
          ]
        }
      ],

      footer: function (currentPage, pageCount) {
        let textFooter = `
        ${'societe'}. Thank You!
        This is line `
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
                  { text: "", fontSize: 10, rowSpan: 3, alignment: 'center' },
                  { text: textFooter, fontSize: 10, rowSpan: 3, alignment: 'center' },
                  { text: page, fontSize: 10, rowSpan: 3, alignment: 'right',margin:[0,0,20,0] }
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
  exportExel() {
    var data = []
    this.fournisseurs.forEach((e) => {
      data.push({
        fournisseur: (e.code),
        nom: (e.raisonSociale),
        type: (e.typeTiers),
        telephone: (e.telephone),
        sdebit: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sdebit)),
        enCours: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.enCours)),
        impaye: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.impaye)),
        scredit: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.scredit)),
        soldeEnCours: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeEnCours)),
        soldeImpaye: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeImpaye)),
        soldeGlobal: (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.soldeGlobal)),

      })
    })

    let sdebit = sommeSdebit(data)
    let enCours = sommeEnCours(data)
    let impaye = sommeImpaye(data)
    let scredit = sommeSCredit(data)
    let soldeEnCours = sommeSoldeEnCours(data)
    let soldeImpaye = sommeSoldeImpaye(data)
    let soldeGlobal = sommeSoldeGlobal(data)

    data.splice(data.length, 0, {
      fournisseur: "Total",
      nom: "",
      type: "",
      telephone: "",
      sdebit: ((sdebit==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sdebit)),
      enCours: ((enCours==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(enCours)),
      impaye: ((impaye==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(impaye)),
      scredit: ((scredit==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(scredit)),
      soldeEnCours: ((soldeEnCours==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeEnCours)),
      soldeImpaye: ((soldeImpaye==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeImpaye)),
      soldeGlobal: ((soldeGlobal==='-')?0:this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(soldeGlobal)),

    })
    console.log(data);

    var filename = 'classementFournisseur.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  }


}
function sommeSoldeEnCours(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].soldeEnCours === '-' || data[index].soldeEnCours === null || data[index].soldeEnCours === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].soldeEnCours)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeSoldeImpaye(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].soldeImpaye === '-' || data[index].soldeImpaye === null || data[index].soldeImpaye === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].soldeImpaye)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeSoldeGlobal(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].soldeGlobal === '-' || data[index].soldeGlobal === null || data[index].soldeGlobal === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].soldeGlobal)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeEnCours(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].enCours === '-' || data[index].enCours === null || data[index].enCours === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].enCours)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeImpaye(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].impaye === '-' || data[index].impaye === null || data[index].impaye === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].impaye)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

function sommeSCredit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].scredit === '-' || data[index].scredit === null || data[index].scredit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].scredit)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}
function sommeSdebit(data: any[]) {
  var som = 0
  for (let index = 0; index < data.length; index++) {
    if (data[index].sdebit === '-' || data[index].sdebit === null || data[index].sdebit === undefined) {
      som += 0
    } else {
      som += parseFloat(data[index].sdebit)
    }
  }
  if (som === 0) {
    return '-'
  } else {
    return som
  }
}

