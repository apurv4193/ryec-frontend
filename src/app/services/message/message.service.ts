import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SignUpLoginSubRes, BusinessFlag } from '../../class/data.model';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class MessageService {

	loginSubject = new BehaviorSubject<boolean>(false);
	registerBusinessSub = new BehaviorSubject<boolean>(false);
	spinnerSub = new BehaviorSubject<boolean>(false);
	isAgentSub = new BehaviorSubject<{ isAgent: string }>({ isAgent: 'NA' });
	userProfileSub = new Subject<SignUpLoginSubRes>();
	businessres = new Subject<BusinessFlag>();
	categoryResponse = new Subject<any>();
	businessResponse = new Subject<any>();
	searchBusiness = new Subject<any>();
	messageCount = new Subject<any>();

	constructor() { }

	// for useloggedIn or not

	setLoggedIn(val: boolean) {
		this.loginSubject.next(val);
	}

	getLoggedIn(): Observable<boolean> {
		return this.loginSubject.asObservable();
	}


	// set registerBusiness
	setRegisterbusiness(val: boolean) {
		this.registerBusinessSub.next(val);
	}

	getRegisterbusiness(): Observable<boolean> {
		return this.registerBusinessSub.asObservable();
	}

	getBusinessDetailUpdate(): Observable<BusinessFlag> {
		return this.businessres.asObservable();
	}

	// get set business data
	setBusinessDetailUpdate(data: BusinessFlag) {
		this.businessres.next(data);
	}

	// set spinner
	setSpinner(val: boolean) {
		this.spinnerSub.next(val);
	}

	getSpinner(): Observable<boolean> {
		return this.spinnerSub.asObservable();
	}

	// get set profile data
	setProfile(data: SignUpLoginSubRes) {
		this.userProfileSub.next(data);
	}

	getProfile(): Observable<SignUpLoginSubRes> {
		return this.userProfileSub.asObservable();
	}

	// set Agent application status
	setAgentStatus(status: string) {
		this.isAgentSub.next({ isAgent: status });
	}

	// getAgent status
	getAgentStatus(): Observable<{ isAgent: string }> {
		return this.isAgentSub.asObservable();
	}

	//get/set parent category 
	setParentCategory(data: any) {
		this.userProfileSub.next(data);
	}

	getParentCategory(): Observable<any> {
		return this.userProfileSub.asObservable();
	}

	//set business name
	setBusinessName(data: any) {
		this.businessResponse.next(data);
	}

	//get business name
	getBusinessName(): Observable<any> {
		return this.businessResponse.asObservable();
	}

	setBusinessSearchText(data: any) {
		this.searchBusiness.next(data);
	}

	getBusinessSearchText(): Observable<any> {
		return this.searchBusiness.asObservable();
	}

	setMessageCount(data: any) {
		this.messageCount.next(data);
	}

	getMessageCount(): Observable<any> {
		return this.messageCount.asObservable();
	}

}
