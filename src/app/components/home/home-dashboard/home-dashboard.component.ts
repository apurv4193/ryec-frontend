import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HomeService, CommonService } from './../../../services';
import { environment } from '../../../../environments/environment';
import {
	TrendingServiceRes, marker
} from './../../../class/data.model';

@Component({
	selector: 'ryec-home-dashboard',
	templateUrl: './home-dashboard.component.html',
	styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {

	categoriesArr = [];
	trendServiceArr = [];
	trendCategorieArr = [];
	promotedBusinessArr = [];
	premiumBusinessArr = [];
	investmentOpportunityArr = [];
	recentlyAddedBusinessArr = [];
	popularBusinessArr = [];
	center_lat = localStorage.getItem('latitude');
	center_long = localStorage.getItem('longitude');
	businessMarkers: marker[] = [];
	business_title = '';
	business_address = '';
	business_slug = '';
	user_lat: any;
	user_long: any;
	public repoUrl: string;

	HttpHeaderOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	@Output() emit: EventEmitter<number> = new EventEmitter();

	properties = {
		title: 'Business Name : Painter',
		description: 'my desc',
		image: 'https://ryec.s3.amazonaws.com/uploads/category/category_logo/thumbnail/catgory_logo_1522302770.png',
		via: 'RYEC'
	}

	constructor(private hS: HomeService, private cS: CommonService) {
		this.repoUrl = "http://apnsservice.com";
	}

	ngOnInit() {
		this.cS.scrollTop();
		
		this.cS.currentMessage.subscribe(
			message => {
				console.log(message);
				this.center_lat = <any>localStorage.getItem('latitude');
				this.center_long = <any>localStorage.getItem('longitude');
				this.user_lat = localStorage.getItem('latitude');
				this.user_long = localStorage.getItem('longitude');
				this.getNearByBusinessesList();
			});

		if (this.center_lat === '' || this.center_lat === null) {
			this.hS.getNetworkLatLong();
		}

		this.getMenuCategoryListing();
		this.getTrendingServiceListing();
		this.getTrendingCategorieListing();
		this.getInvestmentOpportunityList();
		this.getRecentlyAddedBusinessListing();
		this.getPopularBusinessList();
		this.getPremiumBusinessListing();
	}

	/**
	* Get ALl Categories Menu listing
	* @returns void
	*/
	getMenuCategoryListing(): void {

		if (this.hS.menuCategories.data.length <= 0) {
			this.hS.getMenuCategoryListing().subscribe(res => {
				this.categoriesArr = <any>res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.categoriesArr = <any>this.hS.menuCategories.data;
		}
	}

	/**
	* Get Trending service listing
	* @returns void
	*/
	getTrendingServiceListing(): void {
		if (this.hS.trendingServicesList.data.length <= 0) {

			const limit = 6;

			this.hS.getTrendingServiceListing(limit).subscribe((res: TrendingServiceRes) => {

				this.trendServiceArr = <any>res.data;
			}, err => {
				console.log(err);
			});

		} else {
			this.trendServiceArr = <any>this.hS.trendingServicesList.data;
		}
	}
	/**
	* Get Trending Category listing
	* @returns void
	*/
	getTrendingCategorieListing(): void {
		if (this.hS.trendingCategoryList.data.length <= 0) {

			const limit = 6;
			this.hS.getTrendingCategorieListing(limit).subscribe((res: TrendingServiceRes) => {

				this.trendCategorieArr = <any>res.data;
			}, err => {
				console.log(err);
			});

		} else {
			this.trendCategorieArr = <any>this.hS.trendingCategoryList.data;
		}
	}

	/**
	* Get Recently Added Business listing
	* @returns void
	*/
	getRecentlyAddedBusinessListing(): void {
		if (this.hS.trendingCategoryList.data.length <= 0) {
			const postJson = {
				limit: 4
			};

			this.hS.getRecentlyAddedBusinessListing(postJson).subscribe((res: any) => {
				this.recentlyAddedBusinessArr = res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.recentlyAddedBusinessArr = <any>this.hS.recentlyAddedBusinessList.data;
		}
	}

	/**
	* Get Promoted Business listing
	* @returns void
	*/
	getPromotedBusinessListing() {
		if (this.hS.promotedBusinessList.data.length <= 0) {

			const postJson = {
				limit: 4
			};

			this.hS.getPromotedBusinessListing(postJson).subscribe((res: any) => {
				this.promotedBusinessArr = res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.promotedBusinessArr = <any>this.hS.promotedBusinessList.data;
		}
	}

	/**
	* Get Investment Opportunities Listing
	* @returns void
	*/
	getInvestmentOpportunityList() {
		if (this.hS.investmentOpportunityList.data.length <= 0) {
			const postJson = {
				limit: 4
			};

			this.hS.getInvestmentOpportunityList(postJson).subscribe((res: any) => {
				this.investmentOpportunityArr = res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.investmentOpportunityArr = <any>this.hS.investmentOpportunityList.data;
		}
	}

	/**
	* Get Popular Business Listing
	* @returns void
	*/
	getPopularBusinessList(): void {
		if (this.hS.popularBusinessList.data.length <= 0) {
			const postJson = {
				limit: 4
			};

			this.hS.getPopularBusinessList(postJson).subscribe((res: any) => {
				this.popularBusinessArr = res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.popularBusinessArr = <any>this.hS.popularBusinessList.data;
		}
	}

	/**
	* Get Near by Business Listing
	* @returns void
	*/
	getNearByBusinessesList(): void {
		const postJson = {
			radius: environment.LOCATION_RADIUS,
			latitude: this.center_lat,
			longitude: this.center_long,
			sortBy: 'nearMe'
		};

		this.hS.getNearByBusinessesList(postJson).subscribe((res: any) => {
			for (const x in res.data) {
				if (res.data.hasOwnProperty(x)) {
					this.businessMarkers.push({
						latitude: res.data[x]['latitude'],
						longitude: res.data[x]['longitude'],
						title: res.data[x]['name'],
						address: res.data[x]['address'],
						business_slug: res.data[x]['business_slug']
					});
				}
			}
		}, err => {
			console.log(err);
		});
	}

	/**
	* open map click
	*/
	clicked(markerEvent: any, pos: any) {
		this.business_title = pos.title;
		this.business_address = pos.address;
		this.business_slug = pos.business_slug;
		let marker = markerEvent.target;
		marker.nguiMapComponent.openInfoWindow('ibn', marker);
	}

	saveParentCategory(item: any) {
		const obj = {
			category_slug: item['category_slug'],
			category_id: item['service_id'],
			name: item['category_name']
		};
		this.cS.parentCategoryList = [];
		this.cS.setParentCategory(obj);
	}

	saveParentCategories(item: any) {
		const obj = {
			category_slug: item['category_slug'],
			category_id: item['category_id'],

			name: item['name']
		};
		this.cS.parentCategoryList = [];
		this.cS.setParentCategory(obj);
	}

	showCategory(obj: any) {
		return (obj['isBusiness'] === 1) ? false : true;
	}

	/**
	* Get Premium  Business listing
	* @returns void
	*/
	getPremiumBusinessListing() {
		if (this.hS.premiumBusinessList.data.length <= 0) {

			const postJson = {
				limit: 4
			};

			this.hS.getPremiumBusinessListing(postJson).subscribe((res: any) => {
				this.premiumBusinessArr = res.data;
			}, err => {
				console.log(err);
			});
		} else {
			this.premiumBusinessArr = <any>this.hS.premiumBusinessList.data;
		}
	}
}
