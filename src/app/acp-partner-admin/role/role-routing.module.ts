import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { ListRoleComponent } from './list-role/list-role.component';

const routes: Routes = [
  { path: '', component: RoleComponent ,
  children:[
    { path:'',redirectTo: 'rolelist',pathMatch:'full'},
    {path:'rolelist',component:ListRoleComponent},
   // {path:'addstaff',component:AddStaffComponent},
    //{path:'staffprofile',component:StaffProfileComponent},
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
