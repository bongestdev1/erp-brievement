import { SessionCaisse } from 'src/app/model/modelCommerce/sessionCaisse';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { formatDate } from '@angular/common';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-reglement-input2',
  templateUrl: './reglement-input2.component.html',
  styleUrls: ['./reglement-input2.component.scss']
})
export class ReglementInput2Component implements OnInit {

  @Output() joinAndClose = new EventEmitter<string>();
  @Output() getAllParametres = new EventEmitter<string>();
  @Output() setImprission = new EventEmitter<Object>();

  @Input() allModeReglement: any
  @Input() allSituationReglement: any
  @Input() reglements: any
  @Input() isLoading: any
  @Input() bonLivraison: any
  @Input() client:any

  reglement = {
    id: "",
    client: "",
    modeReglement: "",
    tresorerie: "",
    montant: 0,
    dateReglement: "",
    dateEncaissement: "",
    numCheque: "",
    dateEcheance: "",
    notes: "",
    societe: "",
    numero: "Nouveau",
    reste: 0,
    situationReglement: "",
    activerLiltrage: "oui",
    sessionCaisse: "",
    montantAPayer: 0
  }

  erreurReglement = {
    situationReglement: "",
    modeReglement: "",
    montant: ""
  }

  objectKeys = Object.keys;

  constructor(
    private notificationToast: ToastNotificationService,
    public fonctionPartagesService: FonctionPartagesService,
    public informationGenerale: InformationsService) {
  }

  ngOnInit(): void {
    this.reglement.montant = this.bonLivraison.restPayer
    this.reglement.montantAPayer = this.bonLivraison.restPayer
    this.reglement.reste = 0
    this.reglement.modeReglement = this.informationGenerale.modeReglCurrent
    this.reglement.dateReglement = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.reglement.dateEcheance = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    try {
      let sessionCaise = this.informationGenerale.getSessionCaisse()
      this.reglement.sessionCaisse = sessionCaise[0].id
    } catch (e) {
      this.reglement.sessionCaisse = null
      console.log(e)
      return
    }
  }

  getDate(date) {
    return formatDate(new Date(date), 'dd/MM/yyyy', 'en')
  }


  setlitterage() {
    if (this.reglement.montantAPayer > this.reglement.montant) {
      this.reglement.montantAPayer = this.reglement.montant
    }

    if (this.reglement.montantAPayer < 0) {
      this.reglement.montantAPayer = 0
    }

    this.reglement.reste = this.reglement.montant - this.reglement.montantAPayer

  }

  ImprimerReglement() {
    if (!this.controleInputs()) {
      return
    }
    this.reglement.numero = this.bonLivraison.numero
    this.reglement.id = this.fonctionPartagesService.getIdOfArrayElement(this.reglements, 'id')
    this.reglements.push(this.reglement)
    this.setImprission.emit(this.reglements.length - 1)
    this.joinAndClose.emit()
  }

  addReglement() {
    if (!this.controleInputs()) {
      return
    }
    this.reglement.numero = this.bonLivraison.numero
    this.reglement.id = this.fonctionPartagesService.getIdOfArrayElement(this.reglements, 'id')
    this.reglements.push(this.reglement)
    console.log("addReglement")
    this.joinAndClose.emit()
  }

  itemsVariableG = {
    numero: "Numéro",
    date: "Date",
    montantTotal: "Montant total",
    montantPaye: "Montant paye",
    montantAPayer: "Montant à payer",
    restPayer: "Reste à payer",
    isPayee: "Payee"
  }

  itemsVariableGOrderby = {
    numero: 0,
    date: 0,
    montantTotal: 0,
    montantPaye: 0,
    restPayer: 0,
    montantAPayer: 0,
    isPayee: 0
  }

  controleInputs() {
    for (let key in this.erreurReglement) {
      this.erreurReglement[key] = ""
    }

    var isValid = true

    if (this.reglement.modeReglement == "") {
      this.erreurReglement.modeReglement = "Veuillez remplir ce champ"
      isValid = false
    }

    if (this.reglement.situationReglement == "") {
      this.erreurReglement.situationReglement = "Veuillez remplir ce champ"
      isValid = false
    }

    if (this.reglement.montant <= 0) {
      this.erreurReglement.montant = "Votre Montant est invalid"
      isValid = false
    }

    return isValid
  }


  //autocomplete SituationReglement
  keySelectedSituationReglement = "libelle"
  objetSituationReglement = {
    libelle: "Libelle",
    encaisse: "EnCaisse"
  }
  setSituationReglementID(id) {
    this.reglement.situationReglement = id
  }

