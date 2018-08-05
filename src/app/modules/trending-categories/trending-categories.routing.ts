import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { TrendingCategoriesComponent } from '../../components';
import { AuthGuard } from './../../guards/auth-guard.service';
import { TrendingApi } from '../../resolver/trending-api.resolver';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', redirectTo: 'trending/category', pathMatch: 'full' },
            {
                path: 'trending/category',
                resolve: { list: TrendingApi },
                component: TrendingCategoriesComponent,
                data: { title: 'Ryuva - Trending Categories' }
            },
            {
                path: 'trending/service',
                resolve: { list: TrendingApi },
                component: TrendingCategoriesComponent,
                data: { title: 'Ryuva - Trending Services' }
            }
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);