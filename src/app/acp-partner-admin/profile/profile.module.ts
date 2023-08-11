import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AcpProfileComponent } from './acp-profile/acp-profile.component';
import { AcpDocumnetComponent } from './acp-documnet/acp-documnet.component';
import { ProgramActivitiesComponent } from './program-activities/program-activities.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ResetPasswordComponent } from 'src/app/auth/Logins/Components/reset-password/reset-password.component';
import { AddDocumentComponent } from './acp-documnet/add-document/add-document.component';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ProfileComponent,
    AcpProfileComponent,
    AcpDocumnetComponent,
    ProgramActivitiesComponent,
    AddDocumentComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,FormsModule, MatTableModule,MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,NgxMaskModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ProfileModule { }
