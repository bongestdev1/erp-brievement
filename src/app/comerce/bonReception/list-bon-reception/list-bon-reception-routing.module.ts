import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBonReceptionComponent } from './list-bon-reception.component';

const routes: Routes = [
  {
    path: '',
    component: ListBonReceptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListBonReceptionRoutingModule { }
