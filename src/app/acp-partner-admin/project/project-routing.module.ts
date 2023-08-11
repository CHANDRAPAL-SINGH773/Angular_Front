import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';


const routes: Routes = [
  { path: '', component: ProjectComponent ,
  children:[
    { path:'',redirectTo: 'projectlist',pathMatch:'full'},
    {path:'projectlist',component:ListProjectComponent},
    {path:'addproject',component:AddProjectComponent},
    {path:'viewproject/:projectid',component:ViewProjectComponent}
    
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
