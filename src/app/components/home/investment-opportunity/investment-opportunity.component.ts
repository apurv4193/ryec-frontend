import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService, CommonService, MessageService} from './../../../services';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'ryec-investment-opportunity',
	templateUrl: './investment-opportunity.component.html',
	styleUrls: ['./investment-opportunity.component.css']
})
export class InvestmentOpportunityComponent implements OnInit {

	currentPage: number;
	modalReference: any;
	routerLink = '';
	activeUrl = '';
	InvestmentList = [];
	sort_slug = '';
	maxSize = 5;
	totalBuinessCount = 0;
	collectionSize = 0;
	first = 1;
	last = 0;
	perPageList = environment.BUSINESS_LIST_LIMIT;
	endPage: number = environment.BUSINESS_LIST_LIMIT;
	business_title = '';
	business_address = '';
	business_slug = '';
	noData = false;
	isShow = true;
	totalInvestmentCount = 0;
	contentShow = false;
	investmentFilter: any;
	minPrice = 0;
	maxPrice = 0;
	from = 0;
	to = 0;
	category_id= [];
	location= [];
	center_lat = localStorage.getItem('latitude');
	center_long = localStorage.getItem('longitude');
	postJson = {
		sortBy: '',
		page: 1,
		min_price: this.minPrice,
		max_price: this.maxPrice,
		location: [],
		category_id: [],
		latitude: 0,
		longitude: 0,
		myInvestment: 0
	}
	isFilter = false;
	isVendor = false;
	myOppoShow = false;

	constructor(
		private modalService: NgbModal,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private hS: HomeService,
		private mS: MessageService,
		private cS: CommonService) {
		const activeUrlArray = this.activeRoute.snapshot.url;

		this.activeRoute.params.subscribe(data => {
			this.routerLink = data.slug;
			if (activeUrlArray.length > 2) {
				this.activeUrl = activeUrlArray[2].path;
			}
			this.currentPage = 1;

			/*
			*Check which type of sorting happend
			*/
			if (this.routerLink === 'relevance') {
				this.sort_slug = '';
			} else if (this.routerLink === 'ratings') {
				this.sort_slug = 'ratings';
			} else if (this.routerLink === 'near-me') {
				this.sort_slug = 'nearMe';
			} else if (this.routerLink === 'recently-added') {
				this.sort_slug = 'recentlyAdded';
			} else if (this.routerLink === 'popular') {
				this.sort_slug = 'popular';
			} else {
				this.router.navigateByUrl('/home');
			}
			this.getInvestmentOpportunity();
		});

		// profile subscription
		this.mS.getProfile().subscribe((data: any) => {
			if (data.isVendor === 1) {
				this.isVendor = true;
			} else {
				this.isVendor = false;
			}
		});
	}

	ngOnInit() {
		this.cS.scrollTop();

		const userProfile = this.cS.getUserDetails();
		if (userProfile) {
			if (userProfile['isVendor'] === 1) {
				this.isVendor = true;
			} else {
				this.isVendor = false;
			}
		}	
	}

	/*
	*Get all Investment Opportunity list from server.
	*/
	getInvestmentOpportunity() {
		this.postJson.sortBy = this.sort_slug;
		this.postJson.page = this.currentPage;
		this.postJson.min_price = this.minPrice;
		this.postJson.max_price = this.maxPrice;
		this.postJson.category_id = this.category_id;
		this.postJson.location = this.location;
		
		if(this.sort_slug === 'nearMe')
		{
			this.postJson.latitude = <any>this.center_lat;
			this.postJson.longitude = <any>this.center_long;
		} else {
			this.postJson.latitude = 0;
			this.postJson.longitude = 0;
		}

		this.hS.getInvestmentOpportunityList(this.postJson).subscribe((res: any) => {
			console.log(res);
			this.InvestmentList = res.data;
			this.totalInvestmentCount = res.investment_count;
			this.countCollectionSize();
		}, err => {
			console.log(err);
		});
	}

	/**
	 * Call API for get next page data
	 * @param event 
	 */
	getNextPageInvestmentOpportunity(event: number): void {
		console.log(event);
		if (this.contentShow) {
			this.getMyInvestmentInterestList();
		} else {
			this.getInvestmentOpportunity();
		}
	}

	/**
	*Calculate pagination display on screen and count of total Investment Opportunity.
	*/
	countCollectionSize() {
		if (this.totalInvestmentCount > this.perPageList) {
			this.collectionSize = Math.ceil(this.totalInvestmentCount / this.perPageList);
			this.collectionSize = this.collectionSize * 10;
			if (this.currentPage === 1) {
				this.first = 1;
				this.last = this.perPageList;
			} else {
				this.first = (this.currentPage - 1) * this.perPageList + 1;
				if (this.InvestmentList.length < this.perPageList) {
					this.last = (this.currentPage - 1) * this.perPageList + this.InvestmentList.length;
				} else {
					this.last = (this.currentPage - 1) * this.perPageList + this.perPageList;
				}
			}
		} else {
			this.last = this.totalInvestmentCount;
			this.collectionSize = this.perPageList;
		}

		if (this.totalInvestmentCount === 0 || this.totalInvestmentCount === undefined) {
			this.noData = true;
		} else {
			this.noData = false;
		}
		this.cS.scrollTop();
	}

	/**
	 * Get Investment Interest List
	 */
	getMyInvestmentInterestList() {

		this.hS.getMyInvestmentInterestList().subscribe((res: any) => {
			console.log(res);
			this.InvestmentList = res.data;
			this.totalInvestmentCount = res.investment_count;
			this.countCollectionSize();
		}, err => {
			console.log(err);
		});
	}

	/**
	 * Get filter data from server
	 * @param content 
	 */
	filter(content: string) {
		this.hS.getInvestmentFilters().subscribe((res: any) => {
			console.log(res);
			this.investmentFilter = res.data;
			if (this.minPrice === 0)
			{
				this.minPrice = this.investmentFilter['min_amount'];
				this.from = this.investmentFilter['min_amount'];
			}

			if (this.maxPrice === 0)
			{
				this.maxPrice = this.investmentFilter['max_amount'];
				this.to = this.investmentFilter['max_amount'];
			}
			
			this.modalReference = this.modalService.open(content, { windowClass: 'filter_popup' });
			this.modalReference.result.then((result: any) => {
				console.log(`Closed with: ${result}`);
			}, (reason: any) => {
				console.log(reason);
				this.minPrice = 0;
				this.maxPrice = 0;
				this.from = 0;
				this.to = 0;
				this.category_id = [];
				this.location = [];
				this.isFilter = false;
				this.getInvestmentOpportunity();
			});
		}, err => {
			console.log(err);
		});
	}

	myOnChange(event: string)
	{
		this.minPrice = event['from'];
		this.maxPrice = event['to'];
	}

	applyFilter()
	{
		this.from = this.minPrice;
		this.to = this.maxPrice;
		this.isFilter = true;
		this.modalReference.close();
		this.getInvestmentOpportunity();
	}


	interestsOpportunity() {
		this.contentShow = true;
		this.myOppoShow = false;
		this.getMyInvestmentInterestList();
	}

	investmentOpportunity() {
		this.myOppoShow = false;
		this.contentShow = false;
		this.minPrice = 0;
		this.maxPrice = 0;
		this.from = 0;
		this.to = 0;
		this.category_id = [];
		this.location = [];
		this.isFilter = false;
		this.postJson.myInvestment = 0;
		this.getInvestmentOpportunity();
	}

	myOpportunity() {
		this.myOppoShow = true;
		this.postJson.myInvestment = 1;
		this.getInvestmentOpportunity();
	}
}
