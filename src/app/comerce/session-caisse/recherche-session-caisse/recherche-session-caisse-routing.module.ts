import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RechercheSessionCaisseComponent } from './recherche-session-caisse.component';

const routes: Routes = [
  {
    path: '',
    component: RechercheSessionCaisseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RechercheSessionCaisseRoutingModule { }
