import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpressionDocumentService } from 'src/app/services/impression-document.service';
import { Client } from 'src/app/model/modelComerce/Client/Client';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import {saveAs} from 'file-saver';
import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';

@Component({
  selector: 'app-facture-avoir',
  templateUrl: './facture-avoir.component.html',
  styleUrls: ['./facture-avoir.component.scss']
})
export class FactureAvoirComponent implements OnInit {

 
  public isCollapsed: boolean;
  public isCollapsed2: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonAchatFormGroup: FormGroup;

  @Input() lienupload = "/bonLivraisons/upload"

  apiGetBonReception = "/factureAvoirs/getBonReceptions"

  @Input() lienAjoute = "/factureAvoirs/newFactureAvoir"


  @Input() apiParametres = "/factureAvoirs/getAllParametres"

  @Input() lienModifie = "/factureAvoirs/modifierFactureAvoir/"

  @Input() lienGetById = "/factureAvoirs/getById/"

  @Input() titreDocument = this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises

  @Input() modeTiere = this.fonctionPartagesService.modeTiere.client

  @Input() titreCrud = this.fonctionPartagesService.titreCrud.ajouter

  @Input() pageList = "/factureAvoir/list"

  lienGetDocuments1 = "/factureAvoirs/getBonRetourClients/"
  lienGetDocuments2 = "/factureAvoirs/getFacturesClient/"
  lienGetDocuments3 = "/factureAvoirs/getFacturesClientSansDejaAvoir/"

  allBonReceptions = []

  modeTransfert = false

  id = ""

  allClients = []


  objectKeys = Object.keys;

  request = {
    numero: "",
    date: "",
    client: "",

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

    numeroFactureVenteClient:"",
    dateFactureVenteClient:"",
    captureFactureVenteClient:"",

    bonRetourClients:[],
    factureVentes:[],
    factureVente:""

  }

  bonAchat = {
    numero: "",
    date: "",
    client: "",

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

    numeroFactureVenteClient:"",
    dateFactureVenteClient:"",
    captureFactureVenteClient:"",

    bonRetourClients:[],
    factureVentes:[],
    factureVente:""
  }

  tabNumbers = ["totalDC", "montantEscompte", "tFiscale", "montantPaye", "restPaye", "totalRedevance", "totalFodec"]

  erreurBonAchat = {
    client: "",
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
    // var client = null
    // var clients = this.allClients.filter(x => x.id == this.bonAchat.client)
    // if (clients.length > 0) {
    //   client = clients[0]
    // }
    //this.impressionDocument.generatePDF(this.titreDocument, this.bonAchat, this.articles, client)

    console.log('hello');

  }

  isPrixVenteNotPrixAchat() {
    if (this.titreDocument == this.fonctionPartagesService.titreDocuments.bonRetourClient || this.titreDocument == this.fonctionPartagesService.titreDocuments.devis || this.titreDocument == this.fonctionPartagesService.titreDocuments.bonAchat || this.titreDocument == this.fonctionPartagesService.titreDocuments.commande) {
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
          this.allClients = resultat.clients
          if (this.allClients.filter(x => x.id == this.bonAchat.client).length > 0) {
            this.client = this.allClients.filter(x => x.id == this.bonAchat.client)[0]
            this.getBonDocuments()
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
    this.titreCrud = this.fonctionPartagesService.getTitreCrudOfUrl(this.router.url);
    this.isCollapsed = true;
    this.isCollapsed2 = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
    if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter) {
      this.bonAchat.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.bonAchat.dateFactureVenteClient = formatDate(new Date(), 'yyyy-MM-dd', 'en');
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

    if (this.bonAchat['client'] == "") {
      this.erreurBonAchat['client'] = "Veuillez remplir ce champ"
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
          this.bonRetourSelected = response.bonRetourClients

          this.titreDocument = this.request.typeAvoir
          for (let key in this.bonAchat) {
            this.bonAchat[key] = this.request[key]
          }

          this.bonAchat.date = formatDate(new Date(this.bonAchat.date), 'yyyy-MM-dd', 'en');
          this.calculTotalFactureAchat()
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
            this.bonReceptions = response.bonReceptions.filter(x => x.client === response.bonReceptions[0].client)
            this.bonAchat.client = response.bonReceptions[0].client
          }

          this.bonAchat.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          this.bonAchat.dateFactureVenteClient = formatDate(new Date(), 'yyyy-MM-dd', 'en');
         
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
    
    if(this.client){
      this.getBonDocuments()
    }
  }

  getBonDocuments(){
      this.request.typeAvoir = this.bonAchat.typeAvoir
      if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises){
        this.getBonDocumentsBonRetourClients()
      }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirSurFacture){
        this.getBonDocumentsFacturesClient()
      }else{
        this.getBonDocumentsFacturesClientSansDejaTransformerAvoirSurFac()
      }
  }

  allBonRetourClients = []

  getBonDocumentsBonRetourClients() {
    
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments1 + this.client.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allBonRetourClients = resultat.bonRetourClients
          this.renitialiserFacture()
           
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments()
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  allFacturesClient = []

  getBonDocumentsFacturesClientSansDejaTransformerAvoirSurFac() {
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments3 + this.client.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFacturesClient = resultat.factureVentes
          this.renitialiserFacture()
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments()
          }
        }
      }, err => {
        this.isLoading = false
        console.log(err)
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  getBonDocumentsFacturesClient() {
    if (this.isLoading) {
      return
    }

    this.allBonReceptions = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments2 + this.client.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        console.log(res)
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allFacturesClient = resultat.factureVentes
          this.renitialiserFacture()
          if(this.bonAchat.typeAvoir !== this.request.typeAvoir){
            this.getBonDocuments()
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
    if (this.captureClient) {
      request.append("myFiles", this.captureClient, this.captureClient.filename);
    }

    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienupload, request, this.tokenStorageService.getHeader()).subscribe(

      res => {
         this.isLoading = false
         this.bonAchat.captureFactureVenteClient = res[0]

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
    var bonRetourClients = []
    this.bonRetourSelected.forEach( x =>{
      bonRetourClients.push(x.id)
    })

    request.bonRetourClients = bonRetourClients

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
    
    var bonRetourClients = []
    this.bonRetourSelected.forEach( x =>{
      bonRetourClients.push(x.id)
    })

    request.bonRetourClients = bonRetourClients

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

  //autocomplete client

  client: any = {}
  setClientID(id) {
    this.bonAchat.client = id
    let client: any = this.allClients.filter(x => x.id == id)
    if (client.length == 0) {
      this.client = {}
      return
    }

    this.client = JSON.parse(JSON.stringify(client[0]))

    this.getBonDocuments()
  }
  //pour calculer le nombre des bons Achats non payées par un id Client
  lienBonAchatsClient = "/bonAchats/bonAchatsClient/"
  nbLivsClientNonPayee = 0
  bonAchatsClient(idClient) {
    this.http.get(this.informationGenerale.baseUrl + this.lienBonAchatsClient + idClient, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.nbLivsClientNonPayee = resultat.bonAchatsClient
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  //open modal ajout Client
  isOpenModalAjoutClient = false
  idAjoutClientModal = ""
  typeElement
  closeModalAjoutClient() {
    this.isOpenModalAjoutClient = false
    this.typeElement = ""
    this.getAllParametres()
  }

  openModalAjoutClient() {
    if (this.modeTiere == this.fonctionPartagesService.modeTiere.client) {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterClient
    } else {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterClient
    }

    this.isOpenModalAjoutClient = true
  }


  isOpenModalBlockerClient = false
  messageBlockerClient = ""
  closeBlockerClient() {
    this.isOpenModalBlockerClient = false
  }

  imageData: string;
  captureClient = null

  onFileSelect(event: Event) {
    this.captureClient = (event.target as HTMLInputElement).files[0];
    if (this.captureClient) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };

      console.log(this.imageData)
      reader.readAsDataURL(this.captureClient);
    }
  }

  saveFileFacture(){
    this.http.get(this.informationGenerale.baseUrl+'/'+this.bonAchat.captureFactureVenteClient, {responseType: "blob", headers: {'Accept': 'application/pdf'}})
    .subscribe(blob => {
      console.log(blob)
      saveAs(blob, this.bonAchat.captureFactureVenteClient );
    });
  }

  replacePath(chaine){
    console.log(chaine)
    console.log(chaine.replace('\\','_'))
    return chaine.replace('\\','_')
  }

  calculTotalFactureAchat(){
    console.log(this.titreDocument)
    if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirMarchandises){
      this.calculTotalFactureBonRetourClient()
    }else if(this.titreDocument === this.fonctionPartagesService.titreDocuments.factureAvoirSurFacture){
      this.calculTotalFactureAvoirSurFacture()
    }else{
      this.calculTotalFactureAvoirSurFacture()
    } 
  }

  calculTotalFactureAvoirSurFacture(){
    console.log(this.allFacturesClient)
    console.log(this.bonAchat.factureVente)

    if(this.allFacturesClient.filter(x => x.id === this.bonAchat.factureVente).length > 0){
      var fv = this.allFacturesClient.filter(x => x.id === this.bonAchat.factureVente)[0]
      this.bonAchat.totalRemise = fv.totalRemise
      this.bonAchat.totalTTC = fv.totalTTC
      this.bonAchat.totalHT = fv.totalHT
      this.bonAchat.montantTotal = fv.montantTotal
      this.bonAchat.montantPaye = fv.montantPaye
      this.bonAchat.restPayer = fv.restPayer
    }
  }

  calculTotalFactureBonRetourClient(){
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
    this.getBonDocuments()
  }

  // start BonRetourClient
  itemBRSelected = ""
  erreuritemBRSelected = ""
  bonRetourSelected = []
  setBonRetourId(idBonRetour){
    this.itemBRSelected = idBonRetour
  }
  
  ajouterBonRetourClient(){
    if(this.allBonRetourClients.filter(x => x.id === this.itemBRSelected).length > 0 &&
    this.bonRetourSelected.filter(x => x.id === this.itemBRSelected).length === 0
    ){
      this.bonRetourSelected.push(this.allBonRetourClients.filter(x => x.id === this.itemBRSelected)[0])
      this.allBonRetourClients = this.allBonRetourClients.filter(x => x.id !== this.itemBRSelected)
    }
    this.calculTotalFactureAchat()
  }

  openModalModiferBR(idBonRetourClient){
    this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonRetourClient    
    this.isOpenModalAjoutClient = true
    this.idAjoutClientModal = idBonRetourClient
  }

  isOpenModalDelete = false
  params1Delete = ""
  params2Delete = ""

  openModalDelete(numero, params2) {
    this.itemBRSelected = numero
    this.isOpenModalDelete = true
    this.params1Delete = "Bon Retour Client"
    this.params2Delete = params2
  }

  deleteBonRetourClient() {
    this.notificationToast.showSuccess("Votre bon retour client est supprimée")
    var bonRetourClient = this.bonRetourSelected.filter( x => x.id === this.itemBRSelected)[0]
    this.allBonRetourClients.push(bonRetourClient)
    this.bonRetourSelected = this.bonRetourSelected.filter( x => x.id !== this.itemBRSelected)
    this.closeModalDelete()
    this.calculTotalFactureAchat()
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }
  //end BonretourClient

  // start FactureVente
  itemFVSelected = ""
  erreuritemFVSelected = ""
  factureVenteSelected = []
  setFactureVenteId(idFV){
    this.itemFVSelected = idFV
  }
  
  ajouterFV(){
    if(this.allFacturesClient.filter(x => x.id === this.itemFVSelected).length > 0 &&
    this.factureVenteSelected.filter(x => x.id === this.itemFVSelected).length === 0
    ){
      var factureVente = this.allFacturesClient.filter(x => x.id === this.itemFVSelected)[0]
      factureVente.montantFinancie = 0
      this.factureVenteSelected.push(factureVente)
      this.allFacturesClient = this.allFacturesClient.filter(x => x.id !== this.itemFVSelected)
    }
  }

  openModalModiferFV(itemFVSelected){
    this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonRetourClient    
    this.isOpenModalAjoutClient = true
    this.idAjoutClientModal = itemFVSelected
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
    this.allFacturesClient.push(fv)
    this.factureVenteSelected = this.factureVenteSelected.filter( x => x.id !== this.itemFVSelected)
    this.closeModeleDeleteFV()
    this.changeMontantFinancier()
  }

  changeMontantFinancier(){
    var sommeHt = 0
    var sommeTTC = 0
 
    // this.bonAchat.timbreFiscale = this.fonctionPartagesService.parametres.prixTimbreFiscale
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
  
}
