import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { SubCategorieComponent } from './../../../components';
import { Routing } from './sub-categorie.routing';
import { CategoryGuardService } from './../../../guards/category-guard.service';
import { ApiResolver } from './../../../resolver/api-resolver.resolver';

@NgModule({
  imports: [
    SharedModule,
    Routing
  ],
  declarations: [SubCategorieComponent],
  providers: [CategoryGuardService, ApiResolver]
})
export class SubCategorieModule { }
