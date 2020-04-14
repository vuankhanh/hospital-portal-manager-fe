import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PushNotificationsModule } from 'ng-push';
import { NgxSpinnerModule } from "ngx-spinner";

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
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { DirectbillingComponent } from './dashboard/directbilling/directbilling.component';
import { PendingComponent } from './dashboard/pending/pending.component';
import { HistoryComponent } from './dashboard/history/history.component';

import { ConfirmActionComponent } from './sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from './sharing/modal/case-number/case-number.component';
import { UpdateInsurerIdComponent } from './sharing/modal/update-insurer-id/update-insurer-id.component'
import { ReasonInputComponent } from './sharing/modal/reason-input/reason-input.component';
import { CommentComponent } from './sharing/modal/comment/comment.component';
import { TicketCostComponent } from './sharing/component/ticket-cost/ticket-cost.component';
import { ImageShowComponent } from './sharing/modal/image-show/image-show.component';
import { PushSmsComponent } from './sharing/modal/push-sms/push-sms.component';

import { TitleService } from './service/title.service';
import { TimelineOfRequestsService } from './service/timeline-of-requests.service';
import { SharedModule } from './sharing/module/shared.module';
import { CurrencyDirective } from './directives/currency.directive';
import { EmptyPageComponent } from './sharing/component/empty-page/empty-page.component';


@NgModule({
  entryComponents:[
    ConfirmActionComponent,
    CaseNumberComponent,
    UpdateInsurerIdComponent,
    ReasonInputComponent,
    CommentComponent,
    ImageShowComponent,
    PushSmsComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DirectbillingComponent,
    PendingComponent,
    HistoryComponent,
    ConfirmActionComponent,
    CaseNumberComponent,
    UpdateInsurerIdComponent,
    ReasonInputComponent,
    CommentComponent,
    TicketCostComponent,
    CurrencyDirective,
    ImageShowComponent,
    PushSmsComponent,
    EmptyPageComponent
    
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
    SharedModule,
    
    ClipboardModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
      autoDismiss: true
    })
  ],
  providers: [
    TitleService,
    TimelineOfRequestsService,
    { provide : LocationStrategy , useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
