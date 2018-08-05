import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import {
  BecomeAgentComponent, HeaderComponent,
  FooterComponent, AddMemberAgentComponent,
  VerifyMemberComponent, RegisterMemberComponent
} from '../../components';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    BecomeAgentComponent,
    VerifyMemberComponent,
    AddMemberAgentComponent,
    RegisterMemberComponent
  ],
  exports: [HeaderComponent, FooterComponent],
  entryComponents: [
    BecomeAgentComponent,
    AddMemberAgentComponent,
    VerifyMemberComponent,
    RegisterMemberComponent
  ]
})
export class HeaderFooterModule { }
