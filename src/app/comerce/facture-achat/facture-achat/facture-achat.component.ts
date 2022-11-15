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

@Component({
  selector: 'app-facture-achat',
  templateUrl: './facture-achat.component.html',
  styleUrls: ['./facture-achat.component.scss']
})
export class FactureAchatComponent implements OnInit {

  public isCollapsed: boolean;
  public isCollapsed2: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonAchatFormGroup: FormGroup;

  @Input() lienupload = "/bonLivraisons/upload"

  apiGetBonReception = "/factureAchats/getBonReceptions"

  @Input() lienAjoute = "/factureAchats/newFactureAchat"

  @Input() apiList = "/factureAchats/listFactureAchats"

  @Input() apiParametres = "/factureAchats/getAllParametres"

  @Input() lienModifie = "/factureAchats/modifierFactureAchat/"

  @Input() lienGetById = "/factureAchats/getById/"

  @Input() titreDocument = this.fonctionPartagesService.titreDocuments.factureAchat

  @Input() modeTiere = this.fonctionPartagesService.modeTiere.fournisseur

  @Input() titreCrud = this.fonctionPartagesService.titreCrud.ajouter

  @Input() pageList = "/factureAchat/list"

  lienGetDocuments = "/factureAchats/getBonReceptions/"

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

    numeroFactureVenteFournisseur:"",
    dateFactureVenteFournisseur:"",
    captureFactureVenteFournisseur:"",

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

