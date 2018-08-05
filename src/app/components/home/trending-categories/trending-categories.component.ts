import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../services';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'ryec-trending-categories',
	templateUrl: './trending-categories.component.html',
	styleUrls: ['./trending-categories.component.css']
})
export class TrendingCategoriesComponent implements OnInit {

	trendServiceArr: {
		image_url: string,
		name: string,
		sub_category: Array<any>
	};
	nda = environment.NDA;

	constructor(private router: ActivatedRoute, private cS: CommonService) {

		this.trendServiceArr = {
			image_url: '../assets/images/default-logo.png',
			name: '',
			sub_category: []
		};

		this.router.url.subscribe(data => {
			this.trendServiceArr.name = data[1].path;
		});

		this.router.data.subscribe(res => {
			this.trendServiceArr.sub_category = res.list.data;
		});

	}

	ngOnInit() {
		this.cS.scrollTop();
	}

	saveParentCategory(item: any) {
		const obj = {
			category_slug: item['category_slug'],
			category_id: item['service_id'],
			name: item['category_name']
		};
		this.cS.parentCategoryList = [];
		this.cS.setParentCategory(obj);
	}
}
