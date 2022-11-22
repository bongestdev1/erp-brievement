import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBonReceptionComponent } from './list-bon-reception/list-bon-reception.component';
import { AjoutBonReceptionComponent } from './ajout-bon-reception/ajout-bon-reception.component';
import { ModifierBonReceptionComponent } from './modifier-bon-reception/modifier-bon-reception.component';
import { DetailsBonReceptionComponent } from './details-bon-reception/details-bon-reception.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListBonReceptionComponent
      },
      {
        path: 'ajout',
        component: AjoutBonReceptionComponent
      },
      {
        path: 'modifier/:id',
        component: ModifierBonReceptionComponent
      },
      {
        path: 'details/:id',
        component: DetailsBonReceptionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonreceptionRoutingModule { }
