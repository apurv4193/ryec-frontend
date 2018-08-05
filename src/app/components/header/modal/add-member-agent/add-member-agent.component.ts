import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpService, CommonService, HomeService } from '../../../../services';
import { environment } from '../../../../../environments/environment';
import { VerifyMemberComponent } from './../verify-member/verify-member.component';
import { MemberDataRes, MemberData } from '../../../../class/data.model';
 
@Component({
	selector: 'ryec-add-member-agent',
	templateUrl: './add-member-agent.component.html',
	styleUrls: ['./add-member-agent.component.css']
})
export class AddMemberAgentComponent implements OnInit {

	@HostListener('document:click', ['$event'])
	clickout(event: any) {
		if (this.eRef.nativeElement.contains(event.target)) {
			if (event.srcElement.className !== 'dropbtn')
			{
				this.showDropDown = false;
			}
		} else {
			this.showDropDown = false;
		}
  }

	addMemberForm: FormGroup;
	modalOption: NgbModalOptions;
	countryCodes: any;
	country_code = '+91';
	country_img = '';
	showDropDown = false;

	constructor(private fb: FormBuilder,
		public activeModal: NgbActiveModal,
		private hS: HttpService,
		private hmS: HomeService,
		private cS: CommonService,
		private eRef: ElementRef,
		private modalService: NgbModal) {

		this.addMemberForm = this.fb.group({
			//country_code: ['+91'],
			phone: [null, Validators.compose([Validators.required,
			Validators.maxLength(13),
			Validators.minLength(6),
			Validators.pattern('^[0-9]+$')])],
			country_code:['+91']
		});

		this.modalOption = {
			backdrop: 'static',
			windowClass: 'mobile_popup',
			keyboard: false
		};
	}

	ngOnInit() {
		this.hmS.getCountryCode().subscribe((res: any) => {
			this.countryCodes = res['data'];
			for (let x in this.countryCodes)
			{
				if (this.country_code === this.countryCodes[x]['country_code'])
				{
					this.country_img = this.countryCodes[x]['country_flag'];
				}
			}
			console.log(res);
		}, err => {
			console.log(err);
		});
	}

	sendOTP() {
		if (this.addMemberForm.valid) {

			const uri = environment.RYEC_API_URL + 'sendAddMemberOTP';
			this.hS.post(uri, this.addMemberForm.value).subscribe((res: MemberDataRes) => {

				// console.log(res);
				if (res.status === 1) {
					console.log(res.data);
					this.openOTPModal(res.data);
				} else if (res.status === 0) {
					this.activeModal.dismiss();
				}
				this.cS.showSuccess(res.message);

			}, err => {

				console.log(err);
			});

		} else {
			this.validateAllFields(this.addMemberForm);
		}
	}

	openOTPModal(params: MemberData) {

		// dismiss active forgot password model
		this.activeModal.dismiss();
		// open otp model
		localStorage.setItem('member_id', <any>params.id);
		localStorage.setItem('member_mobile', <any>this.addMemberForm.value.country_code + '-' + this.addMemberForm.value.phone);
		const modalReference = this.modalService.open(VerifyMemberComponent, this.modalOption);
		modalReference.componentInstance.mobile = this.addMemberForm.value.phone;
		modalReference.componentInstance.country_code = this.country_code;
		modalReference.componentInstance.memberdata = params;

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

	selectCountry(countryObj : any)
	{
	  this.country_code = countryObj['country_code'];
	  this.country_img = countryObj['country_flag'];
	  this.showDropDown = false;
	}
  
	selectCountryCode()
	{
	  if (this.showDropDown)
	  {
		this.showDropDown = false;
	  } else {
		this.showDropDown = true;
	  }
	}
}

