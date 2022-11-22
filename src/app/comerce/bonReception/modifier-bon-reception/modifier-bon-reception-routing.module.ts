import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifierBonReceptionComponent } from './modifier-bon-reception.component';

const routes: Routes = [
  {
    path: '',
    component: ModifierBonReceptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifierBonReceptionRoutingModule { }
