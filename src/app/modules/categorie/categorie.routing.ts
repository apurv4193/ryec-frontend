import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CategorieComponent } from '../../components';
import { AuthGuard } from './../../guards/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            { path: '', component: CategorieComponent, data: { title: 'Ryuva - Categories' } },
            {
                path: 'category/:slug',
                loadChildren: './sub-categorie/sub-categorie.module#SubCategorieModule'
            },
            { path: 'service/:slug', loadChildren: './sub-categorie/sub-categorie.module#SubCategorieModule' }
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
// export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });

