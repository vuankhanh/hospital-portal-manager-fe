import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from '../home/home.component';
import { StaffAccountManagementComponent } from '../staff-account-management/staff-account-management.component';
import { HospitalListManagementComponent } from '../hospital-list-management/hospital-list-management.component';
import { OutWorkingTimeComponent } from '../out-working-time/out-working-time.component';
import { ExportDataComponent } from '../export-data/export-data.component';

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