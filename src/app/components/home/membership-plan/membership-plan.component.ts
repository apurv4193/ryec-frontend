import { Component, OnInit } from '@angular/core';
import { HttpService, CommonService } from './../../../services';
import { environment } from '../../../../environments/environment.prod';
@Component({
	selector: 'ryec-membership-plan',
	templateUrl: './membership-plan.component.html',
	styleUrls: ['./membership-plan.component.css']
})
export class MembershipPlanComponent implements OnInit {

	showPlan = false;
	membershipPlansList: any;
	isApply = 0;

	constructor(
		private httpS: HttpService,
		private cS: CommonService) {
	}

	ngOnInit() {
		this.getMembershipPlans();
	}

	getMembershipPlans() {
		const apiUrl = environment.RYEC_API_URL + 'getSubscriptionPlanList';

		this.httpS.get(apiUrl).subscribe((res: any) => {
			if (res.status === 1) {
				this.membershipPlansList = res.data;
				this.isApply = res.isPendingRequest;
			}
		}, err => {
			if (err.error) {
				console.log(err.error);
			}
		})
	}

	showPlans() {
		if (this.showPlan) {
			this.showPlan = false;
		} else {
			this.showPlan = true;
		}
	}

	selectMembershipPlan(id: number) {
		const postJson = {
			subscription_plans_id: id
		}
		const apiUrl = environment.RYEC_API_URL + 'sendMembershipRequest';

		this.httpS.post(apiUrl, postJson).subscribe((res: any) => {
			if (res.status === 1) {
				this.isApply = 1;
				this.cS.showSuccess(res.message);
			} else {
				this.isApply = 0;
				this.cS.showError(res.message);
			}
		}, err => {
			if (err.error) {
				this.isApply = 0;
				console.log(err.error);
			}
		});
	}
}