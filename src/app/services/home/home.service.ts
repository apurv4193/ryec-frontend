import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    CategorieMenuRes, TrendingServiceRes, BusinessRes, BusinessListDetailsRes, ProductDetailRes, ServiceDetailRes,
    InvestmentOpportunityRes, BusinessRatingRes,
    PostJsonBusinessList
} from './../../class/data.model';
import { CommonService } from './../../services';
import { Observable } from 'rxjs/Observable';
// import { environment } from '../../../environments/environment';
// import { CategorieMenuRes } from './../../class/data.model';

@Injectable()
export class HomeService {

    public menuCategories: CategorieMenuRes;
    public trendingServicesList: TrendingServiceRes;
    public trendingCategoryList: TrendingServiceRes;
    public promotedBusinessList: BusinessRes;
    public investmentOpportunityList: InvestmentOpportunityRes;
    public recentlyAddedBusinessList: BusinessRes;
    public popularBusinessList: BusinessRes;
    public premiumBusinessList: BusinessRes;

    HttpHeaderOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private hC: HttpClient, private cS: CommonService) {

        this.menuCategories = {
            status: 0,
            message: '',
            data: []
        };

        this.trendingServicesList = {
            status: 0,
            message: '',
            data: []
        };

        this.trendingCategoryList = {
            status: 0,
            message: '',
            data: []
        };

        this.promotedBusinessList = {
            status: 0,
            message: '',
            data: []
        };

        this.premiumBusinessList = {
            status: 0,
            message: '',
            data: []
        };

        this.investmentOpportunityList = {
            status: 0,
            message: '',
            loadMore: 0,
            data: []
        };

        this.recentlyAddedBusinessList = {
            status: 0,
            message: '',
            data: []
        };

        this.popularBusinessList = {
            status: 0,
            message: '',
            data: []
        };

    }

    /**
    * Get Trending service listing
    * @returns Observable<TrendingServiceRes>
    */
    getTrendingServiceListing(limit?: number): Observable<TrendingServiceRes> {
        let url = `${environment.RYEC_API_URL}getTrendingServices`;
        if (limit) {
            url = `${environment.RYEC_API_URL}getTrendingServices?limit=${limit}`;
        }
        return this.hC.get<TrendingServiceRes>(url).map((res: TrendingServiceRes) => {
            this.trendingServicesList = res;
            return res;
        });
    }

    /**
    * Get Trending Category listing
    * @returns Observable<TrendingServiceRes>
    */
    getTrendingCategorieListing(limit?: number): Observable<TrendingServiceRes> {
        let url = `${environment.RYEC_API_URL}getTrendingCategories`;
        if (limit) {
            url = `${environment.RYEC_API_URL}getTrendingCategories?limit=${limit}`;
        }
        return this.hC.get<TrendingServiceRes>(url).map((res: TrendingServiceRes) => {
            this.trendingCategoryList = res;
            return res;
        });
    }

    /**
    * Get Promoted Business listing
    * @returns Observable<BusinessRes>
    */
    getPromotedBusinessListing(postJson?: PostJsonBusinessList): Observable<BusinessRes> {
        let body = '';

        if (postJson) {
            for (const key in postJson) {
                if (postJson.hasOwnProperty(key)) {
                    body += key + '=' + postJson[key] + '&';
                }
            }
        }
        const url = environment.RYEC_API_URL + 'getPromotedBusinesses?' + body;

        return this.hC.get<BusinessRes>(url).map((res: BusinessRes) => {
            if (postJson) {
                if ('limit' in postJson) {
                    this.promotedBusinessList = res;
                }
            }
            return res;
        });
    }

    /**
    * Get Investment Opportunity listing
    * @returns Observable<InvestmentOpportunityRes>
    */
    getInvestmentOpportunityList(postJson?: PostJsonBusinessList): Observable<InvestmentOpportunityRes> {
        const url = environment.RYEC_API_URL + 'getInvestmentIdeas';

        return this.hC.post<InvestmentOpportunityRes>(url, postJson, this.HttpHeaderOptions).map((res: InvestmentOpportunityRes) => {
            if (postJson) {
                if ('limit' in postJson) {
                    this.investmentOpportunityList = res;
                }
            }
            return res;
        });
    }

    /**
    * Get Investment Opportunity listing
    * @returns Observable<InvestmentOpportunityRes>
    */
    getMyInvestmentInterestList(): Observable<any> {
        const url = environment.RYEC_API_URL + 'getMyInvestmentInterest';

        return this.hC.post<any>(url, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }

    /**
    * Get Investment Opportunity Filters
    * @returns Observable<>
    */
    getInvestmentFilters(): Observable<any> {
        const url = environment.RYEC_API_URL + 'getInvestmentFilters';

        return this.hC.get<any>(url).map((res: any) => {
            return res;
        });
    }

    /**
    * Get Business Detail by business slug
    * @returns BusinessListDetailsRes
    */
    getInvestmentDetailBySlug(postJson?: {}): Observable<InvestmentOpportunityRes> {
        const url = environment.RYEC_API_URL + 'getInvestmentIdeaDetails';

        return this.hC.post<InvestmentOpportunityRes>(url, postJson, this.HttpHeaderOptions).map((res: InvestmentOpportunityRes) => {
            return res;
        });
    }

    /**
    * Get Recently added Business listing
    * @returns Observable<BusinessRes>
    */
    getRecentlyAddedBusinessListing(postJson?: PostJsonBusinessList): Observable<BusinessRes> {
        const url = environment.RYEC_API_URL + 'getRecentlyAddedBusinessListing';

        return this.hC.post<BusinessRes>(url, postJson, this.HttpHeaderOptions).map((res: BusinessRes) => {
            if (postJson) {
                if ('limit' in postJson) {
                    this.recentlyAddedBusinessList = res;
                }
            }
            return res;
        });
    }

    /**
    * Get Popular Business listing
    * @returns Observable<BusinessRes>
    */
    getPopularBusinessList(postJson?: PostJsonBusinessList): Observable<BusinessRes> {
        let body = '';
        if (postJson) {
            for (const key in postJson) {
                if (postJson.hasOwnProperty(key)) {
                    body += key + '=' + postJson[key] + '&';
                }
            }
        }

        const url = environment.RYEC_API_URL + 'getPopularBusinesses?' + body;
        return this.hC.get<BusinessRes>(url).map((res: BusinessRes) => {
            if (postJson) {
                if ('limit' in postJson) {
                    this.popularBusinessList = res;
                }
            }
            return res;
        });
    }

    /**
    * Get Category wise Business listing
    * @returns void
    */
    getBusinessListByCategory(postJson?: PostJsonBusinessList) {
        const url = environment.RYEC_API_URL + 'getBusinessListing';

        return this.hC.post(url, postJson, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }

    /**
    * Get Business Detail by business slug
    * @returns BusinessListDetailsRes
    */
    getBusinessDetailBySlug(postJson?: {}): Observable<BusinessListDetailsRes> {
        const url = environment.RYEC_API_URL + 'getBusinessDetail';

        return this.hC.post<BusinessListDetailsRes>(url, postJson, this.HttpHeaderOptions).map((res: BusinessListDetailsRes) => {
            return res;
        });
    }

    /**
    * Get Product Detail by product id
    * @returns ProductDetailRes
    */
    getProductDetailByProductId(postJson?: {}): Observable<ProductDetailRes> {
        const url = environment.RYEC_API_URL + 'getProductDetails';

        return this.hC.post<ProductDetailRes>(url, postJson, this.HttpHeaderOptions).map((res: ProductDetailRes) => {
            return res;
        });
    }

    /**
    * Get Service Detail by product id
    * @returns ServiceDetailRes
    */
    getServiceDetailByServiceId(postJson?: {}): Observable<ServiceDetailRes> {
        const url = environment.RYEC_API_URL + 'getServiceDetails';

        return this.hC.post<ServiceDetailRes>(url, postJson, this.HttpHeaderOptions).map((res: ServiceDetailRes) => {
            return res;
        });
    }

    /**
    * Get Business Rating List by business id
    * @returns BusinessRatingRes
    */
    getBusinessRating(postJson?: {}): Observable<BusinessRatingRes> {
        const url = environment.RYEC_API_URL + 'getBusinessRatings';

        return this.hC.post<BusinessRatingRes>(url, postJson, this.HttpHeaderOptions).map((res: BusinessRatingRes) => {
            return res;
        });
    }

    /**
    * Get Near By Business List by
    * @returns BusinessRatingRes
    */
    getNearByBusinessesList(postJson?: {}): Observable<BusinessRes> {
        const url = environment.RYEC_API_URL + 'getNearByBusinesses';

        return this.hC.post<BusinessRes>(url, postJson, this.HttpHeaderOptions).map((res: BusinessRes) => {
            return res;
        });
    }

    getMenuCategoryListing(): Observable<CategorieMenuRes> {
        const url = environment.RYEC_API_URL + 'getMainCategory';
        return this.hC.get<CategorieMenuRes>(url).map(res => {
            this.menuCategories = res;
            return res;
        });
    }

    /**
    * Get Business List for agent
    * @returns BusinessRatingRes
    */
    getBusinessListForAgent(postJson?: {}): Observable<BusinessRes> {
        const url = environment.RYEC_API_URL + 'getAgentBusinesses';

        return this.hC.post<BusinessRes>(url, postJson, this.HttpHeaderOptions).map((res: BusinessRes) => {
            return res;
        });
    }

    getAddressMaster(): Observable<any> {
        const url = environment.RYEC_API_URL + 'getAddressMaster';
        return this.hC.get<any>(url).map(res => {
            return res;
        });
    }

    getCountryCode(): Observable<any> {
        const url = environment.RYEC_API_URL + 'getCountryCode';
        return this.hC.get<any>(url).map(res => {
            return res;
        });
    }

    /**
    * Get search List for business
    * @returns BusinessRatingRes
    */
    getSearchAutocomplete(postJson?: {}): Observable<any> {
        const url = environment.RYEC_API_URL + 'getSearchAutocomplete';

        return this.hC.post<any>(url, postJson, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }

    /**
     * Get latLong from network
     */
    getNetworkLatLong() {
        this.hC.get('https://ipinfo.io/json')
            .subscribe(data => {
                const latlog = data['loc'].split(',');
                if (latlog.length > 1) {
                    const lat = latlog[0];
                    const log = latlog[1];
                    localStorage.setItem('latitude', lat);
                    localStorage.setItem('longitude', log);
                    this.cS.updateLatLong(lat, log);
                }
                return;
            });
    }

    /**
     * Get Search business listing
     * @param postJson
     */
    getSearchBusinesses(postJson?: {}): Observable<any> {
        const url = environment.RYEC_API_URL + 'getSearchBusinesses';

        return this.hC.post<any>(url, postJson, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }

    getBusinessApproved(postJson?: {}): Observable<any> {
        const url = environment.RYEC_API_URL + 'getBusinessApproved';

        return this.hC.post<any>(url, postJson, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }

    /**
    * Get Premium Business listing
    * @returns Observable<BusinessRes>
    */
    getPremiumBusinessListing(postJson?: PostJsonBusinessList): Observable<BusinessRes> {
        let body = '';

        if (postJson) {
            for (const key in postJson) {
                if (postJson.hasOwnProperty(key)) {
                    body += key + '=' + postJson[key] + '&';
                }
            }
        }
        const url = environment.RYEC_API_URL + 'getPremiumBusinesses?' + body;

        return this.hC.get<BusinessRes>(url).map((res: BusinessRes) => {
            if (postJson) {
                if ('limit' in postJson) {
                    this.promotedBusinessList = res;
                }
            }
            return res;
        });
    }

    getNotificationList(postJson?: any): Observable<any> {
        const url = environment.RYEC_API_URL + 'notificationList';

        return this.hC.post<any>(url, postJson, this.HttpHeaderOptions).map((res: any) => {
            return res;
        });
    }
}
