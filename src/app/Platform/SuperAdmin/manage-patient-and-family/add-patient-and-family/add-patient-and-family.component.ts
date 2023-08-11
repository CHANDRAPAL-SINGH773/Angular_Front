import { Component, OnInit, ViewChild } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ManagePatientFamilyService } from 'src/app/Platform/Services/manage-patient-family.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/app/Shared/data-sharing.service';
import { UploadImageServiceService } from 'src/app/Shared/uploadImage/upload-image-service.service';
import { environment } from 'src/environments/environment';
import { NumberHelper } from 'src/app/Utilities/contract/number-helper';
import { CustomValidators } from 'src/app/Shared/custom.validator';

import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import { ManageStaffService } from 'src/app/Platform/Services/staffManagementService/manage-staff.service';
@Component({
  selector: 'app-add-patient-and-family',
  templateUrl: './add-patient-and-family.component.html',
  styleUrls: ['./add-patient-and-family.component.css']
})
export class AddPatientAndFamilyComponent implements OnInit {

  constructor(private _staffService : ManageStaffService, private _numberHelper :NumberHelper,  private _UploadImageService : UploadImageServiceService,    private _dataSharingService: DataSharingService,  private route: ActivatedRoute,private router: Router,private fb: FormBuilder,private _getAllMasterService: GetAllMasterService, private _toasterService: ToastrService, private _AddPatientFamilyService :ManagePatientFamilyService) { }
  addPatientform!:FormGroup;
  imageSrc?: any;
  submitted:any;
  updateButtonflag:boolean=false;
  addButtonflag:boolean=true;
  id:any;
  flag:any;
  attachment?: File;
  ExpirationTypeList:DropdownList[] =[];
  CaregiverList:DropdownList[] =[];
  EmployeeTypeList:DropdownList[] =[];
  countryList:DropdownList[] =[];
  stateList:DropdownList[] =[];
  GenderList:DropdownList[] =[];
  PetsList:DropdownList[] =[];
  AgencyList:DropdownList[] =[];
  DiagnosisList:DropdownList[] =[];
  DignosisList:any=[];
  OrganizationList:any=[];
  SkillList: any =[];
  selectedSkill:boolean = false;
  BindSkillList:any;
  tempSkillArray:any =[];
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  public birthdate: Date;
  public age: number;
  dateModel:any = [];
  public resetModel = new Date(0);
  public CLOSE_ON_SELECTED = false;
 
  loaderflag:boolean = false;
  @ViewChild('picker', { static: true }) _picker!: MatDatepicker<Date>;
  maxDate = new Date();
  uniqueFlag:number = 0;
  ngOnInit(): void {
    this.CreateFormGroup();
    this.GetSkillList();
    this._dataSharingService.changeHeader("Manage Patient")
    this.id = parseInt(this.route.snapshot.params['id']);
    this.flag = parseInt(this.route.snapshot.params['deleteid']);
    if (this.id != 0) {
      this.getPatientFamilyData(this.id);
    }
    if(this.flag == -1)
    {
      this.addButtonflag=false;
      this.updateButtonflag=false;
    }
    this.GetStaffDropDownList();
  }



 public dateClass = (date: Date) => {
  if (this._findDate(date) !== -1) {
    return [ 'selected' ];
  }
  return [ ];
}

public dateChanged(event: MatDatepickerInputEvent<Date>): void {
  if (event.value) {
    const date = event.value;
    const index = this._findDate(date);
    if (index === -1) {
      this.dateModel.push(moment(date).format('MM/DD/yyyy'));
    } else {
      this.dateModel.splice(index, 1)
    }
    this.resetModel = new Date();
    if (!this.CLOSE_ON_SELECTED) {
      const closeFn = this._picker.close;
      this._picker.close = () => { };
      setTimeout(() => {
        this._picker.close = closeFn;
      });
    }
  }
}

public remove(date: Date): void {
  const index = this._findDate(date);
  this.dateModel.splice(index, 1)
}

private _findDate(date: Date): number {
  return this.dateModel.map((m:Date) => +m).indexOf(+date);
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
        formData.append('ProfileLink', 'PatientFamilyProfiles');
        
        this._UploadImageService.UploadPatientFamilyProfileService(formData).subscribe((profilePath:any) => {
          this.imageSrc=   this.createImgPath(profilePath.data);
          this.addPatientform.controls['PatientfamilyLogo'].setValue(this.imageSrc);
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
      this.EmployeeTypeList = this.EmployeeTypeList.filter(p=>p.FlagId == DefaultNumber.Three)
      this.EmployeeTypeList.unshift({ FlagId: DefaultNumber.Three, Label: "Please Select", Id: "" });

      this.PetsList = response.data;
      this.PetsList = this.PetsList.filter(p=>p.FlagId == DefaultNumber.Five)
      this.PetsList.unshift({ FlagId: DefaultNumber.Five, Label: "Please Select", Id: "" });

      this.DiagnosisList = response.data;
      this.DiagnosisList = this.DiagnosisList.filter(p=>p.FlagId == DefaultNumber.Six)
      this.DiagnosisList.unshift({ FlagId: DefaultNumber.Six, Label: "Please Select", Id: "" });

      this.AgencyList = response.data;
      this.AgencyList = this.AgencyList.filter(p=>p.FlagId == DefaultNumber.Seven)
      this.AgencyList.unshift({ FlagId: DefaultNumber.Seven, Label: "Please Select", Id: "" });
      })
      this.loaderflag=false;
     } 




