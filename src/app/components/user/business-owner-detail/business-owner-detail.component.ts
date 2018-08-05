import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { HttpService, CommonService } from './../../../services';
import { Location } from '@angular/common';
@Component({
    selector: 'ryec-business-owner-detail',
    templateUrl: './business-owner-detail.component.html',
    styleUrls: ['./business-owner-detail.component.css']
})
export class BusinessOwnerDetailComponent implements OnInit {

    userId: number;
    ownerInfo = [];
    gender = '';
    dob: any;
    business_name: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private hS: HttpService,
        private cS: CommonService,
        private router: Router,
        private location: Location) 
    {
        this.activeRoute.queryParams
            .subscribe(params => {
                this.userId = <any>atob(params.owner_id);
                if (this.userId > 0) {
                    this.getOwnerInformation();
                }
                else {
                    this.router.navigateByUrl('/home');
                }
            });
        this.business_name = localStorage.getItem('business_name');
    }

    ngOnInit() {
        this.cS.scrollTop();
    }

    /*
    *Get owner detail by owner id
    */
    getOwnerInformation() {
        const uri = environment.RYEC_API_URL + 'getOwnerInfo';
        const postJson = { owner_id: this.userId }
        this.hS.post(uri, postJson).subscribe((res: any) => {
            console.log(res.data);
            if (res.data.mobile != '') {
                res.data.mobile = res.data.country_code + '-' + res.data.mobile;
            }
            this.ownerInfo = res.data;
            if (this.ownerInfo['gender'] == 1) {
                this.gender = 'Male'
            }
            else if (this.ownerInfo['gender'] == 2) {
                this.gender = 'Female'
            }
            else if (this.ownerInfo['gender'] == 3) {
                this.gender = 'Other'
            }
            const date = res.data.dob.split('-');
            if (date.length > 2) {
                const dob = {
                    year: parseInt(date[0]),
                    month: parseInt(date[1]),
                    day: parseInt(date[2])
                }
                this.dob = dob;
            }
        }, err => {
            console.log(err);
        });
    }

    cancelEditOwner() {
        localStorage.removeItem('business_name');
        this.location.back();
    }
}
