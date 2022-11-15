import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalCommandeComponent } from './journal-commande.component';

const routes: Routes = [
  {
    path: '',
    component: JournalCommandeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalCommandeRoutingModule { }
