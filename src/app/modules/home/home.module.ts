import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import {
  HomeComponent, AddBusinessComponent,
  HomeDashboardComponent, BusinessListComponent, BusinessProfileComponent, MyBusinessDetailComponent,
  BusinessDetailComponent, RatingAndReviewComponent, AgentBusinessListComponent, InvestmentOpportunityComponent,
  InvestmentOpportunityDetailComponent, BusinessSearchComponent, CreateInvestmentOpportunityComponent,
  MyInvestmentOpportunityDetailComponent, MembershipPlanComponent
} from './../../components';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { Routing } from './home.routing';
import { TrimstrPipe } from '../../pipes/trimstr/trimstr.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    SharedModule,
    Ng2CarouselamosModule,
    Routing,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    NguiAutoCompleteModule,
    ImageCropperModule
  ],
  declarations: [
    HomeComponent,
    AddBusinessComponent,
    BusinessListComponent,
    TrimstrPipe,
    MyBusinessDetailComponent,
    BusinessProfileComponent,
    HomeDashboardComponent,
    BusinessDetailComponent,
    RatingAndReviewComponent,
    AgentBusinessListComponent,
    InvestmentOpportunityComponent,
    InvestmentOpportunityDetailComponent,
    BusinessSearchComponent,
    CreateInvestmentOpportunityComponent,
    MyInvestmentOpportunityDetailComponent,
    MembershipPlanComponent
  ],
  entryComponents: [RatingAndReviewComponent]
})
export class HomeModule { }
