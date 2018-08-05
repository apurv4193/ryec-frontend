import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpService } from './../../../services';
@Component({
selector: 'ryec-term-conditions',
templateUrl: './term-conditions.component.html',
styleUrls: ['./term-conditions.component.css']
})
export class TermConditionsComponent implements OnInit {

	termsConditionsArr: any;
	sublink = false;
	activeLink = 0;
	displayArr: any;
	constructor(private hS: HttpService) {

	}

	ngOnInit() {
		this.getTermsAndConditionsData();
	}

	/**
	 * Get Terms and condition data
	 */
	getTermsAndConditionsData() {
		const apiUrl = environment.RYEC_API_URL + 'getCMSList';

		this.hS.get(apiUrl).subscribe(res => {
			this.termsConditionsArr = res.data;
			for (let x in this.termsConditionsArr) {
				if (this.termsConditionsArr[x]['type'] === 'privacy') {
					this.termsConditionsArr.splice(x, 1);
				}
			}

			if (this.termsConditionsArr.length > 0) {
				this.displayArr = this.termsConditionsArr[0];
			}
		}, err => {
			console.log(err);
		});
	}

	showTermsNDConditions(index: number) {
		this.activeLink = index;
		this.displayArr = this.termsConditionsArr[index];
	}

	sublinkshow(){
		if (this.sublink) {
			this.sublink = false;
		} else {
			this.sublink = true;
		}
	}
}