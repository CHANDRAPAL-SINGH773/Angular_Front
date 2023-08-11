import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcpPartnerAdminRoutingModule } from './acp-partner-admin-routing.module';
import { AcpPartnerAdminComponent } from './acp-partner-admin.component';
import { AcpPartnerSidebarComponent } from './shared/acp-partner-sidebar/acp-partner-sidebar.component';
import { AcpPartnerHeaderComponent } from './shared/acp-partner-header/acp-partner-header.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ClientsModuleRoutingModule } from './clients/clients-module-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AcpPartnerAdminComponent,
    AcpPartnerSidebarComponent,
    AcpPartnerHeaderComponent
  ],
  imports: [
    CommonModule,
    AcpPartnerAdminRoutingModule,
    DashboardRoutingModule,
    ClientsModuleRoutingModule,
    MatTableModule,MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,

  ]
})
export class AcpPartnerAdminModule { }
