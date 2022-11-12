import { SessionCaisseService } from 'src/app/services/serviceBD_Commerce/sessionCaisse.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InformationsService } from 'src/app/services/informations.service';
import { formatDate } from '@angular/common';
import { UtiliteService } from 'src/app/services/utilite.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';

@Component({
  selector: 'app-reglements-caisse',
  templateUrl: './reglements-caisse.component.html',
  styleUrls: ['./reglements-caisse.component.scss']
})
export class ReglementsCaisseComponent implements OnInit {

  @Input() dates

  @Input() id

  @Input() sessionCaisse

  @Input() utilisateur

  @Input() changeVar

  @Output() listGlobalReg = new EventEmitter<string>();

  formC: FormGroup

  allCreDebs = ['credit', 'debit']

  constructor(
    private utilite: UtiliteService,
    private sessionCaisseSer: SessionCaisseService,
    private fb: FormBuilder,
    public informationGenerale: InformationsService,
    public fonctionPartages: FonctionPartagesService) {

    this.formC = this.fb.group({

      dateReglement: [''],
      mvt: [''],
      client: [''],
      codeClient: [''],
      typeReglement: [''],
      modeReglement: [''],
      montant: [''],
      numero: [''],
      numCheque: [''],
      dateEcheance: [''],
      debit: [''],
      credit: [''],

      limit : 5

    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.changeVar == true) {
      if (this.sessionCaisse.dateCloture != '') {
        this.request.dateStart = this.sessionCaisse.dateOuverture
        this.request.dateEnd = this.sessionCaisse.dateCloture

      } else if (this.dates.dateEnd != '') {
        this.request.dateStart = this.dates.dateStart
        this.request.dateEnd = this.dates.dateEnd

      }
    }

    this.getReglements(this.request)

  }

  objectKeys = Object.keys;

  items = {
    dateReglement: "Date MVT",
    //mvt: "MVT",
    client: "Raison Sociale",
    codeClient: "Code Client",
    typeReglement: "Type",
    modeReglement: "Mode Reglement",
    montant: "Montant",
    numero: "Numero",
    numCheque: "Num Pièce",
    dateEcheance: "Date Echeance",
    debit: "Debit",
    credit: "Credit",
  };

  itemsVariable = {
    dateReglement: "Date MVT",
    //mvt: "MVT",
    client: "Raison Sociale",
    codeClient: "Code Client",
    typeReglement: "Type",
    modeReglement: "Mode Reglement",
    montant: "Montant",
    numero: "Numero",
    numCheque: "Num Pièce",
    dateEcheance: "Date Echeance",
    debit: "Debit",
    credit: "Credit",
  };

  request = {
    dateStart: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    dateEnd: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    magasin: "",
    search: {
      numero: "",
      client: "",
      modeReglement: "",
      typeReglement: "",
      montant: "",
      dateReglement: "",
      numCheque: "",
      dateEcheance: "",
    },
    orderBy: {
      numero: 0,
      client: 0,
      modeReglement: 0,
      typeReglement: 0,
      montant: 0,
      dateReglement: 0,
      numCheque: 0,
      dateEcheance: 0,
    },
    sessionCaisse: "",
    limit: 5,
    page: 1
  }

  oldRequest = {
    dateStart: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    dateEnd: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
    search: {
      numero: "",
      client: "",
      modeReglement: "",
      typeReglement: "",
      montant: "",
      dateReglement: "",
      numCheque: "",
      dateEcheance: "",
    },
    orderBy: {
      numero: 0,
      client: 0,
      modeReglement: 0,
      typeReglement: 0,
      montant: 0,
      dateReglement: 0,
      numCheque: 0,
      dateEcheance: 0,
    },
    magasin: "",
    sessionCaisse: "",
    limit: 5,
    page: 1
  }

  session
  ngOnInit(): void {
  }

  //Afficher
  reglements = []
  isLoading = false
  getReglements2(request) {
    this.reglements = []
    this.oldRequest.page = -1
    //this.getReglements2(request)
  }
            
  getReglements(request) {
    this.reglements = []
    this.request.dateStart = request.dateStart
    this.request.dateEnd = request.dateEnd
    
    this.changeVar = false
    this.session = this.informationGenerale.getSessionCaisse()

    if (this.isLoading) {
      return
    }

    for (let key in this.request.search) {
      this.request.search[key] = this.formC.value[key]
    }
    this.request.magasin = this.informationGenerale.idSocieteCurrent

    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.request.page = 1
    }

    // if (!this.testSyncronisation(this.request, this.oldRequest)) {
    //   this.request.page = 1
    // }else{
    //   if(this.oldRequest.page === this.totalPage && this.totalPage !== 1){
    //      return 
    //   }  
    // }

    this.request.magasin = this.informationGenerale.idSocieteCurrent

    this.request.sessionCaisse = null
   
    try {
      this.request.sessionCaisse = this.id
    } catch (e) {
      console.log(e)
      this.request.sessionCaisse = null
    }

    if (!this.id) {
      return
    }

    this.isLoading = true
    this.sessionCaisseSer.reglements(this.request)
      .subscribe(
        res => {
          this.isLoading = false
          let resultat: any = res

          if (resultat.status) {
            // this.reglements = resultat.resultat.docs
            console.log(resultat.resultat.docs)
            this.reglements = resultat.resultat.docs

            // if(resultat.request.page === 1){
            //   this.reglements = []
            //   this.reglements = resultat.resultat.docs
            // }else{
            //    for(let item of resultat.resultat.docs){
            //     this.reglements.push(item)
            //    }
            // }

            this.totalPage = resultat.resultat.pages
            this.oldRequest = resultat.request
            this.calculeCreditDebit(this.reglements)

            if (!this.testSyncronisation(this.request, resultat.request) || (this.request.page != resultat.request.page)) {
              this.getReglements(this.request)
            }

            // if(this.oldRequest.page < this.totalPage){
            //   this.incrementPage()
            // }else{
            //   this.request.page = 1
            //   this.calculeCreditDebit(this.reglements)
            // }
          }
        },
        error => {
          this.isLoading = false
          alert("Désole, ilya un problème de connexion internet")
        });

  }

