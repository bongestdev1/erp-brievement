import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastNotificationService } from 'src/app/services/toast-notification.service';
import { InformationsService } from 'src/app/services/informations.service';
import { FonctionPartagesService } from 'src/app/services/fonction-partages.service';
import { FnctModelService } from 'src/app/services/fonctionModel/fnct-model.service';
import { TotalsDocument } from '../../bonLivraison/lignebl/models/totals-document'
import { ShemaItemArticleSelected } from '../../bonLivraison/lignebl/models/shema-item-article-selected';
import { ShemaItemArticleSelectedAchat } from '../../bonLivraison/lignebl/models/shema-item-article-selected-achat';
import { ShemaArticle } from '../../bonLivraison/lignebl/models/shema-article';
import { ShemaArticleAchat } from '../../bonLivraison/lignebl/models/shema-article-achat';
import { ShemaArticle2 } from '../../bonLivraison/lignebl/models/shema-article2';
import { ShemaArticle2Achat } from '../../bonLivraison/lignebl/models/shema-article2-achat';
import { ShemaArticle2Number } from '../../bonLivraison/lignebl/models/shema-article2-number';
import { ShemaArticle2Quantite } from '../../bonLivraison/lignebl/models/shema-article2-quantite';
import { ShemaMultiSortieArticle } from '../../bonLivraison/lignebl/models/shema-multi-sortie-article';
import { ShemaMultiSortieArticleAchat } from '../../bonLivraison/lignebl/models/shema-multi-sortie-article-achat';
import { UtilesBonLivraisonService } from '../../bonLivraison/lignebl/services/utiles-bon-livraison.service';

@Component({
  selector: 'app-facture-vente-ligne',
  templateUrl: './facture-vente-ligne.component.html',
  styleUrls: ['./facture-vente-ligne.component.scss']
})
export class FactureVenteLigneComponent implements OnInit {

  articleFormGroup: FormGroup;


  @Input() bonLivraisons = []
  @Input() allBonLivraisons = []

  objectKeys = Object.keys;

  erreurArticle = {
    quantiteVente: "",
    reference: "",
    prixVenteHTReel: "",
  }

  // begin autocomplete articles
  keySelectedArticle = "reference"


  @Input() uniteMesures = []

  @Input() allClients = []

  @Input() isDetails = "non"
  @Input() titreDocument
  @Input() bonLivraison

  @Output() closeModal = new EventEmitter<string>();

  @Output() removeBonLivraison = new EventEmitter<string>();

  @Output() addBonLivraison = new EventEmitter<string>();

  //app-showelements
  itemsShowsElements = {}
  itemsVariableShowsElements = {}

  initialiserVariablesOfShowsElements() {
    for (let key in this.shemaArticle) {
      this.itemsShowsElements[key] = "active"
      this.itemsVariableShowsElements[key] = "active"
    }
  }


  getUniteById(id) {
    var libelle = ""
    var unites = this.uniteMesures.filter(x => x.id == id)

    if (unites.length > 0) {
      return unites[0].libelle
    }

    return libelle
  }

  sousProduits = []
  stocks = []
  changeSousProduit() {

  }

  shemaArticle: any = new ShemaArticle()

  shemaMultiSortie: any = new ShemaMultiSortieArticle()
  shemaArticle2: any = new ShemaArticle2()

  shemaArticle2Number = new ShemaArticle2Number()

  shemaArticle2Quantite = new ShemaArticle2Quantite()

  isLoading = false

  getNumber(float) {
    return this.fonctionPartagesService.getFormaThreeAfterVerguleNomber(float)
  }
  // end autocomplete articles
  constructor(
    private notificationToast: ToastNotificationService,
    public informationGenerale: InformationsService,

    public fonctionPartagesService: FonctionPartagesService,
    private fnctModel: FnctModelService,
    private utiles: UtilesBonLivraisonService) {

  }

  ngOnInit(): void {
    this.initialiserVariablesOfShowsElements()
  }

