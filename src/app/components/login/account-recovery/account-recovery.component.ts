import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService, CommonService } from '../../../services';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

const password = new FormControl(null, {
	validators: Validators.compose([Validators.required,
	Validators.minLength(8)])
});
const confirmPassword = new FormControl(null, {
	validators: Validators.compose([Validators.required, CustomValidators.equalTo(password)])
});
@Component({
	selector: 'ryec-account-recovery',
	templateUrl: './account-recovery.component.html',
	styleUrls: ['./account-recovery.component.css']
})
export class AccountRecoveryComponent implements OnInit {

	cgPasswordForm: FormGroup;
	// status alert 0=> something missing, 1=> success, 3=>default not active
	statusAlert: {
		status: 1 | 0 | 3,
		message: string
	};

	token: string;

	constructor(private fB: FormBuilder,
		private hS: HttpService,
		private cS: CommonService,
		private router: ActivatedRoute) {

		this.token = '';


		this.router.queryParams.subscribe(data => {

			if (data.hasOwnProperty('token')) {
				this.token = atob(data.token);
			} else {
				this.cS.navigateTo('/login');
			}

		});

		this.cgPasswordForm = this.fB.group({
			reset_password_otp: [null],
			password: password,
			confirmPassword: confirmPassword,
			phone: [null],
			country_code: [null]
		});

		this.statusAlert = {
			status: 3,
			message: ''
		};
	}

	ngOnInit() {
	}

	submitDetails() {
		if (this.token !== '') {

			if (this.cgPasswordForm.valid) {
				const splitVal = this.token.split(':');
				if (splitVal.length > 2) {
					this.cgPasswordForm.value.reset_password_otp = splitVal[0];
					this.cgPasswordForm.value.phone = splitVal[1];
					this.cgPasswordForm.value.country_code = splitVal[2];
				}

				const apiUrl = environment.RYEC_API_URL + 'user/resetpassword';
				this.hS.post(apiUrl, this.cgPasswordForm.value).subscribe((res: any) => {
					if (res.status === 1) {
						// successful change password navigate to login
						this.cS.showSuccess(res.message);
						this.cS.navigateTo('/login');
					} else {
						this.statusAlert = {
							status: res.status,
							message: res.message
						};
					}
				}, err => {
					if (err.error) {
						this.statusAlert = {
							status: err.error.status,
							message: err.error.message
						};
					}
				});
			} else {
				Object.keys(this.cgPasswordForm.controls).forEach(field => {
					const control = this.cgPasswordForm.get(field);
					if (control) {
						control.markAsTouched({ onlySelf: true });
					}
				});
			}

		} else {
			// if token is not present redirect to login
			this.cS.navigateTo('/login');
		}

	}

}
