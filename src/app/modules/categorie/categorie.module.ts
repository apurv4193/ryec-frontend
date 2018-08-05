import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { CategorieComponent } from './../../components';
import { Routing } from './categorie.routing';
import { SubCategorieModule } from './sub-categorie/sub-categorie.module';


@NgModule({
  imports: [
    SharedModule,
    SubCategorieModule,
    Routing
  ],
  declarations: [CategorieComponent],
  providers: []
})
export class CategorieModule { }
