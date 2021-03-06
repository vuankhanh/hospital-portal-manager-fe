import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router/';
// import { CacheRouteReuseStrategy } from './service/cache-route-reuse.strategy';
import { CacheRouteReuseSearchStrategy } from './service/cache-route-reuse-search.strategy';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PushNotificationsModule } from 'ng-push';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { NextDayPipe } from './pipes/next-day.pipe';
import { UrlAttachmentPipe } from './pipes/url-attachment.pipe';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatButtonToggleModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { DashboardRoutingModule } from '../app/dashboard/main/dashboard.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/main/dashboard.component';
import { ExportDataComponent } from './dashboard/export-data/export-data.component';
import { EmptyPageComponent } from './sharing/component/empty-page/empty-page.component';
import { HomeComponent } from './dashboard/home/home.component';
import { StaffAccountManagementComponent } from './dashboard/staff-account-management/staff-account-management.component';
import { HospitalListManagementComponent } from './dashboard/hospital-list-management/hospital-list-management.component';
import { HospitalDetailComponent } from './dashboard/hospital-detail/hospital-detail.component';
import { OutWorkingTimeComponent } from './dashboard/out-working-time/out-working-time.component';
import { TodoListComponent } from './sharing/component/todo-list/todo-list.component';
import { ConnectionStatusComponent } from './sharing/component/connection-status/connection-status.component';

//Modal
import { CreateAccountHospitalComponent } from './sharing/modal/create-account-hospital/create-account-hospital.component';
import { ImageShowComponent } from './sharing/modal/image-show/image-show.component';
import { InsuranceListManagementComponent } from './dashboard/insurance-list-management/insurance-list-management.component';
import { UserInformationComponent } from './dashboard/user-information/user-information.component';
import { TimelineTicketComponent } from './dashboard/timeline-ticket/timeline-ticket.component';
import { ConfirmActionComponent } from './sharing/modal/confirm-action/confirm-action.component';
import { UpdateHospitalAccountComponent } from './sharing/modal/update-hospital-account/update-hospital-account.component';

import { TitleService } from './service/title.service';
import { CurrencyDirective } from './directives/currency.directive';
import { ExportDataService } from './service/export-data.service';
import { HospitalInformationComponent } from './sharing/modal/hospital-information/hospital-information.component';
import { SearchTicketComponent } from './dashboard/search-ticket/search-ticket.component';
import { CostTableComponent } from './sharing/modal/cost-table/cost-table.component';
import { InsurerInformationComponent } from './sharing/modal/insurer-information/insurer-information.component';
import { InsurerDetailComponent } from './dashboard/insurer-detail/insurer-detail.component';
import { AccountInformationComponent } from './sharing/modal/account-information/account-information.component';
import { AccountDetailComponent } from './dashboard/account-detail/account-detail.component';

const ISO_FORMAT = {
  parse: {
    dateInput: 'DD/MM/yyyy'
  },
  display: {
    dateInput: 'DD/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM yyyy'
  }
}

@NgModule({
  entryComponents:[
    CreateAccountHospitalComponent,
    ImageShowComponent,
    ConfirmActionComponent,
    UpdateHospitalAccountComponent,
    HospitalInformationComponent,
    InsurerInformationComponent,
    AccountInformationComponent,
    UpdateHospitalAccountComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ExportDataComponent,
    CurrencyDirective,
    EmptyPageComponent,
    NextDayPipe,
    UrlAttachmentPipe,
    HomeComponent,
    StaffAccountManagementComponent,
    HospitalListManagementComponent,
    HospitalDetailComponent,
    OutWorkingTimeComponent,
    TodoListComponent,
    ConnectionStatusComponent,
    InsuranceListManagementComponent,
    CreateAccountHospitalComponent,
    ImageShowComponent,
    UserInformationComponent,
    TimelineTicketComponent,
    ConfirmActionComponent,
    UpdateHospitalAccountComponent,
    HospitalInformationComponent,
    SearchTicketComponent,
    CostTableComponent,
    InsurerInformationComponent,
    InsurerDetailComponent,
    AccountInformationComponent,
    AccountDetailComponent,
    UpdateHospitalAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    PushNotificationsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MdePopoverModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatRippleModule,
    MatTooltipModule,
    MatDatepickerModule,
    
    ClipboardModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
      autoDismiss: true
    })
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT },
    { provide: RouteReuseStrategy,
      useClass: CacheRouteReuseSearchStrategy
    },
    TitleService,
    { provide : LocationStrategy , useClass: HashLocationStrategy },
    CurrencyPipe,
    DatePipe,
    NextDayPipe,
    UrlAttachmentPipe,
    ExportDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }