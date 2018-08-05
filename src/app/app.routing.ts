import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { MessagesComponent, NotificationsListComponent } from './components';
import { AuthGuard } from './guards/auth-guard.service';
import { TermConditionsComponent } from './components/company/term-conditions/term-conditions.component';
import { FaqsComponent } from './components/company/faqs/faqs.component';
import { AboutComponent } from './components/company/about/about.component';
import { ContactComponent } from './components/company/contact/contact.component';
import { PrivacyPolicyComponent } from './components/company/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home', loadChildren: './modules/home/home.module#HomeModule'
    },
    {
        path: 'user', loadChildren: './modules/user/user.module#UserModule'
    },
    {
        path: 'category', loadChildren: './modules/categorie/categorie.module#CategorieModule'
    },
    {
        path: 'service', loadChildren: './modules/categorie/categorie.module#CategorieModule'
    },
    {
        path: 'trending', loadChildren: './modules/trending-categories/trending-categories.module#TrendingCategoriesModule'
    },
    {
        path: 'company', loadChildren: './modules/company/company.module#CompanyModule'
    },
    {
        path: 'terms-conditions',
        component: TermConditionsComponent,
        data: { title: 'Ryuva - Terms & Conditions' }
    },
    {
        path: 'faqs',
        component: FaqsComponent,
        data: { title: 'Ryuva - FAQs' }
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { title: 'Ryuva - About Us' }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Ryuva - Contact Us' }
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: { title: 'Ryuva - Contact Us' }
    },
    {
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: 'messages',
        component: MessagesComponent,
        data: { title: 'Ryuva - Messages' }
    },
    {
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: 'notifications-list',
        component: NotificationsListComponent,
        data: { title: 'Ryuva - Notification List' }
    },
    {
        path: 'atoz', loadChildren: './modules/a-zcategories/a-zcategories.module#AZcategoriesModule'
    },
    { path: '**', redirectTo: 'home' }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
