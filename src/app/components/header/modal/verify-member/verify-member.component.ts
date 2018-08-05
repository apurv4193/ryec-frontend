import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpService, CommonService } from '../../../../services';
import { RegisterMemberComponent } from '../../modal/register-member/register-member.component';
import { MemberData, MemberDataRes } from '../../../../class/data.model';


@Component({
  selector: 'ryec-verify-member',
  templateUrl: './verify-member.component.html',
  styleUrls: ['./verify-member.component.css']
})
export class VerifyMemberComponent implements OnInit {

  @Input() mobile = 0;
  @Input() memberdata: MemberData;
  @Input() country_code = 0;

  otpForm: FormGroup;
  modalOption: NgbModalOptions;


  constructor(private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private cS: CommonService,
    private hS: HttpService) {

    this.otpForm = this.fb.group({
      phone: [null],
      otp: [null, Validators.compose([Validators.required,
      Validators.maxLength(6),
      Validators.minLength(6),
      Validators.pattern('^[0-9]+$')])],
      country_code:[null]
    });

    this.modalOption = {
      backdrop: 'static',
      windowClass: 'mobile_popup',
      keyboard: false,
      size: 'lg'
    };
  }


  ngOnInit() {
  }

  otpCheck() {
    // console.log('click working');
    if (this.otpForm.valid) {
      this.otpForm.value.phone = this.mobile;
      this.otpForm.value.country_code = this.country_code;
      console.log(this.otpForm.value);

      const uri = environment.RYEC_API_URL + 'verifyAgentOTP';

      this.hS.post(uri, this.otpForm.value).subscribe((res: any) => {

        console.log(res, '<<<');
        if (res.status === 1) {
          this.activeModal.dismiss();
          if(localStorage.getItem('member_id') == 'undefined' || localStorage.getItem('member_id') == null || localStorage.getItem('member_id') == undefined || localStorage.getItem('member_id') == '')
          {
            const modalRef = this.modalService.open(RegisterMemberComponent, this.modalOption);
            modalRef.componentInstance.otp = this.otpForm.value.otp;
            modalRef.componentInstance.phone = this.country_code + '-' + this.mobile;
            modalRef.componentInstance.country_code = this.country_code;
          }
          else
          {
            this.cS.navigateTo('/home/business-profile/add-new');
          }

          this.cS.showSuccess(res.message);

        } else if (res.status === 0) {

          this.cS.showError(res.message);
        }

      }, (err: any) => {
        this.activeModal.dismiss();
        console.log(err);
      });
    } else {

      this.cS.triggerValidation(this.otpForm);
    }
  }
  /**
   * resend OTP
   */
  resendOTP() {

    const uri = environment.RYEC_API_URL + 'sendAddMemberOTP';
    this.hS.post(uri, { phone: this.mobile }).subscribe((res: MemberDataRes) => {

      // console.log(res);
      if (res.status === 1) {

      } else if (res.status === 0) {

      }
      this.cS.showSuccess(res.message);

    }, err => {
      console.log(err);
    });
  }



}
