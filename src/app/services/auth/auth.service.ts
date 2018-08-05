import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './../message/message.service';


@Injectable()
export class AuthService {

	redirectUrl: string;
	authToken: string;

	constructor(private route: Router,
		private mS: MessageService) {
		this.redirectUrl = '/';
	}

	isLoggedIn(): boolean {
		return localStorage.getItem('token') && localStorage.getItem('user') ? true : false;
	}

	// get local storage token
	getToken(): string | null {
		if (this.authToken) {
			return this.authToken;
		} else {
			return localStorage.getItem('token') ? localStorage.getItem('token') : null;
		}
	}

	// set token in localstorage
	setToken(token: string): void {
		this.mS.setLoggedIn(true);
		this.authToken = token;
		localStorage.setItem('token', token);
	}

	// logout method
	logout(): void {
		this.mS.setLoggedIn(false);
		this.clearStorage();

		// hide register business option
		this.mS.setRegisterbusiness(true);
		this.redirectToLogin();
	}

	/**
	 * Clear local storage data
	 * @param
	*/
	clearStorage(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('business_flag');
		localStorage.removeItem('lang');
		localStorage.removeItem('isAgent');
		//localStorage.removeItem('latitude');
		//localStorage.removeItem('longitude');
		localStorage.removeItem('member_id');
		localStorage.removeItem('member_mobile');
		localStorage.removeItem('business_name');
		localStorage.removeItem('isRajput');
	}

	redirectToLogin(): void {
		this.route.navigate(['login']);
	}

	checkTypeAuth(err: any): boolean {
		if (err.message === 'Failed to validating token.') {
			return err.message === 'Failed to validating token.';
		} else if (err.message === 'Invalid Token.') {
			return err.message === 'Invalid Token.';
		} else if (err.message === 'Token Expired.') {
			return err.message === 'Token Expired.';
		} else {
			return false;
		}
	}
}