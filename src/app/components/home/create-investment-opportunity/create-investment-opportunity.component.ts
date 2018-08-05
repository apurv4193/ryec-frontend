import { Component, OnInit } from '@angular/core';
//import { HomeService, HttpService, CommonService } from './../../../services';
//import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'ryec-create-investment-opportunity',
	templateUrl: './create-investment-opportunity.component.html',
	styleUrls: ['./create-investment-opportunity.component.css']
})
export class CreateInvestmentOpportunityComponent implements OnInit {

	investmentDetail: any;
	constructor(
		//private hS: HomeService,
        //public router: Router,
        //public cS: CommonService,
		//public httpService: HttpService,
		//private activeRoute: ActivatedRoute
	) {
	}

	ngOnInit() {
	}
}