import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TranslateModule } from '@ngx-translate/core';
import { SignupComponent, SignupOtpComponent } from './../../components';
import { Routing } from './signup.routing'; 
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    Routing,
    SharedModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [SignupComponent, SignupOtpComponent],
  entryComponents: [SignupOtpComponent]
})
export class SignupModule { }
