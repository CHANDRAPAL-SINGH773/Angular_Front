import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcpPartnerAdminComponent } from './acp-partner-admin.component';


const routes: Routes = [
  {
    path: '',
    component: AcpPartnerAdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'staff',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
       // canActivate: [AuthGuard],
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
          
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./staff/staff.module').then((m) => m.StaffModule),
      },
      {
        path: 'role',
        loadChildren: () =>
        import('./role/role.module').then((m) =>m.RoleModule)
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./clients/clients-module.module').then((m) => m.ClientsModuleModule),
      },
      {
        path: 'AcpPartner',
        loadChildren: () =>
          import('./acp-partner-profile/acp-partner-profile.module').then((m) => m.AcpPartnerProfileModule),
      },
      {
        path: 'Profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'project',
        loadChildren: () =>
          import('./project/project.module').then((m) => m.ProjectModule),
      },

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
export class AcpPartnerAdminRoutingModule { }
