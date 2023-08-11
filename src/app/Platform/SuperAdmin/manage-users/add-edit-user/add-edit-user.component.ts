import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { ManageUserService} from '../../../Services/manageUserService/manage-user.service';
import { DataSharingService} from '../../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import {StateModel} from '../../../Model/StateModel';
import {CountryModel} from '../../../Model/CountryModel';
import { AuthService } from "../../../../auth/auth.service";
import { SeverityType } from "../../../../core/messaging/severity-type.enum";
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { ManageRolePermissionService } from 'src/app/Platform/Services/manageRolePermissionService/manage-role-permission.service';
import { RoleModel } from 'src/app/Platform/Model/RoleModel';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  addUserform!: FormGroup;
  fileUPloadForm!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  userId :any;
  userType:any;
  stateList:StateModel[] =[];
  countryList:CountryModel[] =[];
  rolesList:RoleModel[] =[];
  public _imageUrl: string = '';
  loaderflag:boolean = false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  constructor( 
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _manageUserService : ManageUserService,
    private _dataSharingService:DataSharingService,
    private _uploadImageService : UploadImageServiceService,
    public authService: AuthService,
    private _manageRolePermissionService:ManageRolePermissionService,) { }

  ngOnInit(): void {
    this.CreateFormGroup();
    this.GetCountryList();
    this.GetStateList();
    this.GetRoles();
    this.userId = this.authService.userID;
    this.userType = this.authService.userType;
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    this.getUserData(this.id);}
  }

  CreateFormGroup(): void {
    this.addUserform = this.fb.group({
      FirstName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      LastName:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Email: ["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      Phone: new FormControl("",Validators.required),
      Address: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Country: new FormControl("",[Validators.required,]),
      City: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      State: new FormControl("",[Validators.required]),
      ZIPCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      UserName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Password:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ConfirmPassword:["",[Validators.required]],
      ProfileLogo: new FormControl(""),
      RoleId: new FormControl("",[Validators.required]),
      UserType : this.userType,
      UserId:0,
      AgencyId : 0,
    })
}

   // Method for get countrylist
   GetCountryList(){
    this._manageUserService.GetCountryListService().subscribe((response:any)=>{
     this.countryList = response.data;
     this.countryList.unshift({ CountryName: "Please Select", CountryId: "" });
    })
  } 

  // Method for get statelist
  GetStateList(){
    this._manageUserService.GetStateListService().subscribe((response:any)=>{
     this.stateList = response.data;
     this.stateList.unshift({ StateName: "Please Select", StateId: "" });
    })
  } 

  // Method for get all type of user roles
  GetRoles(){
    this._manageRolePermissionService.GetUserRolesService().subscribe((response:any)=>{
     this.rolesList = response.data;
     this.rolesList.unshift({ RoleName: "Please Select", Id: "" });
    })
  } 
  // Method for browse file attachment---
  onAttachment(file?: any): any {
    const formData = new FormData();
    this.attachment = file;
    console.log(file.target.files[0])
    if(file.target.files[0].type == 'image/jpeg' || file.target.files[0].type =='image/png' || file.target.files[0].type =='image/svg' || file.target.files[0].type =='image/jpg'){
      if(file.target.files[0].size <= 1000000){
    if (file.target.files[0] ) {
    formData.append('Image', file.target.files[0]);
    formData.append('ProfileLink', 'AdminUserProfile');
            
    this._uploadImageService.UploadAdminUserProfileService(formData).subscribe((profilePath:any) => {
    this.imageSrc=   this.createImgPath(profilePath.data.value);
    this.addUserform.controls['ProfileLogo'].setValue(this.imageSrc);
       })
      }
    }
    else{
      this._toasterService.error(CommonErrorMessages.fileSize, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
    }

}
else{
  this._toasterService.error(CommonErrorMessages.invalidFormat, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
}
}

  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };

  resetFileUploader() { 
    this.imageSrc='';
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
  getUserData(id:any){
  this.loaderflag= true;
  this._manageUserService.GetUserData(id,'user').subscribe((response:any) => {
    if(response.data != "") {
    this.addUserform.controls['UserId'].setValue(response.data[0].UserId);
    this.addUserform.controls['FirstName'].setValue(response.data[0].FirstName);
    this.addUserform.controls['LastName'].setValue(response.data[0].LastName);
    this.addUserform.controls['Email'].setValue(response.data[0].Email);
    this.addUserform.controls['Phone'].setValue(response.data[0].Phone);
    this.addUserform.controls['Address'].setValue(response.data[0].Address);
    this.addUserform.controls['RoleId'].setValue(response.data[0].RoleId);
    this.addUserform.controls['Country'].setValue(response.data[0].Country);
    this.addUserform.controls['City'].setValue(response.data[0].City);
    this.addUserform.controls['State'].setValue(response.data[0].State);
    this.addUserform.controls['ZIPCode'].setValue(response.data[0].ZIPCode);
    this.addUserform.controls['UserName'].setValue(response.data[0].UserName);
    this.addUserform.controls['Password'].setValue(response.data[0].Password);
    this.addUserform.controls['ConfirmPassword'].setValue(response.data[0].Password);
    this.addUserform.controls['UserType'].setValue(response.data[0].UserType);
    this.addUserform.controls['AgencyId'].setValue(response.data[0].AgencyId);
    this.addUserform.controls['ProfileLogo'].setValue(response.data[0].Profile);
    this.addUserform.controls['UserId'].setValue(response.data[0].UserId);
    this.imageSrc = response.data[0].Profile;
    this.loaderflag= false;
   }
   this.loaderflag= false;
 })
 }
  saveUser(){
    this.loaderflag= true;
    let password = this.addUserform.controls['Password'].value;
    let confirmPassWord = this.addUserform.controls['ConfirmPassword'].value;
    if(password != confirmPassWord){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error(CommonErrorMessages.PasswordMismatch, SeverityType.ERROR, {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
    const model ={
      FirstName: this.addUserform.controls['FirstName'].value,
      LastName: this.addUserform.controls['LastName'].value,
      Email: this.addUserform.controls['Email'].value,
      Phone: this.addUserform.controls['Phone'].value,
      Address: this.addUserform.controls['Address'].value,
      Country: Number(this.addUserform.controls['Country'].value),
      State: Number(this.addUserform.controls['State'].value),
      City: this.addUserform.controls['City'].value,
      ZIPCode: this.addUserform.controls['ZIPCode'].value,
      UserName: this.addUserform.controls['UserName'].value,
      Password: this.addUserform.controls['Password'].value,
      ConfirmPassword: this.addUserform.controls['ConfirmPassword'].value,
      AgencyId: this.addUserform.controls['AgencyId'].value,
      UserType: this.userType,
      ProfileLogo: this.addUserform.controls['ProfileLogo'].value,
      UserId: this.addUserform.controls['UserId'].value,
      RoleId: this.addUserform.controls['RoleId'].value,
    }
     this.submitted = true; 
     if (this.addUserform.invalid) {
      this.submitted = true;
      this.loaderflag= false;
      return ;
    }
    if (this.addUserform.valid) {
      if(model.UserId==0){
        this._manageUserService.SaveUserService(model).subscribe((response:any)=>{
        if(response.statusCode == 200){
          if (response.message ==""){
          this.loaderflag= false;
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.router.navigate(["/Dashboard/ManageUsers"]);
          }
          else
          {
            this.loaderflag= false;
            this._toasterService.toastrConfig.preventDuplicates = true;
            this._toasterService.error(""+response.message+"", "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
          }
         }
       })
      }
      else{
        this._manageUserService.UpdateUserService(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            if(response.message==""){
            this.loaderflag= false;
            this._toasterService.toastrConfig.preventDuplicates = true;
            this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
            this.router.navigate(["/Dashboard/ManageUsers"]);
            }
            else
             {
            this.loaderflag= false;
            this._toasterService.toastrConfig.preventDuplicates = true;
            this._toasterService.error(""+response.message+"", "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
             });
            }
           }
         })
      }
    }
  }
}
