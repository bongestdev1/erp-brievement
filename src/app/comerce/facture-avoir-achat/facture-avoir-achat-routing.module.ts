import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FactureAvoirAchatListComponent } from './facture-avoir-achat-list/facture-avoir-achat-list.component';
import { FactureAvoirAchatComponent } from './facture-avoir-achat/facture-avoir-achat.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: FactureAvoirAchatListComponent
      },
      {
        path: 'ajout',
        component: FactureAvoirAchatComponent
      },
      {
        path: 'transfert/:id',
        component: FactureAvoirAchatComponent
      },
      {
        path: 'modifier/:id',
        component: FactureAvoirAchatComponent
      },
      {
        path: 'details/:id',
        component: FactureAvoirAchatComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureAvoirAchatRoutingModule { }
