import { PrixSpecifiqueTypeTierComponent } from './prix-specifique-type-tier.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PrixSpecifiqueTypeTierComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrixSpecifiqueTypeTierRoutingModule { }
