import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpressionDocumentService } from 'src/app/services/impression-document.service';
import { Fournisseur } from 'src/app/model/modelComerce/Fournisseur/Fournisseur';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import {saveAs} from 'file-saver';
import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';
import { ShemaArticleAchat } from '../../bonLivraison/lignebl/models/shema-article-achat';

@Component({
  selector: 'app-facture-avoir-achat',
  templateUrl: './facture-avoir-achat.component.html',
  styleUrls: ['./facture-avoir-achat.component.scss']
})
export class FactureAvoirAchatComponent implements OnInit {

  public isCollapsed: boolean;
  public isCollapsed2: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonAchatFormGroup: FormGroup;

  @Input() lienupload = "/bonLivraisons/upload"

  apiGetBonReception = "/factureAvoirAchats/getBonReceptions"

  @Input() lienAjoute = "/factureAvoirAchats/newFactureAvoir"

  @Input() apiParametres = "/factureAvoirAchats/getAllParametres"

  @Input() lienModifie = "/factureAvoirAchats/modifierFactureAvoir/"

  @Input() lienGetById = "/factureAvoirAchats/getById/"

  @Input() titreDocument = this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises

  @Input() modeTiere = this.fonctionPartagesService.modeTiere.fournisseur

  @Input() titreCrud = this.fonctionPartagesService.titreCrud.ajouter

  @Input() pageList = "/factureAvoirAchat/list"

  lienGetDocuments1 = "/factureAvoirAchats/getBonRetourFournisseurs/"
  lienGetDocuments2 = "/factureAvoirAchats/getFacturesFournisseur/"
  lienGetDocuments3 = "/factureAvoirAchats/getFacturesFournisseurSansDejaAvoir/"
  lienGetDocuments4 = "/factureAvoirAchats/getFacturesFournisseurWithLignes/"

  allBonReceptions = []

  modeTransfert = false

  id = ""

  allFournisseurs = []


  objectKeys = Object.keys;

  request = {
    numero: "",
    date: "",
    fournisseur: "",

    totalRemise: 0,
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    totalGainCommerciale: 0,
    totalGainReel: 0,
    timbreFiscale: 0,
    totalRemiseFacture: 0,

    montantPaye: 0,
    montantTotal: 0,
    totalRedevance: 0,
    totalFodec: 0,
    montantEscompte: 0,
    totalDC: 0,
    restPayer: 0,

    societe: "",
    exercice: "",

    observation: "",

    typeAvoir: this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises,

    numeroFactureFournisseur:"",
    dateFactureFournisseur:"",
    captureFactureFournisseur:"",

    bonRetourFournisseurs:[],
    factureVentes:[],
    factureAchatsWithArticles:[],
    factureVente:"",
    withTimbreFiscal:false,

  }

  bonAchat = {
    numero: "",
    date: "",
    fournisseur: "",

    totalRemise: 0,
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    totalGainCommerciale: 0,
    totalGainReel: 0,
    timbreFiscale: 0,
    totalRemiseFacture: 0,

    montantTotal: 0,
    montantPaye: 0,
    totalRedevance: 0,
    totalFodec: 0,
    montantEscompte: 0,
    totalDC: 0,
    restPayer: 0,

    societe: "",
    exercice: "",

    observation: "",

    typeAvoir: this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises,

    numeroFactureFournisseur:"",
    dateFactureFournisseur:"",
    captureFactureFournisseur:"",

    bonRetourFournisseurs:[],
    factureVentes:[],
    factureAchatsWithArticles:[],
    factureVente:"",
    withTimbreFiscal:false,
  }

  tabNumbers = ["totalDC", "montantEscompte", "tFiscale", "montantPaye", "restPaye", "totalRedevance", "totalFodec"]

  erreurBonAchat = {
    fournisseur: "",
    date: "",
    totalHT: "",
  }

  uniteMesures = []

  bonReceptions = []

  setTimbreFiscale(){
    this.bonAchat.withTimbreFiscal = !this.bonAchat.withTimbreFiscal
    this.calculTotalFactureAchat()
  }

