import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HomeService } from './../services';
import { TrendingServiceRes, CategoryDataRes } from '../class/data.model';

@Injectable()
export class TrendingApi implements Resolve<Observable<TrendingServiceRes | CategoryDataRes>> {

    constructor(private hS: HomeService) { }

    /*
     *reslover for get sub-category list if exist then return data otherwise redirect to business listing page
     *@return array of data
    */
    resolve(route: ActivatedRouteSnapshot): Observable<TrendingServiceRes | CategoryDataRes> {

        if (route.url[1].path === 'service') {

            return this.hS.getTrendingServiceListing();
        } else if (route.url[1].path === 'category') {

            return this.hS.getTrendingCategorieListing();
        } else {
            return this.hS.getTrendingCategorieListing();
        }
    }
}