  incrementPage() {
    if(this.totalPage > this.request.page){
      this.request.page += 1
      this.getReglements2(this.request)
    }
  }

  listReg = []
  calculeCreditDebit(reglements) {

    this.listReg = []
    for (let item of reglements) {
      let variable = {
        id: item.id,
        numero: item.numero,
        client: (item.client === undefined) ? item.fournisseur : item.client,
        codeClient: (item.codeClient === undefined) ? item.codeFournisseur : item.codeClient,
        typeReglement: item.typeReglement,
        modeReglement: item.modeReglement,
        montant: item.montant,
        dateReglement: item.dateReglement,
        credit: 0,
        debit: 0,
        numCheque: item.numCheque,
        dateEcheance: item.dateEcheance,
      }

      if (item.typeReglement == "bonAchat" || item.typeReglement == "bonRetourClient") {
        variable.credit = item.montant
        this.listReg.push(variable)

      } else if (item.typeReglement == "bonLivraison" || item.typeReglement == "bonRetourFournisseur") {
        variable.debit = item.montant
        this.listReg.push(variable)
      }
    }

    this.envoitListeRegl.emit({ items: this.listReg, requestReglement:this.request })
    this.changeVar = false
  }

  @Output() envoitListeRegl = new EventEmitter<Object>();

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

    if (request1.dateEnd != request2.dateEnd || request1.dateStart != request2.dateStart) {
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
    this.getReglements(this.request)
  }

  setPage(newPage: number) {
    this.request.page = newPage
    this.getReglements(this.request)
  }

  titreFile = "Liste des sessions caisses"
  nameFile = "liste_sessionsCaisses"
  printout() {
    this.utilite.printout(this.reglements, this.items, this.titreFile)
  }

  generatePDF() {
    console.log("hello");

    this.utilite.generatePDF(this.reglements, this.items, this.titreFile, this.nameFile)
  }

  exportexcel() {
    /* table id is passed over here */
    this.utilite.exportexcel(this.reglements, this.items, this.titreFile, this.nameFile)
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

    this.listReg = this.fonctionPartages.orderByDocuments(this.request.orderBy, this.listReg)
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

  getSomme(list, key) {
    var somme = 0
    for (let i = 0; i < list.length; i++) {
      if (!isNaN(list[i][key])) {
        somme += Number(list[i][key])
      }
    }
    return somme
  }
}
