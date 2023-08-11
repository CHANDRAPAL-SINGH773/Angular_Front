import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RegistrationmodalComponent } from './registrationmodal/registrationmodal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { ViewCompanyComponent } from './view-company/view-company.component';


@NgModule({
  declarations: [
    CompanyComponent,
    CompanylistComponent,
    RegistrationmodalComponent,
    ViewCompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,FormsModule, MatTableModule,MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    //BrowserModule,
        FormsModule,
        ReactiveFormsModule,MatSelectModule,
        MatButtonToggleModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot(),
  ]
})
export class CompanyModule { }
