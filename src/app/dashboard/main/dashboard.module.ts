import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { TheRequirementsComponent } from '../the-requirements/the-requirements.component';
import { RequestARefundComponent } from '../../dashboard/request-a-refund/request-a-refund.component';
import { DirectbillingComponent } from '../../dashboard/directbilling/main/directbilling.component';

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
                path: 'therequirements',
                component: TheRequirementsComponent,
                data: { 
                    title: 'Không Tìm Thấy Tự Động',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'requestarefund',
                component: RequestARefundComponent,
                data: { 
                    title: 'Yêu Cầu Hoàn Trả',
                    shouldReuse: true,
                    animation: 'RefundRequest'
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