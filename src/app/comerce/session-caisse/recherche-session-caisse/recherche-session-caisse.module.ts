import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RechercheSessionCaisseRoutingModule } from './recherche-session-caisse-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RechercheSessionCaisseRoutingModule,
    SharedModule,
  ]
})
export class RechercheSessionCaisseModule { }
