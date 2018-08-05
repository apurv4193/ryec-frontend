import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegBusinessConfig, SignUpLoginSubRes } from './../../../class/data.model';
import { HttpService, CommonService, MessageService } from './../../../services';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators } from 'ng2-validation';
@Component({
	selector: 'ryec-add-business',
	templateUrl: './add-business.component.html',
	styleUrls: ['./add-business.component.css']
})
export class AddBusinessComponent implements OnInit {

	RegBusinessForm: FormGroup;
	userDetails: SignUpLoginSubRes | null;
	successFul_registration: boolean;
	lateLongobj = {};
	agentStatus: boolean;
	agentSub: Subscription;
	registerBusiness = false;
	constructor(private fb: FormBuilder,
		private hS: HttpService,
		private router: Router,
		private mS: MessageService,
		private cS: CommonService) {
		this.agentStatus = true;
		this.RegBusinessForm = this.fb.group({
			name: [null, Validators.required],
			mobile: [null],
			email_id: [null, CustomValidators.email],
			address: [null, Validators.compose([Validators.required])],
			description: [null]

		});
		this.userDetails = null;
		this.successFul_registration = false;
		// agent Status Subscription
		this.agentSub = this.mS.getAgentStatus().subscribe(res => {
			if (res.isAgent === 'P') {
				this.agentStatus = true;
			} else if (res.isAgent === 'A') {
				this.agentStatus = false;
			} else {
				this.agentStatus = true;
			}
		});
	}
	ngOnInit() {
		this.cS.scrollTop();
		const isAgentVal = this.cS.getData('isAgent');
		if (isAgentVal && isAgentVal === 'A') {
			this.agentStatus = false;
		} else if (isAgentVal && isAgentVal === 'P') {
			this.agentStatus = true;
		} else {
			this.agentStatus = true;
		}
		this.userDetails = this.cS.getUserDetails();

		if (this.userDetails) {
			this.RegBusinessForm.patchValue({
				mobile: this.userDetails.country_code + "-" + this.userDetails.phone
			});
		}
		this.successFul_registration = this.cS.isBusinessRegister();

	}

	ngOnDestroy(): void {
		this.agentSub.unsubscribe();
		if (!this.registerBusiness && !this.successFul_registration) {
			this.skipBusinessReg();
		}
	}

	// register businessDetails
	submitDetails() {
		if (this.RegBusinessForm.valid) {
			this.registerBusiness = true;
			const apiUrl = environment.RYEC_API_URL + 'addBusiness';

			const splitVal = this.RegBusinessForm.value.mobile.split('-');
			this.RegBusinessForm.value.mobile = splitVal[1];
			this.RegBusinessForm.value.country_code = splitVal[0];

			const paramConfig: RegBusinessConfig = this.RegBusinessForm.value;

			paramConfig['latitude'] = this.lateLongobj['latitude'];
			paramConfig['longitude'] = this.lateLongobj['longitude'];
			this.hS.post(apiUrl, paramConfig).subscribe((res) => {
				console.log(res);
				if (res.status === 1) {
					this.successFul_registration = true;

					this.cS.businessModel.is_Register = true;
					this.cS.businessModel.business_approved = 0;
					this.cS.businessModel.business_id = res.data.business_id;
					this.cS.businessModel.business_name = res.data.business_name;
					this.cS.businessModel.business_slug = res.data.business_slag;
					this.cS.setBusinessRegiFlag();
					this.mS.setRegisterbusiness(true);
					this.mS.setBusinessDetailUpdate(this.cS.businessModel);
				} else {
				}
			});
		} else {
			this.RegBusinessForm.markAsTouched();
		}
	}

	skipBusinessReg() {
		this.cS.businessModel.skipped = true;
		this.cS.setBusinessRegiFlag();
		this.mS.setRegisterbusiness(false);
		// navigate to user profile
		this.router.navigate(['user']);
	}

	placeChanged(place: any) {
		console.log(place);
		this.lateLongobj = {
			'latitude': place.geometry.location.lat(),
			'longitude': place.geometry.location.lng()
		};

		this.RegBusinessForm.value['address'] = place['formatted_address'];
	}
}