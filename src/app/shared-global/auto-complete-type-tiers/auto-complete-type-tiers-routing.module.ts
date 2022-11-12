import { AutoCompleteTypeTiersComponent } from './auto-complete-type-tiers.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AutoCompleteTypeTiersComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoCompleteTypeTiersRoutingModule { }
