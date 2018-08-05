import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from '../../components';
import { SharedModule } from './../shared/shared.module';

import { ToArrayPipe } from '../../pipes/to-array/to-array.pipe';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [MessagesComponent, ToArrayPipe]
})
export class MessagesModule { }
