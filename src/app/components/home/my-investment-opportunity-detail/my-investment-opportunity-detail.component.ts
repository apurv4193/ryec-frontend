import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService, CommonService, HttpService } from './../../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment.prod';

@Component({
	selector: 'ryec-my-investment-opportunity-detail',
	templateUrl: './my-investment-opportunity-detail.component.html',
	styleUrls: ['./my-investment-opportunity-detail.component.css']
})
export class MyInvestmentOpportunityDetailComponent implements OnInit {
	routerLink = '';
	activeUrl = '';
	investmentDetail: any;
	activeId = 0;
	videoActiveId = 0;
	interestForm = {
		idea_id: '',
		description: ''
	}
	validDescription = false;
	validForm = false;
	modalReference: any;
	isInterest = false;
	currentPage: number;
	collectionSize = 0;
	perPageList = environment.BUSINESS_LIST_LIMIT;
	allInterest = [];
	totalInerestCount: number;

	constructor(
		private activeRoute: ActivatedRoute,
		private hmS: HomeService,
		private cS: CommonService,
		private httpS: HttpService,
		private modalService: NgbModal) 
	{
		this.currentPage = 1;
		this.activeRoute.params.subscribe(data => {
			this.routerLink = data.slug;
		});
		this.getInvestmentDetailBySlug();
	}

	ngOnInit() {
		this.cS.scrollTop();
	}

	getInvestmentDetailBySlug(): void {
		const postJson = { idea_slug: this.routerLink };

		this.hmS.getInvestmentDetailBySlug(postJson).subscribe((res: any) => {
			this.investmentDetail = res.data;
			this.interestForm.idea_id = this.investmentDetail['id'];
			this.allInterest = this.investmentDetail['interests'];
			if (this.investmentDetail['interest_flag'] === 1) {
				this.isInterest = true;
			} else {
				this.isInterest = false;
			}
			this.totalInerestCount = this.allInterest.length;
			this.countCollectionSize();
		}, err => {
			console.log(err);
		});

	}

	/**
		*open Image in modal view
	*/
	openImageViwer(index: number, content: string) {
		console.log(index);
		this.activeId = index;
		this.modalService.open(content, { windowClass: 'image_gallery' }).result.then((result) => {
			console.log(`Closed with: ${result}`);
		}, (reason) => {
			console.log(reason);
		});
	}


	/**
		*open Video in modal view
	*/
	openVideoViwer(index: number, content: string) {
		this.videoActiveId = index;
		this.modalService.open(content, { windowClass: 'video_gallery' }).result.then((result) => {
			console.log(`Closed with: ${result}`);
		}, (reason) => {
			console.log(reason);
		});
	}

	openShowInterest(content: string) {
		this.modalReference = this.modalService.open(content, { windowClass: 'enquiry_popup' });
		this.modalReference.result.then((result: any) => {
			console.log(`Closed with: ${result}`);
		}, (reason: any) => {
			console.log(reason);
		});
	}

	changeTitleEvent(event?: any) {
		console.log(event);
		if (this.interestForm.description === '' && this.interestForm.description.trim() == '') {
			this.validDescription = true;
			this.validForm = false;
		}
		else {
			this.validDescription = false;
			this.validForm = true;
		}
	}


	submitInterestDetail() {

		const apiUrl = environment.RYEC_API_URL + 'addInvestmentInterest';

		this.httpS.post(apiUrl, this.interestForm).subscribe((res: any) => {
			console.log(res);
			if (res.status === 1) {
				this.isInterest = true;
				this.cS.showSuccess(res.message);
			}
			else {
				this.cS.showError(res.message);
			}
			this.modalReference.close();
		}, err => {
			if (err.error) {
				console.log(err.error);
			}
		})
	}

	/**
        *get investment interent list
    */
   getNextPageRatingList(event?: number): void {
		console.log(event);
		// const postJson = { business_id: this.idea_id, page: this.currentPage};

		// this.hS.getBusinessRating(postJson).subscribe((res: any) => {
		// 	console.log(res);
		// 	if(res.status == 1)
		// 	{
		// 		this.allRatings = res.data.reviews;
		// 		console.log('revi');
		// 		console.log(this.allRatings)
		// 		this.countCollectionSize();
		// 	}
		// }, err => {
		// 	console.log(err);
		// });
	}

	countCollectionSize() {
        if (this.totalInerestCount > this.perPageList) {
            this.collectionSize = Math.ceil(this.totalInerestCount / this.perPageList);
            this.collectionSize = this.collectionSize * 10;
        } else {
            this.collectionSize = this.perPageList;
        }
    }

}
