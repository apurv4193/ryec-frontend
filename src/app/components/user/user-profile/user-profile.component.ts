import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpService, MessageService, CommonService, HomeService } from './../../../services';
import { environment } from './../../../../environments/environment';
import { UserProfile } from './../../../class/data.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
	selector: 'ryec-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

	@ViewChild('userProfile') userProfileRef: ElementRef;
	@ViewChild('userProfileImage') userProfileImageRef: ElementRef;

	profileForm: FormGroup;
	statusAlert: {
		status: 1 | 0 | 3,
		message: string
	};
	countryCodes: any;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	modalReference: any;

	constructor(private fB: FormBuilder,
		private hS: HttpService,
		private hmS: HomeService,
		private configDP: NgbDatepickerConfig,
		private cS: CommonService,
		public snackBar: MatSnackBar,
		private router: Router,
		private mS: MessageService,
		private modalService: NgbModal) {
		
		this.profileForm = this.fB.group({
			personal: this.personalDetailForm()
		});

		this.statusAlert = {
			status: 3,
			message: ''
		};
		// mark disabled date

		const d = new Date();
		this.configDP.minDate = { year: 1900, month: 1, day: 1 };
		this.configDP.maxDate = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
	}

	personalDetailForm(): FormGroup {
		const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		
		return this.fB.group({
			name: [null, Validators.compose([Validators.required])],
			email: [null, Validators.compose([Validators.pattern(EMAIL_REGEXP)])],
			phone: [null],
			dob: [null],
			gender: ['1'],
			notification: [null],
			country_code: ['+91']
		});
	}
 
	ngOnInit() {
		this.getProfile();
		this.hmS.getCountryCode().subscribe((res: any) => {
			this.countryCodes = res['data'];
			console.log(res);
		}, err => {
			console.log(err)
		});
	}

	/**
	 * submit form details
	 */
	submitDetail() {
		if (this.profileForm.valid) {
			const apiUrl = environment.RYEC_API_URL + 'saveprofile';
			const personalVal = this.profileForm.value.personal;
			
			personalVal.dob = (personalVal.dob) ? personalVal.dob.year + '-' + personalVal.dob.month + '-' + personalVal.dob.day : null;
			
			const splitVal = personalVal.phone.split('-');
			personalVal.phone = splitVal[1];
			personalVal.country_code = splitVal[0];
			
			this.hS.post(apiUrl, personalVal).subscribe((res: any) => {
				if (res && res.status === 1) {
					this.mS.setProfile(res.data);
					this.cS.setUserDetails(res.data);
					this.cS.showSuccess(res.message);
					this.cS.navigateTo('/home');
				}
			}, err => {
				console.log(err);
			});
		} else {
			this.profileForm.markAsTouched();
		}
	}

	/**
	 * get Profile data
	 */
	getProfile(): void {
		const uri = environment.RYEC_API_URL + 'getprofile';
		this.hS.get(uri).subscribe((res: any) => {
			this.setProfileData(res.data);
		}, err => {
			console.log(err);
		});
	}

	setProfileData(res: UserProfile) {
		if (res && res.profile_pic_thumbnail) {
			this.setProfilePic(res.profile_pic_thumbnail);
		}
		this.profileForm.patchValue({
			personal: {
				name: res.name,
				email: res.email,
				phone: res.country_code + "-" + res.phone,
				dob: this.getdobModelVal(res.dob),
				gender: (res.gender === 0) ? '1' : res.gender.toString(),
				notification: res.notification
			}
		});
	}

	getdobModelVal(val: string | null) {
		if (val) {
			const arr = this.splitString(val, '-');
			return {
				year: parseInt(arr[0], 10),
				month: parseInt(arr[1], 10),
				day: parseInt(arr[2], 10)
			};
		}
		return null;

	}
	splitString(stringToSplit: string, Seperator: string): Array<string> {

		return stringToSplit.split(Seperator);
	}

	triggerUpload() {
		this.userProfileRef.nativeElement.click();
	}

	/**
	 * Upload User Profile Pic
	 * @param event <any>
	 */
	uploadProfilePic(event: any, content: any) {
		//console.log(event.srcElement.files[0]);
		const srcEle = event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.cS.checkValidImage(srcEle.files[0])) {
				this.imageChangedEvent = event;
				this.modalReference = this.modalService.open(content);
				this.modalReference.result.then((result: any) => {
					console.log(`Closed with: ${result}`);
				}, (reason: any) => {
					console.log(reason);
				});
			} else {
				this.cS.showError('Please select valid image.');
			}
		}
		// const srcEle = event.srcElement;
		// if (srcEle.files && srcEle.files[0]) {
		// 	if (this.cS.checkValidImage(srcEle.files[0])) {
		// 		const formData = new FormData();
		// 		formData.append('profile_pic', srcEle.files[0]);

		// 		const apiUrl = environment.RYEC_API_URL + 'saveProfilePicture';

		// 		this.hS.postUpload(apiUrl, formData).subscribe(res => {
		// 			if (res.data && res.data.profile_pic_thumbnail) {
		// 				this.setProfilePic(res.data.profile_pic_thumbnail);
		// 				this.mS.setProfile(res.data);
		// 				this.cS.setUserDetails(res.data);
		// 			}
		// 		}, err => {
		// 			console.log(err);
		// 		});
		// 	} else {
		// 		console.log('invalid');
		// 		// const snackBarRef = this.snackBar.open('Please upload valid image.', 'Ok', {
		// 		// 	verticalPosition: 'bottom'
		// 		// });

		// 		// snackBarRef.afterDismissed().subscribe(() => {
		// 		// 	console.log('Close');
		// 		// });
		// 		this.cS.showError('Please select file less than 5MB.');
		// 	}
		// }
	}

	setProfilePic(url: string) {
		this.userProfileImageRef.nativeElement.src = url;
	}

	cancelUserProfile() {
		this.router.navigateByUrl('/home');
	}

	imageCropped(image: string) {
		this.croppedImage = image;
	}

	imageLoaded() {
		// show cropper
	}
	loadImageFailed() {
		// show message
	}

	sendCropImage() {
		//console.log(this.modalService);
		console.log(this.croppedImage);
		const block = this.croppedImage.split(';');
		const contentType = block[0].split(':')[1];
		const realData = block[1].split(',')[1];

		const blob = this.cS.b64toBlob(realData, contentType);
		this.modalReference.close();
		const formData = new FormData();
		formData.append('profile_pic', blob);

		const apiUrl = environment.RYEC_API_URL + 'saveProfilePicture';

		this.hS.postUpload(apiUrl, formData).subscribe(res => {
			if (res.data && res.data.profile_pic_thumbnail) {
				this.setProfilePic(res.data.profile_pic_thumbnail);
				this.mS.setProfile(res.data);
				this.cS.setUserDetails(res.data);
				this.cS.showSuccess(res.message);
			}
		}, err => {
			console.log(err);
		});
	}
}
