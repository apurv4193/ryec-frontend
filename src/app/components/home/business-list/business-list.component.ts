import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostJsonBusinessList } from './../../../class/data.model';
import { HomeService, CommonService } from './../../../services';
import { environment } from '../../../../environments/environment';
import {
	marker
} from './../../../class/data.model';
@Component({
	selector: 'ryec-business-list',
	templateUrl: './business-list.component.html',
	styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent implements OnInit {

	currentPage: number;
	routerLink = '';
	activeUrl = '';
	BusinessList = [];
	sort_slug = '';
	maxSize = 5;
	totalBuinessCount = 0;
	collectionSize = 0;
	first = 1;
	last = 0;
	perPageList = environment.BUSINESS_LIST_LIMIT;
	endPage: number = environment.BUSINESS_LIST_LIMIT;
	center_lat = localStorage.getItem('latitude');
	center_long = localStorage.getItem('longitude');
	businessMarkers: marker[] = [];
	business_title = '';
	business_address = '';
	business_slug = '';
	noData = false;
	user_lat: any;
	user_long: any;
	isShow = true;

	constructor(
		private activeRoute: ActivatedRoute,
		private hS: HomeService,
		private cS: CommonService,
		private router: Router) {
		this.currentPage = 1;
		const activeUrlArray = this.activeRoute.snapshot.url;
		this.user_lat = localStorage.getItem('latitude');
		this.user_long = localStorage.getItem('longitude');

		/*
		*get url slug
		*/
		this.activeRoute.params.subscribe(data => {
			this.routerLink = data.slug;
			if (activeUrlArray.length > 3) {
				this.activeUrl = activeUrlArray[2].path;
			}
			this.currentPage = 1;

			/*
			*Check which type of sorting happend
			*/
			if (this.routerLink === 'relevance') {
				this.sort_slug = 'relevance';
			}
			else if (this.routerLink === 'popularity') {
				this.sort_slug = 'popular';
			}
			else if (this.routerLink === 'ratings') {
				this.sort_slug = 'ratings';
			}
			else if (this.routerLink === 'near-by') {
				this.sort_slug = 'nearMe';
			}
			else if (this.routerLink === 'atoz') {
				this.sort_slug = 'AtoZ';
			}
			else if (this.routerLink === 'ztoa') {
				this.sort_slug = 'ZtoA';
			}
			else {
				this.router.navigateByUrl('/home');
			}
			this.businessMarkers = [];
			this.checkRouterUrlForCallingAPI();
		});
	}

	ngOnInit() {
		if (this.center_lat === '' || this.center_lat === null) {
			this.hS.getNetworkLatLong();
		}
		this.cS.scrollTop();
	}

	checkRouterUrlForCallingAPI() {
		const postJson: PostJsonBusinessList = {
			sortBy: this.sort_slug,
			page: this.currentPage
		};

		if (this.sort_slug === 'nearMe' || this.sort_slug === 'relevance') {
			postJson.radius = environment.LOCATION_RADIUS;
			postJson.latitude = <any>this.center_lat;
			postJson.longitude = <any>this.center_long;
		}

		if (this.sort_slug === 'relevance') {
			postJson.latitude = <any>this.center_lat;
			postJson.longitude = <any>this.center_long;
		}
		switch (this.activeUrl) {
			case 'promoted-business':
				/*
				*Get all Promoted Business list from server 
				*/
				this.hS.getPromotedBusinessListing(postJson).subscribe((res: any) => {
					console.log(res.data);
					this.BusinessList = res.data;
					this.totalBuinessCount = res.businessesTotalCount;
					this.countCollectionSize();
				}, err => {
					console.log(err);
				});
				break;
			case 'recently-added-business':
				/*
				*Get all Recently added Business list from server 
				*/
				this.hS.getRecentlyAddedBusinessListing(postJson).subscribe((res: any) => {
					this.BusinessList = res.data;
					this.totalBuinessCount = res.businessesTotalCount;
					this.countCollectionSize();
				}, err => {
					console.log(err);
				});
				break;
			case 'most-populuar-business':
				/*
				*Get all Popular added Business list from server
				*/
				this.hS.getPopularBusinessList(postJson).subscribe((res: any) => {
					this.BusinessList = res.data;
					this.totalBuinessCount = res.businessesTotalCount;
					this.countCollectionSize();
				}, err => {
					console.log(err);
				});
				break;
			case 'investment-opportunities':
				/*
				*Get all Investment Opportunity listing from server
				*/
				this.hS.getInvestmentOpportunityList(postJson).subscribe((res: any) => {
					this.BusinessList = res.data;
					this.totalBuinessCount = res.businessesTotalCount;
					this.countCollectionSize();
				}, err => {
					console.log(err);
				});
				break;
			case 'premium-business':
				/*
				*Get all Premium Business list from server 
				*/
				this.hS.getPremiumBusinessListing(postJson).subscribe((res: any) => {
					console.log(res.data);
					this.BusinessList = res.data;
					this.totalBuinessCount = res.businessesTotalCount;
					this.countCollectionSize();
				}, err => {
					console.log(err);
				});
				break;
			default:
				/*
				*Get all Business list from server for category
				*/
				this.getBusinessListByCategory();
				break;
		}
	}

	/**
	* Get Category wise Business listing
	* @returns void
	*/
	getBusinessListByCategory(): void {
		const postJson: PostJsonBusinessList = {
			category_slug: this.activeUrl,
			page: this.currentPage,
			sortBy: this.sort_slug
		};

		this.hS.getBusinessListByCategory(postJson).subscribe((res: any) => {
			if (res.data.businesses) {
				this.BusinessList = res.data.businesses;
				this.totalBuinessCount = res.businessesTotalCount;
			}
			this.countCollectionSize();
		}, err => {
			console.log(err);
		});
	}

	getNextPageBusinessList(event: number): void {
		console.log(event);
		this.businessMarkers = [];
		this.checkRouterUrlForCallingAPI();
	}

	/**
	*Calculate pagination display on screen and count of total businesses 
	*/
	countCollectionSize() {
		if (this.totalBuinessCount > this.perPageList) {
			this.collectionSize = Math.ceil(this.totalBuinessCount / this.perPageList);
			this.collectionSize = this.collectionSize * 10;
			if (this.currentPage === 1) {
				this.first = 1;
				this.last = this.perPageList;
			} else {
				this.first = (this.currentPage - 1) * this.perPageList + 1;
				if (this.BusinessList.length < this.perPageList) {
					this.last = (this.currentPage - 1) * this.perPageList + this.BusinessList.length;
				} else {
					this.last = (this.currentPage - 1) * this.perPageList + this.perPageList;
				}
			}
		} else {
			this.last = this.totalBuinessCount;
			this.collectionSize = this.perPageList;
		}

		if (this.totalBuinessCount == 0 || this.totalBuinessCount == undefined) {
			this.noData = true;
		} else {
			this.noData = false;
		}
		this.cS.scrollTop();
		this.showBusinessOnMap();
	}

	/**
	*Load businesses on map 
	*/
	showBusinessOnMap() {
		for (const x in this.BusinessList) {
			if (this.BusinessList.hasOwnProperty(x)) {
				this.businessMarkers.push({
					latitude: this.BusinessList[x]['latitude'],
					longitude: this.BusinessList[x]['longitude'],
					title: this.BusinessList[x]['name'],
					address: this.BusinessList[x]['address'],
					business_slug: this.BusinessList[x]['business_slug']
				});
			}
		}
	}

	/**
	* open map click
	*/
	clicked(marker: any, pos: any) {
		this.business_title = pos.title;
		this.business_address = pos.address;
		this.business_slug = pos.business_slug;
		let markerEvent = marker.target;
		markerEvent.nguiMapComponent.openInfoWindow('business_name', markerEvent);
	}

	/**
	* filter by name
	*/
	filter(filtername: any) {
		if (filtername == 'asc') {
			this.isShow = false;
		} else {
			this.isShow = true;
		}
	}
}