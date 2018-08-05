import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { Routing } from './user.routing';
import { FormsModule } from '@angular/forms';
import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { UserComponent, UserProfileComponent, ChangePasswordComponent, BusinessOwnerDetailComponent, AddOwnerComponent } from './../../components';

//custom scroll import
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true,
	wheelPropagation: true
};

import { ImageCropperModule } from 'ngx-image-cropper';
@NgModule({
	imports: [
		SharedModule,
		Ng2CarouselamosModule,
		Routing,
		FormsModule,
		PerfectScrollbarModule,
		ImageCropperModule
	],
	declarations: [UserComponent, UserProfileComponent, ChangePasswordComponent, BusinessOwnerDetailComponent, AddOwnerComponent],
	providers: [
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		}
	]
})
export class UserModule { }
