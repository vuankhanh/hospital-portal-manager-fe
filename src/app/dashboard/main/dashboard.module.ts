import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from '../home/home.component';
import { InsuranceListManagementComponent } from '../insurance-list-management/insurance-list-management.component';
import { StaffAccountManagementComponent } from '../staff-account-management/staff-account-management.component';
import { HospitalListManagementComponent } from '../hospital-list-management/hospital-list-management.component';
import { HospitalDetailComponent } from '../hospital-detail/hospital-detail.component';
import { OutWorkingTimeComponent } from '../out-working-time/out-working-time.component';
import { ExportDataComponent } from '../export-data/export-data.component';
import { SearchTicketComponent } from '../search-ticket/search-ticket.component';
import { TimelineTicketComponent } from '../timeline-ticket/timeline-ticket.component';
import { InsurerDetailComponent } from '../insurer-detail/insurer-detail.component';

const dashboardModuleRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children:[
            {
                path:'',
                redirectTo:'home',
                pathMatch:'full'
            },{
                path: 'home',
                component: HomeComponent,
                data: { 
                    title: 'Trang chủ',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'insurance-management',
                component: InsuranceListManagementComponent,
                data: { 
                    title: 'Quản lý danh sách nhà BH',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'staff-account-management',
                component: StaffAccountManagementComponent,
                data: { 
                    title: 'Quản lý tài khoản nhân viên',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'hospital-list-management',
                component: HospitalListManagementComponent,
                data: {
                    title: 'Quản lý danh sách CSYT',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'hospital-detail/:id',
                component: HospitalDetailComponent,
                data: { 
                    title: 'Thông tin CSYT',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'out-working-time',
                component: OutWorkingTimeComponent,
                data: { 
                    title: 'Trực ngoài giờ',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'export-data',
                component: ExportDataComponent,
                data: { 
                    title: 'Xuất dữ liệu',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'search-ticket',
                component: SearchTicketComponent,
                data: { 
                    title: 'Tìm kiếm Ticket',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'timeline-ticket/:id',
                component: TimelineTicketComponent,
                data: { 
                    title: 'Quá trình Ticket',
                    shouldReuse: true,
                    animation: 'TheRequirements'
                }
            },{
                path: 'insurer-detail/:id',
                component: InsurerDetailComponent,
                data: { 
                    title: 'Thông tin Nhà Bảo Hiểm',
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