  constructor(
    private notificationToast: ToastNotificationService,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
    private route: ActivatedRoute,
    private router: Router,
    private impressionDocument: ImpressionDocumentService,
    public generationPdfFacture : GenerationPdfFactureService) {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  clickImpression() {
    // var fournisseur = null
    // var fournisseurs = this.allFournisseurs.filter(x => x.id == this.bonAchat.fournisseur)
    // if (fournisseurs.length > 0) {
    //   fournisseur = fournisseurs[0]
    // }
    //this.impressionDocument.generatePDF(this.titreDocument, this.bonAchat, this.articles, fournisseur)

    console.log('hello');

  }

  isPrixVenteNotPrixAchat() {
    if (this.titreDocument == this.fonctionPartagesService.titreDocuments.bonRetourFournisseur || this.titreDocument == this.fonctionPartagesService.titreDocuments.devis || this.titreDocument == this.fonctionPartagesService.titreDocuments.bonAchat || this.titreDocument == this.fonctionPartagesService.titreDocuments.commande) {
      return true
    }
    return false
  }

  allOrdreEmissions = []
  getAllParametres() {
    let request = {
      societe: this.informationGenerale.idSocieteCurrent,
      exercice: this.informationGenerale.exerciceCurrent
    }

    this.isLoading = true
    this.http.post(this.informationGenerale.baseUrl + this.apiParametres, request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFournisseurs = resultat.fournisseurs
          if (this.allFournisseurs.filter(x => x.id == this.bonAchat.fournisseur).length > 0) {
            this.fournisseur = this.allFournisseurs.filter(x => x.id == this.bonAchat.fournisseur)[0]
            this.getBonDocuments(true)
          }

          if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter || this.titreCrud == this.fonctionPartagesService.titreCrud.transfert) {
            this.bonAchat.numero = resultat.numeroAutomatique
          }
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  changePrixTotalEvent() {
  }

  ngOnInit(): void {
    this.initialiserVariablesOfShowsElements()
    this.titreCrud = this.fonctionPartagesService.getTitreCrudOfUrl(this.router.url);
    this.isCollapsed = true;
    this.isCollapsed2 = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter) {
      this.bonAchat.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.bonAchat.dateFactureFournisseur = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.getAllParametres()
    }else if (this.titreCrud == this.fonctionPartagesService.titreCrud.transfert){
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id.length > 1) {
        this.getBonAchats(this.id)
      }
    } else {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id.length > 1) {
        this.getBonAchat(this.id)
      }
    }
  }

  controleInputs() {
    for (let key in this.erreurBonAchat) {
      this.erreurBonAchat[key] = ""
    }

    var isValid = true
    if (this.bonAchat['totalHT'] == 0) {
      this.erreurBonAchat['totalHT'] = "Veuillez ajouter votres documents"
      isValid = false
    }

    if (this.bonAchat['fournisseur'] == "") {
      this.erreurBonAchat['fournisseur'] = "Veuillez remplir ce champ"
      isValid = false
    }

    if (this.bonAchat['date'] == "") {
      this.erreurBonAchat['date'] = "Veuillez ajouter votre date"
      isValid = false
    }
    return isValid
  }

  isLoading = false

  organiserArtticlesSelonNumero(articles) {
    var articlesOrdonnees = []
    for (let i = 0; i < articles.length; i++) {
      articlesOrdonnees.push(articles.filter(x => x.numero == (i + 1))[0])
    }
    return articlesOrdonnees
  }

  getBonAchat(id) {

    this.isLoading = true

    this.http.get(this.informationGenerale.baseUrl + this.lienGetById + id, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          //this.reseteFormulaire()
          this.request = response.resultat
          this.bonRetourSelected = response.bonRetourFournisseurs
          this.factureVenteSelected = response.resultat.factureAchats

          this.titreDocument = this.request.typeAvoir
          for (let key in this.bonAchat) {
            this.bonAchat[key] = this.request[key]
          }
          
          this.bonAchat.date = formatDate(new Date(this.bonAchat.date), 'yyyy-MM-dd', 'en');
          this.bonAchat.dateFactureFournisseur = formatDate(new Date(this.bonAchat.dateFactureFournisseur), 'yyyy-MM-dd', 'en');

          // this.calculTotalFactureAchat()
          this.getAllParametres()

        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  getBonAchats(id) {

    var bonReceptions = id.split("&&")

    this.isLoading = true

    var request = {bonReceptions:bonReceptions}

    this.http.post(this.informationGenerale.baseUrl + this.apiGetBonReception , request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          //this.reseteFormulaire()
          if(response.bonReceptions.length > 0){
            this.bonReceptions = response.bonReceptions.filter(x => x.fournisseur === response.bonReceptions[0].fournisseur)
            this.bonAchat.fournisseur = response.bonReceptions[0].fournisseur
          }

          this.bonAchat.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          this.bonAchat.dateFactureFournisseur = formatDate(new Date(), 'yyyy-MM-dd', 'en');
         
          this.renitialiserFacture()
          this.getAllParametres()

        }else{
          this.notificationToast.showError(this.fonctionPartagesService.getMessageBackend(response.message))
          this.router.navigate([this.pageList]);
        }
      }, err => {
        console.log(err)
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  setTypeAvoir(titreDocument){
    this.titreDocument = titreDocument
    this.bonAchat.typeAvoir = titreDocument
    
    if(this.bonAchat.typeAvoir != this.request.typeAvoir){
      this.bonRetourSelected = []
      this.factureVenteSelected = []
      this.bonAchat.factureVente = ""
      this.calculTotalFactureAchat()
    }

    this.request.typeAvoir = this.bonAchat.typeAvoir
    
    if(this.fournisseur){
      this.getBonDocuments(false)
    }
  }

  getBonDocuments(isNotInisialiserPrix){
      this.request.typeAvoir = this.bonAchat.typeAvoir
      if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises){
        this.getBonDocumentsBonRetourFournisseurs(isNotInisialiserPrix)
      }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirSurFacture){
        this.getBonDocumentsFacturesFournisseur(isNotInisialiserPrix)
      }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirFinanciers){
        this.getBonDocumentsFacturesFournisseurSansDejaTransformerAvoirSurFac(isNotInisialiserPrix)
      }else{
        this.getBonDocumentsAllFacturesWithLignes(isNotInisialiserPrix)
      }
  }

  allFacturesWithLignes = []

  getBonDocumentsAllFacturesWithLignes(isNotInisialiserPrix) {
    
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments4 + this.fournisseur.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFacturesMarchandisesFinancierFournisseur = resultat.factureAchats
          
          if(!isNotInisialiserPrix){
            this.renitialiserFacture()
          }
           
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments(false)
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  allBonRetourFournisseurs = []

  getBonDocumentsBonRetourFournisseurs(isNotInisialiserPrix) {
    
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments1 + this.fournisseur.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allBonRetourFournisseurs = resultat.bonRetourFournisseurs
          
          if(!isNotInisialiserPrix){
            this.renitialiserFacture()
          }
           
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments(false)
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  allFacturesFournisseur = []

  getBonDocumentsFacturesFournisseurSansDejaTransformerAvoirSurFac(isNotInisialiserPrix) {
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments3 + this.fournisseur.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFacturesFournisseur = resultat.factureAchats
          
          for(let item of this.factureVenteSelected){
            this.allFacturesFournisseur = this.allFacturesFournisseur.filter(x => x.id != item.id)
          }

          if(!isNotInisialiserPrix){
            this.renitialiserFacture()
          }
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments(false)
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  

  getBonDocumentsFacturesFournisseur(isNotInisialiserPrix) {
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments2 + this.fournisseur.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFacturesFournisseur = resultat.factureVentes
          if(!isNotInisialiserPrix){
            this.renitialiserFacture()
          }
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments(false)
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }
  
  renitialiserFacture(){

    var keys = ["montantTotal", "montantEscompte", "restPayer", "montantPaye", "totalDC", "totalFodec", "totalGainCommerciale", "totalHT", "totalTTC", "totalTVA", "totalRemise", "totalRedevance",  "totalGainReel", ]
    for(let key of keys){
      this.bonAchat[key] = 0
    }

    var sommeTimbreFiscale = 0

    for(let item of this.bonReceptions){
      sommeTimbreFiscale += item.timbreFiscale
      for(let key of keys){
        this.bonAchat[key] += item[key]
      }
    }

    var societe = this.informationGenerale.getSocieteCurrentObject() 
    
    if (this.bonAchat.withTimbreFiscal) {
      this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
    } else {
      this.bonAchat.timbreFiscale = 0
    }

    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.restPayer = this.bonAchat.montantTotal - this.bonAchat.montantPaye
   
    this.calculTotalFactureAchat()
  }

  isImprimableAfterSave = false
  ajoutImage() {
    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    if(!this.imageData){
      this.ajoutBonAchat()
      return
    }

    if (this.isLoading) {
      return
    }

    var request = new FormData();
    if (this.captureFournisseur) {
      request.append("myFiles", this.captureFournisseur, this.captureFournisseur.filename);
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienupload, request, this.tokenStorageService.getHeader()).subscribe(

      res => {
         this.isLoading = false
         this.bonAchat.captureFactureFournisseur = res[0]

         this.ajoutBonAchat()
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  ajoutBonAchat() {
    if (this.titreCrud == this.fonctionPartagesService.titreCrud.modifier) {
      this.modifierBonAchat()
    } else if (this.titreCrud == this.fonctionPartagesService.titreCrud.transfert) {
      this.ajoutBonAchat2()
    } else {
      this.ajoutBonAchat2()
    }
  }

  ajoutBonAchat2() {

    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    if (this.isLoading) {
      return
    }

    for (let key in this.bonAchat) {
      this.request[key] = this.bonAchat[key]
    }

    this.request.societe = this.informationGenerale.idSocieteCurrent
    this.request.exercice = this.informationGenerale.exerciceCurrent + ""

    let request: any = {}
    request = this.request
    var bonRetourFournisseurs = []
    this.bonRetourSelected.forEach( x =>{
      bonRetourFournisseurs.push(x.id)
    })

    var factureAchats = []
    this.factureVenteSelected.forEach( x =>{
      factureAchats.push({documentAchat:x.id, montantFinancie:x.montantFinancie})
    })
    
    request.factureAchats = factureAchats
    request.bonRetourFournisseurs = bonRetourFournisseurs

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienAjoute, request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          //this.reseteFormulaire()
          if(!this.isImprimableAfterSave){
            this.router.navigate([this.pageList]);
          }else{
            this.isImprimableAfterSave = false
            this.generationPdfFacture.openPopup(this.id, this.titreDocument)
          }
          this.notificationToast.showSuccess("Votre " + this.titreDocument + " est bien enregistrée !")
           
        }else{
          this.notificationToast.showError(this.fonctionPartagesService.getMessageBackend(resultat.message))
          this.router.navigate([this.pageList]);
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  modifierBonAchat() {
    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    if (this.isLoading) {
      return
    }

    for (let key in this.bonAchat) {
      this.request[key] = this.bonAchat[key]
    }

    let request: any = {}
    request = this.request
    
    var bonRetourFournisseurs = []
    this.bonRetourSelected.forEach( x =>{
      bonRetourFournisseurs.push(x.id)
    })

    var factureAchats = []
    this.factureVenteSelected.forEach( x =>{
      factureAchats.push({documentAchat:x.id, montantFinancie:x.montantFinancie})
    })
    
    request.factureAchats = factureAchats
    request.bonRetourFournisseurs = bonRetourFournisseurs

    if (this.isLoading) {
      return
    }
    this.isLoading = true
    this.http.post(this.informationGenerale.baseUrl + this.lienModifie + this.id, request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.notificationToast.showSuccess("Votre " + this.titreDocument + " est bien modifiée !")
          if(!this.isImprimableAfterSave){
            this.router.navigate([this.pageList]);
          }else{
            this.isImprimableAfterSave = false
            this.generationPdfFacture.openPopup(this.id, this.titreDocument)
          }
          this.request = resultat.resultat
        }else{
          this.notificationToast.showError(this.fonctionPartagesService.getMessageBackend(resultat.message))
          // this.router.navigate([this.pageList]);
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  reseteFormulaire() {
    for (let key in this.erreurBonAchat) {
      this.bonAchat[key] = ""
    }
  }

  calculerRestePayer() {
    var montantPaye = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.bonAchat.montantPaye))
    var totalTTC = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.bonAchat.totalTTC))
    this.bonAchat.restPayer = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(totalTTC - montantPaye))
  }

  //autocomplete fournisseur

  fournisseur: any = {}
  setFournisseurID(id) {
    this.bonAchat.fournisseur = id
    let fournisseur: any = this.allFournisseurs.filter(x => x.id == id)
    if (fournisseur.length == 0) {
      this.fournisseur = {}
      return
    }

    this.fournisseur = JSON.parse(JSON.stringify(fournisseur[0]))

    this.getBonDocuments(false)
  }
  //pour calculer le nombre des bons Achats non payées par un id Fournisseur
  lienBonAchatsFournisseur = "/bonAchats/bonAchatsFournisseur/"
  nbLivsFournisseurNonPayee = 0
  bonAchatsFournisseur(idFournisseur) {
    this.http.get(this.informationGenerale.baseUrl + this.lienBonAchatsFournisseur + idFournisseur, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.nbLivsFournisseurNonPayee = resultat.bonAchatsFournisseur
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  //open modal ajout Fournisseur
  isOpenModalAjoutFournisseur = false
  idAjoutFournisseurModal = ""
  typeElement
  closeModalAjoutFournisseur() {
    this.isOpenModalAjoutFournisseur = false
    this.typeElement = ""
    this.getAllParametres()
  }

  openModalAjoutFournisseur() {
    if (this.modeTiere == this.fonctionPartagesService.modeTiere.fournisseur) {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterFournisseur
    } else {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterFournisseur
    }

    this.isOpenModalAjoutFournisseur = true
  }


  isOpenModalBlockerFournisseur = false
  messageBlockerFournisseur = ""
  closeBlockerFournisseur() {
    this.isOpenModalBlockerFournisseur = false
  }

  imageData: string;
  captureFournisseur = null

  onFileSelect(event: Event) {
    this.captureFournisseur = (event.target as HTMLInputElement).files[0];
    if (this.captureFournisseur) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
     
      reader.readAsDataURL(this.captureFournisseur);
    }
  }

  saveFileFacture(){
    this.http.get(this.informationGenerale.baseUrl+'/'+this.bonAchat.captureFactureFournisseur, {responseType: "blob", headers: {'Accept': 'application/pdf'}})
    .subscribe(blob => {
      saveAs(blob, this.bonAchat.captureFactureFournisseur );
    });
  }

  replacePath(chaine){
    return chaine.replace('\\','_')
  }

  calculTotalFactureAchat(){
    if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises){
      this.calculTotalFactureBonRetourFournisseur()
    }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirSurFacture){
      this.calculTotalFactureAvoirSurFacture()
    }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirFinanciers){
      this.changeMontantFinancier()
    }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirSurMarchandisesFinanciers){
      this.changeMontantFinancierMarchandisesFinancier()
    }  
  }

  calculTotalFactureAvoirSurFacture(){
    if(this.allFacturesFournisseur.filter(x => x.id === this.bonAchat.factureVente).length > 0){
      var fv = this.allFacturesFournisseur.filter(x => x.id === this.bonAchat.factureVente)[0]
      this.bonAchat.totalRemise = fv.totalRemise
      this.bonAchat.totalTTC = fv.totalTTC
      this.bonAchat.totalHT = fv.totalHT
      this.bonAchat.montantTotal = fv.montantTotal
      this.bonAchat.montantPaye = fv.montantPaye
      this.bonAchat.restPayer = fv.restPayer
    }
  }

  calculTotalFactureBonRetourFournisseur(){
    var sommeHt = 0
    var sommeTTC = 0
    var totalRemise = 0
    var sommePaye = 0
    for(let i = 0; i < this.bonRetourSelected.length; i++){
      totalRemise += this.bonRetourSelected[i].totalRemise
      sommeHt += this.bonRetourSelected[i].totalHT
      sommeTTC += this.bonRetourSelected[i].totalTTC
      sommePaye += this.bonRetourSelected[i].montantPaye
    }
    // this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
    this.bonAchat.totalRemise = totalRemise
    this.bonAchat.totalTTC = sommeTTC
    this.bonAchat.totalHT = sommeHt
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.montantPaye = sommePaye
    this.bonAchat.restPayer = this.bonAchat.montantTotal - sommePaye
  }
  // calculTotalFactureAchat(){
  //   var sommeHt = 0
  //   var sommeTTC = 0
  //   var totalRemise = 0
  //   var sommePaye = 0
  //   for(let i = 0; i < this.bonRetourSelected.length; i++){
  //     totalRemise += this.bonRetourSelected[i].totalRemise
  //     sommeHt += this.bonRetourSelected[i].totalHT
  //     sommeTTC += this.bonRetourSelected[i].totalTTC
  //     sommePaye += this.bonRetourSelected[i].montantPaye
  //   }
  //   // this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
  //   this.bonAchat.totalRemise = totalRemise
  //   this.bonAchat.totalTTC = sommeTTC
  //   this.bonAchat.totalHT = sommeHt
  //   this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
  //   this.bonAchat.montantPaye = sommePaye
  //   this.bonAchat.restPayer = this.bonAchat.montantTotal - sommePaye

  // }

  closeModal(){
    this.getBonDocuments(false)
  }

  // start BonRetourFournisseur
  itemBRSelected = ""
  erreuritemBRSelected = ""
  bonRetourSelected = []
  setBonRetourId(idBonRetour){
    this.itemBRSelected = idBonRetour
  }
  
  ajouterBonRetourFournisseur(){
    if(this.allBonRetourFournisseurs.filter(x => x.id === this.itemBRSelected).length > 0 &&
    this.bonRetourSelected.filter(x => x.id === this.itemBRSelected).length === 0
    ){
      this.bonRetourSelected.push(this.allBonRetourFournisseurs.filter(x => x.id === this.itemBRSelected)[0])
      this.allBonRetourFournisseurs = this.allBonRetourFournisseurs.filter(x => x.id !== this.itemBRSelected)
    }
    this.calculTotalFactureAchat()
  }

  openModalModiferBR(idBonRetourFournisseur){
    // this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonRetourFournisseur    
    this.isOpenModalAjoutFournisseur = true
    this.idAjoutFournisseurModal = idBonRetourFournisseur
  }

  isOpenModalDelete = false
  params1Delete = ""
  params2Delete = ""

  openModalDelete(numero, params2) {
    this.itemBRSelected = numero
    this.isOpenModalDelete = true
    this.params1Delete = "Bon Retour Fournisseur"
    this.params2Delete = params2
  }

  deleteBonRetourFournisseur() {
    this.notificationToast.showSuccess("Votre bon retour fournisseur est supprimée")
    var bonRetourFournisseur = this.bonRetourSelected.filter( x => x.id === this.itemBRSelected)[0]
    this.allBonRetourFournisseurs.push(bonRetourFournisseur)
    this.bonRetourSelected = this.bonRetourSelected.filter( x => x.id !== this.itemBRSelected)
    this.closeModalDelete()
    this.calculTotalFactureAchat()
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }
  //end BonretourFournisseur

  // start FactureVente
  itemFVSelected = ""
  erreuritemFVSelected = ""
  factureVenteSelected = []
  setFactureVenteId(idFV){
    this.itemFVSelected = idFV
  }
  
  ajouterFV(){
    if(this.allFacturesFournisseur.filter(x => x.id === this.itemFVSelected).length > 0 &&
    this.factureVenteSelected.filter(x => x.id === this.itemFVSelected).length === 0
    ){
      var factureVente = this.allFacturesFournisseur.filter(x => x.id === this.itemFVSelected)[0]
      factureVente.montantFinancie = 0
      this.factureVenteSelected.push(factureVente)
      this.allFacturesFournisseur = this.allFacturesFournisseur.filter(x => x.id !== this.itemFVSelected)
    }

    console.log("this.factureVenteSelected = ",this.factureVenteSelected)
  }

  openModalModiferFV(itemFVSelected){
    // this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonRetourFournisseur    
    this.isOpenModalAjoutFournisseur = true
    this.idAjoutFournisseurModal = itemFVSelected
  }

  isOpenModalDeleteFV = false
  

  openModalDeleteFV(numero, params2) {
    this.itemFVSelected = numero
    this.isOpenModalDeleteFV = true
    this.params1Delete = "Facture Vente"
    this.params2Delete = params2
  }

  closeModeleDeleteFV(){
    this.isOpenModalDeleteFV = false
  }

  deleteFV() {
    this.notificationToast.showSuccess("Votre facture est supprimée")
    var fv = this.factureVenteSelected.filter( x => x.id === this.itemFVSelected)[0]
    this.allFacturesFournisseur.push(fv)
    this.factureVenteSelected = this.factureVenteSelected.filter( x => x.id !== this.itemFVSelected)
    this.closeModeleDeleteFV()
    this.changeMontantFinancier()
  }

  changeMontantFinancier(){
    var sommeHt = 0
    var sommeTTC = 0
 
    if(this.bonAchat.withTimbreFiscal){
      this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
    }else{
      this.bonAchat.timbreFiscale = 0
    }
    
    this.bonAchat.totalRemise = 0
    this.bonAchat.totalTTC = sommeTTC
    this.bonAchat.totalHT = sommeHt
    
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.montantPaye = 0
    this.bonAchat.restPayer = 0
  
    for(let item of this.factureVenteSelected){
      if(item.montantFinancie > item.montantTotal){
        item.montantFinancie = item.montantTotal
      } 
      sommeHt += item.montantFinancie
      sommeTTC += item.montantFinancie
    }

    this.bonAchat.totalRemise = 0
    this.bonAchat.totalTTC = sommeTTC
    this.bonAchat.totalHT = sommeHt
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.montantPaye = 0
    this.bonAchat.restPayer = 0
  }

  changeMontantFinancierMarchandisesFinancier(){
    var sommeHt = 0
    var sommeTTC = 0
 
    if(this.bonAchat.withTimbreFiscal){
      this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
    }else{
      this.bonAchat.timbreFiscale = 0
    }
    
    this.bonAchat.totalRemise = 0
    this.bonAchat.totalTTC = sommeTTC
    this.bonAchat.totalHT = sommeHt
    
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.montantPaye = 0
    this.bonAchat.restPayer = 0
  
    for(let item of this.factureVenteSelected){
      if(item.montantFinancie > item.montantTotal){
        item.montantFinancie = item.montantTotal
      } 
      sommeHt += item.montantFinancie
      sommeTTC += item.montantFinancie
    }

    this.bonAchat.totalRemise = 0
    this.bonAchat.totalTTC = sommeTTC
    this.bonAchat.totalHT = sommeHt
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.montantPaye = 0
    this.bonAchat.restPayer = 0
  }

  //end FactureVente

  //start FactureVente sur facture
  setFactureVenteIdSurFacture(idFV){
    this.bonAchat.factureVente = idFV
    this.calculTotalFactureAchat()
  }
  //end FactureVente sur facture

  shemaArticle: any = new ShemaArticleAchat()

  itemsShowsElements = {}
  itemsVariableShowsElements = {}

  itemsInput = [ "remiseAvoirPourcentage", "remiseAvoirMontant"]
  itemsNumber = [ "remiseAvoirTotal", "prixAchatHTReelAvoir", "prixAchatTTCReelAvoir", "prixDCAvoir", "prixFodecAvoir", "totalDCAvoir", "totalFodecAvoir"]
  

  initialiserVariablesOfShowsElements() {
    for (let key in this.shemaArticle) {
      this.itemsShowsElements[key] = this.shemaArticle[key]
    }
    this.itemsShowsElements['remiseAvoirPourcentage'] = "remiseAvoirPourcentage"
    this.itemsShowsElements['remiseAvoirMontant']= "remiseAvoirMontant"
    this.itemsShowsElements['remiseAvoirTotal']= "remiseAvoirTotal"
    this.itemsShowsElements['prixAchatHTReelAvoir'] = "prixAchatHTReelAvoir"
    this.itemsShowsElements['prixAchatTTCReelAvoir'] = "prixAchatTTCReelAvoir"
    this.itemsShowsElements['prixDCAvoir'] = "prixDCAvoir"
    this.itemsShowsElements['prixFodecAvoir'] = "prixFodecAvoir"
    this.itemsShowsElements['totalDCAvoir'] = "totalDCAvoir"
    this.itemsShowsElements['totalFodecAvoir'] = "totalFodecAvoir"
    this.itemsShowsElements['totalHTAvoir'] = "totalHTAvoir"
    this.itemsShowsElements['totalTVAAvoir'] = "totalTVAAvoir"
    this.itemsShowsElements['totalTTCAvoir'] = "totalTTCAvoir"
  
    this.itemsVariableShowsElements = JSON.parse(JSON.stringify(this.itemsShowsElements)) 
  }

  showArticlesbonReceptions(idBonCommande) {
    var ligne = document.getElementById("ligneWidth");
    var x = document.getElementById(idBonCommande);
    x.style.width = (ligne.clientWidth - 15)+"px"
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }

  // start marchandises-financiers
  itemFVMarchandisesFinancierSelected = ""
  erreuritemFVMarchandisesFinancierSelected = ""
  factureVenteMarchandisesFinancierSelected = []
  allFacturesMarchandisesFinancierFournisseur = []
  setFactureMarchandisesFinancierVenteId(idFV){
    this.itemFVMarchandisesFinancierSelected = idFV
  }
  
  ajouterFVMarchandisesFinancier(){
    if(this.allFacturesMarchandisesFinancierFournisseur.filter(x => x.id === this.itemFVMarchandisesFinancierSelected).length > 0 &&
    this.factureVenteMarchandisesFinancierSelected.filter(x => x.id === this.itemFVMarchandisesFinancierSelected).length === 0
    ){
      var factureVente = this.allFacturesMarchandisesFinancierFournisseur.filter(x => x.id === this.itemFVMarchandisesFinancierSelected)[0]
      factureVente.documentAchat = factureVente.id
      factureVente.totalTVAAvoir = 0
      factureVente.totalTTCAvoir = 0
      factureVente.totalHTAvoir = 0
      factureVente.totalDCAvoir = 0
      factureVente.totalFodecAvoir = 0
      factureVente.montantTotalAvoir = 0
   
      factureVente.articles.forEach(x => {
        x.remiseAvoirPourcentage = 0
        x.remiseAvoirMontant = 0
        x.remiseAvoirTotal = 0
        x.prixAchatHTReelAvoir = 0
        x.prixAchatTTCReelAvoir = 0
        x.prixDCAvoir = 0
        x.prixFodecAvoir = 0
        x.totalDCAvoir = 0
        x.totalFodecAvoir = 0
        x.totalHTAvoir = 0
        x.totalTVAAvoir = 0
        x.totalTTCAvoir = 0
      })

      this.factureVenteMarchandisesFinancierSelected.push(factureVente)
      this.allFacturesMarchandisesFinancierFournisseur = this.allFacturesMarchandisesFinancierFournisseur.filter(x => x.id !== this.itemFVMarchandisesFinancierSelected)
    }

    console.log("this.factureVenteSelected = ",this.factureVenteMarchandisesFinancierSelected)
  }

  openModalModiferFVMarchandisesFinancier(itemFVSelected){
    // this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonRetourFournisseur    
    this.isOpenModalAjoutFournisseur = true
    this.idAjoutFournisseurModal = itemFVSelected
  }

  isOpenModalDeleteFVMarchandisesFinancier = false
  

  openModalDeleteFVMarchandisesFinancier(numero, params2) {
    this.itemFVSelected = numero
    this.isOpenModalDeleteFV = true
    this.params1Delete = "Facture Vente"
    this.params2Delete = params2
  }

  closeModeleDeleteFVMarchandisesFinancier(){
    this.isOpenModalDeleteFV = false
  }

  deleteFVMarchandisesFinancier() {
    this.notificationToast.showSuccess("Votre facture est supprimée")
    var fv = this.factureVenteMarchandisesFinancierSelected.filter( x => x.id === this.itemFVMarchandisesFinancierSelected)[0]
    this.allFacturesMarchandisesFinancierFournisseur.push(fv)
    this.factureVenteMarchandisesFinancierSelected = this.factureVenteMarchandisesFinancierSelected.filter( x => x.id !== this.itemFVMarchandisesFinancierSelected)
    this.closeModeleDeleteFVMarchandisesFinancier()
    this.changeMontantFinancierMarchandisesFinancier()
  }
  // end marchandises-financiers
  
}
