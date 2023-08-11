import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcpPartnerProfileComponent } from './acp-partner-profile.component';
import { AcpPartnerDocComponent } from './acp-partner-doc/acp-partner-doc.component';
import { ListBusinessPartnerComponent } from './list-business-partner/list-business-partner.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { BusinessPartnerDetailComponent } from './list-business-partner/business-partner-detail/business-partner-detail.component';

const routes: Routes = [
  { path: '', component: AcpPartnerProfileComponent ,
  children:[
    { path:'',redirectTo: 'acpPartnerProfile',pathMatch:'full'},
    {path:'acpPartnerProfile',component:AcpPartnerProfileComponent},
    {path:'acpPartnerDoc',component:AcpPartnerDocComponent},
    {path:'partnerList',component:ListBusinessPartnerComponent},
    {path:'companyprofile',component:CompanyProfileComponent},
    {path:'bpDetail/:id',component:BusinessPartnerDetailComponent},
  ]
}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcpPartnerProfileRoutingModule { }
