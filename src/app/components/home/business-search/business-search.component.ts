import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, CommonService, MessageService } from './../../../services';
import { environment } from '../../../../environments/environment';
import {
    marker
} from './../../../class/data.model';
@Component({
    selector: 'ryec-business-search',
    templateUrl: './business-search.component.html',
    styleUrls: ['./business-search.component.css']
})
export class BusinessSearchComponent implements OnInit {

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
    search_city = '';
    search_text = '';

    constructor(
        private activeRoute: ActivatedRoute,
        private hS: HomeService,
        private cS: CommonService,
        private _message: MessageService,
        private router: Router) {
        this.currentPage = 1;
        this.user_lat = localStorage.getItem('latitude');
        this.user_long = localStorage.getItem('longitude');
		/*
		*get url slug
		*/
        this.activeRoute.params.subscribe(data => {

            this.routerLink = data.slug;
            if (data.search) {
                this.search_text = data.search;
            }
            this.search_city = data.city;
            console.log(this.routerLink);
            const obj = {
                city: this.search_city,
                text: this.search_text
            }

            this._message.setBusinessSearchText(obj);

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
            this.getSearchBusinessList();
        });
    }

    ngOnInit() {
        this.cS.scrollTop();
    }

    ngOnDestroy(): void {
        const obj = {
            city: 'All Cities',
            text: ''
        }

        this._message.setBusinessSearchText(obj);
    }

    getSearchBusinessList() {
        const postJson = {
            sortBy: this.sort_slug,
            searchText: this.search_text,
            page: this.currentPage,
            city: this.search_city,
            latitude: 0,
            longitude: 0
        };

        if (this.sort_slug === 'nearMe' || this.sort_slug === 'relevance') {
            postJson.latitude = <any>this.center_lat;
            postJson.longitude = <any>this.center_long;
        }

        if (this.search_city === 'All Cities') {
            postJson.city = '';
        }

		/*
		*Get all Promoted Business list from server.
		*/
        this.hS.getSearchBusinesses(postJson).subscribe((res: any) => {
            this.BusinessList = res.data.businesses;
            this.totalBuinessCount = res.businessesTotalCount;
            this.countCollectionSize();
            console.log(res);
        }, err => {
            console.log(err);
        });
    }


    getNextPageBusinessList(event: number): void {
        console.log(event);
        const obj = {
            city: this.search_city,
            text: this.search_text
        }
        this._message.setBusinessSearchText(obj);
        this.businessMarkers = [];
        this.getSearchBusinessList();
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

        if (this.totalBuinessCount === 0 || this.totalBuinessCount === undefined) {
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
        if (filtername === 'asc') {
            this.isShow = false;
        } else {
            this.isShow = true;
        }
    }
}
