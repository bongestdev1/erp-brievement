import { FactureAvoirListComponent } from './facture-avoir-list/facture-avoir-list.component';
import { FactureAvoirComponent } from './facture-avoir/facture-avoir.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: FactureAvoirListComponent
      },
      {
        path: 'ajout',
        component: FactureAvoirComponent
      },
      {
        path: 'transfert/:id',
        component: FactureAvoirComponent
      },
      {
        path: 'modifier/:id',
        component: FactureAvoirComponent
      },
      {
        path: 'details/:id',
        component: FactureAvoirComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureAvoirRoutingModule { }
