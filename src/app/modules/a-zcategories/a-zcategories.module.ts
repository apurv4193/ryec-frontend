import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routing } from './a-zcategories.routing';
import { AZcategoriesComponent } from '../../components';
import { SharedModule } from './../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    Routing,
    SharedModule
  ],
  declarations: [AZcategoriesComponent]
})
export class AZcategoriesModule { }
