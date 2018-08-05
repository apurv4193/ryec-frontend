import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()

export class HttpService {

	redirectUrl: string;
	constructor(public httpClient: HttpClient, public route: Router) {
		this.redirectUrl = '/';
	}

	get(url: string): Observable<any> {
		return this.httpClient.get(url).pipe(
			catchError(this.handleError)
		);
	}

	post(url: string, data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			})
		};

		return this.httpClient.post(url, data, httpOptions).pipe(
			catchError(this.handleError)
		);

	}

	/**
	 * Method to upload media content multipart form data
	 * @param url <string>
	 * @param data <any>
	 */
	postUpload(url: string, data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'mimeType': 'multipart/form-data',
				'Authorization': 'my-auth-token'
			})
		};

		return this.httpClient.post(url, data, httpOptions).pipe(
			catchError(this.handleError)
		);

	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			if (error.status === 404 || error.status === 400) {
				// redirect to the login route

			}
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${JSON.stringify(error.error)}`);
		}

		// return an ErrorObservable with a user-facing error message
		// return new ErrorObservable(
		//   'Something bad happened; please try again later.');
		return new ErrorObservable(error);
	}
}
