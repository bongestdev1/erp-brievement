import { FactureAchatListComponent } from './facture-achat-list/facture-achat-list.component';
import { FactureAchatComponent } from './facture-achat/facture-achat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: FactureAchatListComponent
      },
      {
        path: 'ajout',
        component: FactureAchatComponent
      },
      {
        path: 'transfert/:id',
        component: FactureAchatComponent
      },
      {
        path: 'modifier/:id',
        component: FactureAchatComponent
      },
      {
        path: 'details/:id',
        component: FactureAchatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureAchatRoutingModule { }
