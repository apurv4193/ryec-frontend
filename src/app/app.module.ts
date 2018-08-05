import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { RyecHttpInterceptor } from './../app/class/ryec-http-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NguiMapModule } from '@ngui/map';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { AgmCoreModule } from '@agm/core';

// app routing for root
import { Routing } from './app.routing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './modules/shared/shared.module';

// resolver import
import { ApiResolver } from './resolver/api-resolver.resolver';

// guard import
import { AuthGuard } from './guards/auth-guard.service';

// service import
import { HttpService, AuthService, MessageService, CommonService, HomeService } from './services';

// modules import
import {
	HeaderFooterModule, LoginModule,
	SignupModule, HomeModule,
	UserModule, MyOwnCustomMaterialModule,
	CategorieModule, MessagesModule, AZcategoriesModule,
	TrendingCategoriesModule
} from './modules';

// Toast module import
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { UpperCasePipe } from '@angular/common';
import { environment } from '../environments/environment';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TermConditionsComponent } from './components/company/term-conditions/term-conditions.component';
import { FaqsComponent } from './components/company/faqs/faqs.component';
import { AboutComponent } from './components/company/about/about.component';
import { ContactComponent } from './components/company/contact/contact.component';
import { PrivacyPolicyComponent } from './components/company/privacy-policy/privacy-policy.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { DateFormatPipe } from './pipes/date-format/date-format';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		SpinnerComponent,
		TermConditionsComponent,
		FaqsComponent,
		AboutComponent,
		ContactComponent,
		PrivacyPolicyComponent,
		NotificationsListComponent,
		DateFormatPipe
	],
	imports: [
		FormsModule,
		MatProgressSpinnerModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AZcategoriesModule,
		MessagesModule,
		SharedModule,
		MyOwnCustomMaterialModule,
		AgmCoreModule.forRoot({
			apiKey: environment.GOOGLE_MAP_API,
			libraries: ['places']
		}),
		ToastModule.forRoot(),
		NgbModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		NguiMapModule.forRoot({ apiUrl: environment.GOOGLE_MAP_API }),
		SweetAlert2Module.forRoot({
			buttonsStyling: false,
			customClass: 'modal-content',
			confirmButtonClass: 'btn ryec_btn',
			cancelButtonClass: 'btn'
		}),
		Routing,
		LoginModule,
		SignupModule,
		HeaderFooterModule,
		HomeModule,
		UserModule,
		CategorieModule,
		MessagesModule,
		TrendingCategoriesModule
	],
	providers: [HttpService,
		AuthService,
		CommonService,
		AuthGuard,
		UpperCasePipe,
		ApiResolver,
		HomeService,
		MessageService, {
			provide: HTTP_INTERCEPTORS,
			useClass: RyecHttpInterceptor,
			multi: true
		}],
	bootstrap: [AppComponent]
})

export class AppModule { }
