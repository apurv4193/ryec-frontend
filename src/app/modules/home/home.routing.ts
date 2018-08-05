import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {
    HomeComponent, BusinessListComponent,
    HomeDashboardComponent, AddBusinessComponent, AgentBusinessListComponent,
    BusinessDetailComponent, BusinessProfileComponent, MyBusinessDetailComponent, InvestmentOpportunityComponent,
    InvestmentOpportunityDetailComponent, BusinessSearchComponent, CreateInvestmentOpportunityComponent,
    MyInvestmentOpportunityDetailComponent, MembershipPlanComponent
} from '../../components';
import { AuthGuard } from './../../guards/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: HomeDashboardComponent, data: { title: 'Ryuva - Dashboard' } },
            { path: 'home/add-business', component: AddBusinessComponent, data: { title: 'Ryuva - Business Register' } },
            { path: 'home/business-list/:slug/:slug', component: BusinessListComponent, data: { title: 'Ryuva - Business List' } },
            { path: 'home/business-detail/:slug', component: BusinessDetailComponent, data: { title: 'Ryuva - Business List' } },
            { path: 'home/business-profile/:slug', component: BusinessProfileComponent, data: { title: 'Ryuva - Business Profile' } },
            { path: 'home/my-business-detail', component: MyBusinessDetailComponent, data: { title: 'Ryuva - My Business Profile' } },
            { path: 'home/agent-business-list/:slug', component: AgentBusinessListComponent, data: { title: 'Ryuva - Business List' } },
            { path: 'home/investment-opportunity/:slug', component: InvestmentOpportunityComponent, data: { title: 'Ryuva - Investment Opportunity List' } },
            { path: 'home/investment-opportunity-detail/:slug', component: InvestmentOpportunityDetailComponent, data: { title: 'Ryuva - Investment Opportunity Detail' } },
            { path: 'home/business-search/:city/:search/:slug', component: BusinessSearchComponent, data: { title: 'Ryuva - Business Search List' } },
            { path: 'home/business-search/:city/:slug', component: BusinessSearchComponent, data: { title: 'Ryuva - Business Search List' } },
            { path: 'home/create-investment-opportunity/:slug', component: CreateInvestmentOpportunityComponent, data: { title: 'Ryuva - Create Investment Opportunity' } },
            { path: 'home/my-investment-opportunity-detail/:slug', component: MyInvestmentOpportunityDetailComponent, data: { title: 'Ryuva - Investment Opportunity Detail' } },
            { path: 'home/membership-plan', component: MembershipPlanComponent, data: { title: 'Ryuva - Membership Plans' } }
        ]
    }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
