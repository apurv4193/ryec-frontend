import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, HttpService, HomeService, CommonService, MessageService } from './../../services';
import { LoginConfig, SignUpLoginRes } from './../../class/data.model';
import { environment } from './../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './modal/forgot-password/forgot-password.component';

@Component({
	selector: 'ryec-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	// @Input() name: string;
	@HostListener('document:click', ['$event'])
	clickout(event: any) {
		if (this.eRef.nativeElement.contains(event.target)) {
			if (event.srcElement.className !== 'dropbtn') {
				this.showDropDown = false;
			}
		} else {
			this.showDropDown = false;
		}
	}

	loginForm: FormGroup;
	returnUrl: string;
	showlogin: boolean;
	// status alert 0=> something missing, 1=> success, 3=>default not active
	statusAlert: {
		status: 1 | 0 | 3,
		message: string
	};
	modalReference: any;
	countryCodes: any;
	country_code = '+91';
	country_img = '';
	showDropDown = false;

	constructor(private fb: FormBuilder,
		private authService: AuthService,
		private hS: HttpService,
		private eRef: ElementRef,
		private hmS: HomeService,
		private cS: CommonService,
		private mS: MessageService,
		private router: Router,
		private modalService: NgbModal,
		private currentRoute: ActivatedRoute) {

		this.returnUrl = this.currentRoute.snapshot.queryParams['returnUrl'] || '/';

		this.loginForm = this.fb.group({
			mobnumber: [null, Validators.compose([Validators.required,
			Validators.maxLength(13),
			Validators.minLength(6),
			Validators.pattern('^[0-9]+$')])],
			password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
			country_code: ['+91']
		});

		this.statusAlert = {
			status: 3,
			message: ''
		};
		this.showlogin = true;
	}

	ngOnInit() {
		this.hmS.getCountryCode().subscribe((res: any) => {
			this.countryCodes = res['data'];
			for (let x in this.countryCodes) {
				if (this.country_code === this.countryCodes[x]['country_code']) {
					this.country_img = this.countryCodes[x]['country_flag'];
				}
			}
			console.log(res);
		}, err => {
			console.log(err)
		});
	}

	submitDetails(): void {
		if (this.loginForm.valid) {

			const apiUrl = environment.RYEC_API_URL + 'login';
			const paramConfig: LoginConfig = {
				username: this.loginForm.controls.mobnumber.value,
				password: this.loginForm.controls.password.value,
				country_code: this.country_code,
				device_type: '3',
				device_id: null,
				device_token: null,
				social_token: null,
				social_type: null
			};

			this.hS.post(apiUrl, paramConfig).subscribe((res: SignUpLoginRes) => {

				console.log(res);
				if (res.status === 1 && res.data) {
					this.cS.showSuccess(res.message);
					// successful login can save token in localstorage
					this.authService.setToken(res.data.loginToken);
					// set User profile data
					this.cS.setUserDetails(res.data);
					this.mS.setProfile(res.data);
					// set if agent approve or not
					this.setAgentApprovalStatus(res.data.agent_approved);

					// set if user register business already
					if (res.data.isVendor === 1) {

						this.cS.businessModel.is_Register = true;
						this.cS.businessModel.business_id = res.data.business_id;
						this.cS.businessModel.business_name = res.data.business_name;
						this.cS.businessModel.business_approved = res.data.business_approved;
						this.cS.businessModel.business_slug = res.data.business_slug;

						this.cS.setBusinessRegiFlag();
						this.mS.setBusinessDetailUpdate(this.cS.businessModel);
						this.mS.setRegisterbusiness(true);
					} else if (res.data.isVendor === 0) {
						this.mS.setRegisterbusiness(false);
						this.mS.setBusinessDetailUpdate(this.cS.businessModel);
					}

					// if returnUrl params set rediret to it else go to '/'
					if (res.data.first_login === 1) {
						this.router.navigateByUrl('/user/change-password');
					} else {
						this.router.navigateByUrl('/home');
					}
				} else {
					this.cS.showError(res.message);
					this.statusAlert = {
						status: res.status,
						message: res.message
					};
				}
			}, err => {
				console.log(err);
				if (err.error) {
					this.statusAlert = {
						status: err.error.status,
						message: err.error.message
					};
				}
			});
		} else {
			this.loginForm.markAsTouched();
		}
	}

	sendOTPonMobile() {

		this.modalReference = this.modalService.open(ForgotPasswordComponent, { windowClass: 'mobile_popup' });

		this.modalReference.result.then((result: any) => {
			console.log(`Closed with: ${result}`);
		}, (reason: any) => {
			console.log(reason);
		});
	}

	/**
	* Set Agent Status to storage
	*  // note that P => pending approval A=> agent approved NA=> not apply yet
	* @param val <string>
	* @returns void
	*/
	setAgentApprovalStatus(val: any): void {
		switch (val) {
			case 'pending':
				this.cS.setData('isAgent', 'P');
				this.mS.setAgentStatus('P');
				break;

			case 'approved':
				console.log('asdasda');
				this.cS.setData('isAgent', 'A');
				this.mS.setAgentStatus('A');
				break;

			default:
				this.cS.setData('isAgent', 'NA');
				this.mS.setAgentStatus('NA');
				break;
		}
	}

	selectCountry(countryObj: any) {
		console.log(countryObj);
		this.country_code = countryObj['country_code'];
		this.country_img = countryObj['country_flag'];
		this.showDropDown = false;
	}

	selectCountryCode() {
		if (this.showDropDown) {
			this.showDropDown = false;
		} else {
			this.showDropDown = true;
		}
	}

	openTermsConditions() {
		this.router.navigateByUrl('/terms-conditions');
	}

	onEvent(event: any) {
		console.log(event);
		this.showDropDown = true;
		console.log(this.showDropDown);
	}

	numberOnly(event: any): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		  return false;
		}
		return true;
	}
}
