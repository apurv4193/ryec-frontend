import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { CompanyComponent } from '../../components';
import { Routing } from './company.routing';

@NgModule({
  imports: [
    SharedModule,
    Routing
  ],
  declarations: [ CompanyComponent]
})
export class CompanyModule { }