  CreateFormGroup(): void {
    this.addPatientform = this.fb.group({
      AgencyName: new FormControl(""),
      // Type: new FormControl("", Validators.required),
      ShiftType: new FormControl(""),
      FirstName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      LastName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Email: new FormControl("", [Validators.required, Validators.email]),
      PhoneNumber: new FormControl("", Validators.required),
      Address: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Country: new FormControl("", Validators.required),
      State: new FormControl("", Validators.required),
      City: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ZipCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      UserName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Password:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ConfirmPassword: new FormControl("", Validators.required),
      PatientId: new FormControl(""),
      PatientfamilyLogo : new FormControl(""),
      UserId : new FormControl(""),
      Diagnosis : new FormControl(""),
      Stairs : new FormControl(""),
      ChildrenAtHome : new FormControl(""),
      Pets : new FormControl(""),
      Insurance : new FormControl(""),
      ParkingOnSite : new FormControl(""),
      DOB:new FormControl("", Validators.required),
      Age : new FormControl(""),
    })
}





public CalculateAge(): void
{
  let dob =  new Date( this.addPatientform.controls['DOB'].value);
    if(dob){
       var timeDiff = Math.abs(Date.now() - dob.getTime());
       this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
       if(this.age != NaN){
        this.addPatientform.controls['Age'].setValue(this.age);
       }
    
   }
   this.checkUniquePatient();
}

//Method is used for check unique patient--
checkUniquePatient():any{
  const model = {
    DOB: this.addPatientform.controls['DOB'].value,
    FirstName: this.addPatientform.controls['FirstName'].value,
    LastName: this.addPatientform.controls['LastName'].value,
  };
  this._AddPatientFamilyService.CheckUniquePatientService(model).subscribe((response: any) => {
    if (response.message != '0') {
      this._toasterService.error(CommonErrorMessages.PatientAlready, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
    this.uniqueFlag = 1;
    }
    else{
      this.uniqueFlag = 0;
    }
  })

}
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
togglePasswordVisibility2() {
  this.showPassword2 = !this.showPassword2;
}
//Method used for Add new Patient/ family --
AddPatientFamilyDetails(): any {
  let password = this.addPatientform.controls['Password'].value
  let confirmPwd = this.addPatientform.controls['ConfirmPassword'].value
  if (password != confirmPwd) {
    let msg = "Both password should be equal";
    // this.error(msg);
    this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });

    return;
  }
  if(this.uniqueFlag ==0){
  if (this.addPatientform.valid) {
    const model = {
      AgencyName: Number(this.addPatientform.controls['AgencyName'].value),
      FirstName: this.addPatientform.controls['FirstName'].value,
      LastName: this.addPatientform.controls['LastName'].value,
      Email: this.addPatientform.controls['Email'].value,
      PhoneNumber: this.addPatientform.controls['PhoneNumber'].value,
      Address: this.addPatientform.controls['Address'].value,
      Country: Number(this.addPatientform.controls['Country'].value),
      State: Number(this.addPatientform.controls['State'].value),
      City: this.addPatientform.controls['City'].value,
      ZipCode: this.addPatientform.controls['ZipCode'].value,
      UserName: this.addPatientform.controls['UserName'].value,
      Password: this.addPatientform.controls['Password'].value,
      PatientfamilyLogo: this.addPatientform.controls['PatientfamilyLogo'].value,
      ShiftType: this.addPatientform.controls['ShiftType'].value,
      Type: '0',
      Diagnosis: Number(this.addPatientform.controls['Diagnosis'].value),
      Stairs: this.addPatientform.controls['Stairs'].value,
      ChildrenAtHome: this.addPatientform.controls['ChildrenAtHome'].value,
      Pets: this.addPatientform.controls['Pets'].value,
      Insurance: this.addPatientform.controls['Insurance'].value,
      ParkingOnSite: this.addPatientform.controls['ParkingOnSite'].value,
      DOB: this.addPatientform.controls['DOB'].value,
      Age: this.addPatientform.controls['Age'].value,
    };
    this.submitted = true;
    if (this.addPatientform.invalid) {
      this.submitted = true;
      return;
    }
    if (this.addPatientform.valid) {
      this._AddPatientFamilyService.SavePatientFamilyService(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
          let res = parseInt(response.message)
          this.addPatientform.controls['PatientId'].setValue(res);
          this._toasterService.success(CommonSuccessMessages.PatientAdded, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.router.navigate(["/Dashboard/ManagePatientFamily"]);
        }
      })
    }
  } else {
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}
else {
  this._toasterService.error(CommonErrorMessages.PatientAlready, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
}
}
getPatientFamilyData(id: number): void {
  // debugger;
  this.addButtonflag = false;
  this.updateButtonflag = true;
  let data: any;
  const model ={
    PatientId: id,
  }
  this._AddPatientFamilyService.GetPatientFamilyData(model).subscribe((response: any) => {
    if (response.data != "") {

      this.addPatientform.controls['AgencyName'].setValue(response.data[0].Agency);
      this.addPatientform.controls['FirstName'].setValue(response.data[0].FirstName);
      this.addPatientform.controls['LastName'].setValue(response.data[0].LastName);
      this.addPatientform.controls['Email'].setValue(response.data[0].Email);
      this.addPatientform.controls['PhoneNumber'].setValue(response.data[0].Contact);
      this.addPatientform.controls['Address'].setValue(response.data[0].Location);
      this.addPatientform.controls['Country'].setValue(response.data[0].Country);
      this.addPatientform.controls['City'].setValue(response.data[0].City);
      this.addPatientform.controls['State'].setValue(response.data[0].State);
      this.addPatientform.controls['ZipCode'].setValue(response.data[0].ZipCode);
      this.addPatientform.controls['UserName'].setValue(response.data[0].UserName);
      this.addPatientform.controls['Password'].setValue(response.data[0].Password);
      this.addPatientform.controls['ConfirmPassword'].setValue(response.data[0].Password);
      this.addPatientform.controls['PatientId'].setValue(response.data[0].PatientId);
      this.addPatientform.controls['UserId'].setValue(response.data[0].UserId);
      this.addPatientform.controls['PatientfamilyLogo'].setValue(response.data[0].Logo);
      this.addPatientform.controls['ShiftType'].setValue(response.data[0].Shifts);
      // this.addPatientform.controls['Type'].setValue(response.data[0].Type);
      this.imageSrc = response.data[0].Logo;
      let date = moment(response.data[0].DOB).format('yyyy-MM-DD')
      this.addPatientform.controls['DOB'].setValue(date);
      this.addPatientform.controls['Age'].setValue(response.data[0].Age);
      this.addPatientform.controls['Diagnosis'].setValue(response.data[0].Diagnosis);
      this.addPatientform.controls['Stairs'].setValue(response.data[0].Stairs);
      this.addPatientform.controls['ChildrenAtHome'].setValue(response.data[0].ChildrenAtHome);
      
      if(response.data[0].Pets != '' && response.data[0].Pets != null){
      let pet = Number(response.data[0].Pets);
      this.addPatientform.controls['Pets'].setValue(pet);
      }
      
      this.addPatientform.controls['Insurance'].setValue(response.data[0].Insurance);
      this.addPatientform.controls['ParkingOnSite'].setValue(response.data[0].ParkingOnSite);
      this.BindSkillList = JSON.parse("[" + response.data[0].Skills + "]");
    }
  })
}
UpdatePatientFamilyDetails(): any {
  let password = this.addPatientform.controls['Password'].value
  let confirmPwd = this.addPatientform.controls['ConfirmPassword'].value
  if (password != confirmPwd) {
    let msg = "Both password should be equal";
    // this.error(msg);
    this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });

