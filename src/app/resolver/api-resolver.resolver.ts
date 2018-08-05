import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment';
import { HttpService } from './../services';

@Injectable()
export class ApiResolver implements Resolve<Observable<any>> {

    constructor(private hS: HttpService) { }

    /*
     *reslover for get sub-category list if exist then return data otherwise redirect to business listing page
     *@return array of data
    */
    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        const parentCategory = route.paramMap.get('slug');
        const url = environment.RYEC_API_URL + 'getSubCategory';
        const postJson = { category_slug: parentCategory };
        return this.hS.post(url, postJson);
    }
}
