import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { HttpService, CommonService } from '../../../../services';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
@Component({
	selector: 'ryec-otp',
	templateUrl: './otp.component.html',
	styleUrls: ['./otp.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OtpComponent implements OnInit {

	@Input() mobile = 0;
	@Input() country_code = 0;
	@Input() message = '';

	otpForm: FormGroup;
	countDown: any;
	minutesDisplay: Number = 0;
	secondsDisplay: Number = 0;
	send = false;

	constructor(private fb: FormBuilder,
		public activeModal: NgbActiveModal,
		private router: Router,
		private cS: CommonService,
		private hS: HttpService) {

		this.otpForm = this.fb.group({
			phone: [null],
			reset_password_otp: [null, Validators.compose([Validators.required,
			Validators.maxLength(6),
			Validators.minLength(6),
			Validators.pattern('^[0-9]+$')])],
			country_code: []
		});
	} 


	ngOnInit() {
		console.log(this.message);
		this.startTime();
	}

	/**
	 * resend OTP again
	 */
	resendOTP(): void {
		if (this.send) {
			const uri = environment.RYEC_API_URL + 'user/resetpasswordrequest';
			this.hS.post(uri, { phone: this.mobile, country_code: this.country_code }).subscribe((data: any) => {
				if (data.status === 1) {
					this.cS.showSuccess(data.message);
					this.message = data.message;
					this.send = false;
					this.startTime();
				} else {
					this.message = '';
					this.cS.showError(data.message);
				}
			}, err => {
				this.message = '';
				console.log(err);
			});
		}
	}

	/**
	 * OTP verification
	 */
	otpCheck() {
		if (this.otpForm.valid) {
			this.otpForm.value.phone = this.mobile;
			this.otpForm.value.country_code = this.country_code;

			const uri = environment.RYEC_API_URL + 'user/resetpasswordrequestconfirm';
			this.hS.post(uri, this.otpForm.value).subscribe((res: any) => {
				if (res.status === 1) {
					// dismiss active model
					this.activeModal.dismiss();
					console.log(res);

					const tokenMix = btoa(res.data.reset_password_otp + ':' + this.otpForm.value.phone + ':' + this.otpForm.value.country_code);
					this.router.navigate(['account-recovery'], { queryParams: { token: tokenMix } });
				} else {
					this.cS.showError(res.message);
				}
			}, err => {
				console.log(err);
			});
		} else {
			this.validateAllFields(this.otpForm);
		}
	}

	validateAllFields(Fg: FormGroup) {
		Object.keys(Fg.controls).forEach(field => {
			const control = Fg.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFields(control);
			}
		});
	}

	startTime() {
		let count = environment.RESEND_OTP_TIME;

		this.countDown = Observable.timer(1, 1000).pipe(
			take(count),
			map(() => {
				--count;
				this.secondsDisplay = this.getSeconds(count);
				this.minutesDisplay = this.getMinutes(count);
				if (count === 0) {
					this.send = true;
				}
			}));
	}

	getSeconds(ticks: number) {
		return this.pad(ticks % 60);
	}
	
	getMinutes(ticks: number) {
		return this.pad((Math.floor(ticks / 60)) % 60);
	}

	pad(digit: any) { 
		return digit <= 9 ? '0' + digit : digit;
	}
}