import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../environments/environment';
import { HttpService, CommonService, HomeService } from './../../../services';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'ryec-add-owner',
    templateUrl: './add-owner.component.html',
    styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        console.log(event.srcElement.className);
        if (this.eRef.nativeElement.contains(event.target)) {
            if (event.srcElement.className !== 'dropbtn') {
                this.showDropDown = false;
            }
        } else {
            this.showDropDown = false;
        }
    }

    @ViewChild('userProfile') userProfileRef: ElementRef;
    @ViewChild('userProfileImage') userProfileImpapiageRef: ElementRef;

    userProfilePic = '../assets/images/default_image.png';
    isPhotoSelect = false;
    addOwnerForm: FormGroup;
    childrenArray: Array<{ id: 0, children_name: string, operation?: string }> = [];
    deletedChildrenArray: Array<{ id: 0, children_name: string, operation?: string }> = [];
    socialActivityArray: Array<{ id: 0, activity_title: string, operation?: string }> = [];
    deleteSocialActivityArray: Array<{ id: 0, activity_title: string, operation?: string }> = [];
    ownerInfo =
        {
            children: this.childrenArray,
            social_activities: this.socialActivityArray
        };
    deletedOwnerInfo = {
        delete_children: this.deletedChildrenArray,
        delete_activities: this.deleteSocialActivityArray
    }
    socialEditFlag: number = -1;
    childEditFlag: number = -1;
    ownerFormData: FormData = new FormData();
    business_id = 0;
    owner_id = 0;
    countryCodes: any;
    label: any;
    business_name: any;
    country_code = '+91';
    country_img = '';
    showDropDown = false;
    public_access = false;
    imageChangedEvent: any = '';
	croppedImage: any = '';
	modalReference: any;

    constructor(private location: Location,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public hS: HttpService,
        private eRef: ElementRef,
        private configDP: NgbDatepickerConfig,
        public hmS: HomeService,
        public cS: CommonService,
        private modalService: NgbModal) {
        //const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        this.addOwnerForm = this.fb.group({
            full_name: [null, Validators.compose([Validators.required])],
            email_id: [null, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
            mobile: [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(13), Validators.pattern('[0-9]*')])],
            dob: [],
            gender: [],
            designation: [],
            father_name: [],
            native_village: [],
            maternal_home: [],
            kul_gotra: [],
            children: [],
            social_activities: [],
            facebook_url: [],
            twitter_url: [],
            linkedin_url: [],
            instagram_url: [],
            country_code: ['+91']
        });

        this.business_name = localStorage.getItem('business_name');

        const d = new Date();
        this.configDP.minDate = { year: 1900, month: 1, day: 1 };
        this.configDP.maxDate = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    }

    ngOnInit() {
        this.cS.scrollTop();
        this.route.queryParams
            .subscribe(params => {
                this.business_id = <any>atob(params.business_id);
                this.owner_id = <any>atob(params.owner_id);
                if (this.owner_id != 0) {
                    this.label = "ang_edit";
                    this.getOwnerInformation();
                }
                else {
                    this.public_access = true;
                    this.label = "ang_add";
                }
            });

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

    /*
    *Get owner detail by owner id
    */
    getOwnerInformation() {
        const uri = environment.RYEC_API_URL + 'getOwnerInfo';
        const postJson = { owner_id: this.owner_id }
        this.hS.post(uri, postJson).subscribe((res: any) => {
            if (res.data.dob != null) {
                const date = res.data.dob.split('-');
                if (date.length > 2) {
                    const dob = {
                        year: parseInt(date[0]),
                        month: parseInt(date[1]),
                        day: parseInt(date[2])
                    }
                    this.addOwnerForm.controls.dob.setValue(dob);
                }
            }
            this.userProfilePic = res.data.photo_original;
            this.addOwnerForm.controls.full_name.setValue(res.data.full_name);
            this.addOwnerForm.controls.email_id.setValue(res.data.email_id);
            this.addOwnerForm.controls.country_code.setValue(res.data.country_code);
            this.addOwnerForm.controls.mobile.setValue(res.data.mobile);
            this.addOwnerForm.controls.designation.setValue(res.data.designation);
            this.addOwnerForm.controls.gender.setValue("" + res.data.gender + "");
            this.addOwnerForm.controls.father_name.setValue(res.data.father_name);
            this.addOwnerForm.controls.native_village.setValue(res.data.native_village);
            this.addOwnerForm.controls.maternal_home.setValue(res.data.maternal_home);
            this.addOwnerForm.controls.kul_gotra.setValue(res.data.kul_gotra);
            this.addOwnerForm.controls.facebook_url.setValue(res.data.social_profiles.facebook_url);
            this.addOwnerForm.controls.twitter_url.setValue(res.data.social_profiles.twitter_url);
            this.addOwnerForm.controls.linkedin_url.setValue(res.data.social_profiles.linkedin_url);
            this.addOwnerForm.controls.instagram_url.setValue(res.data.social_profiles.instagram_url);
            for (let x in res.data.children) {
                res.data.children[x].operation = 'edit';
                this.ownerInfo.children.push(res.data.children[x])
            }
            for (let x in res.data.social_activities) {
                res.data.social_activities[x].operation = 'edit';
                this.ownerInfo.social_activities.push(res.data.social_activities[x])
            }
            // if (res.data.public_access == 1) {
            //     this.public_access = true;
            // } else {
            //     this.public_access = false;
            // }
        }, err => {
            console.log(err);
        });
    }

    addChild() {
        if (this.addOwnerForm.value['children'] != null) {
            if (this.childEditFlag == -1) {
                this.ownerInfo.children.push({ id: 0, children_name: this.addOwnerForm.value['children'], operation: 'add' });
            }
            else {
                this.ownerInfo.children[this.childEditFlag]['children_name'] = this.addOwnerForm.value['children'];
                this.childEditFlag = -1;
            }
            this.addOwnerForm.controls.children.setValue("");
        }
    }

    addSocialActivity() {
        if (this.addOwnerForm.value['social_activities'] != null) {
            if (this.socialEditFlag == -1) {
                this.ownerInfo.social_activities.push({ id: 0, activity_title: this.addOwnerForm.value['social_activities'], operation: 'add' });
            }
            else {
                this.ownerInfo.social_activities[this.socialEditFlag]['activity_title'] = this.addOwnerForm.value['social_activities'];
                this.socialEditFlag = -1;
            }
            this.addOwnerForm.controls.social_activities.setValue("");
        }
    }

    editSocialActivity(index: number) {
        this.addOwnerForm.controls.social_activities.setValue(this.ownerInfo.social_activities[index]['activity_title']);
        this.socialEditFlag = index;
    }

    editChildActivity(index: number) {
        this.addOwnerForm.controls.children.setValue(this.ownerInfo.children[index]['children_name']);
        this.childEditFlag = index;
    }

    deleteSocialActivity(index: number) {
        let obj = { ...this.ownerInfo.social_activities[index] };
        this.ownerInfo.social_activities.splice(index, 1);
        if (obj.id != 0) {
            obj.operation = 'delete';
            this.deletedOwnerInfo.delete_activities.push(obj);
        }
    }

    deleteChild(index: number) {
        console.log(this.ownerInfo.children);
        let obj = { ...this.ownerInfo.children[index] };
        this.ownerInfo.children.splice(index, 1);
        if (obj.id != 0) {
            obj.operation = 'delete';
            this.deletedOwnerInfo.delete_children.push(obj);
        }
        console.log(this.deletedOwnerInfo.delete_children);

    }

    onSubmitAddOwner() {
        if (this.addOwnerForm.controls.mobile.value !== '' && this.addOwnerForm.controls.email_id.value !== '' && this.addOwnerForm.controls.full_name.value !== '') {
            if (this.userProfilePic != '') {
                let social_links = JSON.stringify({
                    facebook_url: this.addOwnerForm.value['facebook_url'],
                    twitter_url: this.addOwnerForm.value['twitter_url'],
                    linkedin_url: this.addOwnerForm.value['linkedin_url'],
                    instagram_url: this.addOwnerForm.value['instagram_url']
                });

                let apiUrl = environment.RYEC_API_URL + 'addOwner';
                if (this.owner_id != 0) {
                    apiUrl = environment.RYEC_API_URL + 'editOwner';
                }

                for (let x in this.deletedOwnerInfo.delete_children) {
                    this.ownerInfo.children.push(this.deletedOwnerInfo.delete_children[x]);
                }
                for (let x in this.deletedOwnerInfo.delete_activities) {
                    this.ownerInfo.social_activities.push(this.deletedOwnerInfo.delete_activities[x]);
                }

                if (this.owner_id != 0) {
                    this.ownerFormData.append("id", <any>this.owner_id);
                }

                if (this.addOwnerForm.controls.dob.value != null) {
                    this.ownerFormData.append("dob", this.addOwnerForm.controls.dob.value['year'] + "-" + this.addOwnerForm.controls.dob.value['month'] + "-" + this.addOwnerForm.controls.dob.value['day']);
                }

                this.ownerFormData.append("business_id", <any>this.business_id);
                this.ownerFormData.append("full_name", this.addOwnerForm.controls.full_name.value);
                this.ownerFormData.append("email_id", this.addOwnerForm.controls.email_id.value);
                this.ownerFormData.append("mobile", this.addOwnerForm.controls.mobile.value);
                this.ownerFormData.append("gender", this.addOwnerForm.controls.gender.value);
                this.ownerFormData.append("father_name", this.addOwnerForm.controls.father_name.value);
                this.ownerFormData.append("native_village", this.addOwnerForm.controls.native_village.value);
                this.ownerFormData.append("maternal_home", this.addOwnerForm.controls.maternal_home.value);
                this.ownerFormData.append("kul_gotra", this.addOwnerForm.controls.kul_gotra.value);
                this.ownerFormData.append("children", JSON.stringify(this.ownerInfo.children));
                this.ownerFormData.append("social_activities", JSON.stringify(this.ownerInfo.social_activities));
                this.ownerFormData.append("social_profiles", social_links);
                this.ownerFormData.append("designation", this.addOwnerForm.controls.designation.value);
                this.ownerFormData.append("country_code", this.country_code);

                this.hS.postUpload(apiUrl, this.ownerFormData).subscribe((res: any) => {
                    if (res['status'] == 1) {
                        this.cS.showSuccess(res['message']);
                        if (this.owner_id === 0) {
                            this.resetForm();
                            localStorage.removeItem('business_name');
                            this.location.back();
                        }
                    } else {
                        this.cS.showError(res['message']);
                    }
                });
            } else {
                this.cS.showError('Please select Owner profile picture');
            }
        } else {
            this.cS.showError('Please fill all required field');
        }
    }

    resetForm() {
        this.childrenArray = [];
        this.socialActivityArray = [];
        this.deletedChildrenArray = [];
        this.deleteSocialActivityArray = [];
        this.addOwnerForm.reset();
        this.userProfilePic = '../assets/images/default_image.png';

        this.ownerInfo = {
            children: this.childrenArray,
            social_activities: this.socialActivityArray
        };

        this.deletedOwnerInfo = {
            delete_children: this.deletedChildrenArray,
            delete_activities: this.deleteSocialActivityArray
        };
    }

    triggerUpload() {
        this.userProfileRef.nativeElement.click();
    }

    uploadProfilePic(event: any, content: any) {
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
        //     if (this.cS.checkValidImage(srcEle.files[0])) {
        //         this.ownerFormData.append('photo', srcEle.files[0]);
        //         this.isPhotoSelect = true;
        //         this.readURL(srcEle);
        //     } else {
        //         this.cS.showError('Please select file less than 5MB.');
        //     }
        // }
    }

    readURL(input: any) {
        let self = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                self.userProfilePic = e['target']['result'];
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    cancelEditOwner() {
        localStorage.removeItem('business_name');
        this.location.back();
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
		//console.log(this.croppedImage);
		const block = this.croppedImage.split(';');
		const contentType = block[0].split(':')[1];
		const realData = block[1].split(',')[1];

        const blob = this.cS.b64toBlob(realData, contentType);
        console.log(blob);
        this.modalReference.close();
        this.userProfilePic = this.croppedImage;
        this.ownerFormData.append('photo', blob);
        this.isPhotoSelect = true;
	}

    numberOnly(event: any): boolean
    {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