  openModalAjoutSituationReglement() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterSituationReglement
    this.isOpenModalAjout = true
  }
  //open modal ajout Client


  //autocomplete ModeReglement
  keySelectedModeReglement = "libelle"
  objetModeReglement = { libelle: "" }
  setModeReglementID(id) {
    this.reglement.modeReglement = id
  }

  //open modal ajout Client
  isOpenModalAjout = false
  idAjoutModal = ""
  typeElement
  closeModalAjout() {
    this.isOpenModalAjout = false
    this.getAllParametres.emit()
  }

  openModalAjoutModeReglement() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterModeReglement
    this.isOpenModalAjout = true
  }

  //fixed chiffre after vergule
  showInput(event) {
    this.fonctionPartagesService.showInput(event)
    setTimeout(() => {
      this.fixedVerguleNumbers()
    }, 100)
  }

  fixedVerguleNumbers() {
    this.reglement.montant = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.reglement.montant))
    this.reglement.montantAPayer = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.reglement.montantAPayer))
  }
  // async generatePDF() {

  //   if (!this.controleInputs()) {
  //     return
  //   }

  //   console.log(this.reglements)
  //   console.log(this.client);

  //   this.joinAndClose.emit()

  //   function check(arg0: string): string {
  //     if (arg0 === null || arg0 === undefined || parseInt(arg0) === 0) {
  //       return '-'
  //     } else {
  //       return arg0
  //     }
  //   }

  //   var data = []

  //   // this.fournisseurs.forEach((e) => {
  //   //   data.push({
  //   //     typeTiers: check(e.typeTiers),
  //   //     codeFournisseur: check(e.codeFournisseur),
  //   //     raisonSociale: check(e.raisonSociale),
  //   //     telephone: check(e.telephone),
  //   //     sInitD:check((e.sInitD===null||e.sInitD===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sInitD))),
  //   //     sInitC: check((e.sInitC===null||e.sInitC===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sInitC))),
  //   //     sPeriodeD:check( (e.sPeriodeD===null||e.sPeriodeD===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sPeriodeD))),
  //   //     sPeriodeC:check((e.sPeriodeC===null||e.sPeriodeC===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sPeriodeC))),
  //   //     sFinaleD:check((e.sFinaleD===null||e.sFinaleD===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sFinaleD))),
  //   //     sFinaleC:check((e.sFinaleC===null||e.sFinaleC===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0): (this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.sFinaleC))),
  //   //     enCours:check((e.enCours===null||e.enCours===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.enCours))),
  //   //     impaye:check((e.impaye===null||e.impaye===undefined)?this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(0):(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(e.impaye))),

  //   //   })
  //   // })


  //   function buildTableBody(data, columns, showHeaders, headers, footerTable) {
  //     //console.log(footerTable);

  //     var body = [];
  //     for (let index = 0; index < headers.length; index++) {
  //       headers[index].text = headers[index].text.toUpperCase()
  //     }
  //     // Inserting headers

  //     //console.log(headers);
  //     if (showHeaders) {
  //       body.push(headers);
  //     }
  //     // Inserting items from external data array

  //     data.forEach(function (row) {

  //       var dataRow = [];
  //       var i = 0;

  //       columns.forEach(function (column) {
  //         dataRow.push({ text: row[column], alignment: (row[column] === '-') ? 'center' : headers[i].alignmentChild, fontSize: headers[i].fontSize });
  //         i++;
  //       })

  //       body.push(dataRow);

  //     });
  //     body.push(footerTable)
  //     //console.log(body);

  //     return body;
  //   }
  //   pdfMake.tableLayouts = {
  //     myCustomLayout: {
  //       hLineWidth: function (i, node) { return 1; },
  //       vLineWidth: function (i, node) { return 1; },
  //       fillColor: function (rowIndex, node, columnIndex) {
  //         // console.log(node);
  //         // console.log(columnIndex);
  //         return (rowIndex % 2 === 0) ? '#f8f9fa' : null;
  //       },
  //       //paddingLeft: function (i, node) { return 0; }
  //     }
  //   };

  //   function table(data, columns, showHeaders, headers, footerTable) {
  //     //console.log(data);
  //     //console.log(columns);
  //     return {
  //       style: 'table',
  //       table: {
  //         heights: ['auto'],
  //         widths: [55, 55, 90, 50, 50, 50, 50, 50, 50, 50, 50,50],
  //         headerRows: 1,
  //         body: buildTableBody(data, columns, showHeaders, headers, footerTable)
  //       },
  //       layout: 'myCustomLayout'
  //     };
  //   }
  //   var url = this.informationGenerale.baseUrl + "/" + this.fonctionPartagesService.parametres.logo
  //   var idSociete = this.informationGenerale.idSocieteCurrent
  //   console.log(idSociete);





  //   var dateEnd = new Date(this.request.dateEnd).toLocaleDateString('fr')
  //   var image = await this.getBase64ImageFromURL(url)
  //   const documentDefinition = {
  //     pageOrientation: 'landscape',
  //     pageSize: 'A4',
  //     pageMargins: [3, 80, 1, 80],



  //     header: function (currentPage, pageCount, pageSize) {

  //       let date = `${new Date().toLocaleDateString('en-GB')}`
  //       return [
  //         {

  //           layout: 'noBorders',
  //           table: {
  //             headerRows: 1,
  //             widths: ['*', '*', '*'],
  //             body: [
  //               [
  //                 {
  //                   image: image,
  //                   rowSpan: 3,
  //                   alignment: 'left',
  //                   height: 60,
  //                   width: 100,
  //                   margin: [5, 5, 0, 0],
  //                 },
  //                 {
  //                   text: `List Releve Fournisseur Avec Solde Arrete Le ${dateEnd}`,
  //                   rowSpan: 3,
  //                   alignment: 'center',
  //                   italics: true,
  //                   fontSize: 12,
  //                   margin: [0, 30, 0, 0],
  //                 },
  //                 { text: date, rowSpan: 3, alignment: 'right',margin: [0, 10, 20, 0], }
  //               ],
  //               [],
  //               []
  //             ]
  //           }
  //         },
  //       ]
  //     },
  //     content: [
  //       {
  //         columns: [
  //           table(
  //             data,
  //             [
  //               'typeTiers',
  //               'codeFournisseur',
  //               'raisonSociale',
  //               'telephone',
  //               'sInitD',
  //               'sInitC',
  //               'sPeriodeD',
  //               'sPeriodeC',
  //               'sFinaleD',
  //               'sFinaleC',
  //               'enCours',
  //               "impaye"
  //             ],
  //             true,
  //             // Custom headers
  //             [
  //               { text: 'Type Fournisseur', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
  //               { text: 'Code Fournisseur', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
  //               { text: 'Fournisseur', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },
  //               { text: 'Telephone', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'left' },

  //               { text: 'S.I.D', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'S.I.C', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'S.Periode. D', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'S.Periode. C', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'S.Finale D', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'S.Finale C', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'EnCours', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },
  //               { text: 'Impaye', fontSize: 8, fillColor: '#D3D3D3', alignment: 'left', alignmentChild: 'right' },

  //             ],
  //             [
  //               { text: "Nombre des Lignes : " + data.length, alignment: 'left', colSpan: 4, fontSize: 11 },
  //               {},
  //               {},
  //               {},
  //               { text: (sommesInitD(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommesInitD(data)), alignment: (sommesInitD(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommessInitC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommessInitC(data)), alignment: (sommessInitC(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommessPeriodeD(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommessPeriodeD(data)), alignment: (sommessPeriodeD(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommessPeriodeC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommessPeriodeC(data)), alignment: (sommessPeriodeC(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommessFinaleD(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommessFinaleD(data)), alignment: (sommessFinaleD(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommessFinaleC(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommessFinaleC(data)), alignment: (sommessFinaleC(data) === '-') ? "center" : "right", fontSize: 8, },
  //               { text: (sommesenCours(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommesenCours(data)), alignment: (sommesenCours(data) === '-') ? "center" : "right", fontSize: 8, },
  //               {text: (sommesimpaye(data) === '-') ? '-' : this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(sommesimpaye(data)), alignment: (sommesimpaye(data) === '-') ? "center" : "right", fontSize: 8, }
  //             ],
  //           ),
  //         ]
  //       }
  //     ],

  //     footer: function (currentPage, pageCount) {
  //       let textFooter = `
  //       \n${'societe'}. Thank You!
  //       This is line 2
  //       Line 3 comes here`
  //       let page = `\n${currentPage.toString()} of ${pageCount}`
  //       return [
  //         { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 833 - 10, y2: 10, lineWidth: 0.5 }] },

  //         {

  //           layout: 'noBorders',
  //           table: {
  //             headerRows: 1,
  //             widths: ['*', '*', '*'],
  //             body: [
  //               [
  //                 { text: "", fontSize: 10, rowSpan: 3, alignment: 'center' },
  //                 { text: textFooter, fontSize: 10, rowSpan: 3, alignment: 'center' },
  //                 { text: page, fontSize: 10, rowSpan: 3, alignment: 'right',margin:[0,0,20,0] }
  //               ],
  //               [],
  //               []
  //             ]
  //           }
  //         },
  //       ];
  //     },

  //     styles: {
  //       table: {
  //         fontSize: 9,
  //         alignment: 'center',
  //         margin: [30, 0, 0, 0]
  //       },
  //       pageCount: {
  //         italics: true,
  //         alignment: 'right',

  //       },

  //     },


  //   };
  //   pdfMake.createPdf(documentDefinition).open();


  // }
}