  checkIsInfinity(number) {
    return Number.isFinite(number)
  }


  //begin delete item

  isOpenModalDelete = false
  numeroItemDelete = '0'
  params1Delete = ""
  params2Delete = ""

  deleteItem() {
    this.notificationToast.showSuccess("Votre article est supprimée")
    this.removeBonLivraison.emit(this.numeroItemDelete)
    this.closeModalDelete()
  }

  openModalDelete(numero, params2) {
    this.numeroItemDelete = numero
    this.isOpenModalDelete = true
    this.params1Delete = "Bon Livraison "
    this.params2Delete = params2
  }

  closeModalDelete() {
    this.isOpenModalDelete = false
  }

  //fin delete item
  tabNumbersInput = ['remiseParMontant2', 'remiseParMontant', 'prixFourn', 'prixVenteHTReel2', 'prixVenteHTReel', 'tauxRemise', 'quantiteVente', 'quantiteVente2', 'quantiteAchat', 'quantiteAchat2']
  allTabNumbers = ['remiseParMontant2', 'remiseParMontant', 'totalRemise', 'redevance', 'totalGainCommerciale', 'totalGainReel', 'prixVenteHTReel2', 'prixVenteHTReel', 'prixAchatHTReel2', 'prixAchatHTReel', 'totalGain', 'pVenteConseille', 'totalTTC', 'prixTTC', 'tauxTVA', 'totalHT', 'prixVente', 'plafondRemise', 'prixVenteHT', 'prixAchat', 'tauxRemise', 'quantiteVente', 'quantiteVente2', 'quantiteAchat', 'quantiteAchat2', 'prixFourn', 'prixFodec', 'prixDC', 'tauxDC']
  tabNumbersLabel = ['totalRemise', 'redevance', 'totalGainCommerciale', 'totalGainReel', 'prixAchatHTReel2', 'prixAchatHTReel', 'totalGain', 'pVenteConseille', 'totalTTC', 'prixTTC', 'tauxTVA', 'totalHT', 'prixVente', 'plafondRemise', 'prixVenteHT', 'prixAchat', 'prixFodec', 'prixDC', 'tauxDC']

  ngOnChanges(changes: SimpleChanges) {
     console.log(this.bonLivraisons)
  }



  //pour tester si les champs client et article n'est pas sélectionné


  //open modal ajout Element
  isOpenModalAjoutElement = false
  idAjoutElementModal = ""
  idAjoutPersModal = ""
  typeElement
  typeDocument = ""

  closeModalAjoutElement() { 
    this.closeModal.emit()
    this.typeElement = ""
    this.isOpenModalAjoutElement = false
  }

  showArticlesbonLivraisons(idBonCommande) {
    var ligne = document.getElementById("ligneWidth");
    var x = document.getElementById(idBonCommande);
    x.style.width = (ligne.clientWidth - 15)+"px"
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }


  //start inserer Client ou fournisseur avant le selectionner article
  isOpenModalInsererClientDabord = false
  messageInsererClientDabord = "Tout D'abord insérer votre client !!"

  //end inserer Client ou fournisseur avant le selectionner article

  //start inserer Client ou fournisseur avant le selectionner article
  isOpenModalStockMax = false
  messageStockMax = ""
  
  openModalModiferBL(id){
    this.typeElement = this.fonctionPartagesService.titreOfModal.modifierBonLivraison    
    this.isOpenModalAjoutElement = true
    this.idAjoutElementModal = id
  }

  erreurBonLivraison = {
    numero:""
  }

  itemBLSelected:any= {id:""}

  openModalAjoutBL(){

  }

  setBonLivraisonId(id){
    if(this.allBonLivraisons.filter(x => x.id === id).length > 0){
      this.itemBLSelected = this.allBonLivraisons.filter(x => x.id === id)[0]
    }
  }

  cocheBonLivraison(){
      this.addBonLivraison.emit(this.itemBLSelected.id)
  }

}
