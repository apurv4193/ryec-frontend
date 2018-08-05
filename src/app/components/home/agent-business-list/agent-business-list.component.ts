import { Component, OnInit } from '@angular/core';
import { HomeService, CommonService } from './../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'ryec-agent-business-list',
    templateUrl: './agent-business-list.component.html',
    styleUrls: ['./agent-business-list.component.css']
})
export class AgentBusinessListComponent implements OnInit {

    routerLink = '';
    activeUrl = '';
    BusinessList = [];
    currentPage: number;
    sort_slug = '';
    totalBuinessCount = 0;
    noData = false;

    constructor(
        private hS: HomeService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private cS: CommonService) {
        this.currentPage = 1;

        /*
        *get url slug
        */
        this.activeRoute.params.subscribe(data => {
            this.routerLink = data.slug;
            /*
            *Check which type of sorting happend
            */
            if (this.routerLink === 'relevance') {
                this.sort_slug = '';
            } else if (this.routerLink === 'recently-added') {
                this.sort_slug = '';
            } else if (this.routerLink === 'subscription-plan') {
                this.sort_slug = '';
            } else if (this.routerLink === 'renewal-date') {
                this.sort_slug = '';
            } else {
                this.router.navigateByUrl('/home')
            }
            this.getBusinessListForAgent();
        });
    }

    ngOnInit() {
    }

    getBusinessListForAgent() {
        const userDetail = this.cS.getUserDetails();
        if (userDetail) {
            const postJson = {
                agent_id: userDetail.id
            };
            this.hS.getBusinessListForAgent(postJson).subscribe((res: any) => {
                this.BusinessList = res.data;
                this.totalBuinessCount = res.businessesTotalCount;
                if (this.totalBuinessCount == 0 || this.totalBuinessCount == undefined) {
                    this.noData = true;
                }
            }, (err: any) => {
                console.log(err);
            });
        }
    }

    viewBusiness() {

    }
}
