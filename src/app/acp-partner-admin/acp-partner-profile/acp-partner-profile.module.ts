import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcpPartnerProfileRoutingModule } from './acp-partner-profile-routing.module';
import { AcpPartnerProfileComponent } from './acp-partner-profile.component';
import { AcpPartnerDocComponent } from './acp-partner-doc/acp-partner-doc.component';
import { ListBusinessPartnerComponent } from './list-business-partner/list-business-partner.component';
import { AddBusinessPartnerComponent } from './add-business-partner/add-business-partner.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CompletedRequestComponent } from './list-business-partner/completed-request/completed-request.component';
import { OutgoingRequestComponent } from './list-business-partner/outgoing-request/outgoing-request.component';
import { IncomingRequestComponent } from './list-business-partner/incoming-request/incoming-request.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BusinessPartnerDetailComponent } from './list-business-partner/business-partner-detail/business-partner-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AcpPartnerProfileComponent,
    AcpPartnerDocComponent,
    ListBusinessPartnerComponent,
    AddBusinessPartnerComponent,
    CompanyProfileComponent,
    CompletedRequestComponent,
    OutgoingRequestComponent,
    IncomingRequestComponent,
    BusinessPartnerDetailComponent
  ],
  imports: [
    CommonModule,
    AcpPartnerProfileRoutingModule,MatTableModule,MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule 
  ]
})
export class AcpPartnerProfileModule { }
