import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { TrendingCategoriesComponent } from './../../components';
import { Routing } from './trending-categories.routing';
import { TrendingApi } from '../../resolver/trending-api.resolver';

@NgModule({
  imports: [
    SharedModule,
    Routing
  ],
  declarations: [TrendingCategoriesComponent],
  providers: [TrendingApi]
})
export class TrendingCategoriesModule { }
