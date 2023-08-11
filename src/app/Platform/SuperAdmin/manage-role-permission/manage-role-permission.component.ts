import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { ManageRolePermissionService } from '../../Services/manageRolePermissionService/manage-role-permission.service';
import { RoleModel} from '../../Model/RoleModel';
import { ModuleModel} from '../../Model/ModuleModel';
import { ToastrService } from 'ngx-toastr';
import { SeverityType } from "../../../core/messaging/severity-type.enum";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-manage-role-permission',
  templateUrl: './manage-role-permission.component.html',
  styleUrls: ['./manage-role-permission.component.css']
})
export class ManageRolePermissionComponent implements OnInit {
  rolePermissionForm!: FormGroup;
  rolesList:RoleModel[] =[];
  moduleList:ModuleModel[] =[];
  submitted!: boolean;
  IsActive : any;
  loaderflag:boolean = false;
  userid: any;
  userType:any;
  constructor(
    private _manageRolePermissionService:ManageRolePermissionService,
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
      UserId: new FormControl("1"),
      ProfileName:new FormControl("1"),
      descriptions: this.fb.array([])
    })
  }

  // Method for get all type of user roles
  GetRoles(){
    this._manageRolePermissionService.GetUserRolesService().subscribe((response:any)=>{
     this.rolesList = response.data;
     this.rolesList.unshift({ RoleName: "Please Select", Id: "0" });
    })
  } 

  // Method for get all type of user roles
  GetModules(roleId : number){
    this.loaderflag = true;
    this._manageRolePermissionService.GetUserModulesService(roleId,this.userid).subscribe((response:any)=>{
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
    UserId: this.rolePermissionForm.controls['UserId'].value,
    Status:addRoleValue,
    RoleId:  parseInt(this.rolePermissionForm.controls['RoleId'].value),
    ModuleName : item.Name,
    UserType : this.userType
  };
  if (this.rolePermissionForm.valid) {
      this._manageRolePermissionService.addPermissionButton(model).subscribe((data:any) => {
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
