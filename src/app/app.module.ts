import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PushNotificationsModule } from 'ng-push';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatButtonToggleModule } from '@angular/material';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { DashboardRoutingModule } from '../app/dashboard/main/dashboard.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/main/dashboard.component';
import { TheRequirementsComponent } from './dashboard/the-requirements/the-requirements.component';
import { RequestARefundComponent } from './dashboard/request-a-refund/request-a-refund.component';
import { DirectbillingComponent } from './dashboard/directbilling/main/directbilling.component';

import { ProccessTheRequrementsComponent } from './dashboard/directbilling/proccess-the-requrements/proccess-the-requrements.component';
import { ProccessTheRefundRequestComponent } from './dashboard/directbilling/proccess-the-refund-request/proccess-the-refund-request.component';
import { ConfirmActionComponent } from './sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from './sharing/modal/case-number/case-number.component';
import { ReasonInputComponent } from './sharing/modal/reason-input/reason-input.component';
import { CommentComponent } from './sharing/modal/comment/comment.component';
import { TicketCostComponent } from './sharing/component/ticket-cost/ticket-cost.component';

import { TimelineOfRequestsService } from './service/timeline-of-requests.service';
import { SharedModule } from './sharing/module/shared.module';
import { CurrencyDirective } from './directives/currency.directive';
@NgModule({
  entryComponents:[ConfirmActionComponent, CaseNumberComponent, ReasonInputComponent, CommentComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TheRequirementsComponent,
    RequestARefundComponent,
    DirectbillingComponent,
    ProccessTheRequrementsComponent,
    ProccessTheRefundRequestComponent,
    ConfirmActionComponent,
    CaseNumberComponent,
    ReasonInputComponent,
    CommentComponent,
    TicketCostComponent,
    CurrencyDirective
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
    BrowserAnimationsModule,
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
    MatMenuModule,
    MatRippleModule,
    MatTooltipModule,
    SharedModule,
    
    ClipboardModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
      autoDismiss: true
    })
  ],
  providers: [ 
    TimelineOfRequestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
