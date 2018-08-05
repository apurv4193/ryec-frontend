import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent, AccountRecoveryComponent } from '../../components';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, data: { title: 'Ryuva - Login' } },
    { path: 'account-recovery', component: AccountRecoveryComponent, data: { title: 'Ryuva - Account Recovery' } }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);