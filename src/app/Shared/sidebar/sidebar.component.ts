import { Component, OnInit } from '@angular/core';
import { ManageRolePermissionService } from 'src/app/Platform/Services/manageRolePermissionService/manage-role-permission.service';
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userId:any;
  userType:any;
  isSubscribed:any;
  disabledControl: any;
  public permissionList :any = [];
  AgencyStaff:boolean = false;
  CaregiverAgency:boolean=false;
  type:any
  constructor(public authService: AuthService,
    private _roleService: ManageRolePermissionService) { }

  ngOnInit(): void {
    this.userId = this.authService.userID;
    this.userType = this.authService.userType;
    this.isSubscribed= this.authService.isSubscribed;
    if(this.isSubscribed==true){
      this.disabledControl = 1;
    }
    else{
      this.disabledControl = 0;
    }
    this.getUserRolesAndPermissions();
  }

  preventEvent(e:any){
    e.stopPropagation();
    if (e.clickEvent && e.clickEvent.target.className!="nav-link") {
      e.preventDefault();
    }
  }

  getUserRolesAndPermissions(){
  this._roleService.GetUserPermissionsService(this.userType, this.userId).subscribe((response:any)=>{
  if(response.data[0].IsAgency != 1 ){
    console.log(response.data)
    this.permissionList = response.data;
    this.AgencyStaff = true;
    this.CaregiverAgency = false;
  }
  else {
    this.AgencyStaff = false;
    this.CaregiverAgency = true;
  }
  })
}

}
