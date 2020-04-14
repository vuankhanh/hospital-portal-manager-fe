import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DirectbillingComponent } from '../directbilling/directbilling.component';
import { PendingComponent } from '../pending/pending.component';
import { HistoryComponent } from '../history/history.component';

const dashboardModuleRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children:[
            {
                path:'',
                redirectTo:'directbilling',
                pathMatch:'full'
            },{
                path: 'directbilling',
                component: DirectbillingComponent,
                data: { 
                    title: 'Bảo Lãnh',
                    shouldReuse: true,
                    animation: 'DirectBilling'
                }
            },{
                path: 'pending',
                component: PendingComponent,
                data: { 
                    title: 'Đang chờ xử lý',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'history',
                component: HistoryComponent,
                data: { 
                    title: 'Đã xử lý',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            }
        ]
    }
];

@NgModule({
    imports:[
        RouterModule.forChild(dashboardModuleRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }