import { Injectable } from '@angular/core';
import { SignUpLoginSubRes, BusinessFlag } from './../../class/data.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToastsManager } from 'ng2-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class CommonService {

    businessModel: BusinessFlag;
    private messageSource = new BehaviorSubject<string>('default message');
    currentMessage = this.messageSource.asObservable();
    parentCategoryList: Array<{category_id: '' , category_slug: '' , name: ''}> = [];

    constructor(public route: Router, public toastr: ToastsManager) {
        this.businessModel = {
            is_Register: false,
            skipped: false,
            country_code: ''
        };
    }

    updateLatLong(lat: any, long: any) {
        this.messageSource.next(lat + ',' + long);
    }

    // set mob number
    setUserDetails(val: SignUpLoginSubRes): void {
        localStorage.setItem('user', JSON.stringify(val));
    }

    // get mob number
    getUserDetails(): SignUpLoginSubRes | null {

        const userDetails = localStorage.getItem('user');
        if (userDetails) {
            return JSON.parse(userDetails);
        } else {
            return null;
        }
    }

    // isBusinessRegister Method to check is Business Register or is skipped if yes then return false else true
    isBusinessRegister(): boolean {
        const business = localStorage.getItem('business_flag');

        if (business) {
            const business_flag = JSON.parse(business);
            return business_flag.is_Register;
        }
        return false;
    }

    isBusinessRegisterSkipped(): boolean {
        const business = localStorage.getItem('business_flag');
        if (business) {
            const business_flag = JSON.parse(business);
            return business_flag.skipped ? true : false;
        }
        return false;
    }

    setBusinessRegiFlag(): void {
        localStorage.setItem('business_flag', JSON.stringify(this.businessModel));
    }

    getBusinessDetail() {
        const business = localStorage.getItem('business_flag');
        if (business) {
            const business_flag = JSON.parse(business);
            return business_flag;
        }
        return [];
    }

    // set language preference
    setLang(lang: string) {
        localStorage.setItem('lang', lang);
    }

    // retrive lang prefrence
    getLang(): string {
        const lang = localStorage.getItem('lang');
        // if set then return othewise lang will be en by default
        return lang ? lang : 'en';
    }

    // navigate to link
    navigateTo(link: string) {
        this.route.navigate([link]);
    }

    /**
        *Check image file type and image size
    */
    checkValidImage(image: File): boolean {
        if (image.name.match(/\.(jpg|png|jpeg|bmp|svg)$/i)) {
            console.log(image.size);
            // if (image.size <= 5000000) {
            //     return true;
            // } else {
            //     return false;
            // }
            return true;
        } else {
            return false;
        }
    }

    /**
     *componenet scroll to top
     */
    scrollTop() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    /**
     *show success toast message
     */
    showSuccess(message: string): void {
        console.log(message);
        this.toastr.success(message, 'Success!');
    }

    /**
     *show error toast message
     */
    showError(message: string): void {
        this.toastr.error(message, 'Oops!');
    }

    /**
     *show Information toast message
     */
    showInfo(message: string): void {
        this.toastr.info(message, '');
    }

    /**
     * common method to set any data with key to storage
     * @returns void
     */
    setData(key: string, val: any): void {
        localStorage.setItem(key, val);
    }

    /**
     * common method to retirve any data with key from storage
     * @param key <string>
     * @return any | null
     */
    getData(key: string): any | null {
        return localStorage.getItem(key) ? localStorage.getItem(key) : null;
    }

    /**
     * Trigger validation on FormGroup While submit
     * @param Fg <FormGroup>
     */
    triggerValidation(Fg: FormGroup) {
        Object.keys(Fg.controls).forEach(field => {
            const control = Fg.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.triggerValidation(control);
            }
        });
    }

    setParentCategory(item: any) {
        this.parentCategoryList.push( {
            category_id: item['category_id'],
            category_slug: item['category_slug'],
            name: item['name']
        });
        localStorage.setItem('parent-category', JSON.stringify(this.parentCategoryList));
    }

    b64toBlob(b64Data: string, contentType: any, sliceSize?: any) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}
}
