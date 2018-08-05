import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CommonService, HttpService } from '../../../../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


const password = new FormControl('', {
  validators: Validators.compose([Validators.required, Validators.minLength(8)])
});
const certainPassword = new FormControl('', {
  validators: Validators.compose([CustomValidators.equalTo(password)])
});


@Component({
  selector: 'ryec-register-member',
  templateUrl: './register-member.component.html',
  styleUrls: ['./register-member.component.css']
})
export class RegisterMemberComponent implements OnInit {

  @Input() otp: string;
  @Input() phone: string;
  @Input() country_code: string;

  signUpForm: FormGroup;

  // status alert 0=> something missing, 1=> success, 3=>default not active
  statusAlert: {
    status: 1 | 0 | 3,
    message: string
  };


  constructor(private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private hS: HttpService,
    private cS: CommonService) {

    this.signUpForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, CustomValidators.email],
      mobnumber: [null],
      password: password,
      passwordConfirm: certainPassword,
      country_code:[null]
    });

    this.statusAlert = {
      status: 3,
      message: ''
    };

  }

  ngOnInit() {
    // reset form
    this.signUpForm.reset();
  }

  /**
   * submit form details registration process
   */
  submitDetails() {
    console.log(this.signUpForm.valid, '<<<<');

    if (this.signUpForm.valid) {
      const splitVal = this.phone.split('-');
			this.phone = splitVal[1];
      const apiUrl = environment.RYEC_API_URL + 'agentSaveUser';
      const paramConfig = {
        name: this.signUpForm.controls.username.value,
        phone: this.phone,
        email: this.signUpForm.controls.email.value,
        otp: this.otp,
        password: this.signUpForm.controls.password.value,
        country_code: this.country_code
      };


      this.hS.post(apiUrl, paramConfig).subscribe((res: any) => {

        console.log(res);
        if (res.status === 1) {
          localStorage.setItem('member_id', <any>res.data.id);
          localStorage.setItem('member_mobile', <any>this.country_code + '-' + this.phone);
          this.activeModal.dismiss();
          this.cS.navigateTo('/home/business-profile/add-new');
          this.cS.showSuccess(res.message);
        } else {
          this.statusAlert = {
            status: res.status,
            message: res.message
          };
        }
      }, (err: any) => {
        if (err.error) {
          // console.log(err.error);
          this.statusAlert = {
            status: err.error.status,
            message: err.error.message
          };
        }
      });

    } else {
      // trigger validation while do submit
      this.cS.triggerValidation(this.signUpForm);
    }
  }

}
