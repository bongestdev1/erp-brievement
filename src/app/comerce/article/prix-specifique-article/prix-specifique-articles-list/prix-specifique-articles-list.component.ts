import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrixSpecifiqueRequest } from '../Models/prix-specifique-request';
import { ItemArticleSelected } from '../Models/item-article-selected';
import { ShemaArticle } from '../Models/shema-article';
import { ShemaArticle2 } from '../Models/shema-article2';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { Articlelist } from 'src/app/model/modelComerce/article/Articlelist';
import { FraisParArticle } from 'src/app/services/serviceBD_Commerce/prixSpecifique.service'





//  
@Component({
  selector: 'app-prix-specifique-articles-list',
  templateUrl: './prix-specifique-articles-list.component.html',
  styleUrls: ['./prix-specifique-articles-list.component.scss']
})
export class PrixSpecifiqueArticlesListComponent implements OnInit {
  formC: FormGroup
  // end autocomplete articles

  @Input() articles
  @Input() allArticles = []
  @Input() allTypeTiers = []
  @Input() allClients = []
  @Input() isLoading
  @Input() errorList = []
  @Input() idArticle = ""
  @Input() allFrais = []

  @Input() isTypeTier = false

  lienGetById = "/articles/getByIdCategorie/"

  @Output() getAllParametres = new EventEmitter<string>();
  @Output() ajouterArticle = new EventEmitter<{ idArticle: string, idLigne: string }>();
  @Output() setNewList = new EventEmitter<Object>();

