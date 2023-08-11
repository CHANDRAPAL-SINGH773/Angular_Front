import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { ClientsSitesComponent } from './list-clients-sites/clients-sites.component';
import { ClientComponent } from './client.component';
import { ContactClientComponent } from './list-contact-client/contact-client.component';

const routes: Routes = [
  { path: '', component: ClientComponent ,
  children:[
    { path:'',redirectTo: 'clientlist',pathMatch:'full'},
    {path:'clientlist',component:ListClientsComponent},
    {path:'addclient',component:AddClientsComponent},
    {path:'clientSite',component:ClientsSitesComponent},
    {path:'contactclient',component:ContactClientComponent}

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsModuleRoutingModule { }
