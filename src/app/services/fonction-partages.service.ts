import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { InformationsService } from './informations.service';
import { TokenStorageService } from './authentication/token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
const PARAMETRES_KEY = 'PARAMETRES_KEY';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FonctionPartagesService {

  private idAutocomplite: BehaviorSubject<string>;

  getSomme(list, key) {
    var somme = 0
    for (let i = 0; i < list.length; i++) {
      if (!isNaN(list[i][key])) {
        somme += Number(list[i][key])
      }
    }
    return somme
  }

  isValidObjectId(id){
    var regex = new RegExp(/^[a-f\d]{24}$/i);
    return regex.test(id)
  }


  strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}
  nombresAvecEspaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  getModalDocument(document){

    switch(document){

      case this.titreDocuments.devis:
         return this.titreOfModal.ajoutDevis
      break;
      case this.titreDocuments.commande:
         return this.titreOfModal.ajoutCommande
      break;
      case this.titreDocuments.bonLivraison:
         return this.titreOfModal.ajoutBonLivraison
      break;
      case this.titreDocuments.devisAchat:
         return this.titreOfModal.ajoutDevisAchat
      break;
      case this.titreDocuments.bonCommande:
         return this.titreOfModal.ajoutBonCommande
      break;
      case this.titreDocuments.bonReception:
         return this.titreOfModal.ajoutBonReception
      break;

    }

    return ""

  }

  organiserArticlesSelonNumero(articles) {
    var articlesOrdonnees = []
    for (let i = 0; i < articles.length; i++) {
      articlesOrdonnees.push(articles.filter(x => x.numero == (i + 1))[0])
    }
    return articlesOrdonnees
  }

  getValue(): Observable<string> {
    return this.idAutocomplite.asObservable();
  }

  setValue(newValue): void {
    this.idAutocomplite.next(newValue);
  }

  addBordureRed(key) {
    if (document.getElementById(key) != null) {
      document.getElementById(key).classList.add("border-erreur")
    }
  }

  removeBordureRed(key) {
    if (document.getElementById(key) != null) {
      document.getElementById(key).classList.remove("border-erreur")
    }
  }

  constructor(
    private http: HttpClient,
    public informationGenerale: InformationsService,
    private tokenStorageService: TokenStorageService) {

    this.tokenStorageService.getUser()
    this.idAutocomplite = new BehaviorSubject<string>("");
    this.getParamatresFromLocalStorage()
  }

  lienGet = "/parametres/getConfiguration"

  openPopupLoadingGlobal(){
    this.informationGenerale.openPopupLoadingGlobal()
  }

  closePopupLoadingGlobal(){
    this.informationGenerale.closePopupLoadingGlobal()
  }

  getConfiguration() {
    if(this.informationGenerale.isLoadingGlobal){
      return
    }

    if (!this.tokenStorageService.isConnected()) {
      return
    }

    if(!this.informationGenerale.idSocieteCurrent || this.informationGenerale.idSocieteCurrent === ""){
       return
    }

    this.informationGenerale.openPopupLoadingGlobal()

    let request = {
      societe: this.informationGenerale.idSocieteCurrent,
      idUserCurrent: this.tokenStorageService.getUser()?.id
    }

    this.http.post(this.informationGenerale.baseUrl + this.lienGet, request, this.tokenStorageService.getHeader()).subscribe(
      res => {
        let resultat: any = res

        this.informationGenerale.closePopupLoadingGlobal()


        if (resultat.status) {
          if(resultat.resultat && resultat.resultat.logo){
            this.setParametres(resultat.resultat)
            this.tokenStorageService.saveUser(resultat.user)
          }
        }
      }, err => {
        this.informationGenerale.closePopupLoadingGlobal()
        alert("Désole, ilya un problème de connexion internet")
      }
    );

  }

  setParametres(parametres) {
    localStorage.removeItem(PARAMETRES_KEY);
    localStorage.setItem(PARAMETRES_KEY, JSON.stringify(parametres));
    this.parametres = parametres
  }

  public getParamatresFromLocalStorage(): any {
    try{
      var paramatres = localStorage.getItem(PARAMETRES_KEY);

      if (paramatres) {
        this.parametres = JSON.parse(paramatres);
      } else {
        this.parametres = this.parametresParDefaut
      }

    }catch(e){
      return this.parametresParDefaut
    }
  }

  parametresParDefaut = {
    nombreChiffresApresVerguleNormale: 3,
    nombreChiffresApresVerguleQuantite: 3,
    prixTimbreFiscale: 0.6,
    tauxFodec: 1,
    coefficientRetenueImpot: 1.5,
    clientPardefault: "",
    modeReglementPardefault: "",
    uniteMesurePardefault: "",
    validationUpdatePrixAchatFromBonAchat: "non",
    societeTransport:"",
    validationTimbreFiscaleBonRec: "oui",
    validationTimbreFiscaleBonLiv: "oui",
    validationTimbreFiscaleAvoirSurFacture:true,
   
    logo: "",
    paramatresImportationArticle: "{}",

  }

  parametres = this.parametresParDefaut

  colonnesQuantites = ["qteSortie","qteEntree","qteInitial", "quantiteAccepter", "quantite", "qteStock", "quantiteVente", "quantiteAchat", "qteAncienne", "qteDifference", "qteNouvelle", "quantiteMax", "quantiteMin", "qteEnStock", "qteTheorique"]

  colonnesPrix = ["qteCorrectionStock","qteCasse","qteSortie","qteEntree","qteInitial","PUTTC","PTTC","margeVar","montantNonLettre","montantLettre","soldeInitialDebit", "soldeInitialCredit", "sPeriodeD",'sPeriodeC', 'sFinaleD',"sFinaleC","soldeInitiale", "soldeDeLaPeriode", "soldeFinale","fodec","droitConsomation","droitTimbre","totalRemise","totalNetHT","chiffreAffaire","soldeGlobal","soldeImpaye","soldeEnCours","sdebit","scredit","enCours","impaye", "marge", "charge", "retrait", "caisse", "debit", "fondCaisseOuvrier", "totalCaisse", "montantDifference", "fondCaisseAdmin", "TotalTTCFacture", "TotalHTFacture", "prixAchatTTCReelFacture", "prixAchatHTReelFacture", "totalRemiseFacture","totalHTFacture","totalTTCFacture", "remiseFactureMontant", "remiseFactureTotal", "prixAchatTTC", "prixAchatHT", "montantFodec", "prixFApresRemise", "montantAfterMultiply", "montantNbj", "montantAPayer", "restPayer", "montantPaye", "montantTotal", "totalReglement", "totalVente", "budjet", "valeurVenteTTC", "valeurVenteHT", "valeurRevientTTC", "valeurRevientHT", "valeurAchatTTC", "valeurAchatHT", "prixRevient", "prixVenteHTReel", "remiseParMontant", "montantRemise", "prixDC", "prixFodec", "totalRedevance", "totalGainReel", "totalGainCommerciale", "prixAchatHTReel", "montant", "reste", "impactPrix", "impactPoids", "budget", "trajet", "totalGain", "totalTTC", "tFiscale", "totalTVA", "totalHT", "totalRemise", "prixVenteHT", "valeurRetiree", "taux", "prixFourn", "remiseF", "marge", "prixVenteHT", "montantTVA", "prixAchat", "prixAchatTTC", "valeurStock", "prixTTC", "plafondRemise", "pVenteConseille", "redevance", "longueur", "largeur", "hauteur", "surface", "volume", "poids", "coefficient", "prixVenteHT2", "prixVenteHT3", "seuilAlerteQTS", "seuilRearpQTS", "plafondCredit", "solde", "credit", "remiseParMontant2"]

  colonnesDates = ["dateFactureVenteFournisseur", "dateBonLivraisonFournisseur", "dateCloture", "dateOuverture", "dateFacture", "dateReglement", "dateEcheance", "date", "dateDebut", "dateFin"]

  colonnesOuiNon = ["cloture", "visibilite", "enCours", "tierNecessaire", "enVente", "enAchat", "enBalance", "enPromotion", "enNouveau", "enDisponible", "enArchive", "enVedette", "enLiquidation", "encaisse"]

  colonnesTaux = ["margePourcentage", "remiseFacturePourcentage", "tauxFodec", "tauxRemise", "tauxDC", "tauxRemise", "tauxTVA"]

  modeTiere = {
    client: "Client",
    fournisseur: "Fournisseur",
  }

  titreCrud = {
    ajouter: "Ajouter",
    modifier: "Modifier",
    transfert: "Transfert",
    details: "Details",
  }

  titreDocuments = {
    demandeOffrePrix: "Demande Offre Prix",
    factureVente: "Facture Vente",
    factureAchat: "Facture Achat",
    factureAvoirMarchandises: "Avoir-marchandises",
    factureAvoirFinanciers: "Avoir-financiers",
    factureAvoirSurFacture: "Avoir-facture",
    bonLivraison: "Bon Livraison",
    devis: "Devis",
    devisAchat: "Devis Achat",
    commande: "Commande",
    bonCommande: "Bon Commande",
    bonAchat: "Bon Achat",
    bonReception: "Bon Reception",
    bonRetourClient: "Bon Retour Client",
    bonRetourFournisseur: "Bon Retour Fournisseur",
  }
  format={
    a4:"A4",
    a5:"A5"
  }

  checkDocumentIsVente(document) {
    switch (document) {
      case this.titreDocuments.factureVente:
        return true
        break;
      case this.titreDocuments.bonLivraison:
        return true
        break;
      case this.titreDocuments.devis:
        return true
        break;
      case this.titreDocuments.commande:
        return true
        break;
      case this.titreDocuments.bonRetourClient:
        return true
        break;
      case this.titreDocuments.factureAchat:
        return false
        break;
      case this.titreDocuments.bonAchat:
        return false
        break;
      case this.titreDocuments.bonReception:
        return false
        break;
      case this.titreDocuments.bonRetourFournisseur:
        return false
        break;
    }
  }

  pageDetails = {
    fournisseur: "/fournisseur/details/"
  }

  getLibelleById(id, items, keySelected) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id == id) {
        return items[i][keySelected]
      }
    }
  }

  getLibelleByKey(id, items, keySelected, keyFilter) {
    for (let i = 0; i < items.length; i++) {
      if (items[i][keyFilter] == id) {
        return items[i][keySelected]
      }
    }
  }

  getIdOfArrayElement(items, key) {
    let ok = false
    while (!ok) {
      let id = this.getIdAleatoire()
      ok = items.filter(x => x[key] == id).length == 0
      if (ok) {
        return id
      }
    }
  }

  orderByDocuments(itemsVariableGOrderby, items) {
    var orderBySelected = ""
    for (let varkey in itemsVariableGOrderby) {
      if (itemsVariableGOrderby[varkey] != 0) {
        orderBySelected = varkey
      }
    }

    for (let i = 0; i < items.length-1; i++) {
      for (let j = i+1; j < items.length; j++) {
        var valeurI = items[i][orderBySelected]
        var valeurJ = items[j][orderBySelected]

        if(this.colonnesDates.indexOf(orderBySelected) > -1){
          try{
            valeurI = (new Date(valeurI)).getTime()
            valeurJ = (new Date(valeurJ)).getTime()
          }catch(e){

          }
        }else if ( this.colonnesTaux.indexOf(orderBySelected) > -1 || this.colonnesPrix.indexOf(orderBySelected) > -1 || this.colonnesQuantites.indexOf(orderBySelected) > -1 ){
          valeurI = Number(items[i][orderBySelected])
          valeurJ = Number(items[j][orderBySelected])
        }

        if (itemsVariableGOrderby[orderBySelected] == -1) {
          if (valeurI < valeurJ) {
            var aux = items[i]
            items[i] = items[j]
            items[j] = aux
          }
        } else {
          if (valeurI > valeurJ) {
            var aux = items[i]
            items[i] = items[j]
            items[j] = aux
          }
        }
      }


    }

    return items
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


  getIdAleatoire() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }


  getDate(date, format) {
    try{
      let dateVar = new Date(date)
      return dateVar.toLocaleDateString('fr');
    }catch(e){
      return ""
    }
  }

  getDateFormatStandart(date) {
    // if (!(date && date.length && date.length > 1)) {
    //   return ""
    // }
    // return formatDate(new Date(date), 'dd/MM/yyyy', 'en');
    let dateVar = new Date(date)
    return dateVar.toLocaleDateString('fr');
  }

  getTitreCrudOfUrl(url) {
    if (url.indexOf("ajout") != -1) {
      return this.titreCrud.ajouter
    } else if (url.indexOf("modifier") != -1) {
      return this.titreCrud.modifier
    } else if (url.indexOf("transfert") != -1) {
      return this.titreCrud.transfert
    } else {
      return this.titreCrud.details
    }
  }

  getFormaThreeAfterVerguleNomber(float) {
    var number = Number(float);
    return  number.toFixed(this.parametres.nombreChiffresApresVerguleNormale)
  }
  getFormaThreeAfterVerguleNomberExportEtatImpression(float) {
    var number = Number(float);
    return parseFloat(parseFloat(float).toFixed(3));

  }

  getNumerWithEspaceEntreTroisChiffre(number2) {
    var part1 = number2
    var part2 = ""

    var posPoint = number2.indexOf('.')
    if (posPoint === -1) {
      var posPoint = number2.indexOf(',')
    }

    if (posPoint > -1) {
      part1 = number2.substring(0, posPoint)
      part2 = number2.substring(posPoint, number2.length)
    }

    var newPart1 = ""
    var compteur = 0
    for (let i = (part1.length - 1); i > -1; i--) {
      compteur++
      if (compteur === 4) {
        compteur = 0
        newPart1 = part1[i] + " " + newPart1
      } else {
        newPart1 = part1[i] + newPart1
      }
    }

    return newPart1 + part2
  }

  getFormaTwoAfterVerguleTaux(float) {
    var number = Number(float);
    return number.toFixed(2)
  }

  getFormaThreeAfterVerguleQuantite(float) {
    var number = Number(float);
    return number.toFixed(this.parametres.nombreChiffresApresVerguleQuantite)
  }

  getFormaThreeAfterVerguleQuantiteExportEtatImpression(float) {
    var number = Number(float);
    return parseFloat(number.toFixed(this.parametres.nombreChiffresApresVerguleQuantite))
  }

  showInput(event) {
    var element2 = document.getElementById(event.target.getAttribute('name'))
    element2.focus()
    event.target.parentElement.classList.add("desactive-text")
    this.resetDesactiveInput(event.target.getAttribute('name'))
  }

  showInput2(event) {
    let name = event.target.getAttribute('ng-reflect-name')
    if (name == null) {
      name = event.target.getAttribute('name')
    }

    var element2 = document.getElementById(name)
    element2.focus()

    event.target.parentElement.classList.add("desactive-text")
    this.resetDesactiveInput(name)
  }

  blurInput2(event) {
    let name = event.target.getAttribute('ng-reflect-name')
    if (name == null) {
      name = event.target.getAttribute('name')
    }

    event.target.parentElement.classList.remove("desactive-text")
  }

  resetDesactiveInput(id) {
    var elements = document.getElementsByClassName("desactive-text")
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].children[0].id != id) {
        elements[i].classList.remove("desactive-text")
      }
    }
    this.resetAutoCompletes("")
  }

  resetAutoCompletes(id) {
    this.setValue(id)
  }

  inisialiserEmptyTab(items) {
    var tabEmpty = []
    if (items) {
      for (let i = 0; i < (6 - items.length); i++) {
        tabEmpty.push({})
      }
    } else {
      for (let i = 0; i < 6; i++) {
        tabEmpty.push({})
      }
    }

    return tabEmpty
  }

  titreOfModal = {
    ajouterDemandeAchatInterne: "Ajouter Demande Achat Interne",
    ajouterDemandeOffrePrix: "Ajouter Demande Offre Prix",
    modifierUniteMesure: "Modifier Unité de Mesure",
    modifierTransporteur: "Modifier Transporteur",
    ajouterTransporteur: "Ajouter Transporteur",
    ajouterCategorie: "Ajouter Categorie",
    modifierCategorie: "Modifier Categorie",
    ajouterUniteMesure: 'Ajouter Unité de Mesure',
    ajouterMarque: 'Ajouter Marque',
    ajouterModele: 'Ajouter Modele',
    modifierModele: 'Modifier Modele',
    modifierMarque: 'Modifier Marque',
    ajouterFamille: 'Ajouter Famille',
    modifierFamille: 'Modifier Famille',
    ajouterSousFamille: 'Ajouter Sous Famille',
    modifierSousFamille: 'Modifier Sous Famille',

    ajouterArticle: 'Ajouter Article',
    modifierArticle: 'Modifier Article',
    listArticle: 'List Article',
    detailsArticle: 'Details Article',

    ajouterExercice: 'Ajouter Exercice',
    modifierExercice: 'Modification Exercice',
    ajouterClient: 'Ajouter Client',
    ajouterFournisseur: 'Ajouter Fournisseur',
    ajouterModeReglement: 'Ajouter Mode Reglement',
    modifierModeReglement: 'Modifier Mode Reglement',
    ajouterModeLivraison: 'Ajouter Mode Livraison',
    modifierModeLivraison: 'Modifier Mode Livraison',
    ajouterUtilisateur: 'Ajouter Utilisateur',
    modifierUtilisateur: 'Modifier Utilisateur',
    detailsUtilisateur: 'Details Utilisateur',
    ajouterTypeContact: 'Ajouter Type Contact',
    modifierTypeContact: 'Modifier Type Contact',
    ajouterPersonnel: 'Ajouter Personnel',
    modifierPersonnel: 'Modifier Personnel',
    detailsPersonnel: 'Details Personnel',
    ajouterTauxTva: 'Ajouter Taux Tva',
    modifierTauxTva: 'Modifier Taux Tva',
    ajouterSecteur: 'Ajouter Secteur',
    modifierSecteur: 'Modifier Secteur',
    ajouterTypeTier: 'Ajouter Type Tier',
    modifierTypeTier: 'Modifier Type Tier',
    ajouterTypeCompte: 'Ajouter Type Compte',
    modifierTypeCompte: 'Modifier Type Compte',
    ajouterTypeFournisseur: 'Ajouter Type Fournisseur',
    modifierTypeFournisseur: 'Modifier Type Fournisseur',
    ajouterStatuOpportunite: 'Ajouter Statu Opportunite',
    modifierStatuOpportunite: 'Modifier Statu Opportunite',
    ajouterProjetInterne: 'Ajouter projet interne',
    modifierProjetInterne: 'Modifier projet interne',
    ajouterOrdreEmission: 'Ajouter ordre de mission',
    modifierOrdreEmission: 'Modifier ordre de mission',
    modifierVariante: 'Modifier Variante',
    ajouterVariante: 'Ajouter Variante',
    ajouterAgentPremierContact: 'Ajouter Agent Premier Contact',
    ajouterAgentCommercial: 'Ajouter Agent Commercial',
    ajouterAgentRecouvrement: 'Ajouter Agent Recouvrement',
    voirHistoriqueAchat: 'Historique de achat d"un article',
    voirHistoriqueVente: 'Historique de vente d"un article',
    ajouterPrixSpecifique: 'ajouterPrixSpecifique',
    modifierPrixSpecifique: 'modifierPrixSpecifique',
    ajouterFrais: 'ajouter Frais',
    modifierFrais: 'Modifier Frais',
    ajouterTypeMission: 'ajouter Type Mission',
    ajoutBonAchat: 'ajouter Bon Achat',
    ajoutBonLivraison: 'ajouter Bon Livraison',

    ajouterCaisse: 'Ajouter Caisse',
    modifierCaisse: 'Modifier Caisse',

    ajouterEtatGlobal: 'Ajouter Etat Global',
    modifierEtatGlobal: 'Modifier Etat Global',

    ajouterExpedition: 'Ajouter Expedition',
    modifierExpedition: 'Modifier Expedition',

    ajouterMethodeReglement: 'Ajouter Methode Reglement',
    modifierMethodeReglement: 'Modifier Methode Reglement',

    ajouterSessionCaisse: 'Ajouter session caisse',

    detailsFournisseur: 'Details Fournisseur',
    modifierFournisseur: 'Modifier Fournisseur',
    listFournisseur: 'Liste Fournisseur',

    detailsClient: 'Details Client',
    modifierClient: 'Modifier Client',
    listClient: 'Liste Client',
    typeTiers: 'Type Tiers',

    ajouterSituationReglement: 'Ajouter Situation Reglement',
    modifierSituationReglement: 'Modifier Situation Reglement',

    ajouterOperationPreventif: 'Ajouter Operation Preventif',
    ajouterMachine: 'Ajouter Machine',
    ajouterPeriodicite: 'Ajouter Periodicite',
    ajouterPlanPreventif: 'Ajouter Plan Preventif',
    ajouterTechnicien: 'Ajouter Technicien',
    ajouterEtatTache: 'Ajouter EtatTache',
    ajouterTypeFrais: 'Ajouter TypeFrais',
    ajouterMission: 'Ajouter Mission',
    ajoutChauffeur: 'Ajouter Chauffeur',
    ajoutVehicule: 'Ajouter Vehicule',
    ajoutCharge: 'Ajouter Charge',

    ajouterClasse: 'Ajouter Classe',

    lignePrixSpecifique: "Prix Specifique",

    detailsSociete: 'Details Societe',
    modifierSociete: 'Modifier Societe',
    ajoutSociete: 'Ajouter Societe',
    listSociete: 'Liste Societes',
    modifierParamliv: "Modifier Paramliv",
    ajoutProjetClient: "Ajouter Projet Client",
    ajoutDevis: "Ajouter Devis",
    ajoutCommande:"Ajouter Commande",
    ajoutDevisAchat:"Ajouter Devis Achat",
    ajoutBonCommande:"Ajouter Bon Commande",
    ajoutBonReception:"Ajouter Bon Réception",

    modifierBonLivraison: "Modifier Bon Livraison",
    modifierBonReception: "Modifier Bon Reception",
    modifierBonRetourClient:"Modifier Bon Retour Client",

  }


  getMessageBackend(numero) {
    switch (numero) {
      case 1:
        return "Vous n'avez pas acceé de modifier !!"
        break;
      case 2:
        return "Vous n'avez pas acceé de supprimer !!"
        break;
      case 3:
        return "Vous n'avez pas le droit de supprimer cet article puisque celui-ci est déjà utilisé par certains documents !!"
        break;
      case 4:
        return "Le crédit du client est passé le plafond !"
        break;
      case 5:
        return "La bonne livraison est déjà transformée !"
        break;
      case 6:
        return "La bonne réception est déjà transformée !"
        break;
      case 7:
        return "Le Règlement passe 24h, on ne peut pas changer le client."
        break;
      case 8:
        return "Le Règlement a plusieurs liltrage avec d'autres Bonnes livraisons, on ne peut pas changer le client."
        break;
      case 9:
        return "Désoler, le document est déjà transféré dans la facture."
        break;
      case 10:
        return "Désoler, stock indisponible."
        break;
      default:
        //
        break;
    }
  }

}

