import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';

// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, MessageService } from './../services';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';



@Injectable()
export class RyecHttpInterceptor implements HttpInterceptor {

    timer: any;
    constructor(public auth: AuthService, private mS: MessageService) {
        this.timer = timer(1000);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        //console.log('intercepted request ... ');

        // Clone the request to add the new header.
        const authReq = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${this.auth.getToken()}`,
                'Platform': 'web'
            }
        });
        if (req.url.indexOf('getSearchAutocomplete') > -1 ) {
            this.mS.setSpinner(false);
        } else {
            this.mS.setSpinner(true);
        }
        // console.log('Sending request with Autorization now ...');
        // show spinner
        // send the newly created request
        return next.handle(authReq).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 400 && this.auth.checkTypeAuth(err.error)) {
                    if (req.url.indexOf('getAddressMaster') === -1) {
                        this.auth.logout();
                    }
                    this.mS.setSpinner(false);
                }
            }
        }).finally(() => {
            this.timer.subscribe(() => {
                this.mS.setSpinner(false);
            });
        });
        // throw new Error("Method not implemented.");
    }

}

