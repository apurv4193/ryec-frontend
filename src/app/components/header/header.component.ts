import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CommonService, HomeService, HttpService, AuthService, MessageService } from './../../services';
import { TranslateService } from '@ngx-translate/core';
import { SignUpLoginSubRes, BusinessFlag } from '../../class/data.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BecomeAgentComponent } from './modal/become-agent/become-agent.component';
import { AddMemberAgentComponent } from './modal/add-member-agent/add-member-agent.component';
import { environment } from '../../../environments/environment.prod';

declare var $: any;
@Component({
	selector: 'ryec-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
	@HostListener('document:click', ['$event'])
	clickout(event: any) {
		if (this.eRef.nativeElement.contains(event.target)) {
			if (event.srcElement.className == "fa fa-list-ul side_menu_icon" || event.srcElement.className == "ng-untouched ng-pristine ng-valid") {
				this.profileDropDown = false;
				this.isShow = false;
			} else if (event.srcElement.className == 'container' || event.srcElement.className == 'ng-pristine ng-valid ng-touched' || event.srcElement.className == '' || event.srcElement.className == 'ng-star-inserted') {
				this.profileDropDown = false;
				this.showMenuList = false;
				$(".auto_complete_list").css("display", "none");
				this.isShow = false;
			}
			else {
				if (event.srcElement.className == 'profile_menu_icon') {
					this.isShow = false;
				} else if (event.srcElement.className == 'dropbtn') {
					this.profileDropDown = false;
					$(".auto_complete_list").css("display", "none");
				}
				this.showMenuList = false;
			}
			if (event.srcElement.className == 'dropbtn langauge') {
				this.showMenuList = true;
			} else {
				this.isLangaugeShow = false;
			}

			if (event.srcElement.className == '') {
				$(".auto_complete_list").css("display", "none");
				this.searchText = '';
				this.search_city = 'All Cities';
			}
			if (event.srcElement.className == 'search_input') {
				$(".auto_complete_list").css("display", "none");
			}
		} else {
			this.profileDropDown = false;
			this.showMenuList = false;
			$(".auto_complete_list").css("display", "none");

			let path = window.location.pathname;
			if (path.indexOf('/home/business-search') === -1) {
				this.searchText = '';
				//this.search_city = 'All Cities';
			}
			this.isShow = false;

			if (event.srcElement.className != 'dropbtn') {
				this.isLangaugeShow = false;
			}
		}
	}

	userProfile: SignUpLoginSubRes | null;
	userLoggedIn = false;
	userSubscription: Subscription;
	isVendorSubscription: Subscription;
	business_flag: boolean;
	agentStatus: boolean;
	languageProvider: Array<{}>;
	lang: string;
	profileSubscription: Subscription;
	businessDetailsSub: Subscription;
	agentSub: Subscription;
	business_name = '';
	business_id = 0;
	business_approved = 0;
	business_slug = '';
	showMenuList: boolean;
	total_unmessage = 0;
	userName: any;
	items: any;
	cities = [];
	allCities = [];
	search_city = 'All Cities';
	searchText = '';
	isShow = false;
	city = '';
	isLangaugeShow = false;
	language = 'English';
	search_text = false;
	isSearchPage = false;
	isRajput = false;
	memberShipPlan = 0;
	memberShipPlanImage = '';
	profileDropDown: boolean;

	constructor(private authService: AuthService,
		private mS: MessageService,
		private cS: CommonService,
		public tS: TranslateService,
		public router: Router,
		public hS: HomeService,
		private modalService: NgbModal,
		private eRef: ElementRef,
		private httpS: HttpService) {

		this.business_flag = false;

		// agent status
		this.agentStatus = true;

		// init profileDropDown
		this.profileDropDown = false;

		// set lang
		this.lang = 'en';

		// set hide
		this.showMenuList = false;

		this.userSubscription = this.mS.getLoggedIn().subscribe(data => {
			this.userLoggedIn = data;
			if (this.userLoggedIn) {
				this.getAddressDetail();
			}
		});

		// profile subscription
		this.profileSubscription = this.mS.getProfile().subscribe((data: SignUpLoginSubRes) => {
			this.userProfile = data;
			// show register business if not vendor
			if (data.isVendor === 0) {
				this.memberShipPlan = 0;
				this.business_flag = false;
			}

			if (data.isRajput === 0) {
				this.isRajput = false
			} else {
				this.isRajput = true;
			}

			if (data.isVendor == 1) {
				if (data.membership_type != null) {
					this.memberShipPlan = <any>data.membership_type;
					this.memberShipPlanImage = <any>data.membership_type_icon;
				}
			}
			if (data.name !== 'null') {
				const temp = data.name.split(' ');
				if (temp.length > 1) {
					const userName = temp[0].substr(0, 1).toUpperCase() + ' ' + temp[1].substr(0, 1).toUpperCase();
					const matches = userName.match(/\b(\w)/g);
					if (matches) {
						this.userName = matches.join(' ');
					}
				} else {
					const matches = data.name.match(/\b(\w)/g);
					if (matches) {
						this.userName = matches.join(' ');
					}
				}
			}
			if (data) {
				const profile_pic_thumb = data.profile_pic_thumbnail;
				if (profile_pic_thumb === '') {
					console.log('profile pic missing');
					this.userProfile.profile_pic_thumbnail = '../assets/images/default_image.png';
				}
			}
		});

		// business subscription
		this.businessDetailsSub = this.mS.getBusinessDetailUpdate().subscribe((dataRes: BusinessFlag) => {
			console.log(dataRes);
			this.updateUserBusinessData();
		});

		//message Count update
		const messageCount = this.mS.getMessageCount().subscribe((messageRes: any) => {
			console.log(messageRes);
			this.total_unmessage = 0;
		})
		console.log(messageCount);

		// agent Status Subscription
		this.agentSub = this.mS.getAgentStatus().subscribe(res => {
			if (res.isAgent === 'P') {
				this.agentStatus = true;
			} else if (res.isAgent === 'A') {
				this.agentStatus = false;
			} else {
				this.agentStatus = true;
			}
		});

		this.isVendorSubscription = this.mS.getRegisterbusiness().subscribe(data => {
			this.business_flag = data;
			console.log(this.business_flag);
			console.log(this.isRajput);
			console.log(this.agentStatus);
		});

		//Get business search page when serach business page change data
		this.mS.getBusinessSearchText().subscribe(data => {
			this.search_city = data.city;
			this.searchText = data.text;
			this.isSearchPage = true;
		})

		this.languageProvider = [{
			key: 'en',
			val: 'English'
		},
		{
			key: 'hi',
			val: 'हिंदी'
		},
		{
			key: 'gu',
			val: 'ગુજરાતી'
		}
		];

		this.mS.getBusinessName().subscribe(businessRes => {
			this.business_name = businessRes;
		})

		// set user profile
		this.userProfile = null;
	}

	ngOnInit() {
		this.lang = this.cS.getLang();
		if (this.lang == 'en') {
			this.language = 'English';
		} else if (this.lang == 'hi') {
			this.language = 'हिंदी';
		} else {
			this.language = 'ગુજરાતી';
		}
		this.authService.isLoggedIn() ? this.userLoggedIn = true : this.userLoggedIn = false;
		if (this.userLoggedIn) {
			const isRegister = this.cS.isBusinessRegister();
			const isSkipped = this.cS.isBusinessRegisterSkipped();
			this.business_flag = isRegister || !isSkipped;
			const isAgentVal = this.cS.getData('isAgent');
			if (isAgentVal && isAgentVal === 'A') {
				this.agentStatus = false;
				this.business_flag = isRegister;
			} else if (isAgentVal && isAgentVal === 'P') {
				this.agentStatus = true;
			} else {
				this.business_flag = isRegister;
			}

			this.updateUserBusinessData();
			if (this.userLoggedIn) {
				this.userProfile = this.cS.getUserDetails();
				if (this.userProfile) {
					if (this.userProfile.isRajput === 0) {
						this.isRajput = false
					} else {
						this.isRajput = true;
					}
					if (this.userProfile.isVendor == 1) {
						if (this.userProfile.membership_type != null) {
							this.memberShipPlan = <any>this.userProfile.membership_type;
							this.memberShipPlanImage = <any>this.userProfile.membership_type_icon;
						}
						this.getBusinessApproved();
					}
					const profile_pic_thumb = this.userProfile.profile_pic_thumbnail;
					if (profile_pic_thumb === '') {
						this.userProfile['profile_pic_thumbnail'] = '../assets/images/default_image.png';
					}

					if (this.userProfile.name !== 'null') {
						const temp = this.userProfile.name.split(' ');
						if (temp.length > 1) {
							const userName = temp[0].substr(0, 1).toUpperCase() + ' ' + temp[1].substr(0, 1).toUpperCase();
							const matches = userName.match(/\b(\w)/g);
							if (matches) {
								this.userName = matches.join(' ');
							}
						} else {
							const matches = this.userProfile.name.match(/\b(\w)/g);
							if (matches) {
								this.userName = matches.join(' ');
							}
						}
					}
				}
			}
			this.getUserUnreadThreadCount();
			this.getAddressDetail();
		}
	}

	//Update business detail like business name, business approved or not
	updateUserBusinessData() {
		const businessData = this.cS.getBusinessDetail();
		if (businessData) {
			this.business_id = businessData.business_id;
			this.business_name = businessData.business_name;
			this.business_approved = businessData.business_approved;
			this.business_slug = businessData.business_slug;
		}
	}

	ngOnDestroy(): void {
		// prevent memory leckage
		this.userSubscription.unsubscribe();
		this.agentSub.unsubscribe();
		this.businessDetailsSub.unsubscribe();
		this.isVendorSubscription.unsubscribe();
	}

	// logout trigger
	logout(): void {
		this.menuHide();
		this.authService.logout();
		this.cS.businessModel.is_Register = true;
		this.cS.businessModel.business_id = 0;
		this.cS.businessModel.business_name = '';
		this.cS.businessModel.business_approved = 0;
		this.cS.businessModel.business_slug = '';
		this.cS.setBusinessRegiFlag();
		this.tS.use('en');
	}

	//Change language and set in default language for translate
	langSelection() {
		this.cS.setLang(this.lang);
		this.tS.setDefaultLang(this.lang);
		this.menuHide();
	}

	toggleMenu() {
		this.showMenuList = !this.showMenuList;
	}

	menuHide() {
		this.showMenuList = false;
		this.profileDropDown = false;
	}

	toggleProfile() {
		this.profileDropDown = !this.profileDropDown;
	}

	ckeckBusinessApproved() {
		this.menuHide();
		if (this.business_approved === 1) {
			this.router.navigateByUrl('home/my-business-detail');
		} else {
			this.cS.showInfo('Your business is under review.  Feel free to contact support at info@ryuva.club or call us at +91-9099937890 for any further details.');
		}
	}

	/**
	* become an agnet model trigger
	*/
	becomeAgent(): void {
		// hide menu if open
		this.showMenuList = false;
		// open become agent modal
		this.modalService.open(BecomeAgentComponent, { size: 'lg', windowClass: 'mobile_popup' });

	}

	/**
	* Open Mobile num verification model (Register Member By Agent)
	* @returns void
	*/
	registerMember() {
		this.menuHide();
		this.modalService.open(AddMemberAgentComponent, { windowClass: 'mobile_popup' });
	}

	/**
	 * Get unread message count from server
	 */
	getThreadMessage() {
		this.total_unmessage = 0;
		this.menuHide();
	}

	/**
	* Get unread thread count
	*/
	getUserUnreadThreadCount() {
		const apiUrl = environment.RYEC_API_URL + 'getUnreadThreadsCount';

		this.httpS.get(apiUrl).subscribe((res: any) => {
			if (res.status == 1) {
				this.total_unmessage = res.data.unread_count;
			}
		}, err => {
			if (err.error) {
				console.log(err.error);
			}
		})
	}

	/**
	 * Search by category with autocomplete
	 * @param event
	 */
	search(event: any) {
		const val = event.target.value;
		if (val === "" || val.length < 3) {
			$(".auto_complete_list").css("display", "none");
		}
		if (val.length >= 3) {
			const postJson = { searchText: val };

			this.hS.getSearchAutocomplete(postJson).subscribe((res: any) => {
				if (res.data) {
					console.log(res.data);
					if (res.data.length > 0) {
						$(".auto_complete_list").css("display", "block");
						this.items = res.data;
					} else {
						$(".auto_complete_list").css("display", "none");
					}
				}
			}, err => {
				console.log(err);
			});
		}
	}

	/**
	* Get Address Detail from entered details
	*@returns void
	*/
	getAddressDetail() {
		this.hS.getAddressMaster().subscribe((res: any) => {
			this.cities = res.data.cities;
			if (this.cities.length > 0) {
				if (this.search_city == '') {
					this.search_city = this.cities[0]['name'];
				}
			}
			this.allCities = this.cities;
		}, err => {
			console.log(err);
		});
	}

	searchBusinessByCategory(category_name: string) {
		this.searchText = category_name;
		this.searchBusiness();
		$(".auto_complete_list").css("display", "none");
		this.isLangaugeShow = false;
	}

	searchBusiness() {
		$(".auto_complete_list").css("display", "none");
		this.isLangaugeShow = false;
		if (this.searchText == "") {
			this.router.navigateByUrl('home/business-search/' + this.search_city + '/relevance');
		} else {
			this.router.navigateByUrl('home/business-search/' + this.search_city + '/' + this.searchText + '/relevance');
		}

	}

	showCityDropDown() {
		if (this.isShow) {
			this.isShow = false;
		} else {
			this.isShow = true;
		}
	}

	//Filter city from city list
	filterCity() {
		this.cities = [];
		if (this.city != '') {
			this.allCities.filter(item => {
				if (item['name'].toLowerCase().indexOf(this.city.toLowerCase()) > -1) {
					this.cities.push(item);
				}
			})
		} else {
			this.cities = this.allCities;
		}
	}

	selectCity(city: string) {
		this.searchText = this.searchText;
		// let path = window.location.pathname;
		this.search_text = true;
		this.search_city = city;
		this.isShow = false;
		console.log(this.search_city);
		// if (path.indexOf('/home/business-search') > -1) {
		// 	if (this.search_city == 'All Cities') {
		// 		this.city = '';
		// 		this.cities = this.allCities;
		// 	}
		// 	this.searchBusiness();
		// }
	}

	/**
	 * Chech user business approved or not
	 */
	getBusinessApproved() {
		const postJson = { business_id: this.business_id };

		this.hS.getBusinessApproved(postJson).subscribe((res: any) => {
			if (res.data) {
				this.business_approved = res.data.isApproved;
				this.memberShipPlan = res.data.membership_type;
				this.memberShipPlanImage = res.data.membership_type_icon;
			}
		}, err => {
			console.log(err);
		});
	}

	showLanguageDropDown() {
		if (this.isLangaugeShow) {
			this.isLangaugeShow = false;
		} else {
			this.isLangaugeShow = true;
		}
	}

	selectLanguage(lang: string, language: string) {
		this.cS.setLang(lang);
		this.tS.setDefaultLang(lang);
		this.tS.use(lang);
		this.language = language;
		this.isLangaugeShow = false;
	}
}
