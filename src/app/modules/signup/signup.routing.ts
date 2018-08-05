import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SignupComponent } from '../../components';


export const routes: Routes = [
    { path: 'signup', component: SignupComponent, data: { title: 'Ryuva - Sign Up' } }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
