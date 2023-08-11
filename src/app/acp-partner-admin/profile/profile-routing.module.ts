import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AcpProfileComponent } from './acp-profile/acp-profile.component';
import { AcpDocumnetComponent } from './acp-documnet/acp-documnet.component';
import { ProgramActivitiesComponent } from './program-activities/program-activities.component';

const routes: Routes = [
  { path: '', component: ProfileComponent ,
  children:[
    { path:'',redirectTo: 'myprofile',pathMatch:'full'},
    {path:'myprofile',component:AcpProfileComponent},
    {path:'documents',component:AcpDocumnetComponent},
    {path:'program-activities',component:ProgramActivitiesComponent}
  ]
}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
