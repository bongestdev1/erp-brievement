import { PrixSpecifiqueTypeTierComponent } from './article/prix-specifique-type-tier/prix-specifique-type-tier.component';
import { ClassementFournisseurComponent } from './fournisseur/classement-fournisseur/classement-fournisseur.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedGlobalModule } from '../shared-global/shared-global.module';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { AddArticleModalComponent } from './commerce-modals/add-article-modal/add-article-modal.component';
import { AddCategorieModalComponent } from './commerce-modals/add-categorie-modal/add-categorie-modal.component';
import { AddFamilleModalComponent } from './commerce-modals/add-famille-modal/add-famille-modal.component';
import { AddMarqueModalComponent } from './commerce-modals/add-marque-modal/add-marque-modal.component';
import { AddModalComponent } from './commerce-modals/add-modal/add-modal.component';
import { AddModeleModalComponent } from './commerce-modals/add-modele-modal/add-modele-modal.component';
import { AddSousFamilleModalComponent } from './commerce-modals/add-sous-famille-modal/add-sous-famille-modal.component';
import { AlerteListeComponent } from './article/alerte-liste/alerte-liste.component';
import { AjouterArticleComponent } from './article/ajouter-article/ajouter-article.component';
import { DetailsArticleComponent } from './article/details-article/details-article.component';
import { FraisArticleComponent } from './article/frais-article/frais-article.component';
import { ListArticleComponent } from './article/list-article/list-article.component';
import { AjouterClientComponent } from './client/ajouter-client/ajouter-client.component';
import { AutreAdresseComponent } from './client/autre-adresse/autre-adresse.component';
import { ClassementClientComponent } from './client/classement-client/classement-client.component';
import { ComplementsComponent } from './client/complements/complements.component';
import { ContactsComponent } from './client/contacts/contacts.component';
import { DetailsClientComponent } from './client/details-client/details-client.component';
import { FactureComponent } from './client/facture/facture.component';
import { ListClientComponent } from './client/list-client/list-client.component';
import { LivraisonComponent } from './client/livraison/livraison.component';
import { ModifierClientComponent } from './client/modifier-client/modifier-client.component';
import { AjoutProjetComponent } from './client/projet/ajout-projet/ajout-projet.component';
import { ListProjetComponent } from './client/projet/list-projet/list-projet.component';
import { ModifierProjetComponent } from './client/projet/modifier-projet/modifier-projet.component';
import { SupprimerClientComponent } from './client/supprimer-client/supprimer-client.component';
import { AjouterFournisseurComponent } from './fournisseur/ajouter-fournisseur/ajouter-fournisseur.component';
import { ListFournisseurComponent } from './fournisseur/list-fournisseur/list-fournisseur.component';
import { DetailsFournisseurComponent } from './fournisseur/details-fournisseur/details-fournisseur.component';
import { ModifierFournisseurComponent } from './fournisseur/modifier-fournisseur/modifier-fournisseur.component';
import { ReleveFournisseurComponent } from './fournisseur/releve-fournisseur/releve-fournisseur.component';
import { ParametresPageComponent } from '../parametres-page/parametres-page.component';
import { AutocompleteFamilleComponent } from './autocompletes/autocomplete-famille/autocomplete-famille.component';
import { AutocompleteCategorieComponent } from './autocompletes/autocomplete-categorie/autocomplete-categorie.component';
import { ArticleHtmlComponent } from './article/article-html/article-html.component';
import { ClientHtmlComponent } from './client/client-html/client-html.component';
import { PrixWithQuantitesComponent } from './article/prix-with-quantites/prix-with-quantites.component';
import { ArticleStockComponent } from './article/article-stock/article-stock.component';
import { ArticleVariantesComponent } from './article/article-variantes/article-variantes.component';
import { AlertStockComponent } from './article/alert-stock/alert-stock.component';
import { RouterModule } from '@angular/router';
import { PrixSpecifiqueArticleComponent } from './article/prix-specifique-article/prix-specifique-article.component';
import { PrixSpecifiqueArticlInputComponent } from './article/prix-specifique-article/prix-specifique-articl-input/prix-specifique-articl-input.component';
import { PrixSpecifiqueArticlesListComponent } from './article/prix-specifique-article/prix-specifique-articles-list/prix-specifique-articles-list.component';
import { AutocompleteFournisseurComponent } from './autocompletes/autocomplete-fournisseur/autocomplete-fournisseur.component';
import { LignePrixSpecifiqueComponent } from './article/prix-specifique-article/ligne-prix-specifique/ligne-prix-specifique.component';
import { AddElementModalComponent } from './commerce-modals/add-element-modal/add-element-modal.component';
import { AjoutChauffeurCommerceComponent } from './commerce-modals/add-element-modal/ajout-chauffeur-commerce/ajout-chauffeur-commerce.component';
import { AutocompleteClientComponent } from './autocompletes/autocomplete-client/autocomplete-client.component';
import { AutocompleteArticleComponent } from './autocompletes/autocomplete-article/autocomplete-article.component';
import { AutocompleteSousFamilleComponent } from './autocompletes/autocomplete-sous-famille/autocomplete-sous-famille.component';


import { MiseAJourComponent } from './bonLivraison/parametrelivraison/mise-a-jour/mise-a-jour.component';
import { ModifierParamComponent } from './bonLivraison/parametrelivraison/modifier-param/modifier-param.component';
import { ValiderParamComponent } from './bonLivraison/parametrelivraison/valider-param/valider-param.component';
import { ModifierlistparamComponent } from './bonLivraison/livraison/modifierlistparam/modifierlistparam.component';
import { HeaderANDfooterPDFComponent } from './bonLivraison/parametrelivraison/header-andfooter-pdf/header-andfooter-pdf.component';
import { ListparamlivraisonComponent } from './bonLivraison/livraison/listparamlivraison/listparamlivraison.component';

import { ReceptionsComponent } from './bonLivraison/receptions/receptions.component';
import { AjoutBonLivraisonComponent } from './bonLivraison/ajout-bon-livraison/ajout-bon-livraison.component';
import { DetailsBonLivraisonComponent } from './bonLivraison/details-bon-livraison/details-bon-livraison.component';
import { ExpeditionsComponent } from './bonLivraison/expeditions/expeditions.component';
import { ListBonLivraisonComponent } from './bonLivraison/list-bon-livraison/list-bon-livraison.component';
import { ModifierBonLivraisonComponent } from './bonLivraison/modifier-bon-livraison/modifier-bon-livraison.component';
import { RoutesTransfertDocumentsComponent } from './bonLivraison/routes-transfert-documents/routes-transfert-documents.component';

import { DetailsReglementComponent } from './reglements/details-reglement/details-reglement.component';
import { ReglementDetailsComponent } from './reglements/components/reglement-details/reglement-details.component';
import { ReglementInputComponent } from './reglements/components/reglement-input/reglement-input.component';
import { InputBonLivraisonComponent } from './bonLivraison/input-bon-livraison/input-bon-livraison.component';
import { ReglementsBonLivraisonComponent } from './bonLivraison/reglements-bon-livraison/reglements-bon-livraison.component';
import { LigneblComponent } from './bonLivraison/lignebl/lignebl.component'
import { ReglementInput2Component } from './reglements/components/reglement-input2/reglement-input2.component';
import { ChargeGlobalComponent } from './bonLivraison/charge-global/charge-global.component'
import { DocumentDetailsComponent } from './bonLivraison/document-details/document-details.component';

import { AjouterReglementComponent } from './reglements/ajouter-reglement/ajouter-reglement.component';
import { ListEcheanceClientComponent } from './reglements/list-echeance-client/list-echeance-client.component';
import { ListReglementsComponent } from './reglements/list-reglements/list-reglements.component';
import { ModifierReglementComponent } from './reglements/modifier-reglement/modifier-reglement.component';

import { ChargeDetailsComponent } from './bonLivraison/charge-details/charge-details.component'
import { HistoriqueVenteComponent } from './bonLivraison/lignebl/historique-vente/historique-vente.component';
import { HistoriqueAchatComponent } from './bonLivraison/lignebl/historique-achat/historique-achat.component'

import { ListReceptionComponent } from './bonLivraison/receptions/list-reception/list-reception.component';
import { ModifierReceptionComponent } from './bonLivraison/receptions/modifier-reception/modifier-reception.component'

import { FilterAticleCategorieComponent } from './filter-aticle-categorie/filter-aticle-categorie.component';
import { AutocompleteSocieteComponent } from './autocompletes/autocomplete-societe/autocomplete-societe.component';



/* ------------Start---------------- */
import { ListSessionCaisseComponent } from './session-caisse/list-session-caisse/list-session-caisse.component';
import { ModifierSessionCaisseComponent } from './session-caisse/modifier-session-caisse/modifier-session-caisse.component';
import { AjoutSessionCaisseComponent } from './session-caisse/ajout-session-caisse/ajout-session-caisse.component';
import { ReglementsCaisseComponent } from './session-caisse/reglements-caisse/reglements-caisse.component';
import { ChargeModeReglComponent } from './session-caisse/charge-mode-regl/charge-mode-regl.component'
import { RechercheSessionCaisseComponent } from './session-caisse/recherche-session-caisse/recherche-session-caisse.component';
import { AjoutBonRetourFournisseurComponent } from './bonRetourFournisseur/ajout-bon-retour-fournisseur/ajout-bon-retour-fournisseur.component';
import { DetailsBonRetourFournisseurComponent } from './bonRetourFournisseur/details-bon-retour-fournisseur/details-bon-retour-fournisseur.component';
import { ListBonRetourFournisseurComponent } from './bonRetourFournisseur/list-bon-retour-fournisseur/list-bon-retour-fournisseur.component';
import { ModifierBonRetourFournisseurComponent } from './bonRetourFournisseur/modifier-bon-retour-fournisseur/modifier-bon-retour-fournisseur.component';


/*---------------------------End-------------------*/

@NgModule({
  declarations: [

    AjoutBonRetourFournisseurComponent,
    DetailsBonRetourFournisseurComponent,
    ListBonRetourFournisseurComponent,
    ModifierBonRetourFournisseurComponent,

    /* ---------------- Start ---------------*/
    LigneblComponent,

    AutocompleteSocieteComponent,
    ListparamlivraisonComponent,
    HeaderANDfooterPDFComponent,
    ModifierlistparamComponent,
    ValiderParamComponent,
    ModifierParamComponent,
    MiseAJourComponent,
    DocumentDetailsComponent,
    ReglementInput2Component,
    ReglementsBonLivraisonComponent,
    InputBonLivraisonComponent,
    ReglementDetailsComponent,
    ReglementInputComponent,
    DetailsReglementComponent,
    ReceptionsComponent,
    AjoutBonLivraisonComponent,
    DetailsBonLivraisonComponent,
    ExpeditionsComponent,
    ListBonLivraisonComponent,
    ModifierBonLivraisonComponent,
    RoutesTransfertDocumentsComponent,
    AjouterReglementComponent,
    ListEcheanceClientComponent,
    ListReglementsComponent,
    ModifierReglementComponent,
    ChargeGlobalComponent,
    ChargeDetailsComponent,

    HistoriqueVenteComponent,
    HistoriqueAchatComponent,

    ListReceptionComponent,
    ModifierReceptionComponent,
    FilterAticleCategorieComponent,

    PrixSpecifiqueTypeTierComponent,
    LignePrixSpecifiqueComponent,
    PrixSpecifiqueArticleComponent,
    PrixSpecifiqueArticlInputComponent,
    PrixSpecifiqueArticlesListComponent,
    AlertStockComponent,
    ArticleStockComponent,
    ArticleVariantesComponent,
    PrixWithQuantitesComponent,
    ClientHtmlComponent,
    ArticleHtmlComponent,

    AddArticleModalComponent,
    AddCategorieModalComponent,
    AddElementModalComponent,
    AddFamilleModalComponent,
    AddMarqueModalComponent,
    AddModalComponent,
    AddModeleModalComponent,
    AddSousFamilleModalComponent,

    AlerteListeComponent,
    AjouterArticleComponent,
    DetailsArticleComponent,
    FraisArticleComponent,
    ListArticleComponent,

    AjouterClientComponent,
    AutreAdresseComponent,
    ClassementClientComponent,

    ClassementFournisseurComponent,
    ComplementsComponent,
    ContactsComponent,
    FactureComponent,
    LivraisonComponent,
    ModifierClientComponent,
    AjoutProjetComponent,
    ListProjetComponent,
    ModifierProjetComponent,
    SupprimerClientComponent,
    AjouterFournisseurComponent,
    ModifierFournisseurComponent,
    ReleveFournisseurComponent,
    ParametresPageComponent,
    AutocompleteFournisseurComponent,
    ListClientComponent,
    ListFournisseurComponent,
    DetailsClientComponent,
    DetailsFournisseurComponent,
    AjoutChauffeurCommerceComponent,
    AutocompleteClientComponent,
    AutocompleteArticleComponent,
    AutocompleteCategorieComponent,
    AutocompleteFamilleComponent,
    AutocompleteSousFamilleComponent,
    /* ---------------- END ---------------*/

  
    AjoutSessionCaisseComponent,
    ModifierSessionCaisseComponent,
    ListSessionCaisseComponent,
    ReglementsCaisseComponent,
    ChargeModeReglComponent,
    
    RechercheSessionCaisseComponent,
    

  ],
  imports: [
    CommonModule,
    SharedGlobalModule,
    SharedModule,
    NgbTabsetModule,
    NgbAccordionModule,
    NgbCollapseModule,
    RouterModule,
    RouterModule,
  ],
  exports: [

  ]
})
export class ComerceModule { }
