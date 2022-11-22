import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsBonReceptionComponent } from './details-bon-reception.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsBonReceptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsBonReceptionRoutingModule { }
