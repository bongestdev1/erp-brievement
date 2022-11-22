import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpressionDocumentService } from 'src/app/services/impression-document.service';
import { Client } from 'src/app/model/modelComerce/client/client';
import { TokenStorageService } from 'src/app/services/authentication/token-storage.service';
import { GenerationPdfFactureService } from 'src/app/services/generation-pdf-facture.service';
import { FactureVenteService } from '../services/facture-vente.service';

@Component({
  selector: 'app-facture-vente',
  templateUrl: './facture-vente.component.html',
  styleUrls: ['./facture-vente.component.scss']
})
export class FactureVenteComponent implements OnInit {

  public isCollapsed: boolean;
  public isCollapsed2: boolean;
  public multiCollapsed1: boolean;
  public multiCollapsed2: boolean;

  bonLivraisonFormGroup: FormGroup;

  apiGetBonLivraison = "/factureVentes/getBonLivraisons"

  @Input() lienAjoute = "/factureVentes/newFactureVente"

  @Input() apiList = "/factureVentes/listFactureVentes"

  @Input() apiParametres = "/factureVentes/getAllParametres"

  @Input() lienModifie = "/factureVentes/modifierFactureVente/"

  @Input() lienGetById = "/factureVentes/getById/"

  @Input() lienGetByIdImpression = "/factureVentes/getByIdImpression/"

  
  @Input() titreDocument = this.fonctionPartagesService.titreDocuments.factureVente

  @Input() modeTiere = this.fonctionPartagesService.modeTiere.client

  @Input() titreCrud = this.fonctionPartagesService.titreCrud.ajouter

  @Input() pageList = "/factureVente/list"

  lienGetDocuments = "/factureVentes/getBonLivraisons/" 

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
  }

  bonLivraison = {
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
  }

  tabNumbers = ["totalDC", "montantEscompte", "tFiscale", "montantPaye", "restPaye", "totalRedevance", "totalFodec"]

  erreurBonLivraison = {
    client: "",
    date: "",
    totalHT: "",
  }

  uniteMesures = []

  bonLivraisons = []

  constructor(
    private notificationToast: ToastNotificationService,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    public informationGenerale: InformationsService,
    public fonctionPartagesService: FonctionPartagesService,
    private route: ActivatedRoute,
    private router: Router,
    private impressionDocument: ImpressionDocumentService,
    public generationPdfFacture : GenerationPdfFactureService,
    public ser:FactureVenteService) {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  clickImpression() {
    var client = null
    var clients = this.allClients.filter(x => x.id == this.bonLivraison.client)
    if (clients.length > 0) {
      client = clients[0]
    }
    //this.impressionDocument.generatePDF(this.titreDocument, this.bonLivraison, this.articles, client)
  }

  isPrixVenteNotPrixAchat() {
    if (this.titreDocument == this.fonctionPartagesService.titreDocuments.bonRetourClient || this.titreDocument == this.fonctionPartagesService.titreDocuments.devis || this.titreDocument == this.fonctionPartagesService.titreDocuments.bonLivraison || this.titreDocument == this.fonctionPartagesService.titreDocuments.commande) {
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
          this.allOrdreEmissions = resultat.ordreEmissions

          if (this.allClients.filter(x => x.id == this.bonLivraison.client).length > 0) {
            this.client = this.allClients.filter(x => x.id == this.bonLivraison.client)[0]
            this.getBonDocuments()
          }

          if (this.titreCrud == this.fonctionPartagesService.titreCrud.ajouter || this.titreCrud == this.fonctionPartagesService.titreCrud.transfert) {
            this.bonLivraison.numero = resultat.numeroAutomatique
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
      this.bonLivraison.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.getAllParametres()
    }else if (this.titreCrud == this.fonctionPartagesService.titreCrud.transfert){
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id.length > 1) {
        this.getBonLivraisons(this.id)
      }
    } else {
      this.id = this.route.snapshot.paramMap.get('id');
      if (this.id.length > 1) {
        this.getBonLivraison(this.id)
      }
    }

    this.bonLivraison.client = this.informationGenerale.clientCurrent
    
  }

  controleInputs() {
    for (let key in this.erreurBonLivraison) {
      this.erreurBonLivraison[key] = ""
    }

    var isValid = true
    if (this.bonLivraison['totalHT'] == 0) {
      this.erreurBonLivraison['totalHT'] = "Veuillez ajouter votres articles"
      isValid = false
    }

    if (this.bonLivraison['client'] == "") {
      this.erreurBonLivraison['client'] = "Veuillez remplir ce champ"
      isValid = false
    }

    if (this.bonLivraison['date'] == "") {
      this.erreurBonLivraison['date'] = "Veuillez ajouter votre date"
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

  getBonLivraison(id) {

    this.isLoading = true

    this.http.get(this.informationGenerale.baseUrl + this.lienGetById + id, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          //this.reseteFormulaire()
          
          this.request = response.resultat

          this.bonLivraisons = response.bonLivraisons
          
          for (let key in this.bonLivraison) {
            this.bonLivraison[key] = this.request[key]
          }
          this.bonLivraison.date = formatDate(new Date(this.bonLivraison.date), 'yyyy-MM-dd', 'en');
         
          this.renitialiserFacture()
          this.getAllParametres()

        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  getBonLivraisons(id) {

    var bonLivraisons = id.split("&&")


    this.isLoading = true

    var request = {bonLivraisons:bonLivraisons}

    this.http.post(this.informationGenerale.baseUrl + this.apiGetBonLivraison , request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let response: any = res
        if (response.status) {
          //this.reseteFormulaire()
          if(response.bonLivraisons.length > 0){
            this.bonLivraisons = response.bonLivraisons.filter(x => x.client === response.bonLivraisons[0].client)
            this.bonLivraison.client = response.bonLivraisons[0].client
          }
          
          this.bonLivraison.date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
       
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

  allBonLivraisons = []

  getBonDocuments() {
    if (this.isLoading) {
      return
    }

    this.allBonLivraisons = []
    this.isLoading = true
    this.http.get(this.informationGenerale.baseUrl + this.lienGetDocuments + this.client.id+ '/' + this.informationGenerale.idSocieteCurrent, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.allBonLivraisons = resultat.bonLivraisons
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
    var newBonLivraisons = []

    for(let i = 0; i < this.bonLivraisons.length; i++){
      var result = this.allBonLivraisons.filter(x => x.id === this.bonLivraisons[i].id )
      
      if(result.length > 0){
        newBonLivraisons.push(result[0])
      }else{
        newBonLivraisons.push(this.bonLivraisons[i])
      }

      this.allBonLivraisons = this.allBonLivraisons.filter(x => x.id !== this.bonLivraisons[i].id )
    }

    this.bonLivraisons = newBonLivraisons

    var keys = ["montantTotal", "montantEscompte", "restPayer", "montantPaye", "timbreFiscale", "totalDC", "totalFodec", "totalGainCommerciale", "totalHT", "totalTTC", "totalTVA", "totalRemise", "totalRedevance",  "totalGainReel", ]
    for(let key of keys){
      this.bonLivraison[key] = 0
    }

    var sommeTimbreFiscale = 0

    for(let item of this.bonLivraisons){
      sommeTimbreFiscale += item.timbreFiscale
      for(let key of keys){
        this.bonLivraison[key] += item[key]
      }
    }

    var resteTimberFiscale = sommeTimbreFiscale - Number(this.fonctionPartagesService.parametres.prixTimbreFiscale)
    if(resteTimberFiscale > 0){
      this.bonLivraison.timbreFiscale -= resteTimberFiscale
      this.bonLivraison.montantTotal -= resteTimberFiscale
      this.bonLivraison.restPayer = this.bonLivraison.montantTotal - this.bonLivraison.montantPaye
    }

    
  }

  isImpremableAfterValidation = false
  ajoutBonLivraison() {
    if (this.titreCrud == this.fonctionPartagesService.titreCrud.modifier) {
      this.modifierBonLivraison()
    } else if (this.titreCrud == this.fonctionPartagesService.titreCrud.transfert) {
        this.ajoutBonLivraison2()
    } else {
      this.ajoutBonLivraison2()
    }
  }

  ajoutBonLivraison2() {

    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    if (this.isLoading) {
      return
    }

    for (let key in this.bonLivraison) {
      this.request[key] = this.bonLivraison[key]
    }

    this.request.societe = this.informationGenerale.idSocieteCurrent
    this.request.exercice = this.informationGenerale.exerciceCurrent + ""

    let request: any = {}
    request = this.request
    var bonLivraisons = []
    this.bonLivraisons.forEach( x =>{
      bonLivraisons.push(x.id) 
    })

    request.bonLivraisons = bonLivraisons
    
    this.isLoading = true

    this.http.post(this.informationGenerale.baseUrl + this.lienAjoute, request, this.tokenStorageService.getHeader()).subscribe(

      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          //this.reseteFormulaire()
          this.notificationToast.showSuccess("Votre " + this.titreDocument + " est bien enregistrée !")
        
          if(this.isImpremableAfterValidation){
            this.isImpremableAfterValidation = false
            this.generationPdfFacture.openPopup(this.id, this.titreDocument)
          }else{
            this.router.navigate([this.pageList]);
          }
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


  modifierBonLivraison() {
    if (!this.controleInputs()) {
      this.notificationToast.showError("Veuillez remplir les champs obligatoires !")
      return
    }

    if (this.isLoading) {
      return
    }

    for (let key in this.bonLivraison) {
      this.request[key] = this.bonLivraison[key]
    }
    
    let request: any = {}
    request = this.request
    var bonLivraisons = []
    this.bonLivraisons.forEach( x =>{
      bonLivraisons.push(x.id) 
    })

    request.bonLivraisons = bonLivraisons
    
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
          if(this.isImpremableAfterValidation){
            this.isImpremableAfterValidation = false
            this.generationPdfFacture.openPopup(this.id, this.titreDocument)
          }else{
            this.router.navigate([this.pageList]);
          }
          this.request = resultat.resultat
        }else{
          this.router.navigate([this.pageList]);
          this.notificationToast.showError(this.fonctionPartagesService.getMessageBackend(resultat.message))
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  reseteFormulaire() {
    for (let key in this.erreurBonLivraison) {
      this.bonLivraison[key] = ""
    }
  }

  calculerRestePayer() {
    var montantPaye = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.bonLivraison.montantPaye))
    var totalTTC = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(this.bonLivraison.totalTTC))
    this.bonLivraison.restPayer = Number(this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(totalTTC - montantPaye))
  }

  //autocomplete client

  client: any = {}
  setClientID(id) {
    this.bonLivraison.client = id
    let client: any = this.allClients.filter(x => x.id == id)
    if (client.length == 0) {
      this.client = {}
      return
    }
    this.client = new Client()
    for (let key in this.client) {
      if (key != undefined) {
        this.client[key] = client[0][key]
      }
    }

    if (this.titreDocument == this.fonctionPartagesService.titreDocuments.bonLivraison || this.titreDocument == this.fonctionPartagesService.titreDocuments.commande) {
      this.verifierClient()
    }

    this.getBonDocuments()
    
    //this.bonLivraisonsClient(id)
  }
  //pour calculer le nombre des bons livraisons non payées par un id client 
  lienBonLivraisonsClient = "/bonLivraisons/bonLivraisonsClient/"
  nbLivsClientNonPayee = 0
  bonLivraisonsClient(idClient) {
    this.http.get(this.informationGenerale.baseUrl + this.lienBonLivraisonsClient + idClient, this.tokenStorageService.getHeader()).subscribe(
      res => {
        this.isLoading = false
        let resultat: any = res
        if (resultat.status) {
          this.nbLivsClientNonPayee = resultat.bonLivraisonsClient
        }
      }, err => {
        this.isLoading = false
        alert("Désole, ilya un problème de connexion internet")
      }
    );
  }

  closeModal(){
    this.getBonDocuments()
  }

  //open modal ajout Client
  isOpenModalAjoutClient = false
  idAjoutClientModal = ""
  typeElement
  closeModalAjoutClient() {
    this.isOpenModalAjoutClient = false
    this.getAllParametres()
  }

  openModalAjoutClient() {
    if (this.modeTiere == this.fonctionPartagesService.modeTiere.client) {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterClient
    } else {
      this.typeElement = this.fonctionPartagesService.titreOfModal.ajouterFournisseur
    }

    this.isOpenModalAjoutClient = true
  }



  //start inserer Client ou fournisseur avant le selectionner article
  verifierClient() {
    var isValide = true
    if (this.client.plafondCredit < this.client.credit) {
      isValide = false
      this.openBlockerClientCredit()
    }

    if (this.client.plafondEnCours < this.client.reglementEnCoursActual) {
      isValide = false
      this.openBlockerClientEnCours()
    }

    if (this.client.plafondRisque < this.client.reglementRisqueActual) {
      isValide = false
      //risque = credit + encours(cheque non payee)
      this.openBlockerClientRisque()
    }

    if (this.client.nbFactureNonPaye < this.client.nbFactureNonPayeActual) {
      isValide = false
      this.openBlockerClientNbrFNonSoldee()
    }

    if (isValide == false) {
      this.client = {}
      this.bonLivraison.client = ""
    }

  }

  isOpenModalBlockerClient = false
  messageBlockerClient = ""
  closeBlockerClient() {
    this.isOpenModalBlockerClient = false
  }

  openBlockerClientCredit() {
    this.isOpenModalBlockerClient = true
    this.messageBlockerClient = "Le crédit de ce client passe le plafond !!"
  }

  openBlockerClientEnCours() {
    this.isOpenModalBlockerClient = true
    this.messageBlockerClient = "Le reglement en cours de ce client passe le plafond !!"
  }

  openBlockerClientRisque() {
    this.isOpenModalBlockerClient = true
    this.messageBlockerClient = "Le risque de ce client passe le plafond !!"
  }

  openBlockerClientNbrFNonSoldee() {
    this.isOpenModalBlockerClient = true
    this.messageBlockerClient = "Le nombre de bon de livraison non soldée de ce client passe le plafond !!"
  }
  //end inserer Client ou fournisseur avant le selectionner article

  idDocument
  isOpenModalLisBonLivraison = false

  setDocumentID(id) {
    if (id && id.length > 0) {
      this.idDocument = id
    }
  }

  openModalAjoutDocument() {
    this.isOpenModalLisBonLivraison = !this.isOpenModalLisBonLivraison
  }
  closePopupBonLivraisons(){
    this.isOpenModalLisBonLivraison = false
  }

  addBonLivraison(id){
    var bonLivraison = this.allBonLivraisons.filter( x => x.id === id )
    if(bonLivraison.length > 0 && this.bonLivraisons.filter( x => x.id === id ).length === 0){
      this.bonLivraisons.push(JSON.parse(JSON.stringify(bonLivraison[0])))
    }

    this.allBonLivraisons = this.allBonLivraisons.filter( x => x.id !== id )

    this.renitialiserFacture()
  }

  removeBonLivraison(id){
    if(this.bonLivraisons.filter( x => x.id === id ).length > 0 && this.allBonLivraisons.filter( x => x.id === id ).length === 0){
      this.allBonLivraisons.push(this.bonLivraisons.filter( x => x.id === id )[0])
    }

    this.bonLivraisons = this.bonLivraisons.filter( x => x.id != id )
    this.renitialiserFacture()
  }

}