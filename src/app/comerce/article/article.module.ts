import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { PrixSpecifiqueArticleComponent } from './prix-specifique-article/prix-specifique-article.component';
import { PrixSpecifiqueArticlInputComponent } from './prix-specifique-article/prix-specifique-articl-input/prix-specifique-articl-input.component';
import { PrixSpecifiqueTypeTierComponent } from './prix-specifique-type-tier/prix-specifique-type-tier.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArticleRoutingModule,
  ],
  exports: [
    
  ]
})

export class ArticleModule { }
