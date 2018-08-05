import { Component, OnInit, ViewEncapsulation, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService, CommonService, HomeService } from './../../../../services';
import { environment } from '../../../../../environments/environment';
import { OtpComponent } from './../otp/otp.component';

@Component({
	selector: 'ryec-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit {

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

	forgotPassword: FormGroup;
	countryCodes: any;
	country_code = '+91';
	country_img = '';
	showDropDown = false;
	error = false;
	email = '';
	message = '';
	successMsg = '';

	constructor(private fb: FormBuilder,
		public activeModal: NgbActiveModal,
		private hS: HttpService,
		private eRef: ElementRef,
		private hmS: HomeService,
		private cS: CommonService,
		private modalService: NgbModal) {

		this.forgotPassword = this.fb.group({
			phone: [null, Validators.compose([Validators.required,
			Validators.maxLength(13),
			Validators.minLength(6),
			Validators.pattern('^[0-9]+$')])],
			country_code: ['+91']
		});
	}

	ngOnInit() {
		this.hmS.getCountryCode().subscribe((res: any) => {
			this.countryCodes = res['data'];
			for (let x in this.countryCodes) {
				if (this.country_code === this.countryCodes[x]['country_code']) {
					this.country_img = this.countryCodes[x]['country_flag'];
				}
			}
		}, err => {
			console.log(err);
		});
	}

	sendOTP() {
		this.error = false;
		if (this.forgotPassword.valid) {
			this.forgotPassword.controls.country_code.setValue(this.country_code);
			const uri = environment.RYEC_API_URL + 'user/resetpasswordrequest';
			this.hS.post(uri, this.forgotPassword.value).subscribe((data: any) => {
				if (data['status'] === 1) {
					this.cS.showSuccess(data.message);
					this.successMsg = data.message;
					this.openOTPModal();
				} else {
					this.successMsg = '';
					if (data['data']['error'] !== undefined) {
						const error_code = data['data']['error']['errorcode'];
						if (error_code === 'foreign_country_code') {
							this.error = true;
							this.email = data['data']['error']['email'];
							this.message = data['message'];
						} else {
							this.cS.showError(data.message);
						}
					} else {
						this.cS.showError(data.message);
					}
				}
			}, err => {
				this.cS.showError(err.error.message);
				console.log(err);
			});

		} else {
			this.cS.triggerValidation(this.forgotPassword);
		}
	}

	openOTPModal() {
		// dismiss active forgot password model
		this.activeModal.dismiss();

		// open otp model
		const modalReference = this.modalService.open(OtpComponent, { windowClass: 'mobile_popup' });

		modalReference.componentInstance.mobile = this.forgotPassword.value.phone;
		modalReference.componentInstance.country_code = this.forgotPassword.value.country_code;
		modalReference.componentInstance.message = this.successMsg;
		
		modalReference.result.then((result: any) => {
			console.log(`Closed with: ${result}`);
		}, (reason: any) => {
			console.log(reason);
		});
	}

	selectCountry(countryObj: any) {
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
}
