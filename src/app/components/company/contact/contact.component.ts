import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService, CommonService } from './../../../services';
import { environment } from './../../../../environments/environment';
import { CustomValidators } from 'ng2-validation';

@Component({
	selector: 'ryec-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
	
	contactUsForm: FormGroup;
	center_lat = 23.075157;
	center_long = 72.52618499999994;
	statusAlert: {
		status: 1 | 0 | 3,
		message: string
	};
	userDetail: any;

	constructor(private fb: FormBuilder, private hS: HttpService, private cS: CommonService) {
		this.contactUsForm = this.fb.group({
			name: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.required, CustomValidators.email])],
			subject: [null, Validators.compose([Validators.required])],
			description: [null, Validators.compose([Validators.required])],
		});

		this.userDetail = this.cS.getUserDetails();
		if (this.userDetail) {
			this.contactUsForm.controls.name.setValue(this.userDetail.name);
			this.contactUsForm.controls.email.setValue(this.userDetail.email);
		}
	}

	ngOnInit() {
		this.cS.scrollTop();
	}

	onContactUsFormSubmit() {
		console.log(this.contactUsForm.value);

		const apiUrl = environment.RYEC_API_URL + 'contactUs';

		this.hS.post(apiUrl, this.contactUsForm.value).subscribe(res => {
			console.log(res);
			if (res.status === 1) {

				this.cS.showSuccess(res.message);
				// successful change password navigate to login
				this.contactUsForm.reset();

			} else {
				this.statusAlert = {
					status: res.status,
					message: res.message
				};
			}
		});
	}

	/**
	* open map click
	*/
	clicked(markerEvent: any) {
		let marker = markerEvent.target;
		marker.nguiMapComponent.openInfoWindow('ibn', marker);
	}
}