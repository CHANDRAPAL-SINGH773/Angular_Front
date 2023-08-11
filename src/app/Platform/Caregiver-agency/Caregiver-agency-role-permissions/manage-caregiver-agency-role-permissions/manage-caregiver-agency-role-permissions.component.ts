import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { ModuleModel } from 'src/app/Platform/Model/ModuleModel';
import { RoleModel } from 'src/app/Platform/Model/RoleModel';
import { SeverityType } from 'src/app/core/messaging/severity-type.enum';
import { CaregiverAgencyRolePermissionService } from 'src/app/Platform/Services/caregiverAgencyRolesPermissionService/caregiver-agency-role-permission.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-manage-caregiver-agency-role-permissions',
  templateUrl: './manage-caregiver-agency-role-permissions.component.html',
  styleUrls: ['./manage-caregiver-agency-role-permissions.component.css']
})
export class ManageCaregiverAgencyRolePermissionsComponent implements OnInit {
  rolePermissionForm!: FormGroup;
  rolesList:RoleModel[] =[];
  moduleList:ModuleModel[] =[];
  submitted!: boolean;
  IsActive : any;
  loaderflag:boolean = false;
  userid: any;
  userType:any;
  constructor(
    private _caRolePermissionService:CaregiverAgencyRolePermissionService,
    private router: Router, 
    private fb: FormBuilder,
    private toastrService: ToastrService,
    public authService: AuthService) {    
   }

  ngOnInit(): void {
    this.userid = this.authService.userID;
    this.userType = this.authService.userType;
    this.CreateFormGroup();
    this.GetRoles();
    this.GetModules(0);
 
  }
  CreateFormGroup(): void {
    this.rolePermissionForm = this.fb.group({
      RoleId: new FormControl("0",[Validators.required]),
      State: new FormControl(0,[Validators.required]),
      UserId: new FormControl(""),
      ProfileName:new FormControl("1"),
      descriptions: this.fb.array([])
    })
  }

  // Method for get all type of user roles
  GetRoles(){
    this._caRolePermissionService.GetUserRolesService().subscribe((response:any)=>{
     this.rolesList = response.data;
     this.rolesList.unshift({ RoleName: "Please Select", Id: "0" });
    })
  } 

  // Method for get all type of user roles
  GetModules(roleId : number){
    this.loaderflag = true;
    this._caRolePermissionService.GetUserModulesService(roleId,this.userid).subscribe((response:any)=>{
     this.moduleList = response.data;
     this.loaderflag = false;
    })
  } 

  changeRole(): void {
    let roleId;
    roleId=this.rolePermissionForm.controls['RoleId'].value
    this.GetModules(roleId);
   }

  addPermissionButton(i: number,item : any, event: any){
  this.loaderflag = true;
  if(this.rolePermissionForm.controls['RoleId'].value == "0")
  {
    this.loaderflag = false;
    this.toastrService.toastrConfig.preventDuplicates = true;
    this.toastrService.error(CommonErrorMessages.SelectRole, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    return false;
  }
  let addRoleValue = 0
  if(event.target.checked){ 
    addRoleValue =1;
  }
  else{
    addRoleValue =0;
  }
  let model ={
    ModuleId: item.Id,
    Id:item.Id,
    UserId: this.userid,
    Status:addRoleValue,
    RoleId:  parseInt(this.rolePermissionForm.controls['RoleId'].value),
    ModuleName : item.Name,
    UserType:  this.userType
  };
  if (this.rolePermissionForm.valid) {
      this._caRolePermissionService.addPermissionButton(model).subscribe((data:any) => {
       if(data.statusCode == 200) {
        this.loaderflag = false;
        this.toastrService.toastrConfig.preventDuplicates = true;
        this.toastrService.success(CommonSuccessMessages.RecordSavedSuccessfully, SeverityType.SUCCESS, {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
      }
    });
    this.loaderflag = false;
    return  true;
  }
  else{
     this.loaderflag = false;
     return false;
   }
  }

}
