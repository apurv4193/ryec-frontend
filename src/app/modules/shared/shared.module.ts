import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NguiMapModule } from '@ngui/map';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { YoutubePlayerModule } from 'ng2-youtube-player';

//custom scroll import
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    NgbModule,
    NguiMapModule,
    IonRangeSliderModule,
    YoutubePlayerModule,
    PerfectScrollbarModule
  ],
  declarations: [],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
