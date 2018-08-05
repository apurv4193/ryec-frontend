import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpService, CommonService } from '../../../../services';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'ryec-become-agent',
  templateUrl: './become-agent.component.html',
  styleUrls: ['./become-agent.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BecomeAgentComponent implements OnInit {

  becomeAgentForm: FormGroup;
  successFul_submission: boolean;
  isAgent: string | null;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder, private hS: HttpService, private cS: CommonService) {

    // hide approval design
    this.successFul_submission = false;
    this.becomeAgentForm = this.fb.group({
      comment: [null, Validators.compose([Validators.required])]
    });

    this.isAgent = this.cS.getData('isAgent');



  }

  ngOnInit() {

    // if already apply for agent
    if (this.isAgent && this.isAgent === 'P') {
      this.successFul_submission = true;
    }
  }

  sendDetails() {
    if (this.becomeAgentForm.valid) {

      const uri = environment.RYEC_API_URL + 'addAgentRequest';

      this.hS.post(uri, this.becomeAgentForm.value).subscribe(res => {


        if (res.status === 1) {
          this.cS.showSuccess(res.message);
          // note that P => pending approval A=> agent approved NA=> not apply yet
          this.cS.setData('isAgent', 'P');
          this.successFul_submission = true;
          // hide modal
          // this.activeModal.dismiss();
        }

      }, err => {
        console.log(err);
      });

    } else {
      this.validateAllFields(this.becomeAgentForm);
    }
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
}
