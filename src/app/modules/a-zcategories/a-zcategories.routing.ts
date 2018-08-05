import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AZcategoriesComponent } from '../../components';
import { AuthGuard } from './../../guards/auth-guard.service';

export const routes: Routes = [
    {
        path: 'atoz',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'categories',
                component: AZcategoriesComponent,
                data: { title: 'Ryuva - A-Z Category' }
            }
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);