import { NgModule } from '@angular/core';
import { MaterialModule} from '../../../material.module';
import { ManageAgenciesComponent} from './manage-agencies/manage-agencies.component';
import { AddEditAgencyComponent} from './manage-agencies/add-edit-agency/add-edit-agency.component';
import { ManageCaregiverComponent } from './manage-caregiver/manage-caregiver.component';
import { AddEditCaregiverComponent } from './manage-caregiver/add-edit-caregiver/add-edit-caregiver.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination'; 
import { ManageShiftComponent } from './manage-shift/manage-shift.component';
import { AddEditShiftComponent} from './manage-shift/add-edit-shift/add-edit-shift.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import { ManagePatientAndFamilyComponent } from './manage-patient-and-family/manage-patient-and-family.component';
import { AddPatientAndFamilyComponent } from './manage-patient-and-family/add-patient-and-family/add-patient-and-family.component';
import { OpenShiftComponent } from './manage-shift/open-shift/open-shift.component';
import { PendingShiftComponent} from './manage-shift/pending-shift/pending-shift.component';
import { CompletedShiftComponent} from './manage-shift/completed-shift/completed-shift.component';
import { ApprovedShiftComponent} from './manage-shift/approved-shift/approved-shift.component';
import { AppliedShiftComponent} from './manage-shift/applied-shift/applied-shift.component';
import { InvitedShiftComponent} from './manage-shift/invited-shift/invited-shift.component';
import { AddEditPlanComponent} from './subscription-plan/add-edit-plan/add-edit-plan.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { SendNewNotificationComponent } from './manage-notification/send-new-notification/send-new-notification.component';
import { AddAvailableTimeComponent } from './manage-caregiver/add-available-time/add-available-time.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { NotificationTemplateComponent } from './notification-template/notification-template.component';
import { AddTemplateComponent } from './notification-template/add-template/add-template.component';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule} from '@angular/material/paginator';
import { PaginationService } from "../Services/paginationService/pagination.service";
import { DatePipe } from '@angular/common';
import { MastersComponent } from './masters/masters.component';
import { ManageMastersComponent } from './manage-masters/manage-masters.component';
import { DiscountCodeComponent } from './discount-codes/discount-code.component';
import { AddEditDiscountCodeComponent } from './discount-codes/add-edit-discount-code/add-edit-discount-code.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddEditUserComponent } from './manage-users/add-edit-user/add-edit-user.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AddEditSubscriptionPlanComponent } from './subscription/add-edit-subscription-plan/add-edit-subscription-plan.component';
import { ManageReferralsComponent } from './manage-referrals/manage-referrals.component';
import { AddEditReferralsComponent } from './manage-referrals/add-edit-referrals/add-edit-referrals.component';
import { CancelledShiftComponent } from './manage-shift/cancelled-shift/cancelled-shift/cancelled-shift.component';
import { StylePaginatorDirective } from 'src/app/Utilities/contract/PaginatorStyleDirective';
import { AssociateMembersComponent } from './manage-referrals/associate-members/associate-members.component';
import { SendInviteComponent } from './manage-shift/send-invite/send-invite.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/core.service';
@NgModule({
  declarations: [
    ManageAgenciesComponent,
    AddEditAgencyComponent,
    ManageCaregiverComponent,
    AddEditCaregiverComponent,
    ManageShiftComponent,
    ManageReferralsComponent,
    AddEditReferralsComponent,
    AddEditShiftComponent,
    ManagePatientAndFamilyComponent,
    AddPatientAndFamilyComponent,
    OpenShiftComponent,
    PendingShiftComponent,
    CompletedShiftComponent,
    ApprovedShiftComponent,
    AppliedShiftComponent,
    InvitedShiftComponent,
    ManageNotificationComponent,
    SendNewNotificationComponent,
    AddEditPlanComponent,
    AddAvailableTimeComponent,
    NotificationTemplateComponent,
    AddTemplateComponent,
    MastersComponent,
    ManageMastersComponent,
    DiscountCodeComponent,
    AddEditDiscountCodeComponent,
    ManageUsersComponent,
    AddEditUserComponent,
    SubscriptionPlanComponent,
    SubscriptionComponent,
    AddEditSubscriptionPlanComponent,
    CancelledShiftComponent,
    StylePaginatorDirective,
    AssociateMembersComponent,
    SendInviteComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    NgxMatTimepickerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,   
    MatPaginatorModule,
    NgbModule
    
  ],
  
  providers: [
    MatDialog,
    PaginationService,
    DatePipe,
    CoreService
  ],
  bootstrap: []
})
export class SuperAdminModule { }
