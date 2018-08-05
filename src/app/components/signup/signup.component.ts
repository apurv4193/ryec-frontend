import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SignUpConfig, SignUpLoginRes } from './../../class/data.model';
import { HttpService, AuthService, CommonService, MessageService, HomeService } from './../../services';
import { environment } from './../../../environments/environment';
import { SignupOtpComponent } from './../signup/modal/signup-otp/signup-otp.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const password = new FormControl('', {
    validators: Validators.compose([Validators.required, Validators.minLength(8)])
});
const certainPassword = new FormControl('', {
    validators: Validators.compose([Validators.required, CustomValidators.equalTo(password)])
});

@Component({
    selector: 'ryec-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

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

    country_code = '+91';
    country_img = '';
    showDropDown = false;
    signUpForm: FormGroup;
    countryCodes: any;
    lang = '';
    // status alert 0=> something missing, 1=> success, 3=>default not active
    statusAlert: {
        status: 1 | 0 | 3,
        message: string
    };
    otp = 0;

    isRajput = '1';
    showEmail = false;
    successMsg = '';

    constructor(private fb: FormBuilder,
        private hS: HttpService,
        private hmS: HomeService,
        private router: Router,
        private eRef: ElementRef,
        private cS: CommonService,
        private mS: MessageService,
        private translate: TranslateService,
        private authService: AuthService,
        private modalService: NgbModal) {
        this.lang = this.cS.getLang();
        this.signUpForm = this.fb.group({
            username: [null, Validators.required],
            mobnumber: [null, Validators.compose([Validators.required,
            Validators.maxLength(13),
            Validators.minLength(6),
            Validators.pattern('^[0-9]+$')])],
            password: password,
            passwordConfirm: certainPassword,
            country_code: ['+91'],
            isRajput: ["" + 1 + ""],
            email: []
        });

        this.statusAlert = {
            status: 3,
            message: ''
        };

        if (localStorage.getItem('token')) {
            window.history.back();
        }

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
	/**
	* Set to language prefrance
	* @param lang <string>
	*/
    switchLang(lang: string) {
        this.cS.setLang(lang);
        this.translate.use(lang);
        this.lang = lang;
    }
	/**
	* submit form details registration process
	*/
    submitDetails() {
        if (this.signUpForm.valid) {
            const apiUrl = environment.RYEC_API_URL + 'register';

            const paramConfig: SignUpConfig = {
                name: this.signUpForm.controls.username.value,
                phone: this.signUpForm.controls.mobnumber.value,
                password: this.signUpForm.controls.password.value,
                country_code: this.country_code,
                device_type: '3',
                device_token: null,
                device_id: null,
                isRajput: this.signUpForm.controls.isRajput.value,
                otp: this.otp,
                email: this.signUpForm.controls.email.value
            };

            this.hS.post(apiUrl, paramConfig).subscribe((res: SignUpLoginRes) => {
                if (res.status === 1 && res.data) {
                    this.statusAlert = {
                        status: res.status,
                        message: res.message
                    };

                    // set token
                    this.authService.setToken(res.data.loginToken);
                    // set user details
                    this.cS.setUserDetails(res.data);
                    this.mS.setProfile(res.data);
                    // successful sign up navigate to home
                    if (res.data.isVendor === 0) {
                        this.cS.businessModel.is_Register = false;
                        this.cS.setBusinessRegiFlag();
                        this.mS.setRegisterbusiness(true);
                        this.setAgentApprovalStatus(res.data.agent_approved);
                        this.mS.setBusinessDetailUpdate(this.cS.businessModel);
                        if (this.signUpForm.controls.isRajput.value === '1') {
                            this.router.navigate(['/home/add-business']);
                            localStorage.setItem('isRajput', btoa(this.signUpForm.controls.isRajput.value));
                        } else {
                            localStorage.setItem('isRajput', btoa(this.signUpForm.controls.isRajput.value));
                            this.cS.businessModel.skipped = true;
                            this.cS.setBusinessRegiFlag();
                            this.mS.setRegisterbusiness(false);
                            this.router.navigate(['user']);
                        }
                    } else {
                        this.cS.businessModel.is_Register = true;
                        this.cS.setBusinessRegiFlag();
                        this.mS.setRegisterbusiness(true);
                        this.setAgentApprovalStatus(res.data.agent_approved);
                        this.mS.setBusinessDetailUpdate(this.cS.businessModel);
                        this.router.navigate(['user']);
                    }
                } else {
                    if (res['data']) {
                        const error_code = res['data']['error']['errorcode'];
                        if (error_code === 'phone-unique-error') {
                            // open otp model
                            const modalReference = this.modalService.open(SignupOtpComponent, { windowClass: 'mobile_popup' });

                            modalReference.componentInstance.error = true;
                            modalReference.componentInstance.message = res.message;

                            modalReference.result.then((result: any) => {
                                console.log(`Closed with: ${result}`);
                            }, (reason: any) => {
                                console.log(reason);
                            });
                        } else {
                            this.cS.showError(res.message);
                        }
                    } else {
                        const str = res.message;
                        if ((str.toLowerCase().indexOf('otp') > -1)) {
                            const modalReference = this.modalService.open(SignupOtpComponent, { windowClass: 'mobile_popup' });

                            modalReference.result.then((result: any) => {
                                console.log(`Closed with: ${result}`);
                            }, (reason: any) => {
                                if (reason.text === 'otp') {
                                    this.otp = reason.otp;
                                    this.submitDetails();
                                }
                            });
                        }
                        this.cS.showError(res.message);
                    }
                    this.statusAlert = {
                        status: res.status,
                        message: res.message
                    };
                }
            }, err => {
                if (err.error) {
                    this.cS.showError(err.error.message);
                    this.statusAlert = {
                        status: err.error.status,
                        message: err.error.message
                    };
                }
            });
        } else {
            this.signUpForm.markAsTouched();
        }
    }

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
        this.country_code = countryObj['country_code'];
        this.country_img = countryObj['country_flag'];
        this.showDropDown = false;
        if (countryObj['country_code'] === '+91') {
            this.signUpForm.controls.email.setValue('');
            this.showEmail = false;
            this.signUpForm.controls['email'].setValidators(null);
            this.signUpForm.controls['email'].updateValueAndValidity();
        } else {
            this.showEmail = true;
            this.signUpForm.controls['email'].setValidators([Validators.required, Validators.email]);
            this.signUpForm.controls['email'].updateValueAndValidity();
        }
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

    sendVerificationOTP() {

        //if (this.country_code == '+91') {
        const apiUrl = environment.RYEC_API_URL + 'sendRegisterOTP';

        const paramConfig = {
            phone: this.signUpForm.controls.mobnumber.value,
            email: this.signUpForm.controls.email.value,
            country_code: this.country_code
        };

        this.hS.post(apiUrl, paramConfig).subscribe((res) => {
            if (res['status'] === 1) {
                this.cS.showSuccess(res['message']);
                // open otp model
                const modalReference = this.modalService.open(SignupOtpComponent, { windowClass: 'mobile_popup' });

                modalReference.componentInstance.mobile = this.signUpForm.controls.mobnumber.value;
                modalReference.componentInstance.email = this.signUpForm.controls.email.value;
                modalReference.componentInstance.country_code = this.country_code;
                modalReference.componentInstance.show_message = res.message;

                modalReference.result.then((result: any) => {
                    console.log(`Closed with: ${result}`);
                }, (reason: any) => {
                    if (reason.text === 'otp') {
                        this.otp = reason.otp;
                        this.submitDetails();
                    }
                });
            } else {
                if (res['data']) {
                    const error_code = res['data']['error']['errorcode'];
                    if (error_code === 'phone-unique-error') {
                        // open otp model
                        const modalReference = this.modalService.open(SignupOtpComponent, { windowClass: 'mobile_popup' });

                        modalReference.componentInstance.error = true;
                        modalReference.componentInstance.message = res.message;

                        modalReference.result.then((result: any) => {
                            console.log(`Closed with: ${result}`);
                        }, (reason: any) => {
                            console.log(reason);
                        });
                    } else {
                        this.cS.showError(res.message);
                    }
                } else {
                    this.cS.showError(res.message);
                }
            }
        }, err => {

            console.log(err);
        });
        // } else {
        // 	this.submitDetails();
        // }
    }

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
