import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services';

@Component({
    selector: 'ryec-sub-categorie',
    templateUrl: './sub-categorie.component.html',
    styleUrls: ['./sub-categorie.component.css']
})
export class SubCategorieComponent implements OnInit {

    parentCategory: string;
    nda = environment.NDA;
    parentCategoryArr = {
        name: '',
        image_url: '',
        banner_image_url: '',
        sub_category: []
    };
    noData = false;
    caregoryArray: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private cS: CommonService
    ) {
        this.parentCategory = '';

        // get resolve data
        this.activeRoute.data.subscribe(res => {
            console.log(res.category);
            this.parentCategoryArr = res.category.data;
            if (this.parentCategoryArr['sub_category'].length === 0) {
                this.noData = true;
            }
            this.caregoryArray = JSON.parse(<any>localStorage.getItem('parent-category'));
        });
        // get catergory slug
        this.activeRoute.params.subscribe(data => {
            this.parentCategory = data.slug;
        });
    }

    ngOnInit() {
        this.cS.scrollTop();
    }

    saveParentCategory(item: any) {
        this.cS.setParentCategory(item);
    }
}
