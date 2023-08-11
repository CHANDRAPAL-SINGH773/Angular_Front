import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformAdminRoutingModule } from './platform-admin-routing.module';
import { PlatformAdminComponent } from './platform-admin.component';
import { PlatformAdminHeaderComponent } from './shared/platform-admin-header/platform-admin-header.component';
import { PlatformAdminSidebarComponent } from './shared/platform-admin-sidebar/platform-admin-sidebar.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    PlatformAdminComponent,
    PlatformAdminHeaderComponent,
    PlatformAdminSidebarComponent
  ],
  imports: [
    CommonModule,
    PlatformAdminRoutingModule,
    MatIconModule
  ]
})
export class PlatformAdminModule { }
