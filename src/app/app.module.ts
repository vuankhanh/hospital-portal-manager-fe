import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatButtonToggleModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { DashboardRoutingModule } from '../app/dashboard/main/dashboard.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/main/dashboard.component';
import { TheRequirementsComponent } from './dashboard/the-requirements/the-requirements.component';
import { RequestARefundComponent } from './dashboard/request-a-refund/request-a-refund.component';
import { DirectbillingComponent } from './dashboard/directbilling/main/directbilling.component';

import { TimelineOfRequestsService } from './service/timeline-of-requests.service';
import { ProccessTheRequrementsComponent } from './dashboard/directbilling/proccess-the-requrements/proccess-the-requrements.component';
import { ProccessTheRefundRequestComponent } from './dashboard/directbilling/proccess-the-refund-request/proccess-the-refund-request.component';
import { ConfirmActionComponent } from './modal/confirm-action/confirm-action.component';
@NgModule({
  entryComponents:[ConfirmActionComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TheRequirementsComponent,
    RequestARefundComponent,
    DirectbillingComponent,
    ProccessTheRequrementsComponent,
    ProccessTheRefundRequestComponent,
    ConfirmActionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MdePopoverModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [ 
    TimelineOfRequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
