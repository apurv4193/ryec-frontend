import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './../../../login/modal/forgot-password/forgot-password.component';
import { environment } from './../../../../../environments/environment';
import { HttpService, CommonService  } from './../../../../services';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'ryec-signup-otp',
  templateUrl: './signup-otp.component.html',
  styleUrls: ['./signup-otp.component.css']
})
export class SignupOtpComponent implements OnInit {
	  
	@Input() mobile = 0;
	@Input() country_code = 0;
	@Input() email = '';
	@Input() error = false;
	@Input() message = '';
	@Input() show_message = '';

	countDown: any;
	minutesDisplay: Number = 0;
	secondsDisplay: Number = 0;
	send = false;

	otpForm: FormGroup;
	modalReference: any;
	constructor(
		private fb: FormBuilder,
		public activeModal: NgbActiveModal,
		private hS: HttpService,
		private cS: CommonService,
		private modalService: NgbModal) {

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
		this.startTime();
	}

	/**
	 * OTP verification
	 */
	otpCheck() {
		const obj = {
			text: 'otp',
			otp: this.otpForm.controls.reset_password_otp.value
		}
		this.activeModal.dismiss(obj);
		// if (this.otpForm.valid) {
		// 	this.otpForm.value.phone = this.mobile;
		// 	this.otpForm.value.country_code = this.country_code;

		// 	const uri = environment.RYEC_API_URL + 'user/resetpasswordrequestconfirm';
		// 	this.hS.post(uri, this.otpForm.value).subscribe((res: any) => {
		// 		if (res.status === 1) {
		// 			this.activeModal.dismiss();
		// 		}
		// 	}, err => {
		// 		console.log(err);
		// 	});
		// } else {
		// 	this.validateAllFields(this.otpForm);
		// }
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

	forgotPassword() {
		this.activeModal.dismiss();
		this.modalReference = this.modalService.open(ForgotPasswordComponent, { windowClass: 'mobile_popup' });

		this.modalReference.result.then((result: any) => {
			console.log(`Closed with: ${result}`);
		}, (reason: any) => {
			console.log(reason);
		});
	}

	closePopup() {
		this.activeModal.dismiss();
	}

	resendOTP() {
		if (this.send) {
			const apiUrl = environment.RYEC_API_URL + 'sendRegisterOTP';

			const paramConfig = {
				phone: this.mobile,
				email: this.email,
				country_code: this.country_code
			};

			this.hS.post(apiUrl, paramConfig).subscribe((res) => {
				if (res['status'] === 1) {
					this.cS.showSuccess(res['message']);
					this.show_message = res.message;
					this.send = false;
					this.startTime();
				} else {
					this.show_message = '';
					this.cS.showError(res.message);
				}
			} , (err: any) => {
				this.show_message = '';
				console.log(err);
			});
		}
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
