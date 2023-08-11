import { NgModule } from '@angular/core';
import { MaterialModule} from '../../../material.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination'; 
import { NgxMaskModule } from 'ngx-mask';
import { NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { AddEditAgencyShiftComponent } from './add-edit-agency-shift/add-edit-agency-shift.component';
import { AgencyOpenShiftComponent } from './agency-open-shift/agency-open-shift.component';
import { AgencyAppliedShiftComponent } from './agency-applied-shift/agency-applied-shift.component';
import { AgencyCompletedShiftComponent } from './agency-completed-shift/agency-completed-shift.component';
import { RequestedByCaregiverShiftComponent } from './requested-by-caregiver-shift/requested-by-caregiver-shift.component';
import { InvitedReferralComponent } from './invited-referral/invited-referral.component';
import { MatTableModule} from '@angular/material/table';
import { MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule} from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { CaregiverAgencySchedulerComponent} from "./scheduler/caregiver-agency-scheduler.component";
import { StaffManagementComponent } from '../Caregiver-agency/staff-management/staff-management.component';
import { AddNewStaffComponent } from '../Caregiver-agency/staff-management/add-new-staff/add-new-staff.component';
import { AgencyProfileComponent} from './profile/agency-profile.component';
import { ManageAgencyCaregiverComponent} from './manage-agency-caregiver/manage-agency-caregiver.component';
import { AddAvailableTimeComponent} from './manage-agency-caregiver/add-available-time/add-available-time.component';
import { AddEditAgencyCaregiverComponent} from './manage-agency-caregiver/add-edit-caregiver/add-edit-agency-caregiver.component';
import { AgencyApprovedShiftComponent} from './agency-approved-shift/agency-approved-shift.component';
import { AssignShiftCaregiverComponent } from './agency-approved-shift/assign-shift-caregiver/assign-shift-caregiver.component';
import { ManageCredentialingComponent } from '../Caregiver-agency/manage-credentialing/manage-credentialing.component';
import { AddNewCredentialingComponent } from '../Caregiver-agency/manage-credentialing/add-new-credentialing/add-new-credentialing.component';
import { AssignedInvitedShiftComponent} from '../Caregiver-agency/assigned-invited-shift/assigned-invited-shift.component';
import { ManageCaregiverAgencyRolePermissionsComponent } from './Caregiver-agency-role-permissions/manage-caregiver-agency-role-permissions/manage-caregiver-agency-role-permissions.component';
import { AgencyInvitedShiftComponent } from './agency-invited-shift/agency-invited-shift.component';

@NgModule({
  declarations: [
    AddEditAgencyShiftComponent,
    AgencyOpenShiftComponent,
    AgencyAppliedShiftComponent,
    AgencyCompletedShiftComponent,
    RequestedByCaregiverShiftComponent,
    InvitedReferralComponent,
    CaregiverAgencySchedulerComponent,
    StaffManagementComponent,
    AddNewStaffComponent,
    AgencyProfileComponent,
    ManageAgencyCaregiverComponent,
    AddAvailableTimeComponent,
    AddEditAgencyCaregiverComponent,
    AgencyApprovedShiftComponent,
    AssignShiftCaregiverComponent,
    ManageCredentialingComponent,
    AddNewCredentialingComponent,
    AssignedInvitedShiftComponent,
    ManageCaregiverAgencyRolePermissionsComponent,
    AgencyInvitedShiftComponent
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
    DatePipe
  ],
  providers: [
    MatDialog],
  bootstrap: []
})
export class CaregiverAgencyModule { }
