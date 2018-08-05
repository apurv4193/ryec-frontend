import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HomeService, HttpService, CommonService, MessageService } from './../../../services';
import {
    BusinessListDetailsRes
} from './../../../class/data.model';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'ryec-business-profile',
    templateUrl: './business-profile.component.html',
    styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (this.eRef.nativeElement.contains(event.target)) {
            console.log(event.srcElement.className);

            if (event.srcElement.className === "fa fa-list-ul side_menu_icon" || event.srcElement.className === "ng-untouched ng-pristine ng-valid") {
                this.isTimeZoneShow = false;
            } else if (event.srcElement.className === 'container' || event.srcElement.className === 'ng-pristine ng-valid ng-touched' || event.srcElement.className === '' || event.srcElement.className === 'ng-star-inserted') {
                this.isTimeZoneShow = false;
            } else {
                if (event.srcElement.className === 'profile_menu_icon') {
                    this.isTimeZoneShow = false;
                }
                if (event.srcElement.className === 'city-search ng-untouched ng-pristine ng-valid' || event.srcElement.className === 'city-search ng-touched ng-dirty ng-valid') {
                    this.isTimeZoneShow = true;
                }
            }

            if (event.srcElement.className !== 'dropbtn') {
                this.isTimeZoneShow = false;
            }
            if (event.srcElement.className === 'city-search ng-untouched ng-pristine ng-valid' || event.srcElement.className === 'city-search ng-touched ng-dirty ng-valid') {
                this.isTimeZoneShow = true;
            }
        } else {
            this.isTimeZoneShow = false;
        }
    }
    businessDetail: BusinessListDetailsRes;
    business_slug = '';
    business_id = 0;
    business_name: any;
    addBusinessForm: FormGroup;
    activityEditFlag: number = -1;
    businessActivityArray: Array<{ id: 0, activity_title: string, operation?: string }> = [];
    businessImagesFormData: FormData = new FormData();
    base64BusinessImages: Array<{}> = [];
    addProductFlag = false;
    addProductForm: FormGroup;
    productImagesFormData: FormData = new FormData();
    addServiceFlag = false;
    addServiceForm: FormGroup;
    serviceImagesFormData: FormData = new FormData();
    base64ProductImages: Array<{}> = [];
    base64ServiceLogo: string;
    business_address_auto: string = "";
    business_category: Array<{ id: number, category: string }> = [];
    selectedName: Array<{}> = [];
    finalCategory: Array<{}> = [];
    mainCategory: Array<{}> = [];
    subCategory: Array<{}> = [];
    mainCategorySelected = {};
    categoryMetaTag = [];
    metaTags: Array<string> = [];
    filteredMeatTags: Observable<any[]>;
    categoryIds: string;
    category_name = '';
    deletedBusinessActivity: Array<{ id: 0, activity_title: string, operation?: string }> = [];
    @ViewChild('userProfile') userProfileRef: ElementRef;
    @ViewChild('businessLogo') businessLogoRef: ElementRef;
    showExtraFields = false;
    productImagesArr: Array<string> = [];
    product_id = 0;
    service_id = 0;
    serviceIndex = 0;
    timezoneArr: Array<string> = [];
    timezone = 'UTC +05:30 - Asia/Kolkata';
    addressDetail = [];
    countries = [];
    states = [];
    cities = [];
    isShow = false;
    isAgent: any;
    showAgent = false;

    fields = {
        isRequired: true,
        business_working_hours: {
            options: [
                {
                    day: 'Monday',
                    isOpen: true,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Tuesday',
                    isOpen: true,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Wednesday',
                    isOpen: true,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Thursday',
                    isOpen: true,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Friday',
                    isOpen: true,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Saturday',
                    isOpen: false,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                },
                {
                    day: 'Sunday',
                    isOpen: false,
                    startTime: "9:00",
                    startMeridies: "AM",
                    endTime: "6:00",
                    endMeridies: "PM"
                }
            ]
        }
    };
    @ViewChild('productImage') productImageRef: ElementRef;
    @ViewChild('serviceImage') serviceImageRef: ElementRef;
    myControl: FormControl = new FormControl();

    selectedTags: Array<{}> = [];
    timeZone = 'Asia/Kolkata';
    isTimeZoneShow = false;
    allTimezoneArr: any;
    businessProfilePic = '';
    business_logo = '';
    imageChangedEvent: any = '';
	croppedImage: any = '';
	modalReference: any;

    valueChanged(newVal: string) {
        if (this.metaTags.indexOf(newVal) > -1) {
            if (this.selectedTags.indexOf(newVal) == -1) {
                if (this.selectedTags.length < 51) {
                    this.selectedTags.push(newVal);
                    this.addBusinessForm.controls.tag.setValue(null);
                } else {
                    this.cS.showError('you can maximum enter 50 meta tags');
                }
            }
            if (this.selectedTags.length < 51) {
                this.metaTags.splice(this.metaTags.indexOf(newVal), 1);
            }
        }
    }

    constructor(
        private activeRoute: ActivatedRoute,
        private hS: HomeService,
        private fb: FormBuilder,
        public router: Router,
        public cS: CommonService,
        public httpService: HttpService,
        private location: Location,
        private eRef: ElementRef,
        private mS: MessageService,
        private modalService: NgbModal) {

        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        this.addBusinessForm = this.fb.group({
            id: [this.business_id],
            user_id: [localStorage.getItem('member_id')],
            parent_category: [],
            name: [null, Validators.compose([Validators.required])],
            description: [],
            phone: [null],
            mobile: [localStorage.getItem('member_mobile')],
            address: [null, Validators.compose([Validators.required])],
            latitude: [],
            longitude: [],
            email_id: [null, Validators.compose([Validators.pattern(EMAIL_REGEXP)])],
            establishment_year: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4)])],
            website_url: [],
            facebook_url: [],
            twitter_url: [],
            linkedin_url: [],
            instagram_url: [],
            timezone: ['Asia/Kolkata'],
            tag: [],
            country_code: ['+91'],
            street_address: [null],
            locality: [null],
            country: [null],
            state: [null],
            city: [null],
            taluka: [null],
            district: [null],
            pincode: [null],
            timezoneSearch: [null],

            metatags: [],
            category_id: [null],

            business_activities: [],
            business_working_hours: this.fb.group({
                options: this.fb.array([])
            }),
            working_hours: []
        });

        this.addProductForm = this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            description: [null, Validators.compose([Validators.required])],
            cost: [null]
        });

        this.addServiceForm = this.fb.group({
            name: [null, Validators.compose([Validators.required])],
            description: [null, Validators.compose([Validators.required])],
            cost: [null]
        });

        this.businessDetail = {
            status: 0,
            message: ''
        };

        localStorage.removeItem('business_name');

        /*
        *get url slug
        */
        this.activeRoute.params.subscribe(data => {
            this.business_slug = data.slug;
            if (this.business_slug !== 'add-new') {
                this.isAgent = localStorage.getItem('isAgent');
                if (this.isAgent === 'A') {
                    this.isShow = true;
                    this.showExtraFields = true;
                    this.getBusinessDetailBySlug(true);
                } else {
                    const businessData = this.cS.getBusinessDetail();
                    if (businessData) {
                        this.business_name = businessData.business_name;
                        if (businessData.business_slug == this.business_slug) {
                            this.isShow = true;
                            this.showExtraFields = true;
                            this.getBusinessDetailBySlug(true);
                        } else {
                            this.router.navigateByUrl('/home');
                        }
                    }
                }

            } else {
                this.resetForm();
                if (localStorage.getItem('member_id') == 'undefined' || localStorage.getItem('member_id') == null || localStorage.getItem('member_id') == undefined || localStorage.getItem('member_id') == '') {
                    this.router.navigateByUrl('/home');
                }
                this.patch();
            }
        });
        this.getTimezone();
    }
    changeStartMeridies(meridies: string, index: number, isStartOrEnd: string) {
        const meri = meridies === 'AM' ? 'PM' : 'AM';
        this.fields.business_working_hours.options[index][isStartOrEnd] = meri;
        // const control = this.addBusinessForm.controls.business_working_hours['controls']['options'];
        // control.value[index][isStartOrEnd] = meri;
    }

    placeChanged(place: any) {
        console.log(place);
        this.isShow = true;
        this.addBusinessForm.controls.latitude.setValue(place.geometry.location.lat());
        this.addBusinessForm.controls.longitude.setValue(place.geometry.location.lng());
        this.business_address_auto = place['formatted_address'];
    }

    addressChanged() {
        this.isShow = true;
    }

    checkboxChange(index: number) {
        this.fields.business_working_hours.options[index]['isOpen'] = !this.fields.business_working_hours.options[index]['isOpen'];
    }

    patch() {
        const control = <FormArray>this.addBusinessForm.controls.business_working_hours['controls']['options'];
        this.fields.business_working_hours.options.forEach(x => {
            control.push(this.patchValues(x.day, x.isOpen, x.startTime, x.endTime, x.startMeridies, x.endMeridies))
        });
    }

    patchValues(day: string, isOpen: boolean, startTime: string, endTime: string, startMeridies: string, endMeridies: string) {
        return this.fb.group({
            day: [day],
            isOpen: [isOpen],
            startTime: [startTime],
            endTime: [endTime],
            startMeridies: [startMeridies],
            endMeridies: [endMeridies]
        })
    }

    addActivity() {
        if (this.addBusinessForm.value['business_activities'] !== '') {
            if (this.activityEditFlag === -1) {
                this.businessActivityArray.push({ id: 0, activity_title: this.addBusinessForm.value['business_activities'], operation: "add" });
            } else {
                this.businessActivityArray[this.activityEditFlag]['activity_title'] = this.addBusinessForm.value['business_activities'];
                this.activityEditFlag = -1;
            }
            this.addBusinessForm.controls.business_activities.setValue('');
        }
    }

    editActivity(index: number) {
        this.addBusinessForm.controls.business_activities.setValue(this.businessActivityArray[index]['activity_title']);
        this.activityEditFlag = index;
    }

    deleteActivity(index: number) {
        this.businessActivityArray[index]['operation'] = 'delete';
        this.deletedBusinessActivity.push(this.businessActivityArray[index]);
        this.businessActivityArray.splice(index, 1);
    }

    ngOnInit() {
        this.cS.scrollTop();
        this.getAddressDetail();
    }

    /**
    * Get Address Detail from entered details
    *@returns void
    */
    getAddressDetail() {
        this.hS.getAddressMaster().subscribe((res: any) => {
            this.countries = res.data.countries;
            this.cities = res.data.cities;
            this.states = res.data.states;
        }, err => {
            console.log(err);
        });
    }

    /**
    * Get Business Detail by business slug
    *@returns void
    */
    getBusinessDetailBySlug(isFirstLoad: boolean = false): void {

        this.business_category = [];

        const postJson = { business_slug: this.business_slug };

        this.hS.getBusinessDetailBySlug(postJson).subscribe((res: any) => {
            if (res.data) {
                if (isFirstLoad) {
                    if (res.data['hoursOperation'].length > 0) {
                        for (let i = 0; i < 7; i++) {
                            if (res.data['hoursOperation'][i]['open_close'] !== 'Closed') {
                                const SD = res.data['hoursOperation'][i]['start_time'].split(' ');
                                const ED = res.data['hoursOperation'][i]['end_time'].split(' ');

                                this.fields.business_working_hours.options[i] = {
                                    day: res.data['hoursOperation'][i]['name'],
                                    isOpen: res.data['hoursOperation'][i]['open_close'] === 'Open' ? true : false,
                                    startTime: SD[0],
                                    startMeridies: SD[1].toUpperCase(),
                                    endTime: ED[0],
                                    endMeridies: ED[1].toUpperCase()
                                };
                            } else {
                                this.fields.business_working_hours.options[i] = {
                                    day: res.data['hoursOperation'][i]['name'],
                                    isOpen: res.data['hoursOperation'][i]['open_close'] == "Open" ? true : false,
                                    startTime: '9:00',
                                    startMeridies: 'AM',
                                    endTime: '6:00',
                                    endMeridies: 'PM'
                                };
                            }
                        }
                    }
                    this.patch();
                }

                if (res['data']['metatags'] !== '') {
                    this.selectedTags = res['data']['metatags'].split(',');
                }

                this.businessDetail = res;
                this.business_id = res.data.id;
                this.business_name = res.data.name;
                let category = '';
                let id = 0;
                if (res.data.category_hierarchy.length > 0) {
                    for (let x in res.data.category_hierarchy) {
                        for (let i in res.data.category_hierarchy[x]) {
                            if (parseInt(i) != 0) {
                                category += ' >> ' + res.data.category_hierarchy[x][i].name;
                            } else {
                                category = res.data.category_hierarchy[x][i].name;
                            }
                            if (parseInt(i) == (res.data.category_hierarchy[x].length - 1)) {
                                id = res.data.category_hierarchy[x][i].id;
                            }
                        }
                        this.business_category.push(
                            {
                                category: category,
                                id: id
                            }
                        );
                    }
                }
                this.getCategoryMetatags();
                this.addBusinessForm.controls.id.setValue(res.data.id);
                this.addBusinessForm.controls.user_id.setValue(res.data.user_id);
                this.addBusinessForm.controls.parent_category.setValue(res.data.parent_category_id);
                this.addBusinessForm.controls.latitude.setValue(res.data.latitude);
                this.addBusinessForm.controls.longitude.setValue(res.data.longitude);
                this.addBusinessForm.controls.name.setValue(res.data.name);
                if (res.data.country_code) {
                    this.addBusinessForm.controls.mobile.setValue(res.data.country_code + "-" + res.data.mobile);
                } else {
                    this.addBusinessForm.controls.mobile.setValue(res.data.mobile);
                }
                this.addBusinessForm.controls.phone.setValue(res.data.phone);
                this.addBusinessForm.controls.email_id.setValue(res.data.email);
                this.addBusinessForm.controls.address.setValue(res.data.full_address);
                this.addBusinessForm.controls.street_address.setValue(res.data.street_address);
                this.addBusinessForm.controls.locality.setValue(res.data.locality);
                this.addBusinessForm.controls.country.setValue(res.data.country);
                this.addBusinessForm.controls.state.setValue(res.data.state);
                this.addBusinessForm.controls.city.setValue(res.data.city);
                this.addBusinessForm.controls.taluka.setValue(res.data.taluka);
                this.addBusinessForm.controls.district.setValue(res.data.district);
                this.addBusinessForm.controls.pincode.setValue(res.data.pincode);

                this.addBusinessForm.controls.description.setValue(res.data.descriptions);
                this.addBusinessForm.controls.establishment_year.setValue(res.data.year_of_establishment);
                this.addBusinessForm.controls.website_url.setValue(res.data.website);
                this.addBusinessForm.controls.facebook_url.setValue(res.data.social_profiles.facebook_url);
                this.addBusinessForm.controls.twitter_url.setValue(res.data.social_profiles.twitter_url);
                this.addBusinessForm.controls.linkedin_url.setValue(res.data.social_profiles.linkedin_url);
                this.addBusinessForm.controls.instagram_url.setValue(res.data.social_profiles.instagram_url);
                this.business_logo = res.data.business_logo;
                if (res.data.timezone !== '') {
                    this.addBusinessForm.controls.timezone.setValue(res.data.timezone);
                    this.timezoneArr.filter((item: any) => {
                        const search = item['name'];
                        if (search.toLowerCase().indexOf(res.data.timezone.toLowerCase()) > -1) {
                            this.timezone = item['value'] + ' - ' + item['name'];
                        }
                    });
                }

                for (let i = 0; i < res.data.business_activities.length; i++) {
                    res.data.business_activities[i]['operation'] = 'update';
                }
                this.businessActivityArray = res.data.business_activities;
                this.mS.setBusinessName(res.data.name);
            }
        }, err => {
            console.log(err);
        });
    }

    triggerUpload() {
        if (this.businessDetail.data) {
            if ((this.base64BusinessImages.length + this.businessDetail.data.business_images.length) == 9) {
                this.cS.showError('You can only upload 9 images.');
            } else {
                this.userProfileRef.nativeElement.click();
            }
        } else {
            if (this.base64BusinessImages.length === 9) {
                this.cS.showError('You can only upload 9 images.');
            } else {
                this.userProfileRef.nativeElement.click();
            }
        }
    }

    readURL(input: any) {
        const self = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                self.base64BusinessImages.push(e['target']['result']);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    uploadProfilePic(event: any) {
        const srcEle = event.srcElement;
        if (srcEle.files && srcEle.files[0]) {
            if (this.cS.checkValidImage(srcEle.files[0])) {
                this.businessImagesFormData.append('business_images[]', srcEle.files[0]);
                this.readURL(srcEle);
            } else {
                this.cS.showError('Please select file less than 5MB.');
            }
        }
    }

    uploadImage() {
        const apiUrl = environment.RYEC_API_URL + 'saveBusinessImages';
        this.businessImagesFormData.append('business_id', <any>this.business_id);
        this.httpService.postUpload(apiUrl, this.businessImagesFormData).subscribe((res: any) => {
            if (res['status'] === 1) {
                this.cS.showSuccess(res['message']);
            } else {
                this.cS.showError(res['message']);
            }

        });
    }

    deleteBusinessImage(index: number, id?: number) {
        if (id === undefined) {
            this.base64BusinessImages.splice(index, 1);
        } else {
            const obj = {
                id: id,
                business_id: this.business_id
            };

            const apiUrl = environment.RYEC_API_URL + 'deleteBusinessImage';
            this.httpService.post(apiUrl, obj).subscribe((res: any) => {
                console.log(res);
                if (this.businessDetail.data) {
                    this.businessDetail.data.business_images.splice(index, 1);
                }
            });
        }
    }

    changeCategory(category_id: number, flag?: boolean) {
        if (!flag) {
            this.business_category = [];
        }
        this.selectedName = [];
        this.mainCategory.forEach(res => {
            if (category_id === res['category_id']) {
                this.mainCategorySelected = res;
                this.getSubcategory(res);
            }
        });
    }
    chooseCategory(subCat: any) {
        this.selectedName.push(subCat['name']);

        let str = '';

        this.selectedName.forEach(res => {
            str += res + ' >> ';
        });

        this.selectedName = [];
        this.subCategory = [];
        str = str.substr(0, str.length - 3);
        if (this.business_category.length > 0) {
            for (let x in this.business_category) {
                if (this.business_category[x]['id'] !== subCat['category_id']) {
                    this.business_category.push({ id: subCat['category_id'], category: str });
                }
            }
        } else {
            this.business_category.push({ id: subCat['category_id'], category: str });
        }
        this.changeCategory(<any>this.category_name, true);
    }

    getSubcategory(obj: any) {
        const paramObj = {
            id: obj['category_id'],
            category_slug: obj['category_slug']
        };

        this.selectedName.push(obj['name']);

        const apiUrl = environment.RYEC_API_URL + 'getSubCategory';
        this.httpService.post(apiUrl, paramObj).subscribe((res: any) => {
            if (res['status'] === 1) {
                if (res['data']['sub_category'].length === 0) {
                    this.cS.showError('No category found.');
                }

                this.subCategory = res['data']['sub_category'];
            }
        });
    }

    editBusinesscategory(content: string) {
        console.log(content);
        swal({
            title: 'You can not change Business Category without approval.',
            text: 'Contact support at info@ryvua.com or call on 9099937890.',
            type: 'warning'
        });
    }

    /**
    * add or update owner data
    * @param ownerId
    */
    addExitOwnerData(ownerId?: number) {
        const business_id = btoa(<any>this.business_id);
        let owner_id = btoa(<any>0);
        if (ownerId !== undefined) {
            owner_id = btoa(<any>ownerId)
        }
        localStorage.setItem('business_name', this.business_name);
        this.router.navigate(['/user/add-owner'], { queryParams: { business_id: business_id, owner_id: owner_id }, queryParamsHandling: 'merge' })
    }

    /**
    * delete owner data
    * @param ownerId
    */
    deleteOwnerData(ownerId: number, index: number) {
        let name = 'this';
        if (this.businessDetail.data) {
            name = this.businessDetail.data.owners[index]['name'];
        }
        swal({
            title: 'Do you really want to delete Owner?',
            text: name,
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                const apiUrl = environment.RYEC_API_URL + 'deleteOwner';
                const postObj = {
                    owner_id: ownerId
                };

                this.httpService.post(apiUrl, postObj).subscribe(res => {
                    if (res.status === 1) {
                        this.cS.showSuccess(res.message);
                        if (this.businessDetail.data) {
                            this.businessDetail.data.owners.splice(index, 1);
                        }
                    }
                }, err => {
                    console.log(err);
                });
            }
        });
    }

    /**
    * add new product
    */
    addNewProduct() {
        this.addProductFlag = !this.addProductFlag;
        this.addProductForm.reset();
        this.base64ProductImages = [];
        this.productImagesArr = [];
    }

    hideProductSection() {
        this.addProductFlag = !this.addProductFlag;
        this.addProductForm.reset();
        this.base64ProductImages = [];
        this.productImagesArr = [];
    }

    saveProduct() {
        if (this.addProductForm.valid) {
            if (this.base64ProductImages.length != 0 || this.productImagesArr.length != 0) {
                const apiUrl = environment.RYEC_API_URL + 'saveProduct';
                this.productImagesFormData.append('id', <any>this.product_id);
                this.productImagesFormData.append('business_id', <any>this.business_id);
                this.productImagesFormData.append('name', this.addProductForm.controls.name.value);
                this.productImagesFormData.append('description', this.addProductForm.controls.description.value);
                this.productImagesFormData.append('cost', this.addProductForm.controls.cost.value);
                this.httpService.postUpload(apiUrl, this.productImagesFormData).subscribe((res: any) => {
                    if (res['status'] === 1) {
                        this.cS.showSuccess(res['message']);
                        this.productImagesArr = [];
                        this.base64ProductImages = [];
                        if (this.product_id === 0) {
                            if (this.businessDetail.data) {
                                this.businessDetail.data.products.push({
                                    id: res.data.id,
                                    name: res.data.name,
                                    image_url: res.data.product_images[0].image_thumbnail
                                })
                            }
                        }
                        this.productImagesFormData = new FormData();
                        this.addProductForm.reset();
                        this.addProductFlag = !this.addProductFlag;
                        this.getBusinessDetailBySlug(false);
                    } else {
                        this.cS.showError(res['message']);
                    }
                }, err => {
                    console.log(err);
                });
            } else {
                this.cS.showError('Please select one product image')
            }
        }
    }

    triggerProductImage() {
        console.log(this.base64ProductImages.length);
        if ((this.base64ProductImages.length + this.productImagesArr.length) < 5) {
            this.productImageRef.nativeElement.click();
        } else {
            this.cS.showError('You can only upload 5 images in each product.');
        }
    }

    uploadProductPic(event: any) {
        const srcEle = event.srcElement;
        if (srcEle.files && srcEle.files[0]) {
            if (this.cS.checkValidImage(srcEle.files[0])) {
                this.productImagesFormData.append('product_images[]', srcEle.files[0]);
                this.readProductURL(srcEle);
            } else {
                this.cS.showError('Please select file less than 5MB.');
            }
        }
    }

    readProductURL(input: any) {
        const self = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                self.base64ProductImages.push(e['target']['result']);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    addNewService() {
        this.addServiceFlag = !this.addServiceFlag;
        this.addServiceForm.reset();
        this.base64ServiceLogo = '';
    }

    hideServiceSection() {
        this.addServiceFlag = !this.addServiceFlag;
        this.addServiceForm.reset();
        this.base64ServiceLogo = '';
    }

    saveService() {
        if (this.addServiceForm.valid) {
            if (this.base64ServiceLogo !== '') {
                const apiUrl = environment.RYEC_API_URL + 'saveService';
                this.serviceImagesFormData.append('id', <any>this.service_id);
                this.serviceImagesFormData.append('business_id', <any>this.business_id);
                this.serviceImagesFormData.append('name', this.addServiceForm.controls.name.value);
                this.serviceImagesFormData.append('description', this.addServiceForm.controls.description.value);
                this.serviceImagesFormData.append('cost', this.addServiceForm.controls.cost.value);
                this.httpService.postUpload(apiUrl, this.serviceImagesFormData).subscribe((res: any) => {
                    if (res['status'] === 1) {
                        this.cS.showSuccess(res['message']);
                        if (this.service_id === 0) {
                            if (this.businessDetail.data) {
                                this.businessDetail.data.services.push({
                                    id: res.data.id,
                                    name: res.data.name,
                                    image_url: res.data.thumb_logo
                                });
                            }
                        } else {
                            if (this.businessDetail.data) {
                                this.businessDetail.data.services[this.serviceIndex].id = res.data.id;
                                this.businessDetail.data.services[this.serviceIndex].name = res.data.name;
                                this.businessDetail.data.services[this.serviceIndex].image_url = res.data.thumb_logo;
                            }
                        }
                        this.serviceImagesFormData = new FormData();
                        this.addServiceForm.reset();
                        this.base64ServiceLogo = '';
                        this.addServiceFlag = !this.addServiceFlag;
                    } else {
                        this.cS.showError(res['message']);
                    }
                });
            } else {
                this.cS.showError('Please select service image')
            }
        }
    }

    triggerServiceImage() {
        this.serviceImageRef.nativeElement.click();
    }

    uploadServicePic(event: any) {
        const srcEle = event.srcElement;
        if (srcEle.files && srcEle.files[0]) {
            if (this.cS.checkValidImage(srcEle.files[0])) {
                this.serviceImagesFormData.append('logo', srcEle.files[0]);
                this.readServiceURL(srcEle);
            } else {
                this.cS.showError('Please select file less than 5MB.');
            }
        }
    }

    readServiceURL(input: any) {
        const self = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                self.base64ServiceLogo = e['target']['result'];
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    removeService(service_id: number, index: number) {
        let name = 'this';
        if (this.businessDetail.data) {
            name = this.businessDetail.data.services[index]['name'];
        }
        swal({
            title: 'Are you sure?',
            text: 'To delete ' + name + ' service.',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                const apiUrl = environment.RYEC_API_URL + 'removeService';
                const postJson = { service_id: service_id };

                this.httpService.post(apiUrl, postJson).subscribe(res => {
                    if (res.status === 1) {
                        this.cS.showSuccess(res.message);
                        if (this.businessDetail.data) {
                            this.businessDetail.data.services.splice(index, 1);
                        }
                    }
                }, err => {
                    console.log(err);
                });
            }
        });
    }

    removeProduct(product_id: number, index: number) {
        let name = 'this';
        if (this.businessDetail.data) {
            name = this.businessDetail.data.products[index]['name'];
        }
        swal({
            title: 'Are you sure?',
            text: 'To delete ' + name + ' product.',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                const apiUrl = environment.RYEC_API_URL + 'removeProduct';
                const postJson = { product_id: product_id };

                this.httpService.post(apiUrl, postJson).subscribe(res => {
                    if (res.status === 1) {
                        this.cS.showSuccess(res.message);
                        if (this.businessDetail.data) {
                            this.businessDetail.data.products.splice(index, 1);
                        }
                        this.getBusinessDetailBySlug(false);
                    }
                }, err => {
                    console.log(err);
                });
            }
        });
    }

    editProduct(product_id: number, index: number) {
        console.log(index);
        this.product_id = product_id;
        this.productImagesArr = [];
        this.addProductFlag = true;
        const postJson = { product_id: product_id };
        this.hS.getProductDetailByProductId(postJson).subscribe((res: any) => {
            if (res.status == 1) {
                this.addProductForm.controls.name.setValue(res.data.name);
                this.addProductForm.controls.description.setValue(res.data.descriptions);
                this.addProductForm.controls.cost.setValue(res.data.cost);
                for (const x in res.data.product_images) {
                    console.log(res.data.product_images[x]);
                    this.productImagesArr.push(res.data.product_images[x]);
                }
            }
        }, err => {
            console.log(err);
        });
    }

    editService(service_id: number, index: number) {
        this.serviceIndex = index;
        this.service_id = service_id;
        this.addServiceFlag = true;
        const postJson = { service_id: service_id };
        this.hS.getServiceDetailByServiceId(postJson).subscribe((res: any) => {
            if (res.status === 1) {
                this.addServiceForm.controls.name.setValue(res.data.name);
                this.addServiceForm.controls.description.setValue(res.data.descriptions);
                this.addServiceForm.controls.cost.setValue(res.data.cost);
                this.base64ServiceLogo = res.data.thumb_logo;
            }
        }, err => {
            console.log(err);
        });
    }

    removeCategory(index: number) {
        this.business_category.splice(index, 1);
        this.getCategoryMetatags();
    }

    getCategoryIds() {
        this.categoryIds = '';
        for (let x in this.business_category) {
            if (parseInt(x) !== 0) {
                this.categoryIds += ',' + this.business_category[x]['id'];
            } else {
                this.categoryIds = <any>this.business_category[x]['id'];
            }
        }
        this.addBusinessForm.controls.category_id.setValue(this.categoryIds);
    }

    getCategoryMetatags() {
        this.metaTags = [];
        this.getCategoryIds();
        const apiUrl = environment.RYEC_API_URL + 'getCategoryMetaTags';
        const postJson = { category_id: this.categoryIds };

        this.httpService.post(apiUrl, postJson).subscribe(res => {
            if (res.status === 1) {
                for (let x in res.data) {
                    if (this.selectedTags.indexOf(res.data[x]) === -1)
                        this.metaTags.push(res.data[x]);
                }
            }
        }, err => {
            console.log(err);
        });
    }

    onSubmitEditBusiness() {

        if (this.addBusinessForm.valid) {
            for (let i = 0; i < this.deletedBusinessActivity.length; i++) {
                this.businessActivityArray.push(this.deletedBusinessActivity[i]);
            }

            this.addBusinessForm.controls.business_activities.setValue(this.businessActivityArray);
            this.addBusinessForm.controls.category_id.setValue(this.categoryIds);
            this.addBusinessForm.controls.metatags.setValue(this.selectedTags.toString());

            const hoursUpdated = this.addBusinessForm.controls.business_working_hours['controls']['options']['controls'];

            console.log(hoursUpdated[0].value);
            const filedObj =  this.fields.business_working_hours.options;

            const hours = {
                'mon_open_close': hoursUpdated[0].value.isOpen === true ? 1 : 0,
                'mon_start_time': hoursUpdated[0].value.startTime,
                'mon_start_time_am_pm': filedObj[0].startMeridies,
                'mon_end_time': hoursUpdated[0].value.endTime,
                'mon_end_time_am_pm': filedObj[0].endMeridies,

                'tue_open_close': hoursUpdated[1].value.isOpen === true ? 1 : 0,
                'tue_start_time': hoursUpdated[1].value.startTime,
                'tue_start_time_am_pm': filedObj[1].startMeridies,
                'tue_end_time': hoursUpdated[1].value.endTime,
                'tue_end_time_am_pm': filedObj[1].endMeridies,

                'wed_open_close': hoursUpdated[2].value.isOpen === true ? 1 : 0,
                'wed_start_time': hoursUpdated[2].value.startTime,
                'wed_start_time_am_pm': filedObj[2].startMeridies,
                'wed_end_time': hoursUpdated[2].value.endTime,
                'wed_end_time_am_pm': filedObj[2].endMeridies,

                'thu_open_close': hoursUpdated[3].value.isOpen === true ? 1 : 0,
                'thu_start_time': hoursUpdated[3].value.startTime,
                'thu_start_time_am_pm': filedObj[3].startMeridies,
                'thu_end_time': hoursUpdated[3].value.endTime,
                'thu_end_time_am_pm': filedObj[3].endMeridies,

                'fri_open_close': hoursUpdated[4].value.isOpen === true ? 1 : 0,
                'fri_start_time': hoursUpdated[4].value.startTime,
                'fri_start_time_am_pm': filedObj[4].startMeridies,
                'fri_end_time': hoursUpdated[4].value.endTime,
                'fri_end_time_am_pm': filedObj[4].endMeridies,

                'sat_open_close': hoursUpdated[5].value.isOpen === true ? 1 : 0,
                'sat_start_time': hoursUpdated[5].value.startTime,
                'sat_start_time_am_pm': filedObj[5].startMeridies,
                'sat_end_time': hoursUpdated[5].value.endTime,
                'sat_end_time_am_pm': filedObj[5].endMeridies,

                'sun_open_close': hoursUpdated[6].value.isOpen === true ? 1 : 0,
                'sun_start_time': hoursUpdated[6].value.startTime,
                'sun_start_time_am_pm': filedObj[6].startMeridies,
                'sun_end_time': hoursUpdated[6].value.endTime,
                'sun_end_time_am_pm': filedObj[6].endMeridies,

                'timezone': this.addBusinessForm.controls.timezone.value
            };

            console.log(hours);


//            this.addBusinessForm.controls.working_hours.setValue(hours);
            const apiUrl = environment.RYEC_API_URL + 'saveBusiness';

            const splitVal = this.addBusinessForm.value.mobile.split('-');
            this.addBusinessForm.value.mobile = splitVal[1];
            this.addBusinessForm.value.country_code = splitVal[0];

            const paramObj = this.addBusinessForm.value;
            paramObj['working_hours'] = hours;

            if (this.business_address_auto !== '') {
                paramObj['address'] = this.business_address_auto;
            }

            this.httpService.post(apiUrl, paramObj).subscribe(res => {
                if (res.status === 1) {
                    this.addBusinessForm.controls.business_activities.setValue('');
                    this.cS.showSuccess(res.message);
                    if (this.base64BusinessImages.length > 0 || this.businessProfilePic !== '') {
                        this.uploadImage();
                    }
                    this.business_id = res.data.id;
                    this.business_slug = res.data.business_slug;
                    this.showExtraFields = true;
                    localStorage.removeItem('member_id');
                    localStorage.removeItem('member_mobile');
                    this.getBusinessDetailBySlug(false);
                } else {
                    this.cS.showError(res.message);
                }
            }, err => {
                console.log(err);
            });
        }

    }

    cancelEditBusiness() {
        this.location.back();
    }

    getTimezone() {
        const apiUrl = environment.RYEC_API_URL + 'getTimezone';
        this.httpService.get(apiUrl).subscribe((res: any) => {
            if (res['status'] === 1) {
                this.timezoneArr = res.data;
                this.allTimezoneArr = this.timezoneArr;
            }
        });
    }

    changeTimeZone(event: any) {
        console.log(event.value);
        this.timezone = event.name;
        this.addBusinessForm.controls.timezone.setValue(event.name);
    }

    removeMetaTags(index: number) {
        if (this.metaTags.indexOf(<any>this.selectedTags[index]) === -1)
            this.metaTags.push(<any>this.selectedTags[index]);
        this.selectedTags.splice(index, 1);
    }

    resetForm() {
        this.addBusinessForm.reset();
        this.business_category = [];
        this.metaTags = [];
        this.base64BusinessImages = [];
        this.selectedTags = [];
        this.productImagesArr = [];
        this.addProductForm.reset();
        this.addServiceForm.reset();
        this.base64ProductImages = [];
        this.base64ServiceLogo = '';
        this.addBusinessForm.controls.user_id.setValue(localStorage.getItem('member_id'))
        this.addBusinessForm.controls.mobile.setValue(localStorage.getItem('member_mobile'))
    }

    openHelpPopup(content: string) {
        console.log(content);
    }

    removeImage(image_id: number, index: number) {
        swal({
            title: 'Are you sure?',
            text: 'To delete this image.',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                const apiUrl = environment.RYEC_API_URL + 'removeProductImage';
                const postJson = { product_image_id: image_id };

                this.httpService.post(apiUrl, postJson).subscribe(res => {
                    if (res.status === 1) {
                        this.cS.showSuccess(res.message);
                        if (this.productImagesArr) {
                            this.productImagesArr.splice(index, 1);
                        }
                    }
                }, err => {
                    console.log(err);
                });
            }
        });
    }

    removeProductImage(index: number) {
        swal({
            title: 'Are you sure?',
            text: 'To delete this image.',
            type: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }).then((result) => {
            if (result.value) {
                this.base64ProductImages.splice(index, 1);
            }
        });
    }

    showTimeZoneDropDown() {
        if (this.isTimeZoneShow) {
            this.isTimeZoneShow = false;
        } else {
            this.isTimeZoneShow = true;
        }
    }

    filterTimeZone() {
        this.timezoneArr = [];

        if (this.addBusinessForm.controls.timezoneSearch.value !== '') {
            this.allTimezoneArr.filter((item: any) => {
                const search = item['value'] + ' ' + item['name'];
                if (search.toLowerCase().indexOf(this.addBusinessForm.controls.timezoneSearch.value.toLowerCase()) > -1) {
                    this.timezoneArr.push(item);
                }
            });
        } else {
            this.timezoneArr = this.allTimezoneArr;
        }
    }

    selectTimeZone(timezone: any) {
        this.timezone = timezone.value + ' - ' + timezone.name;
        this.addBusinessForm.controls.timezone.setValue(timezone.name);
        this.isShow = false;
        this.addBusinessForm.controls.timezoneSearch.setValue('');
        this.timezoneArr = this.allTimezoneArr;
    }

    /**
     * Upload business logo
     */
    triggerLogoUpload() {
        this.businessLogoRef.nativeElement.click();
    }

    readLogoURL(input: any) {
        const self = this;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                self.businessProfilePic = e['target']['result'];
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    uploadBusinessLogo(event: any, content: any) {
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
        //         this.businessImagesFormData.append('business_logo', srcEle.files[0]);
        //         this.readLogoURL(srcEle);
        //     } else {
        //         this.cS.showError('Please select file less than 5MB.');
        //     }
        // }
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
        this.modalReference.close();
        this.businessProfilePic = this.croppedImage;
        this.businessImagesFormData.append('business_logo', blob);

	}

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
