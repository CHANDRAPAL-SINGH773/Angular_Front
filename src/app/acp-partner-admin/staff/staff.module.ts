import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule,IConfig } from 'ngx-mask';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    StaffComponent,
    AddStaffComponent,
    ListStaffComponent,
    StaffProfileComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    CommonModule,
 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,FormsModule, MatTableModule,MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    NgxMaskModule,
    MatIconModule
  ]
})
export class StaffModule { }
