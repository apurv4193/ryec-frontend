import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService, HttpService, CommonService } from './../../../../../services';
import {
    BusinessListDetailsRes
} from './../../../../../class/data.model';
import { environment } from '../../../../../../environments/environment.prod';
import { Meta } from '@angular/platform-browser';

@Component({
    selector: 'ryec-business-detail',
    templateUrl: './business-detail.component.html',
    styleUrls: ['./business-detail.component.css']
})
export class BusinessDetailComponent implements OnInit {

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
    }
    validTitle = false;
    validDescription = false;
    validForm = false;
    repoUrl = window.location.href;
    user_id = 0;
    isAgent: any;
    showAgent = false;
    rating = 4.14;

    constructor(
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal,
        private hS: HomeService,
        private httpS: HttpService,
        private cS: CommonService,
        private router: Router,
        private meta: Meta) {
        this.businessDetail = {
            status: 0,
            message: ''
        };
        this.selectedIndex = 1;
        this.selectedServiceIndex = 1;
        this.currentPage = 1;
        this.selectedImageItemIndex = 1;
        const userDetail = this.cS.getUserDetails();
        if (userDetail) {
            this.user_id = userDetail.id;
        }
        /*
        *get url slug
        */
        this.activeRoute.params.subscribe(data => {
            this.business_slug = data.slug;
            this.getBusinessDetailBySlug();
        });
        this.isAgent = localStorage.getItem('isAgent');
        if (this.isAgent === 'A') {
            this.showAgent = true;
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
                this.meta.updateTag({ name: 'twitter:card', content: res['data']['owners']['0']['image_url'] });
                this.meta.updateTag({ name: 'twitter:site', content: this.repoUrl });
                this.meta.updateTag({ name: 'twitter:title', content: res['data']['name'] });
                this.meta.updateTag({ name: 'twitter:description', content: res['data']['descriptions'] });
                this.meta.updateTag({ name: 'twitter:image', content: res['data']['owners']['0']['image_url'] });

                this.meta.updateTag({ name: 'og:url', content: this.repoUrl });
                this.meta.updateTag({ name: 'og:type', content: "Business details" });
                this.meta.updateTag({ name: 'og:title', content: res['data']['name'] });
                this.meta.updateTag({ name: 'og:description', content: res['data']['descriptions'] });
                this.meta.updateTag({ name: 'og:image', content: res['data']['owners']['0']['image_url'] });                
                this.businessDetail = res;
                this.business_id = res.data.id;
                this.business_name = res.data.name;
                this.totalRatingCount = res.data.rating.total;
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

    /**
    *open business list add review and rating modal
    */
    addReviewAndRating(content: string) {
        this.review = '';
        this.modalReference = this.modalService.open(content, { windowClass: 'rating_popup' });
        this.modalReference.result.then((result: any) => {
            console.log(`Closed with: ${result}`);
            this.getBusinessDetailBySlug();
        }, (reason: any) => {
            console.log(reason);
        });
    }

    /**
    *add reviews and rating for business list
    */
    submitRatingDetail() {
        if (this.review == '' && this.review.trim() == '') {
            this.reviewValid = true;
        } else {
            const userDetail = this.cS.getUserDetails();
            if (userDetail) {
                const postJson = {
                    user_id: userDetail.id,
                    business_id: this.business_id,
                    rating: this.currentRate,
                    comment: this.review
                }

                const apiUrl = environment.RYEC_API_URL + 'addBusinessRating';

                this.httpS.post(apiUrl, postJson).subscribe((res: any) => {
                    if (res.status === 1) {
                        this.cS.showSuccess(res.message);
                    } else {
                        this.cS.showError(res.message);
                    }
                    this.modalReference.close();
                }, err => {
                    if (err.error) {
                        console.log(err.error);
                    }
                });
            }
        }
    }

    /**
    *open business list add enquiry modal
    */
    addEnquiryForBusiness(content: string) {
        this.enquiryForm.title = '';
        this.enquiryForm.description = ''
        this.modalReference = this.modalService.open(content, { windowClass: 'enquiry_popup' });
        this.modalReference.result.then((result: any) => {
            console.log(`Closed with: ${result}`);
        }, (reason: any) => {
            console.log(reason)
        });
    }

    /**
    *add reviews and rating for business list
    */
    submitEnquiryDetail() {
        const postJson = {
            business_id: this.business_id,
            title: this.enquiryForm.title,
            message: this.enquiryForm.description
        };

        console.log(postJson)
        const apiUrl = environment.RYEC_API_URL + 'sendEnquiry';

        this.httpS.post(apiUrl, postJson).subscribe((res: any) => {
            console.log(res);
            if (res.status === 1) {
                this.cS.showSuccess(res.message);
            }
            else {
                this.cS.showError(res.message);
            }
            this.modalReference.close();
        }, err => {
            if (err.error) {
                console.log(err.error);
            }
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
    *open share popup
    */
    openShareOptions(content: string) {
        this.modalService.open(content, { windowClass: 'share_popup' }).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            console.log(reason);
        });
    }

    changeEvent(event?: any) {
        console.log(event);
        if (this.review === '' && this.review.trim() === '') {
            this.reviewValid = true;
        }
        else {
            this.reviewValid = false;
        }
    }

    changeTitleEvent(event?: any) {
        console.log(event);
        if (this.enquiryForm.title === '' && this.enquiryForm.title.trim() === '') {
            this.validTitle = true;
        } else {
            this.validTitle = false;
        }

        if (this.enquiryForm.description === '' && this.enquiryForm.description.trim() === '') {
            this.validDescription = true;
        } else {
            this.validDescription = false;
        }

        if (this.enquiryForm.title === '' || this.enquiryForm.title.trim() === '' || this.enquiryForm.description === '' || this.enquiryForm.description.trim() === '') {
            this.validForm = false;
        } else {
            this.validForm = true;
        }
    }

    /**
    * add or update owner data
    * @param ownerId
    */
    viewOwnerData(ownerId?: number) {
        localStorage.setItem('business_name', this.business_name);
        const owner_id = btoa(<any>ownerId);
        this.router.navigate(['/user/business-owner'], { queryParams: { owner_id: owner_id }, queryParamsHandling: 'merge' });
    }
}