import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutBonReceptionComponent } from './ajout-bon-reception.component';


const routes: Routes = [
  {
    path: '',
    component: AjoutBonReceptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjoutBonReceptionRoutingModule { }
