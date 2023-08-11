import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharingService} from '../../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ManageStaffService } from 'src/app/Platform/Services/staffManagementService/manage-staff.service';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { AddAgencyService } from 'src/app/Platform/Services/addAgencyService/add-agency.service';
@Component({
  selector: 'app-add-new-staff',
  templateUrl: './add-new-staff.component.html',
  styleUrls: ['./add-new-staff.component.css']
})

export class AddNewStaffComponent implements OnInit {
  agencyStaffform!: FormGroup;
  fileUPloadForm!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  userType:any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;

  genderList:any;
  designationList:any;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  updatebtnflag : boolean = false;
  savebtnFlag:boolean = true;
  credentialingList:DropdownList[] =[];
  ExpirationTypeList:DropdownList[] =[];
  CaregiverList:DropdownList[] =[];
  EmployeeTypeList:DropdownList[] =[];
  countryList:DropdownList[] =[];
  stateList:DropdownList[] =[];
  GenderList:DropdownList[] =[];
  OfficeList:DropdownList[] =[];
  RoleTypeList:DropdownList[] =[];
  maxDate =new Date();
  loaderflag:boolean = false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
   public _imageUrl: string = '';
    constructor(
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _staffService : ManageStaffService,
    private _dataSharingService:DataSharingService,
    private _UploadImageService : UploadImageServiceService,
    private _getAllMasterService :GetAllMasterService,
    public authService: AuthService,
    private _AddAgencyService : AddAgencyService,) { }

  ngOnInit(): void {
    
    this.CreateFormGroup();

    this._dataSharingService.changeHeader("Manage Agencies")
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    
    this.getStaffData(this.id);}
    this.userid = this.authService.userID;
    this.userType = this.authService.userType;
    this.getAgencyId(this.userid);
    this.GetStaffDropDownList();
  }

  GetStaffDropDownList(){
    this.loaderflag=true;
    this._staffService.GetStaffDropDownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{

    this.countryList = response.data;
    this.countryList = this.countryList.filter(p=>p.FlagId == DefaultNumber.One)
    this.countryList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "" });

    this.stateList = response.data;
    this.stateList = this.stateList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.stateList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "" });

    this.GenderList = response.data;
    this.GenderList = this.GenderList.filter(p=>p.FlagId == DefaultNumber.Three)
    this.GenderList.unshift({ FlagId: DefaultNumber.Three, Label: "Please Select", Id: "" });

    this.EmployeeTypeList = response.data;
    this.EmployeeTypeList = this.EmployeeTypeList.filter(p=>p.FlagId == DefaultNumber.Four)
    this.EmployeeTypeList.unshift({ FlagId: DefaultNumber.Four, Label: "Please Select", Id: "" });

    this.OfficeList = response.data;
    this.OfficeList = this.OfficeList.filter(p=>p.FlagId == DefaultNumber.Eight)
    this.OfficeList.unshift({ FlagId: DefaultNumber.Eight, Label: "Please Select", Id: "" });

    this. RoleTypeList = response.data;
    this.RoleTypeList = this.RoleTypeList.filter(p=>p.FlagId == DefaultNumber.Nine)
    this.RoleTypeList.unshift({ FlagId: DefaultNumber.Nine, Label: "Please Select", Id: "" });

    })
    this.loaderflag=false;
   } 

  
  CreateFormGroup(): void {
    this.agencyStaffform = this.fb.group({
      StaffRole: new FormControl("", Validators.required),
      Name: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      Gender: new FormControl("", Validators.required),
      Email: new FormControl("", [Validators.required, Validators.email]),
      Designation: new FormControl("", Validators.required),
      Contact: new FormControl("", Validators.required),
      DOB:new FormControl("", Validators.required),
      Address: new FormControl("",Validators.required),
      Country: new FormControl("",Validators.required),
      State: new FormControl("",[Validators.required]),
      City: new FormControl(undefined,[Validators.required,]),
      ZipCode: new FormControl(undefined,[Validators.required,]),
      UserType : this.userType ,
      AgencyId:new FormControl(""),
      UserId:new FormControl(""),
      StaffLogo:new FormControl(""),
      Office:new FormControl(""),
      StaffId:new FormControl(0),
      UserName:new FormControl("",Validators.required),
      Password: new FormControl("",Validators.required),
      ConfirmPassword:new FormControl("",Validators.required)
    })
}


get formControls() { return this.agencyStaffform.controls; }


getAgencyId(id : number):void {
  let data:any ; 
  this._AddAgencyService.GetAgencyID(id).subscribe((response:any) => {
  if(response.data != "") {
           this.agencyStaffform.controls['AgencyId'].setValue(response.data[0].AgencyId);
          }
        })
      }

//method for Add new Staff --
AddUpdateStaff(): any {
  let password =  this.agencyStaffform.controls['Password'].value;
  let confirmpassword =  this.agencyStaffform.controls['ConfirmPassword'].value;

  if(password == confirmpassword){
  const model ={
                Name: this.agencyStaffform.controls['Name'].value,
                LastName: this.agencyStaffform.controls['LastName'].value,
                Gender: Number(this.agencyStaffform.controls['Gender'].value),
                DOB: this.agencyStaffform.controls['DOB'].value,
                Designation: Number(this.agencyStaffform.controls['Designation'].value),
                Contact: this.agencyStaffform.controls['Contact'].value,
                Email: this.agencyStaffform.controls['Email'].value,
                Address: this.agencyStaffform.controls['Address'].value,
                Country: Number(this.agencyStaffform.controls['Country'].value),
                State: Number(this.agencyStaffform.controls['State'].value),
                City: this.agencyStaffform.controls['City'].value,
                ZIPCode: this.agencyStaffform.controls['ZipCode'].value,
                UserType: this.userType,
                UserId : this.agencyStaffform.controls['UserId'].value,
                StaffLogo: this.agencyStaffform.controls['StaffLogo'].value,
                StaffId: this.agencyStaffform.controls['StaffId'].value,
                Office: this.agencyStaffform.controls['Office'].value,
                UserName: this.agencyStaffform.controls['UserName'].value,
                Password: this.agencyStaffform.controls['Password'].value,
                StaffRole: this.agencyStaffform.controls['StaffRole'].value,
                AgencyId: this.agencyStaffform.controls['AgencyId'].value,
             }
   this.submitted = true; 
   if (this.agencyStaffform.invalid) {
    this.submitted = true;
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
    return ;
  }
 const StaffId = this.agencyStaffform.controls['StaffId'].value;
  if(StaffId < 0){
  if (this.agencyStaffform.valid) {
    this._staffService.AddStaffService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        this._toasterService.success(CommonSuccessMessages.staffAdded, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.router.navigate(["/Dashboard/Staff-Management"]);
      }
    })
  }
}
else{
  if (this.agencyStaffform.valid) {
    this._staffService.UpdateStaffService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        this._toasterService.success(CommonSuccessMessages.staffUpdated, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.router.navigate(["/Dashboard/Staff-Management"]);
      }
    })
  }
}
}
else{
  this._toasterService.error(CommonErrorMessages.PasswordMismatch, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
}
}


  //method for get Staff Details --
  getStaffData(id : number):void {
  // debugger;
  this.savebtnFlag = false;
  this.updatebtnflag = true;
  let data:any ; 
  this._staffService.GetStaffData(id).subscribe((response:any) => {
            if(response.data != "") {
           this.Addbuttonflag= false;
           this.UpdateButtonflag= true;
           this.agencyStaffform.controls['Name'].setValue(response.data[0].FirstName);
           this.agencyStaffform.controls['LastName'].setValue(response.data[0].LastName);
           this.agencyStaffform.controls['Gender'].setValue(response.data[0].Gender);
           this.agencyStaffform.controls['DOB'].setValue(response.data[0].DOB);
           this.agencyStaffform.controls['Designation'].setValue(response.data[0].Designation);
           this.agencyStaffform.controls['Contact'].setValue(response.data[0].Contact);
           this.agencyStaffform.controls['Email'].setValue(response.data[0].Email);
           this.agencyStaffform.controls['Address'].setValue(response.data[0].Address);
           this.agencyStaffform.controls['Country'].setValue(response.data[0].Country);
           this.agencyStaffform.controls['State'].setValue(response.data[0].State);
           this.agencyStaffform.controls['City'].setValue(response.data[0].City);
           this.agencyStaffform.controls['ZipCode'].setValue(response.data[0].ZipCode);
           this.agencyStaffform.controls['UserId'].setValue(response.data[0].UserId);
           this.agencyStaffform.controls['StaffId'].setValue(response.data[0].StaffId);
           this.agencyStaffform.controls['StaffLogo'].setValue(response.data[0].Logo);
           this.agencyStaffform.controls['Office'].setValue(response.data[0].Office);
           this.agencyStaffform.controls['UserName'].setValue(response.data[0].UserName);
           this.agencyStaffform.controls['Password'].setValue(response.data[0].Staffkey);
           this.agencyStaffform.controls['ConfirmPassword'].setValue(response.data[0].Staffkey);
           this.agencyStaffform.controls['StaffRole'].setValue(response.data[0].StaffRole);

           this.imageSrc =   response.data[0].Logo;
          }
        })
      }

      //upload agency staff profile image--
      Upload():void{
        debugger;
        const formData = new FormData();
        if (this.attachment) {
          formData.set("file", this.attachment, this.attachment.name);
        }
        else{
          return;
        }
      }
   
      // Method for browse file attachment---
      onAttachment(file?: any): any {
        const formData = new FormData();
        this.attachment = file;
        console.log(file.target.files[0])
        if (file.target.files[0] ) {
          formData.append('Image', file.target.files[0]);
          formData.append('ProfileLink', 'StaffProfiles');
          
          this._UploadImageService.UploadStaffProfileService(formData).subscribe((profilePath:any) => {
            this.imageSrc=   this.createImgPath(profilePath.data.value);
            this.agencyStaffform.controls['StaffLogo'].setValue(this.imageSrc);
          })
        }
      }
      createImgPath = (serverPath: string) => {
        var path = `${environment.imageUrl}/${serverPath}`;
        return path;
      };

      resetFileUploader() { 
        this.imageSrc='';
      }
}

