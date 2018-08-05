import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { environment } from '../../../environments/environment';
import { HttpService, CommonService } from './../../services';

function NotSameAsOld(oldPwd: AbstractControl): ValidatorFn {
	// const hasExclamation = input.value !== this.o_password.value;
	return (control: AbstractControl) => {
		return control.value === oldPwd.value ? {
			NotSameAsOld: {
				valid: false
			}
		} : null;
	};
}

const oldPassword = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)]));
const newPassword = new FormControl(null, {
	validators: Validators.compose([Validators.required,
	Validators.minLength(8), NotSameAsOld(oldPassword)])
});
const confirmPassword = new FormControl(null, {
	validators: Validators.compose([Validators.required, CustomValidators.equalTo(newPassword)])
});

@Component({
	selector: 'ryec-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

	cgPasswordForm: FormGroup;
	// status alert 0=> something missing, 1=> success, 3=>default not active
	statusAlert: {
		status: 1 | 0 | 3,
		message: string
	};


	constructor(private fB: FormBuilder,
		private hS: HttpService,
		private cS: CommonService) {
		this.cgPasswordForm = this.fB.group({
			oldPassword: oldPassword,
			newPassword: newPassword,
			confirmPassword: confirmPassword
		});

		this.statusAlert = {
			status: 3,
			message: ''
		};
	}

	ngOnInit() {
	}

	/**
	 * submit form details registration process
	 */
	submitDetails() {
		if (this.cgPasswordForm.valid) {

			const apiUrl = environment.RYEC_API_URL + 'changepassword';

			this.hS.post(apiUrl, this.cgPasswordForm.value).subscribe((res: any) => {

				if (res.status === 1) {
					this.statusAlert = {
						status: res.status,
						message: res.message
					};
					// successful change password navigate to login
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
	}
}
