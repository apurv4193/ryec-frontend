import { Component, OnInit, EventEmitter, Output, ViewContainerRef, OnDestroy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService, MessageService, HomeService } from './services';
import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
declare let ga: Function;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

	title = 'RYEC';

	location = {};
	@Output() locationchange: EventEmitter<number> = new EventEmitter();
	spinnerSub: Subscription;
	toggleSpinner: boolean;

	constructor(private translate: TranslateService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title,
		private upperCase: UpperCasePipe,
		private mS: MessageService,
		private hS: HomeService,
		private cS: CommonService,
		vRef: ViewContainerRef,
		public toastr: ToastsManager) {

		// init toggleSpinner
		this.toggleSpinner = false;
		// init subscription

		this.spinnerSub = this.mS.getSpinner().subscribe(res => {
			setTimeout(() => {
				this.toggleSpinner = res;
			}, 0)
		});

		// set default lang tranlate provider to english
		this.toastr.setRootViewContainerRef(vRef);
		this.translate.setDefaultLang(this.cS.getLang());

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				ga('set', 'page', event.urlAfterRedirects);
				ga('send', 'pageview');
			}
		});
		//console.log = function() {};
		//console.error = function() {};
	}

	ngOnInit() {
		// subscribe to router events
		this.router.events
			.filter((event) => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map((route) => {
				while (route.firstChild) { route = route.firstChild; }
				return route;
			})
			.filter((route) => route.outlet === 'primary')
			.mergeMap((route) => {

				route.params.subscribe(data => {
					if (data.slug) {
						console.log(this.upperCase.transform(data.slug));
					}

				});
				return route.data;
			})
			.subscribe((event) => {
				this.titleService.setTitle(event.title);
			});

		// get geolocation current Position
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.geolocationSuccess.bind(this), this.geolocationError.bind(this));
		}
	}

	switchLanguage(lang: string) {
		this.translate.use(lang);
	}

	geolocationSuccess(position: { coords: {}; }) {
		this.location = position.coords;
		localStorage.setItem('latitude', position.coords['latitude']);
		localStorage.setItem('longitude', position.coords['longitude']);
		console.log(position.coords, '<<<<<location');
		this.cS.updateLatLong(position.coords['latitude'], position.coords['longitude']);
	}

	geolocationError() {
		console.log('Unable to retrive geolocation');
		this.hS.getNetworkLatLong();
	}

	ngOnDestroy(): void {
		this.spinnerSub.unsubscribe();
	}
}
