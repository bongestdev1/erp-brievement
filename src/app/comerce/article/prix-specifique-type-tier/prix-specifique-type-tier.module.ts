import { PrixSpecifiqueTypeTierRoutingModule } from './prix-specifique-type-tier-routing.module';
import { PrixSpecifiqueArticleRoutingModule } from './../prix-specifique-article/prix-specifique-article-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrixSpecifiqueTypeTierRoutingModule,
  ]   
})
export class PrixSpecifiqueTypeTierModule { }