    return;
  }
  if(this.uniqueFlag ==0){
  if (this.addPatientform.valid) {
    const model = {
      AgencyName: Number(this.addPatientform.controls['AgencyName'].value),
      FirstName: this.addPatientform.controls['FirstName'].value,
      LastName: this.addPatientform.controls['LastName'].value,
      Email: this.addPatientform.controls['Email'].value,
      PhoneNumber: this.addPatientform.controls['PhoneNumber'].value,
      Address: this.addPatientform.controls['Address'].value,
      Country: Number(this.addPatientform.controls['Country'].value),
      State: Number(this.addPatientform.controls['State'].value),
      City: this.addPatientform.controls['City'].value,
      ZipCode: this.addPatientform.controls['ZipCode'].value,
      UserName: this.addPatientform.controls['UserName'].value,
      Password: this.addPatientform.controls['Password'].value,
      PatientfamilyLogo: this.addPatientform.controls['PatientfamilyLogo'].value,
      PatientId: this.addPatientform.controls['PatientId'].value,
      UserId: this.addPatientform.controls['UserId'].value,
      ShiftType: this.addPatientform.controls['ShiftType'].value,
      Type: '0',
      Diagnosis: Number(this.addPatientform.controls['Diagnosis'].value),
      Stairs: this.addPatientform.controls['Stairs'].value,
      ChildrenAtHome: this.addPatientform.controls['ChildrenAtHome'].value,
      Pets: this.addPatientform.controls['Pets'].value,
      Insurance: this.addPatientform.controls['Insurance'].value,
      ParkingOnSite: this.addPatientform.controls['ParkingOnSite'].value,
      DOB: this.addPatientform.controls['DOB'].value,
      Age: this.addPatientform.controls['Age'].value,
    };
    this.submitted = true;
    if (this.addPatientform.invalid) {
      this.submitted = true;
      return;
    }
    if (this.addPatientform.valid) {
      this._AddPatientFamilyService.UpdatePatientFamilyService(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this._toasterService.success(CommonSuccessMessages.PatientUpdated, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.router.navigate(["/Dashboard/ManagePatientFamily"]);
        }
      })
    }
  } else {
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}
  else {
    this._toasterService.error(CommonErrorMessages.PatientAlready, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}
GetSkillList() {
  this._getAllMasterService.getSkillsMaster().subscribe((response: any) => {
    this.SkillList = response.data;
    for(var i=0; i<this.SkillList.length; i++){
      this.SkillList[i].isSelected=false;
    }
    this.setSelectedSkills();
  })
}
selectSkill(index:any,i:number){
  this.selectedSkill = index;
  
  
  if(this.SkillList[i].isSelected){
    this.SkillList[i].isSelected=false;
  }
  else{
    this.SkillList[i].isSelected=true;
  }
    // for(i=0; i<this.tempSkillArray.length; i++){
    //   if(index ==this.tempSkillArray){
    //     this.tempSkillArray.pop(index);
    //   }
    // }
  // (<HTMLInputElement>document.getElementById(index)).style="selected";
  // this.selectedSkill = index;
}
//Method for bind selected skills --
setSelectedSkills(){
  if(this.BindSkillList !=null){
  for(var i=0; i< this.BindSkillList.length; i++){
    for(var j=0; j<this.SkillList.length;j++){
      if(this.BindSkillList[i] == this.SkillList[j].SkillId)
      this.SkillList[j].isSelected= true;
    }    
  }
}
}
AddPatientFamilySkill(){
  this.getSkillsSetId();
 const  PatientId = Number(this.addPatientform.controls['PatientId'].value);
  if(PatientId != null && PatientId != undefined && PatientId != 0){
  const model={
    PatientId: Number(this.addPatientform.controls['PatientId'].value),
    FamilyPatientSkills : this.tempSkillArray.toString(),
  }
  this._AddPatientFamilyService.insertPatientSkillDetails(model).subscribe((response: any) => {
    if (response.statusCode == 200) {
      let res = parseInt(response.message)
      this.router.navigate(["/Dashboard/ManagePatientFamily"]);
      this._toasterService.success(CommonSuccessMessages.PatientSkillAdded, "", {
       timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
     });
    }
  })
}
else{
  this._toasterService.info(CommonSuccessMessages.AddPatientdetailsFirst, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
}

}
getSkillsSetId(){
  for(var i=0; i<this.SkillList.length;i++){
    if(this.SkillList[i].isSelected){
      this.tempSkillArray.push(this.SkillList[i].SkillId);
    }
  }

 }
 checkIsValidEmail(event:any) {

  if(event.target.value!= "None" && event.target.value!= "none")  

  {

     var result = this._numberHelper.validateEmail(event);

     if(!result){

      this._toasterService.toastrConfig.preventDuplicates = true;

      this._toasterService.error(CommonErrorMessages.InvalidEmail, '');

      event.preventDefault();

   }

  }

}
}
