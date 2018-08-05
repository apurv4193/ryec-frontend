import { Component, OnInit } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpService } from './../../../services';

@Component({
	selector: 'ryec-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

	privacyPolicyArr: any;
	constructor(private hS: HttpService) { }

	ngOnInit() {
		this.getPrivacyPolicyData();
	}

	/**
	 * Get Privacy Policy data
	 */
	getPrivacyPolicyData() {
		const apiUrl = environment.RYEC_API_URL + 'getCMSList';

		this.hS.get(apiUrl).subscribe(res => {
			for (let x in res.data) {
				if (res.data[x]['type'] === 'privacy') {
					this.privacyPolicyArr = res.data[x];
				}
			}
		}, err => {
			console.log(err);
		});
	}

}