  articleSelected = ""
  erreurAjouterArticle = ""

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    public informationGenerale: InformationsService,
    private tokenStorageService: TokenStorageService,
    private notificationToast: ToastNotificationService,
    public fonctionPartagesService: FonctionPartagesService,
    private fb: FormBuilder,
    public prixSpecifiqueService: FraisParArticle
  ) {


    this.formC = this.fb.group({
      article: [''],
      // sousProduit: [''],
      client: [''],
      marge: [''],
      margePourcentage: [''],
      // quantiteMin:[''],
      // quantiteMax:[''], 
      typeTier: [''],
      note: [''],
      prixAchat: [''],
      numero: [''],
      reference: [''],
      designation: [''],
      newPrixVenteHT: [''],
    })

    console.log(this.isTypeTier)

    
  }

  request = new PrixSpecifiqueRequest()

  oldRequest = new PrixSpecifiqueRequest()

  //start prix specifique

  lienDelete = "/prixSpecifiques/deletePrixSpecifique"
  lienList = "/prixSpecifiques/listPrixSpecifique"

  isOpenModalDelete = false
  idDeleteModal = ""
  params1Delete = ""
  params2Delete = ""

  deleteItem() {

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienDelete + "/" + this.idDeleteModal, {}, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.getPrixSpecifiques()
          this.closeModalDelete()
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
    this.params1Delete = "La prixSpecifique"
    this.params2Delete = params2
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }

  getPrixSpecifiques() {

    if (this.isLoading) {
      return
    }

    for (let key in this.request.search) {
      this.request.search[key] = this.formC.value[key]
    }

    this.request.societe = this.informationGenerale.idSocieteCurrent

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienList, this.request, this.tokenStorageService.getHeader()).subscribe(

      res => {

        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {

          console.log(resultat.resultat)
          this.setNewList.emit({ items: resultat.resultat })
          // this.prixSpecifiques = resultat.resultat.docs
          this.oldRequest = resultat.request
          if (!this.testSyncronisation(this.request, resultat.request)) {
            this.getPrixSpecifiques()
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

    return true;
  }

  clickIsEnable(numero){
    for(let i = 0; i < this.articles.length; i++){
        if(numero === this.articles[i].numero){
          this.articles[i].isEnable = !this.articles[i].isEnable
        }
    }
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

    //this.getPrixSpecifiques()
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

  //end prix specifique

  ngOnInit(): void {
 
    var shemaArticleCopie = {}
    
    if(this.isTypeTier){
      for(let key in this.shemaArticle){
        if('client' === key){
          shemaArticleCopie['libelle'] = 'Type Tier'
        }else{
          shemaArticleCopie[key] = this.shemaArticle[key]
        }
      }
      
      this.shemaArticle = JSON.parse(JSON.stringify(shemaArticleCopie))
      this.shemaArticleVariables = JSON.parse(JSON.stringify(shemaArticleCopie))

    }

   
  }

  getStyleErrorLigne(item) {
    var nbrError = this.errorList.filter(x => x.id == item.id)
    if (nbrError.length > 0) {
      return "background:rgb(241, 152, 152);"
    } else {
      return "background:white;"
    }
  }


  lienAjoute = "/articles/newArticle"

  objectKeys = Object.keys;
  // begin autocomplete articles
  itemArticleSelected = new ItemArticleSelected()

  //pour list article dans autocomplite
  shemaArticle = new ShemaArticle()

  //pour list article dans autocomplite
  shemaArticleVariables = new ShemaArticle()

  getPrixAfterMarge(item) {
    // //console.log(item)
    // var prixAchat = Number(item.prixAchat)
    // if (item.margeAppliqueeSur !== "Achat" && item.prixRevient) {
    //   prixAchat = Number(item.prixRevient)
    // }

    // var prixSpecifique = 0
    // for (let i = 0; i < this.articles.length; i++) {
    //   if (this.articles[i].numero == item.numero) {
    //     prixSpecifique = prixAchat + this.articles[i].margePourcentage * 0.01 * prixAchat + Number(this.articles[i].marge)
    //     this.articles[i].newPrixVenteHT = prixSpecifique
    //   }
    // }
  }

  parametresGlobal = {
    margeGlobal: 0,
    margePourcentageGlobal: 0
  }

  changeParametreGlobal() {
    for (let i = 0; i < this.articles.length; i++) {
      this.articles[i].marge = this.parametresGlobal.margeGlobal;
      this.articles[i].margePourcentage = this.parametresGlobal.margePourcentageGlobal;

      var prixAchat = Number(this.articles[i].prixAchat)
      if (this.articles[i].margeAppliqueeSur !== "Achat" && this.articles[i].prixRevient) {
        prixAchat = Number(this.articles[i].prixRevient)
      }

      var prixSpecifique = prixAchat + (this.articles[i].margePourcentage * 0.01 * prixAchat) + this.articles[i].marge
      this.articles[i].newPrixVenteHT = prixSpecifique
    }
  }

  // end autocomplete articles

  //begin delete item
  numeroItemDelete = 0

  tabNumbers = ["marge", "margePourcentage"]
  allTabNumbers = ['qteInv1', 'qteInv2', 'qteInv3', 'qteInvValide']
  tabCoches = ['qteInv1', 'qteInv2', 'qteInv3']
  tabQTV = ['qteInvValide']

  idsFrais = []

  ngOnChanges(changes: SimpleChanges) {

    console.log("articles = ",this.articles)
    console.log("ngonchange")
    var newKeys: any = {}
    this.idsFrais = []

    for (let key in this.shemaArticle) {
      newKeys[key] = this.shemaArticle[key]
      if ((key === "client" || key === "libelle") && this.allFrais && this.allFrais.length > 0) {
        for (let frais of this.allFrais) {
          this.idsFrais.push(frais.id)
          newKeys[frais.id] = frais.type
        }
      }
    }

    this.shemaArticle = JSON.parse(JSON.stringify(newKeys))
    this.shemaArticleVariables = JSON.parse(JSON.stringify(newKeys))

    this.calculerAllArticle()
  }

  // start modal sous produit
  titreCrud = "Ajouter"
  modalReference: NgbModalRef;
  closeResult = '';
  titre = "sousProduit";

  sousProduit = {
    sousProduit: "",
    reference: "",
  }

  erreurSousProduit = {
    reference: "",
  }

  open(content, item) {

    this.titreCrud = "Ajouter"
    this.sousProduit = {
      sousProduit: "",
      reference: "",
    }

    this.erreurSousProduit = {
      reference: "",
    }

    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }

  openAjouter(content, idLigne) {
    this.itemArticleSelected.article = ""
    this.posLigneAjouter = idLigne

    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
    });
  }

  JoinAndClose() {
    this.modalReference.close();
  }

  tabEmpty = []
  inisialiserEmptyTab() {
    this.tabEmpty = this.fonctionPartagesService.inisialiserEmptyTab(this.articles)
    return true
  }

  getStyle(item) {
    if (item.numero != 0) {
      return "background-color:white;"
    } else {
      return "background-color: rgba(64, 26, 231, 0.30);"
    }
  }

  getStyleDropDown(item) {
    if (item.numero == 0 && item.isShow == 0) {
      return "display:none;"
    } else {
      return "display:block;"
    }
  }

  deleteLigne(numero) {
    var newlist = this.articles
    for (let i = 0; i < newlist.length; i++) {
      if (newlist[i].numero == numero) {
        newlist.splice(i, 1)
        this.setNewList.emit({ items: newlist })
      }
    }
  }


  //start Categorie
  isOpenModalAjoutElement = false
  idAjoutElementModal = ""
  typeElement
  keySelectedTypeTier = "libelle"
  objetTypeTier = { libelle: "" }

  closeModalAjoutElement() {
    this.isOpenModalAjoutElement = false
    this.getAllParametres.emit()
  }

  openModalAjoutTypeTier() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterTypeTier
    this.isOpenModalAjoutElement = true
  }

  setTypeTierID(objet) {
    for (let i = 0; i < this.articles.length; i++) {
      if (this.articles[i].id == objet.item.id) {
        this.articles[i].typeTier = objet.id
      }
    }
  }
  //end Categorie

  //start Client
  typeClient
  keySelectedClient = "raisonSociale"
  objetClient = {
    raisonSociale: "Raison sociale",
    code: "Code",
    matriculeFiscale: "matricule Fiscale",
    email: "Email",
  }

  openModalAjoutClient() {
    this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterClient
    this.isOpenModalAjoutElement = true
  }

  setClientID(objet) {
    for (let i = 0; i < this.articles.length; i++) {
      if (this.articles[i].id == objet.item.id) {
        this.articles[i].client = objet.id
      }
    }
  }
  //end Client

  //start article
  shemaMultiSortie = {
    reference: "Réference",
    designation: "Désignation",
    prixVenteHT: "Prix HT",
    prixTTC: "Prix TTC"
  }

  shemaArticle2 = new ShemaArticle2()

  keySelectedArticle = "reference"

  shemaArticle2Number = {
    marge: '',
    tauxTVA: '',
    prixTTC: '',
    pVenteConseille: '',
    plafondmarge: ''
  }

  shemaArticle2Quantite = {
    qteEnStock: '',
    qteTheorique: ''
  }

  erreurArticle = {
    reference: ""
  }

  setArticleID(id) {

  }

  //ajouterArticle()
  posLigneAjouter = ""

  ajouterArticle2() {
    if (this.itemArticleSelected.article == "") {
      return
    }
    this.ajouterArticle.emit({ idArticle: this.itemArticleSelected.article, idLigne: this.posLigneAjouter })
    this.JoinAndClose()
  }

  setArticle2ID(id) {
    this.itemArticleSelected.article = id
  }
  //end article


  checkedFrais(numero, idFrais) {
    if (this.articles.filter(x => x.numero === numero).length > 0) {
      return this.articles.filter(x => x.numero === numero)[0].frais.filter(x => x.idFrais === idFrais).length > 0
    }

    return false
  }

  clickedFrais(numero, idFrais) {
    if (this.checkedFrais(numero, idFrais)) {
      this.articles[numero - 1].frais = this.articles[numero - 1].frais.filter(x => x.idFrais !== idFrais)
    } else {
      this.articles[numero - 1].frais.push({ idFrais: idFrais })
    }
    this.calculerAllArticle()
  }

  calculeReciproquePrixSpecifique(numero) {
    var prixAchat = this.articles[numero - 1].prixRevient
    var prixSpecifique = this.articles[numero - 1].newPrixVenteHT
    this.articles[numero - 1].prixTTC = prixSpecifique * (1 + Number(this.articles[numero - 1].tauxTVA) /100) + this.articles[numero - 1].redevance

    var difference = prixSpecifique - prixAchat

    if (difference <= 0) {
      this.articles[numero - 1].marge = difference
      this.articles[numero - 1].margePourcentage = 0
    } else {
      var montantMargePourcentage = this.articles[numero - 1].margePourcentage * prixAchat / 100
      if (montantMargePourcentage < difference) {
        this.articles[numero - 1].marge = difference - montantMargePourcentage
      } else {
        difference -= this.articles[numero - 1].marge
        this.articles[numero - 1].margePourcentage = difference / prixAchat * 100
      }
    }

  }

  calculerAllArticle() {
    for (let k = 0; k < this.articles.length; k++) {

      if (this.allArticles.filter(x => x.id === this.articles[k].article).length > 0) {
        var result = this.getPrixSpecifique(this.allArticles.filter(x => x.id === this.articles[k].article)[0], this.articles[k])

        this.articles[k].prixRevient = result.prixRevient
        this.articles[k].newPrixVenteHT = result.prixVenteHT
      }
    }
  }

  cochedAll(event) {

    for (let k = 0; k < this.articles.length; k++) {
      if (event.target.checked) {
        if (!this.checkedFrais(this.articles[k].numero, event.target.name)) {
          this.articles[k].frais.push({ idFrais: event.target.name })
        }
      } else {
        if (this.checkedFrais(this.articles[k].numero, event.target.name)) {
          this.articles[k].frais = this.articles[k].frais.filter(x => x.idFrais !== event.target.name)
        }
      }
    }

    this.calculerAllArticle()

  }

  getMontantFrais(idFrais, numeroLigne) {
    if (this.allArticles.filter(x => x.id === this.articles[numeroLigne - 1].article).length > 0 &&
      this.allArticles.filter(x => x.id === this.articles[numeroLigne - 1].article)[0].frais.filter(x => x.frais === idFrais).length > 0) {
      return this.allArticles.filter(x => x.id === this.articles[numeroLigne - 1].article)[0].frais.filter(x => x.frais === idFrais)[0].montant
    }
    return 0
  }

  getFraisTVA(idFrais) {
    if (this.allFrais.filter(x => x.id === idFrais).length > 0) {
      return " (" + this.allFrais.filter(x => x.id === idFrais)[0].tauxTVA.toFixed(2) + ")"
    }
    return ""
  }

  getPrixSpecifique(article, prixSpecifique) {

    var totalFrais = 0
    for (var i = 0; i < prixSpecifique.frais.length; i++) {
      if (article.frais.filter(x => x.frais === prixSpecifique.frais[i].idFrais).length > 0) {
        var montant = article.frais.filter(x => x.frais === prixSpecifique.frais[i].idFrais)[0].montant
        totalFrais += montant
      }
    }

    var prixAchat = Number(article.prixFourn) - Number(article.prixFourn) * Number(article.remiseF / 100) - article.remiseParMontant

    var prixDC = Number(this.getNumber(prixAchat * article.tauxDC / 100))

    var prixFodec = Number(this.getNumber(prixAchat * this.fonctionPartagesService.parametres.tauxFodec / 100))
    if (article.isFodec != "oui") {
      prixFodec = Number(this.getNumber(0))
    }

    var prixAchat2 = Number(this.getNumber(prixAchat + prixDC + prixFodec))

    var prixRevient = Number(prixAchat2) + Number(totalFrais)
    var prixVenteHT = Number(prixRevient) + prixSpecifique.margePourcentage * prixRevient / 100 + prixSpecifique.marge

    return { prixVenteHT: prixVenteHT, prixRevient: prixRevient }
  }

  getNumber(float) {
    return this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(float)
  }

  apiList = "/articles/listArticlesSociete"
  requestArticle = new Articlelist()

  exportexcel() {
    var data = []

    for (let key in this.request.search) {
      this.requestArticle.search[key] = this.formC.value[key]
    }

    this.requestArticle.limit = 5//this.formC.value.limit
    this.requestArticle.societe = this.informationGenerale.idSocieteCurrent

    if (!this.testSyncronisation(this.request, this.oldRequest)) {
      this.requestArticle.page = 1
    }
    this.http.post(this.informationGenerale.baseUrl + this.apiList, this.requestArticle, this.tokenStorageService.getHeader()).subscribe(
      (res) => {
        let resultat: any = res
        //console.log(resultat);

        if (resultat.status) {
          resultat.resultat.docs.forEach(async e => {


            data.push({
              Reference: e.reference,
              Designation: e.designation,
              Prix_Achats_HT: e.prixAchat,
              Prix_Achat_TTC: e.prixVenteHT,
              TR1: "",
              Cout_TR_1: await this.test(e._id, 1),
              TR2: "",
              Cout_TR_2: await this.test(e._id, 2),
              PrixRevient: "",
              Marge: "",
              PrixHT: "",
              TauxTVA: "",
              PrixTTC: ""
            })
          });


        } else {
          this.notificationToast.showError(this.fonctionPartagesService.getMessageBackend(resultat.message))
        }
        setTimeout(() => {
          var filename = 'prix_specifique.xlsx';
          var ws = XLSX.utils.json_to_sheet(data);
          var wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, filename);
        }, 2000);
      },
      (err) => {
        console.log(err);
      }
    )

  }

  async test(arg, index) {
    console.log(arg);

    var coutTR = await this.coutFraisTransportI(arg, index)
    console.log(coutTR);

    if (coutTR == undefined) {
      return 0
    } else {
      return coutTR
    }

  }
  coutFraisTransportI(id: any, index) {
    return new Promise<void>((resolve, reject) => {
      this.prixSpecifiqueService.getFraisParArticle(id).pipe().subscribe(
        (data: any) => {
          console.log(data);
          if (index == 1) {
            resolve(data.resultat[0].frais[0]?.montant)
          } else {
            resolve(data.resultat[0].frais[1]?.montant)
          }
        }
      )
    })

  }


}


