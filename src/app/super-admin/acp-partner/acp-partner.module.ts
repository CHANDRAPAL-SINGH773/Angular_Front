import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcpPartnerRoutingModule } from './acp-partner-routing.module';
import { AcpPartnerComponent } from './acp-partner.component';
import { AddAcpPartnerComponent } from './add-acp-partner/add-acp-partner.component';
import { ListAcpPartnerComponent } from './list-acp-partner/list-acp-partner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { NgxMaskModule } from 'ngx-mask';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AcpPartnerComponent,
    AddAcpPartnerComponent,
    ListAcpPartnerComponent,
  ],
  imports: [
    CommonModule,
    AcpPartnerRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatDatepickerModule,FormsModule, MatTableModule,MatPaginatorModule,MatIconModule,
    NgxMaskModule,MatSlideToggleModule,
    //BrowserModule,
        FormsModule,
        ReactiveFormsModule,MatSelectModule,
        
  ]
})
export class AcpPartnerModule { }
