import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';


const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'acp-partner',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
       // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
          
      },// import('./facility/facility.module').then((m) => m.FacilityModule),
      {
        path: 'acp-partner',
        loadChildren: () =>
          import('./acp-partner/acp-partner.module').then((m) => m.AcpPartnerModule),
      }
      // {
      //   path: 'appointment',
      //   loadChildren: () =>
      //     import('./appointment/appointment.module').then((m) => m.AppointmentModule),
      // },

      // {
      //   path: 'application-master',
      //   loadChildren: () =>
      //     import('./application-master/application-master.module').then(
      //       (m) => m.ApplicationMasterModule
      //     ),
      // },
      // {
      //   path: 'equipment',
      //   loadChildren: () =>
      //     import('./equipment/equipment.module').then(
      //       (m) => m.EquipmentModule
      //     ),
      // },
      // {
      //   path: 'attendance',
      //   loadChildren: () =>
      //     import('./attendance/attendance.module').then(
      //       (m) => m.AttendanceModule
      //     ),
      // },

      // {
      //   path: 'profile/:id',
      //   loadChildren: () =>
      //     import('./profile/profile.module').then(
      //       m => m.ProfileModule)
      // },

      // {
      //   path: 'role-permision',
      //   component: RolePermissionsComponent
      // },

      // {
      //   path: 'application-log',
      //   component: ApplicationLogComponent
      // },

      // {
      //   path: 'email-communication',
      //   component: EmailCommunicationComponent
      // },
      // {
      //   path: 'reminder',
      //   component: ReminderComponent
      // },
      // {
      //   path: 'communication', loadChildren: () =>
      //     import('./communication/communication.module').then(
      //       (m) => m.CommunicationModule
      //     )
      // }
    ],

  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
