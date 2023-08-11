import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { ListStaffComponent } from './list-staff/list-staff.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffProfileComponent } from './staff-profile/staff-profile.component';

const routes: Routes = [
  { path: '', component: StaffComponent ,
  children:[
    { path:'',redirectTo: 'stafflist',pathMatch:'full'},
    {path:'stafflist',component:ListStaffComponent},
    {path:'addstaff',component:AddStaffComponent},
    {path:'staffprofile',component:StaffProfileComponent},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
