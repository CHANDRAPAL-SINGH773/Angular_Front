import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ClientsModuleRoutingModule } from './clients-module-routing.module';
import { ClientsSitesComponent } from './list-clients-sites/clients-sites.component';
import { ClientComponent } from './client.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskModule,IConfig } from 'ngx-mask';
import { ContactClientComponent } from './list-contact-client/contact-client.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AddClientSitesComponent } from './add-client-sites/add-client-sites.component';
import { AddContactClientComponent } from './add-contact-client/add-contact-client.component';



@NgModule({
  declarations: [
AddClientsComponent,
ListClientsComponent,
ClientsSitesComponent,
ClientComponent,
ContactClientComponent,
AddClientSitesComponent,
AddContactClientComponent
  ],
  imports: [
    CommonModule,ClientsModuleRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
   NgxMaskModule.forRoot(),

    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ClientsModuleModule { }