    numeroFactureVenteFournisseur:"",
    dateFactureVenteFournisseur:"",
    captureFactureVenteFournisseur:"",

  }

  tabNumbers = ["totalDC", "montantEscompte", "tFiscale", "montantPaye", "restPaye", "totalRedevance", "totalFodec"]

  erreurBonAchat = {
    fournisseur: "",
    date: "",
    totalHT: "",
  }

  uniteMesures = []

  bonReceptions = []


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
          console.log(resultat);

          this.allFournisseurs = resultat.fournisseurs
          this.allOrdreEmissions = resultat.ordreEmissions
          if (this.allFournisseurs.filter(x => x.id == this.bonAchat.fournisseur).length > 0) {
            this.fournisseur = this.allFournisseurs.filter(x => x.id == this.bonAchat.fournisseur)[0]
            this.getBonDocuments()
          }

          if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter || this.titreCrud == this.fonctionPartagesService.titreCrud.transfert) {
            this.bonAchat.numero = resultat.numeroAutomatique
          }

          this.uniteMesures = resultat.uniteMesures

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
    this.titreCrud = this.fonctionPartagesService.getTitreCrudOfUrl(this.router.url);
    this.isCollapsed = true;
    this.isCollapsed2 = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter) {
      this.bonAchat.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.bonAchat.dateFactureVenteFournisseur = formatDate(new Date(), 'yyyy-MM-dd', 'en');
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
      this.erreurBonAchat['totalHT'] = "Veuillez ajouter votres articles"
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

          this.bonReceptions = response.bonReceptions

          for (let key in this.bonAchat) {
            this.bonAchat[key] = this.request[key]
          }
          this.bonAchat.date = formatDate(new Date(this.bonAchat.date), 'yyyy-MM-dd', 'en');
          this.bonAchat.dateFactureVenteFournisseur = formatDate(new Date(this.bonAchat.dateFactureVenteFournisseur), 'yyyy-MM-dd', 'en');
         
          this.renitialiserFacture()
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
          this.bonAchat.dateFactureVenteFournisseur = formatDate(new Date(), 'yyyy-MM-dd', 'en');
         

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

  getBonDocuments() {
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments + this.fournisseur.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allBonReceptions = resultat.bonReceptions
          this.renitialiserFacture()
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }
  
  renitialiserFacture(){

    var newBonReceptions = []

    for(let i = 0; i < this.bonReceptions.length; i++){
      var result = this.allBonReceptions.filter(x => x.id === this.bonReceptions[i].id )

      if(result.length > 0){
        newBonReceptions.push(result[0])
      }else{
        newBonReceptions.push(this.bonReceptions[i])
      }

      this.allBonReceptions = this.allBonReceptions.filter(x => x.id !== this.bonReceptions[i].id )
    }

    this.bonReceptions = newBonReceptions

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
    
    if (societe.exemptTimbreFiscale == "non" ) {
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
         this.bonAchat.captureFactureVenteFournisseur = res[0]

         console.log(this.bonAchat)

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
    var bonReceptions = []
    this.bonReceptions.forEach( x =>{
      bonReceptions.push(x.id)
    })

    request.bonReceptions = this.bonReceptions

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
    var bonReceptions = []
    this.bonReceptions.forEach( x =>{
      bonReceptions.push(x.id)
    })

    request.bonReceptions = this.bonReceptions

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
          this.router.navigate([this.pageList]);
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

    if (this.titreDocument == this.fonctionPartagesService.titreDocuments.bonAchat || this.titreDocument == this.fonctionPartagesService.titreDocuments.commande) {
      this.verifierFournisseur()
    }

    this.getBonDocuments()
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



  //start inserer Fournisseur ou fournisseur avant le selectionner article
  verifierFournisseur() {
    var isValide = true
    if (this.fournisseur.plafondCredit < this.fournisseur.credit) {
      isValide = false
      this.openBlockerFournisseurCredit()
    }

    if (this.fournisseur.plafondEnCours < this.fournisseur.reglementEnCoursActual) {
      isValide = false
      this.openBlockerFournisseurEnCours()
    }

    if (this.fournisseur.plafondRisque < this.fournisseur.reglementRisqueActual) {
      isValide = false
      //risque = credit + encours(cheque non payee)
      this.openBlockerFournisseurRisque()
    }

    if (this.fournisseur.nbFactureNonPaye < this.fournisseur.nbFactureNonPayeActual) {
      isValide = false
      this.openBlockerFournisseurNbrFNonSoldee()
    }

    if (isValide == false) {
      this.fournisseur = {}
      this.bonAchat.fournisseur = ""
    }

  }

  isOpenModalBlockerFournisseur = false
  messageBlockerFournisseur = ""
  closeBlockerFournisseur() {
    this.isOpenModalBlockerFournisseur = false
  }

  openBlockerFournisseurCredit() {
    this.isOpenModalBlockerFournisseur = true
    this.messageBlockerFournisseur = "Le crédit de ce Fournisseur passe le plafond !!"
  }

  openBlockerFournisseurEnCours() {
    this.isOpenModalBlockerFournisseur = true
    this.messageBlockerFournisseur = "Le reglement en cours de ce Fournisseur passe le plafond !!"
  }

  openBlockerFournisseurRisque() {
    this.isOpenModalBlockerFournisseur = true
    this.messageBlockerFournisseur = "Le risque de ce Fournisseur passe le plafond !!"
  }

  openBlockerFournisseurNbrFNonSoldee() {
    this.isOpenModalBlockerFournisseur = true
    this.messageBlockerFournisseur = "Le nombre de bon de Achat non soldée de ce Fournisseur passe le plafond !!"
  }
  //end inserer Fournisseur ou fournisseur avant le selectionner article


  imageData: string;
  captureFournisseur = null

  onFileSelect(event: Event) {
    this.captureFournisseur = (event.target as HTMLInputElement).files[0];
    if (this.captureFournisseur) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };

      console.log(this.imageData)
      reader.readAsDataURL(this.captureFournisseur);
    }
  }

  saveFileFacture(){
    this.http.get(this.informationGenerale.baseUrl+'/'+this.bonAchat.captureFactureVenteFournisseur, {responseType: "blob", headers: {'Accept': 'application/pdf'}})
    .subscribe(blob => {
      console.log(blob)
      saveAs(blob, this.bonAchat.captureFactureVenteFournisseur );
    });
  }

  replacePath(chaine){
    console.log(chaine)
    console.log(chaine.replace('\\','_'))
    return chaine.replace('\\','_')
  }


  addBonReception(id){
    var bonReception = this.allBonReceptions.filter( x => x.id === id )
    if(bonReception.length > 0 && this.bonReceptions.filter( x => x.id === id ).length === 0){
      this.bonReceptions.push(JSON.parse(JSON.stringify(bonReception[0])))
    }

    this.allBonReceptions = this.allBonReceptions.filter( x => x.id !== id )

    this.renitialiserFacture()
  }

  removeBonReception(id){
    if(this.bonReceptions.filter( x => x.id === id ).length > 0 && this.allBonReceptions.filter( x => x.id === id ).length === 0){
      this.allBonReceptions.push(this.bonReceptions.filter( x => x.id === id )[0])
    }

    this.bonReceptions = this.bonReceptions.filter( x => x.id != id )
    this.renitialiserFacture()
  }

  calculTotalFactureAchat(){
    var sommeHtTotal = 0
    var sommeTTCTotal = 0
    var sommeRemiseTotal = 0
    var totalRemise = 0
    for(let i = 0; i < this.bonReceptions.length; i++){
      var sommeHt = 0
      var sommeTTC = 0
      var sommeRemiseFacture = 0
      for(let j = 0; j < this.bonReceptions[i].articles.length; j++){
        if(!this.bonReceptions[i].articles[j].remiseFactureMontant){
          this.bonReceptions[i].articles[j].remiseFactureMontant = 0
        }

        if(!this.bonReceptions[i].articles[j].remiseFacturePourcentage){
          this.bonReceptions[i].articles[j].remiseFacturePourcentage = 0
        }

        this.bonReceptions[i].articles[j].remiseFactureTotal = this.bonReceptions[i].articles[j].prixAchatHTReel * this.bonReceptions[i].articles[j].remiseFacturePourcentage /100 + this.bonReceptions[i].articles[j].remiseFactureMontant
        this.bonReceptions[i].articles[j].prixAchatHTReelFacture = this.bonReceptions[i].articles[j].prixAchatHTReel - this.bonReceptions[i].articles[j].remiseFactureTotal
        this.bonReceptions[i].articles[j].TotalHTFacture = this.bonReceptions[i].articles[j].prixAchatHTReelFacture * this.bonReceptions[i].articles[j].quantiteAchat
        this.bonReceptions[i].articles[j].prixAchatTTCReelFacture = this.bonReceptions[i].articles[j].prixAchatHTReelFacture + this.bonReceptions[i].articles[j].prixAchatHTReelFacture * this.bonReceptions[i].articles[j].tauxTVA / 100 + this.bonReceptions[i].articles[j].redevance
        this.bonReceptions[i].articles[j].TotalTTCFacture = this.bonReceptions[i].articles[j].prixAchatTTCReelFacture * this.bonReceptions[i].articles[j].quantiteAchat
        sommeHt += this.bonReceptions[i].articles[j].TotalHTFacture
        sommeTTC += this.bonReceptions[i].articles[j].TotalTTCFacture
        sommeRemiseFacture += this.bonReceptions[i].articles[j].remiseFactureTotal
      }
      this.bonReceptions[i].totalTTCFacture = sommeTTC
      this.bonReceptions[i].totalHTFacture = sommeHt
      this.bonReceptions[i].totalRemiseFacture = sommeRemiseFacture
      totalRemise += this.bonReceptions[i].totalRemise
      sommeHtTotal += this.bonReceptions[i].totalTTCFacture
      sommeTTCTotal += this.bonReceptions[i].totalHTFacture
      sommeRemiseTotal += this.bonReceptions[i].totalRemiseFacture
    }
    // this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
    this.bonAchat.totalRemise = totalRemise
    this.bonAchat.totalTTC = sommeHtTotal
    this.bonAchat.totalHT = sommeTTCTotal
    this.bonAchat.totalRemiseFacture = sommeRemiseTotal
    this.bonAchat.montantTotal = this.bonAchat.timbreFiscale + this.bonAchat.totalTTC
    this.bonAchat.restPayer = this.bonAchat.montantTotal - this.bonAchat.montantPaye
  }

  closeModal(){
    this.getBonDocuments()
  }
}
