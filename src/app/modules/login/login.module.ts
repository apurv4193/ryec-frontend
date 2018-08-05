import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { LoginComponent, ForgotPasswordComponent, OtpComponent, AccountRecoveryComponent } from '../../components';
import { Routing } from './login.routing';

@NgModule({
  imports: [
    SharedModule,
    Routing
  ],
  declarations: [LoginComponent,
    ForgotPasswordComponent,
    OtpComponent,
    AccountRecoveryComponent],
  entryComponents: [ForgotPasswordComponent, OtpComponent]
})
export class LoginModule { }
