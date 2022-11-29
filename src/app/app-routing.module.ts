import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { SuperAdminComponent } from './theme/layout/super-admin/super-admin.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then(module => module.AuthenticationModule)
      },
      {
        path: 'authentication',
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
      },

    ]
  },

  {
    path: 'dashboard-admin',
    component: SuperAdminComponent,
    children: [
      
    ]
  },

  {
    path: '',
    component: AdminComponent,
    children: [
      
      {
        path: 'prixSpecifiques',
        loadChildren: () => import('./comerce/article/prix-specifique-article/prix-specifique-articl-input/prix-specifique-articl-input.module').then(module => module.PrixSpecifiqueArticlInputModule)
      },
      {
        path: 'prixSpecifiquesTypeTier',
        loadChildren: () => import('./comerce/article/prix-specifique-type-tier/prix-specifique-type-tier.module').then(module => module.PrixSpecifiqueTypeTierModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'layout',
        loadChildren: () => import('./demo/pages/layout/layout.module').then(module => module.LayoutModule)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(module => module.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(module => module.FormElementsModule)
      },
      {
        path: 'tbl-bootstrap',
        loadChildren: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.module').then(module => module.TblBootstrapModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(module => module.CoreChartModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./demo/pages/core-maps/core-maps.module').then(module => module.CoreMapsModule)
      },
      {
        path: 'sample-page',
        loadChildren: () => import('./demo/pages/sample-page/sample-page.module').then(module => module.SamplePageModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./comerce/client/client.module').then(module => module.ClientModule)
      },
      {
        path: 'fournisseur',
        loadChildren: () => import('./comerce/fournisseur/fournisseur.module').then(module => module.FournisseurModule)
      },
      {
        path: 'article',
        loadChildren: () => import('./comerce/article/article.module').then(module => module.ArticleModule)
      },
      {
        path: 'importations',
        loadChildren: () => import('./importations-page/importations-page.module').then(module => module.ImportationsPageModule)
      },
      {
        path: 'parametresImportations',
        loadChildren: () => import('./parametres-importations-page/parametres-importations-page.module').then(module => module.ParametresImportationsPageModule)
      },
      {
        path: 'parametresPage',
        loadChildren: () => import('./parametres-page/parametres-page.module').then(module => module.ParametresPageModule)
      },
      {
        path: 'alert-stock',
        loadChildren: () => import('./comerce/article/alert-stock/alert-stock.module').then(module => module.AlertStockModule)
      },
     
      {
        path: 'bonLivraison',
        loadChildren: () => import('./comerce/bonLivraison/bon-livrason.module').then(module => module.BonLivrasonModule)
      },
      {
        path: 'venteComptoire',
        loadChildren: () => import('./comerce/bonLivraison/bon-livrason.module').then(module => module.BonLivrasonModule)
      },
      {
        path: 'parametreColonnesFacture',
        loadChildren: () => import('./comerce/bonLivraison/livraison/livraison.module').then(module => module.LivraisonModule)
      },
      {
        path: 'parametreGeneraleFacture',
        loadChildren: () => import('./comerce/bonLivraison/parametrelivraison/parametrelivraison.module').then(module => module.ParametrelivraisonModule)
      },
      

      {
        path: 'bonReception',
        loadChildren: () => import('./comerce/bonReception/bonreception.module').then(module => module.BonreceptionModule)
      },
      {
        path: 'achatComptoire',
        loadChildren: () => import('./comerce/bonReception/bonreception.module').then(module => module.BonreceptionModule)
      },
      
      {
        path: 'bonRetourClient',
        loadChildren: () => import('./comerce/bonRetourClient/bonretourclient.module').then(module => module.BonretourclientModule)
      },
      {
        path: 'retourVenteComptoire',
        loadChildren: () => import('./comerce/bonRetourClient/bonretourclient.module').then(module => module.BonretourclientModule)
      },
      {
        path: 'bonRetourFournisseur',
        loadChildren: () => import('./comerce/bonRetourFournisseur/bonretourfournisseur.module').then(module => module.BonretourfournisseurModule)
      },
      {
        path: 'retourAchatComptoire',
        loadChildren: () => import('./comerce/bonRetourFournisseur/bonretourfournisseur.module').then(module => module.BonretourfournisseurModule)
      },
      
      {
        path: 'reglement',
        loadChildren: () => import('./comerce/reglements/reglements.module').then(module => module.ReglementsModule)
      },
      {
        path: 'factureVente',
        loadChildren: () => import('./comerce/facture-vente/facture-vente-routing.module').then(module => module.FactureVenteRoutingModule)
      },
      {
        path: 'factureAvoirAchat',
        loadChildren: () => import('./comerce/facture-avoir-achat/facture-avoir-achat.module').then(module => module.FactureAvoirAchatModule)
      },
      {
        path: 'factureAvoir',
        loadChildren: () => import('./comerce/facture-avoir/facture-avoir-routing.module').then(module => module.FactureAvoirRoutingModule)
      },
      {
        path: 'factureAchat',
        loadChildren: () => import('./comerce/facture-achat/facture-achat-routing.module').then(module => module.FactureAchatRoutingModule)
      },
     

      {
        path: 'recepetion',
        loadChildren: () => import('./comerce/bonLivraison/receptions/receptions.module').then(module => module.ReceptionsModule)
      },

     
      {
        path: 'filterCat',
        loadChildren: () => import('./comerce/filter-aticle-categorie/filter-aticle-categorie.module').then(module => module.FilterAticleCategorieModule)
      },
    
      {
        path: 'comptabilite',
        loadChildren: () => import('./Comptabilite/comptabilite.module').then(module => module.ComptabiliteModule)
      },

    ]
  },

  {
    path: '**',
    redirectTo: 'authentication/page-inaccessible',
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
