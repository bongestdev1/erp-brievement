import { FactureVenteListComponent } from './facture-vente-list/facture-vente-list.component';
import { FactureVenteComponent } from './facture-vente/facture-vente.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: FactureVenteListComponent
      },
      {
        path: 'ajout',
        component: FactureVenteComponent
      },
      {
        path: 'transfert/:id',
        component: FactureVenteComponent
      },
      {
        path: 'modifier/:id',
        component: FactureVenteComponent
      },
      {
        path: 'details/:id',
        component: FactureVenteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactureVenteRoutingModule { }
