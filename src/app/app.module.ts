import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from "../app/_guards/auth.guard";
import { LoginComponent } from './auth/Logins/Components/login/login.component';
import { CareConnectionMasterComponent } from './Platform/ApplicationMaster/care-connection-master.component';
import { DashboardComponent } from './Platform/SuperAdmin/dashboard/dashboard.component';
import { HeaderComponent } from './Shared/header/header.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { SidebarComponent } from './Shared/sidebar/sidebar.component';
import { ParentNavigatorComponent } from './Shared/parent-navigator/parent-navigator.component';
import { PagenotfoundComponent } from './PageNotFound/pagenotfound.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SignUpComponent } from './auth/Logins/Components/sign-up/sign-up.component';
import { RedirectionComponent } from './auth/Logins/Components/redirection/redirection.component';
import { ForgotPasswordComponent } from './auth/Logins/Components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/Logins/Components/reset-password/reset-password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {OverlayModule} from '@angular/cdk/overlay';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { ManageRolePermissionComponent } from './Platform/SuperAdmin/manage-role-permission/manage-role-permission.component';
import { SuperAdminModule } from './Platform/SuperAdmin/SuperAdminModule';
import { NgxMaskModule,IConfig } from 'ngx-mask';
import { CaregiverAgencyDashboardComponent } from './Platform/Caregiver-agency/caregiver-agency-dashboard/caregiver-agency-dashboard.component';
import { SchedulerComponent } from './Platform/SuperAdmin/scheduler/scheduler.component';
import { ProfileComponent } from './Platform/SuperAdmin/profile/profile.component';
import { ExcelService } from './Platform/Services/excelService/excel.service';
import { ExportToExcelService } from './Platform/Services/exportToExcelService/export-to-excel.service';
import { MessagingComponent } from './Platform/SuperAdmin/messaging/messaging.component';
import { ComposeMessageComponent } from './Platform/SuperAdmin/compose-message/compose-message.component';
import { ImportantMessageComponent } from './Platform/SuperAdmin/important-message/important-message.component';
import { ManageMessagesComponent } from './Platform/SuperAdmin/manage-messages/manage-messages.component';
import { TrashComponent } from './Platform/SuperAdmin/trash/trash.component';
import { ViewMessageComponent } from './Platform/SuperAdmin/view-message/view-message.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from "ng-apexcharts";
import { SubscriptionPaymentComponent} from "./Shared/subscription-payment/subscription-payment.component";
import { PaymentConfirmationComponent} from "./Shared/payment-confirmation/payment-confirmation.component";
import { MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule} from '@angular/material/paginator';
import { PaginationService } from "./Platform/Services/paginationService/pagination.service";
import { NumberHelper } from './Utilities/contract/number-helper';
import { ManageReviewsComponent } from './Platform/SuperAdmin/manage-reviews/manage-reviews.component';
// import { RequestCaregiverComponent } from './Platform/Patient/request-caregiver/request-caregiver.component';
import { CustomPhoneFormatPipe } from "./Utilities/contract/custom-phone-format";
import { CaregiverAgencyModule } from './Platform/Caregiver-agency/CaregiverAgencyModule';
import { TextMaskModule } from 'angular2-text-mask';
import { PDFDownloadService} from '../app/Platform/Services/downloadPDF.service';
import { ViewAllNotificationComponent } from './Shared/view-all-notification/view-all-notification.component';
import { NotificationDetailComponent } from './Shared/view-all-notification/notification-detail/notification-detail.component';
import { MatIconModule} from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllMastersComponent } from './Platform/Caregiver-agency/Master/all-masters/all-masters.component';
import { AddUpdateMastersComponent } from './Platform/Caregiver-agency/Master/add-update-masters/add-update-masters.component';
import { DatePipe } from '@angular/common';
import { LinkResetPasswordComponent } from './auth/Logins/Components/link-reset-password/link-reset-password.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CareConnectionMasterComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ParentNavigatorComponent,
    PagenotfoundComponent,
    SignUpComponent,
    RedirectionComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ManageRolePermissionComponent,
    CaregiverAgencyDashboardComponent,
    SchedulerComponent,
    ProfileComponent,
    MessagingComponent,
    ComposeMessageComponent,
    ImportantMessageComponent,
    ManageMessagesComponent,
    TrashComponent,
    ViewMessageComponent,
    ManageReviewsComponent,
    // RequestCaregiverComponent,
    SubscriptionPaymentComponent,
    PaymentConfirmationComponent,
    ViewAllNotificationComponent,
    NotificationDetailComponent,
    AllMastersComponent,
    AddUpdateMastersComponent,
    CustomPhoneFormatPipe,
    LinkResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OverlayModule,
    MaterialModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CaregiverAgencyModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    BrowserAnimationsModule,
    SuperAdminModule,
    NgxMaskModule.forRoot(),
    AngularEditorModule,
    NgApexchartsModule,
    TextMaskModule,
    MatIconModule,
    NgbModule,
    DatePipe
    
  ],
  providers: [AuthGuard,CookieService, 
    {provide:LocationStrategy,useClass:HashLocationStrategy},
    ExcelService,
    PDFDownloadService,
    ExportToExcelService,
    PaginationService,
    NumberHelper,
    CustomPhoneFormatPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
