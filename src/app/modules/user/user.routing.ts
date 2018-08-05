import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UserComponent, UserProfileComponent, ChangePasswordComponent, BusinessOwnerDetailComponent, AddOwnerComponent } from '../../components';
import { AuthGuard } from './../../guards/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: UserComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', redirectTo: '/user/profile', pathMatch: 'full' },
            { path: 'user/profile', component: UserProfileComponent, data: { title: 'Ryuva - User Profile' } },
            {
                path: 'user/business-owner', component: BusinessOwnerDetailComponent,
                data: { title: 'Ryuva - Business Owner Profile' }
            },
            { path: 'user/change-password', component: ChangePasswordComponent, data: { title: 'Ryuva - Changes Password' } },
            { path: 'user/add-owner', component: AddOwnerComponent, data: { title: 'Ryuva - Add Owner' } }
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);