import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }from '../app/_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  // {
  //   path: 'platform-admin',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./platform-admin/platform-admin.module').then(m => m.PlatformAdminModule)
  // },
  { 
    path: 'super-admin',
   canActivate: [AuthGuard], 
    loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) 
    
  // },
  // { path: 'SuperAdmin', loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) },
  // { path: 'Dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  // { path: 'Dashboard', loadChildren: () => import('./super-admin/dashboard/dashboard.module').then(m => m.DashboardModule)
 },
  // { path: 'AcpPartner', loadChildren: () => import('./super-admin/acp-partner/acp-partner.module').then(m => m.AcpPartnerModule) },
  { path: 'PlatformAdmin', loadChildren: () => import('./platform-admin/platform-admin.module').then(m => m.PlatformAdminModule) },
  // { path: 'Company', loadChildren: () => import('./platform-admin/company/company.module').then(m => m.CompanyModule) },
  { path: 'AcpPartnerAdmin', loadChildren: () => import('./acp-partner-admin/acp-partner-admin.module').then(m => m.AcpPartnerAdminModule) },
  { path: 'Role', loadChildren: () => import('./acp-partner-admin/role/role.module').then(m => m.RoleModule) },
  // { path: 'dashboard', loadChildren: () => import('./platform-admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
  // { path: 'staff', loadChildren: () => import('./acp-partner-admin/staff/staff.module').then(m => m.StaffModule) },
  // { path: 'dashboard', loadChildren: () => import('./acp-partner-admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
  // { path: 'auth', loadChildren: () => import('./auth/auth/auth.module').then(m => m.AuthModule) }
//   ,{ path: 'appointment', loadChildren: () => import('./super-admin/appointment/appointment.module').then(m => m.AppointmentModule) },
//   { path: 'equipment', loadChildren: () => import('./super-admin/equipment/equipment.module').then(m => m.EquipmentModule) },
//   {
//     path: '**',
//     redirectTo: 'auth',
// },
];    

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
