import { Component, OnInit } from '@angular/core';
import { HomeService, CommonService } from './../../services';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
@Component({
	selector: 'ryec-notifications-list',
	templateUrl: './notifications-list.component.html',
	styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {

	currentPage: number;
	totalNotificationCount = 0;
	collectionSize = 0;
	first = 1;
	last = 0;
	perPageList = environment.BUSINESS_LIST_LIMIT;
	endPage: number = environment.BUSINESS_LIST_LIMIT;
	NotificationList = [];
	maxSize = 5;
	noData = false;
	business_approved = 0;
	memberShipPlan = 0;

	constructor(
		private hS: HomeService,
		private router: Router,
		private cS: CommonService) {
		
		this.currentPage = 1;
	}

	ngOnInit() {
		this.cS.scrollTop();
		this.getNotificationList();

		this.getBusinessApproved();
	}

	/**
	 * Chech user business approved or not
	 */
	getBusinessApproved() {
		let business = localStorage.getItem('business_flag');
		business = JSON.parse(<any>business);
		if (business) {
			if (business['is_Register']) {
				const postJson = { business_id: business['business_id'] };

				this.hS.getBusinessApproved(postJson).subscribe((res: any) => {
					if (res.data) {
						this.business_approved = res.data.isApproved;
						this.memberShipPlan = res.data.membership_type;
					}
				}, err => {
					console.log(err);
				});
			}
		}
	}

	getNotificationList() {
		const postJson = {
			page: this.currentPage
		}

		/**
		 * Get all Notification List
		*/

		this.hS.getNotificationList(postJson).subscribe((res: any) => {
			if (res.status === 1) {
				if (res.data.notifications.length > 0) {
					this.NotificationList = res.data.notifications;
					this.totalNotificationCount = res.data.notificationsCount;
				}
				this.countCollectionSize();
			} else {
				this.noData = true;
			}
		}, err => {
			console.log(err);
		});
	}

	getNextPageNotificatioList(event: number): void {
		console.log(event);
		this.getNotificationList();
	}

	/**
	*Calculate pagination display on screen and count of total businesses 
	*/
	countCollectionSize() {
		if (this.totalNotificationCount > this.perPageList) {
			this.collectionSize = Math.ceil(this.totalNotificationCount / this.perPageList);
			this.collectionSize = this.collectionSize * 10;
			if (this.currentPage === 1) {
				this.first = 1;
				this.last = this.perPageList;
			} else {
				this.first = (this.currentPage - 1) * this.perPageList + 1;
				if (this.NotificationList.length < this.perPageList) {
					this.last = (this.currentPage - 1) * this.perPageList + this.NotificationList.length;
				} else {
					this.last = (this.currentPage - 1) * this.perPageList + this.perPageList;
				}
			}
		} else {
			this.last = this.totalNotificationCount;
			this.collectionSize = this.perPageList;
		}

		if (this.totalNotificationCount === 0 || this.totalNotificationCount === undefined) {
			this.noData = true;
		} else {
			this.noData = false;
		}
		this.cS.scrollTop();
	}

	openDetailPage(item: any) {
		if (item.type === 1 || item.type === 3 || item.type === 4 || item.type === 8 || item.type === 9) {
			this.router.navigateByUrl('/home/business-detail/' + item.business_slug);
		} else if (item.type === 2 || item.type === 5) {
			localStorage.setItem('thread_id', item.thread_id);
			this.router.navigateByUrl('messages');
		} else if (item.type === 6) {
			const isRegister = this.cS.isBusinessRegister();
			if (!isRegister) {
				this.router.navigateByUrl('home/add-business');
			}
		} else if (item.type === 7) {
			if (this.memberShipPlan === 0) {
				this.router.navigateByUrl('home/membership-plan');
			}
		}
	}
}
