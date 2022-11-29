import { FactureVenteRoutingModule } from './facture-vente-routing.module';
import { FactureVenteComponent } from './facture-vente/facture-vente.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactureVentePopupComponent } from './facture-vente-popup/facture-vente-popup.component';


@NgModule({
  declarations: [FactureVentePopupComponent],
  imports: [
    CommonModule,
    FactureVenteRoutingModule
  ]
})
export class FactureVenteModule { }
