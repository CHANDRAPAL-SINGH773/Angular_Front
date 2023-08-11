import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcpPartnerComponent } from './acp-partner.component';
import { ListAcpPartnerComponent } from './list-acp-partner/list-acp-partner.component';
import { AddAcpPartnerComponent } from './add-acp-partner/add-acp-partner.component';

const routes: Routes = [
  { path: '', component: AcpPartnerComponent ,
  children:[
    { path:'',redirectTo: 'list',pathMatch:'full'},
    {path:'list',component:ListAcpPartnerComponent},
    {path:'view-acp-partner/:id',component:AddAcpPartnerComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcpPartnerRoutingModule { }
