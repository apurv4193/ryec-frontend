import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//import { AuthGuard } from './../../guards/auth-guard.service';
//import { ContactComponent } from '../../components';

export const routes: Routes = [
    {
        // path: '',
        // component: CompanyComponent,
        // canActivate: [AuthGuard],
        // canLoad: [AuthGuard],
        // canActivateChild: [AuthGuard],
        // children: [
        //     { path: '', redirectTo: 'about', pathMatch: 'full' },
        //     {
        //         path: 'about',
        //         component: AboutComponent,
        //         data: { title: 'RYEC - About Us' }
        //     },
        //     {
        //         path: 'contact',
        //         component: ContactComponent,
        //         data: { title: 'RYEC - Contact Us' }
        //     }
        // ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
