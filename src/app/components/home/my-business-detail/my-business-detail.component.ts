import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService, CommonService } from './../../../services';
import {
    BusinessListDetailsRes
} from './../../../class/data.model';
import { environment } from '../../../../environments/environment.prod';
import { Router } from '@angular/router';
@Component({
    selector: 'ryec-my-business-detail',
    templateUrl: './my-business-detail.component.html',
    styleUrls: ['./my-business-detail.component.css']
})
export class MyBusinessDetailComponent implements OnInit {

    currentPage: number;
    selectedItem: any;
    selectedIndex: number;
    selectedServiceItem: any;
    selectedServiceIndex: number;
    selectedImageItem: any;
    selectedImageItemIndex: number;
    business_slug = '';
    business_name = '';
    currentRate = 0;
    businessDetail: BusinessListDetailsRes;
    productDetail = {};
    serviceDetail = {};
    collectionSize = 0;
    business_id: any;
    modalReference: any;
    activeId = 0;
    totalRatingCount = 0;
    perPageList = environment.BUSINESS_LIST_LIMIT;
    allRatings = [];
    start_5 = 0;
    start_4 = 0;
    start_3 = 0;
    start_2 = 0;
    start_1 = 0;
    trimLength = environment.DESCRIPTIO_TRIM_LENGTH;
    review = '';
    reviewValid = false;
    enquiryForm = {
        title: '',
        description: ''
    };
    validTitle = false;
    validDescription = false;
    validForm = false;
    business_category: Array<string> = [];

    constructor(
        private modalService: NgbModal,
        private hS: HomeService,
        private cS: CommonService,
        private router: Router) {
        this.businessDetail = {
            status: 0,
            message: ''
        };
        this.selectedIndex = 1;
        this.selectedServiceIndex = 1;
        this.currentPage = 1;
        this.selectedImageItemIndex = 1;

        /*
        *get url slug
        */
        const businessData = this.cS.getBusinessDetail();
        if (businessData) {
            this.business_id = businessData.business_id;
            this.business_slug = businessData.business_slug;
            if (this.business_slug === '') {
                this.router.navigateByUrl('/home');
            } else {
                this.getBusinessDetailBySlug();
            }
        }

        localStorage.removeItem('business_name');
    }

    ngOnInit() {
        this.cS.scrollTop();
    }

    /**
    * Get Business Detail by business slug
    *@returns void
    */
    getBusinessDetailBySlug(): void {
        const postJson = { business_slug: this.business_slug };

        this.hS.getBusinessDetailBySlug(postJson).subscribe((res: any) => {
            if (res.data) {
                console.log(res.data);
                this.businessDetail = res;
                this.business_id = res.data.id;
                this.business_name = res.data.name;
                if (res.data.rating) {
                    this.totalRatingCount = res.data.rating.total;
                }
                let category = '';
                if (res.data.category_hierarchy.length > 0) {
                    for (let x in res.data.category_hierarchy) {
                        for (let i in res.data.category_hierarchy[x]) {
                            if (parseInt(i) != 0) {
                                category += ' > ' + res.data.category_hierarchy[x][i].name;
                            }
                            else {
                                category = res.data.category_hierarchy[x][i].name;
                            }
                        }
                        this.business_category.push(category);
                    }
                }
                this.start_5 = Math.round((res.data.rating['start_5_rating'] * 100) / this.totalRatingCount);
                this.start_4 = Math.round((res.data.rating['start_4_rating'] * 100) / this.totalRatingCount);
                this.start_3 = Math.round((res.data.rating['start_3_rating'] * 100) / this.totalRatingCount);
                this.start_2 = Math.round((res.data.rating['start_2_rating'] * 100) / this.totalRatingCount);
                this.start_1 = Math.round((res.data.rating['start_1_rating'] * 100) / this.totalRatingCount);
                this.getNextPageRatingList();
            }
        }, err => {
            console.log(err);
        });
    }

    /**
    *open Image in modal view
    */
    openImageViwer(index: number, content: string) {
        this.activeId = index;
        this.modalService.open(content, { windowClass: 'image_gallery' }).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(reason);
        });
    }

    /**
    *open Product detail in modal view
    */
    openProductDetail(product_id: number, content: string) {
        const postJson = { product_id: product_id };
        this.hS.getProductDetailByProductId(postJson).subscribe((res: any) => {
            this.productDetail = res.data;
            this.modalService.open(content, { windowClass: 'product_gallery' }).result.then((result) => {
                console.log(`Closed with: ${result}`);
            }, (reason) => {
                console.log(reason);
            });
        }, err => {
            console.log(err);
        });
    }

    /**
    *open Service detail in modal view
    */
    openServiceDetail(service_id: number, content: string) {
        const postJson = { service_id: service_id };
        this.hS.getServiceDetailByServiceId(postJson).subscribe((res: any) => {
            this.serviceDetail = res.data;
            this.modalService.open(content, { windowClass: 'service_gallery' }).result.then((result) => {
                console.log(`Closed with: ${result}`);
            }, (reason) => {
                console.log(reason);
            });
        }, err => {
            console.log(err);
        });
    }


    countCollectionSize() {
        if (this.totalRatingCount > this.perPageList) {
            this.collectionSize = Math.ceil(this.totalRatingCount / this.perPageList);
            this.collectionSize = this.collectionSize * 10;
        } else {
            this.collectionSize = this.perPageList;
        }
    }

    /**
    *get business rating list
    */
    getNextPageRatingList(event?: number): void {
        console.log(event);
        const postJson = { business_id: this.business_id, page: this.currentPage };

        this.hS.getBusinessRating(postJson).subscribe((res: any) => {
            if (res.status === 1) {
                this.allRatings = res.data.reviews;
                console.log('revi');
                console.log(this.allRatings);
                this.countCollectionSize();
            }
        }, err => {
            console.log(err);
        });
    }

    /**
    *open business list detail view
    */
    openBusinessDescription(content: string) {
        this.modalService.open(content, { windowClass: 'desc_popup' }).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(reason);
        });
    }

    /**
    *open business list categories list
    */
    openAllCategories(content: string) {
        this.modalService.open(content, { windowClass: 'allcategory_popup' }).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(reason);
        });
    }

    /**
    * add or update owner data
    * @param ownerId 
    */
    viewOwnerData(ownerId?: number) {
        localStorage.setItem('business_name', this.business_name);
        const owner_id = btoa(<any>ownerId);
        this.router.navigate(['/user/business-owner'], { queryParams: { owner_id: owner_id }, queryParamsHandling: 'merge' })
    }

    /**
    *open share popup
    */
    openShareOptions(content: string) {
        this.modalService.open(content, { windowClass: 'share_popup' }).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(reason);
        });
    }
}