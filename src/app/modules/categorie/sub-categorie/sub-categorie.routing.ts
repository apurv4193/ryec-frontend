import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SubCategorieComponent } from '../../../components';
import { AuthGuard } from './../../../guards/auth-guard.service';
// import { CategoryGuardService } from './../../../guards/category-guard.service';
import { CategoryGuardService } from '../../../guards/category-guard.service';
import { ApiResolver } from '../../../resolver/api-resolver.resolver';


export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        children: [
            {
                path: '', canActivate: [CategoryGuardService],
                resolve: { category: ApiResolver },
                component: SubCategorieComponent,
                data: { title: 'Ryuva - Sub Categories' },
            },
            {
                path: 'category/:slug/:business-slug',
                canActivate: [CategoryGuardService],
                redirectTo: 'home/business-detail/:business-slug',
                pathMatch: 'full'
            },
            {
                path: 'service/:slug/:business-slug',
                canActivate: [CategoryGuardService],
                redirectTo: 'home/business-detail/:business-slug',
                pathMatch: 'full'
            },
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
// export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });

