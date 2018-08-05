import { Component, OnInit } from '@angular/core';
import { CommonService, HomeService } from './../../services';

@Component({
    selector: 'ryec-a-zcategories',
    templateUrl: './a-zcategories.component.html',
    styleUrls: ['./a-zcategories.component.css']
})
export class AZcategoriesComponent implements OnInit {

    allCategoryArr = [];
    constructor(private cS: CommonService, private hS: HomeService) {
    }

    ngOnInit() {
        this.cS.scrollTop();
        this.getAllCategory();
    }

    getAllCategory() {
        this.hS.getMenuCategoryListing().subscribe(res => {
            this.allCategoryArr = <any>res.data;
        }, err => {
            console.log(err);
        });
    }

    saveParentCategory(item: any) {
        this.cS.parentCategoryList = [];
        this.cS.setParentCategory(item);
    }

    showCategory(obj: any) {
        return (obj['isBusiness'] === 1) ? false : true;
    }
}
