import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { ManageUserShiftService} from '../../Services/manageUserShiftService/manage-user-shift.service';
import { DataSharingService} from '../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import {DefaultNumber} from '../../../Shared/Enums/Default.enums';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AuthService } from "../../../auth/auth.service";
import * as moment from "moment";
import { ManageCaregiverAgencyService } from '../../Services/manageCaregiverAgency/manage-caregiver-agency.service';
import { ManageReferralShiftService } from '../../Services/manageReferralService/manage-referral-shift.service';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { AddAgencyService } from '../../Services/addAgencyService/add-agency.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-edit-agency-shift',
  templateUrl: './add-edit-agency-shift.component.html',
  styleUrls: ['./add-edit-agency-shift.component.css']
  
})
export class AddEditAgencyShiftComponent implements OnInit {
  addReCaregiverAgencyShiftform!: FormGroup;
  fileUPloadForm!: FormGroup;
  loaderflag:boolean = false;
  userid: any;
  userType:any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  shiftTypeList:DropdownList[] =[];
  shiftPayList:DropdownList[] =[];
  ratePayList:DropdownList[] =[];
  shiftRepeatList:DropdownList[] =[];
  qualificationList:DropdownList[] =[];
  assignedList:DropdownList[] =[];
  shiftLocationList:DropdownList[] =[];
  ShiftTemplateList:DropdownList[] =[];
  AgencyList: DropdownList[]=[];
  GenderList:DropdownList[]=[];
  PatientList :any;
  SkillList:DropdownList[]=[];
  DiagnosisList:DropdownList[]=[];
  PetsList:DropdownList[]=[];
  public _imageUrl: string = '';
  required: boolean = !1;
  minDate = new Date();
  @ViewChild("timepicker") timepicker: any;
  @ViewChild("timepicker1") timepicker1: any;
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  dateModel:any = [];
  @ViewChild('picker', { static: true }) _picker!: MatDatepicker<Date>;
  jsondata:any =[];
  tempAssignedTo : any;
  tempQualification :any;
  tempShiftDate :any;
  years: number[] = [];
  monthList:any[] =[];
  selectedYear: number;
  addbtn:boolean = true;
  publishbtn:boolean = false;
  PopupEndTime:any;
  PopupStarttime:any;
  popupStartDate:any;
  popupshiftNo:any;
  tempShift:any;
  maxDate = new Date();
  title:any = 'Create New Shift';
  timeStart:any = 0;
  timeEnd:any=0;
  timeStartAt:any="";
  timeEndAt:any="";
  key = 'TUc0emRqRXpkdw=='; 
  isReadonly:boolean = false;
  
  constructor( 
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _manageCAShiftService : ManageCaregiverAgencyService,
    private _dataSharingService:DataSharingService,
    private _uploadImageService : UploadImageServiceService,
    public authService: AuthService,
    private _manageReferralShiftService : ManageReferralShiftService,
    private _AddAgencyService : AddAgencyService,) { }

  ngOnInit(): void {
    this.minDate = new Date();
    this.id   = parseInt(this.route.snapshot.params['id']);
    this.userid = this.authService.userID;
    this.userType = this.authService.userType;
    this.CreateFormGroup();
    this.GetReferralShiftDropDownList();
    this.getAgencyData(this.userid)
    if(this.id != 0){
      this.getCaregiverAgencyShiftData(this.id);
     }
    this.GetYearDropdown()
  }


  CreateFormGroup(): void {
    this.addReCaregiverAgencyShiftform = this.fb.group({
      Id:new FormControl("0"),
      IsHighPriority : new FormControl(false), 
      ShiftTemplate:new FormControl("0"),
      Title:new FormControl(""),
      ShiftNo: new FormControl(""),
      ShiftAddress: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CaregiverQualification: new FormControl([""],),
      CaregiverGender: new FormControl(""),
      Description: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      StartDate: new FormControl("",[Validators.required]),
      StartTime: new FormControl("",[Validators.required]),
      EndTime: new FormControl("",[Validators.required]),
      Duration: new FormControl(""),
      BreakTime: new FormControl(""),
      ShiftType:   new FormControl("",Validators.required),
      ShiftPay:   new FormControl("",Validators.required),
      RatePay:   new FormControl("",Validators.required),
      ShiftRepeat:   new FormControl(""),
      Country:new FormControl("USA"),
      ShiftLocation:new FormControl (""),
      City:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ZipCode:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Notes: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      UserId:new FormControl(0),
      UserType:new FormControl(0),
      Smoker:new FormControl(""),
      Diagnosis:new FormControl("",Validators.required),
      Skills:new FormControl([""], Validators.required),
      Pets:new FormControl(""),
      PatientName:   new FormControl("",Validators.required),
      PatientId: new FormControl("",Validators.required),
      AgencyId:new FormControl(""),
      ShiftUser:new FormControl(""),

    })
}
   GetYearDropdown():void{
     this.selectedYear = 2050;
  for (let year = this.selectedYear; year >= 2022; year--) {
    this.years.push(year);
  }
  this.monthList =[
    { Value: 1, MonthName: 'January' },
    { Value: 2, MonthName: 'February' },
    { Value: 3, MonthName: 'March' },
    { Value: 4, MonthName: 'April' },
    { Value: 5, MonthName: 'May' },
    { Value: 6, MonthName: 'June' },
    { Value: 7, MonthName: 'July' },
    { Value: 8, MonthName: 'August' },
    { Value: 9, MonthName: 'September' },
    { Value: 10, MonthName: 'October' },
    { Value: 11, MonthName: 'November' },
    { Value: 12, MonthName: 'December' }
  ]
  this.monthList;
}

     //method for get Agency Details --
  getAgencyData(id : number):void {
      let data:any ; 
      this._AddAgencyService.GetAgencyProfileData(id).subscribe((response:any) => {
      if(response.data != null) {
        this.addReCaregiverAgencyShiftform.controls['AgencyId'].setValue(response.data[0].AgencyId);
        }
      })
  }

  searchPatientByName(){
  this.loaderflag=true;
  if(this.isReadonly==false){
  let patientName =   this.addReCaregiverAgencyShiftform.controls['PatientName'].value
  this._manageReferralShiftService.GetPatientList(patientName).subscribe((response:any)=>{
    if(response.data!=null){
     this.PatientList = response.data;
     this.loaderflag = false; 
    }
    else{
      this.PatientList =[];
      this.loaderflag = false; 
    } 
   })
  }
  }

  PatientValue(value:number){
    this.addReCaregiverAgencyShiftform.controls['PatientId'].setValue(value);
  }

   // Method for get dropdownlist
   GetReferralShiftDropDownList(){
    this._manageCAShiftService.GetShiftTemplateDropDownListService(this.userid).subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.shiftTypeList = response.data;
    this.shiftTypeList = this.shiftTypeList.filter(p=>p.FlagId == DefaultNumber.One)
    this.shiftTypeList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id:""});

    this.shiftPayList = response.data;
    this.shiftPayList = this.shiftPayList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.shiftPayList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id:""});

    this.shiftRepeatList = response.data;
    this.shiftRepeatList = this.shiftRepeatList.filter(p=>p.FlagId == DefaultNumber.Three)
    this.shiftRepeatList.unshift({ FlagId: DefaultNumber.Three, Label: "Please Select", Id:""});

    this.ratePayList = response.data;
    this.ratePayList = this.ratePayList.filter(p=>p.FlagId == DefaultNumber.Four);
    this.ratePayList.unshift({ FlagId: DefaultNumber.Four, Label: "Please Select", Id: "" });

    this.qualificationList = response.data;
    this.qualificationList = this.qualificationList.filter(p=>p.FlagId == DefaultNumber.Five)

    this.assignedList = response.data;
    this.assignedList = this.assignedList.filter(p=>p.FlagId == DefaultNumber.Six)

    this.shiftLocationList = response.data;
    this.shiftLocationList = this.shiftLocationList.filter(p=>p.FlagId == DefaultNumber.Seven)
    this.shiftLocationList.unshift({ FlagId: DefaultNumber.Seven, Label: "Please Select", Id: "" });

    this.ShiftTemplateList = response.data;
    this.ShiftTemplateList = this.ShiftTemplateList.filter(p=>p.FlagId == DefaultNumber.Eight)
    this.ShiftTemplateList.unshift({ FlagId: DefaultNumber.Eight, Label: "Please Select", Id: "" });

    this.AgencyList = response.data;
    this.AgencyList = this.AgencyList.filter(p=>p.FlagId == DefaultNumber.Nine)

    this.GenderList = response.data;
    this.GenderList = this.GenderList.filter(p=>p.FlagId == DefaultNumber.Ten)
    this.GenderList.unshift({ FlagId: DefaultNumber.Ten, Label: "Please Select", Id: "" });
    // this.PatientList = response.data;
    // this.PatientList = this.PatientList.filter(p=>p.FlagId == DefaultNumber.Eleven)

    this.SkillList = response.data;
    this.SkillList = this.SkillList.filter(p=>p.FlagId == DefaultNumber.Tweleve);

    this.DiagnosisList = response.data;
    this.DiagnosisList = this.DiagnosisList.filter(p=>p.FlagId == DefaultNumber.Thirteen)
    this.DiagnosisList.unshift({ FlagId: DefaultNumber.Thirteen, Label: "Please Select", Id: "" });

    this.PetsList = response.data;
    this.PetsList = this.PetsList.filter(p=>p.FlagId == DefaultNumber.Fourteen)
    this.PetsList.unshift({ FlagId: DefaultNumber.Fourteen, Label: "Please Select", Id: "" });
    })
  } 

   GetTemplateData(id:any){
    this.dateModel = [];
    this.loaderflag = true;
    if(id.value==0){
      this.addReCaregiverAgencyShiftform.controls['Description'].setValue(""); 
      //this.dateModel.push(moment(response.data[0].StartDate).format('MM/DD/yyyy'));
      this.addReCaregiverAgencyShiftform.controls['StartDate'].setValue("");
      this.addReCaregiverAgencyShiftform.controls['StartTime'].setValue("");
      this.addReCaregiverAgencyShiftform.controls['EndTime'].setValue("");
      this.addReCaregiverAgencyShiftform.controls['BreakTime'].setValue("");
      this.addReCaregiverAgencyShiftform.controls['ShiftType'].setValue("0");
      this.addReCaregiverAgencyShiftform.controls['ShiftPay'].setValue("0");
      this.addReCaregiverAgencyShiftform.controls['RatePay'].setValue("0");
      this.addReCaregiverAgencyShiftform.controls['Notes'].setValue("");
      this.addReCaregiverAgencyShiftform.controls['Title'].setValue(""); 
      this.addReCaregiverAgencyShiftform.controls['CaregiverQualification'].setValue([""]);
      this.loaderflag = false;
    }
    else{
    this._manageReferralShiftService.GetShiftTemplateData(id.value).subscribe((response:any) => {
     if(response.data != null) {
     this.addReCaregiverAgencyShiftform.controls['Description'].setValue(response.data[0].Description); 
     //this.dateModel.push(moment(response.data[0].StartDate).format('MM/DD/yyyy'));
     this.addReCaregiverAgencyShiftform.controls['StartDate'].setValue(response.data[0].StartDate);
     this.addReCaregiverAgencyShiftform.controls['StartTime'].setValue(response.data[0].StartTime);
     this.addReCaregiverAgencyShiftform.controls['EndTime'].setValue(response.data[0].EndTime);
     this.addReCaregiverAgencyShiftform.controls['BreakTime'].setValue(response.data[0].BreakTime);
     this.addReCaregiverAgencyShiftform.controls['ShiftType'].setValue(response.data[0].ShiftType);
     this.addReCaregiverAgencyShiftform.controls['ShiftPay'].setValue(response.data[0].ShiftPay);
     this.addReCaregiverAgencyShiftform.controls['RatePay'].setValue(response.data[0].RateOfPay);
     this.addReCaregiverAgencyShiftform.controls['Notes'].setValue(response.data[0].Notes);
     this.addReCaregiverAgencyShiftform.controls['Title'].setValue(response.data[0].Title); 
     if(response.data[0].Qualification != null){
      this.tempQualification = response.data[0].Qualification.split(','); 
      this.addReCaregiverAgencyShiftform.controls['CaregiverQualification'].setValue(this.tempQualification);
     } 
     this.loaderflag = false;
    }
    else{
      this.loaderflag = false;
    }
   })
  }  
  }



//Method is used for Save agency shift -- 
  SaveAgencyShift(){
    this.loaderflag = true;
    let ShiftUser= this.addReCaregiverAgencyShiftform.controls['ShiftUser'].value;
    let PatientName;
    if(Number(ShiftUser)==Number(this.userid)){
      PatientName=this.addReCaregiverAgencyShiftform.controls['PatientName'].value;
    }
    else if (ShiftUser=="")
    {
      PatientName=this.addReCaregiverAgencyShiftform.controls['PatientName'].value;
    }  
    else{ 
      let encryptedpatient= this.addReCaregiverAgencyShiftform.controls['PatientName'].value;
      let decrypted = CryptoJS.AES.decrypt(encryptedpatient, this.key);
      let decryptedPatient = decrypted.toString(CryptoJS.enc.Utf8);   
      PatientName = decryptedPatient
    }
    debugger
    if (this.addReCaregiverAgencyShiftform.valid) {
     const model ={
      Id: Number(this.addReCaregiverAgencyShiftform.controls['Id'].value),
      IsHighPriority: this.addReCaregiverAgencyShiftform.controls['IsHighPriority'].value, 
      Title : this.addReCaregiverAgencyShiftform.controls['Title'].value, 
      ShiftTemplate : Number(this.addReCaregiverAgencyShiftform.controls['ShiftTemplate'].value),  
      ShiftAddress: this.addReCaregiverAgencyShiftform.controls['ShiftAddress'].value,
      CaregiverQualification: this.addReCaregiverAgencyShiftform.controls['CaregiverQualification'].value,
      CaregiverGender: Number(this.addReCaregiverAgencyShiftform.controls['CaregiverGender'].value),
      Description: this.addReCaregiverAgencyShiftform.controls['Description'].value,
      StartDate: this.addReCaregiverAgencyShiftform.controls['StartDate'].value,
      StartTime: this.addReCaregiverAgencyShiftform.controls['StartTime'].value,
      EndTime: this.addReCaregiverAgencyShiftform.controls['EndTime'].value,
      Duration: this.addReCaregiverAgencyShiftform.controls['Duration'].value,
      BreakTime: this.addReCaregiverAgencyShiftform.controls['BreakTime'].value,
      ShiftType: this.addReCaregiverAgencyShiftform.controls['ShiftType'].value,
      ShiftPay: this.addReCaregiverAgencyShiftform.controls['ShiftPay'].value,
      RatePay: this.addReCaregiverAgencyShiftform.controls['RatePay'].value,
      ShiftRepeat: this.addReCaregiverAgencyShiftform.controls['ShiftRepeat'].value,
      Country: this.addReCaregiverAgencyShiftform.controls['Country'].value,
      ShiftLocation: this.addReCaregiverAgencyShiftform.controls['ShiftLocation'].value,
      City: this.addReCaregiverAgencyShiftform.controls['City'].value,
      ZipCode: this.addReCaregiverAgencyShiftform.controls['ZipCode'].value,
      Notes: this.addReCaregiverAgencyShiftform.controls['Notes'].value,
      Diagnosis: this.addReCaregiverAgencyShiftform.controls['Diagnosis'].value,
      Skills: this.addReCaregiverAgencyShiftform.controls['Skills'].value,
      Pets: this.addReCaregiverAgencyShiftform.controls['Pets'].value,
      Smoker: this.addReCaregiverAgencyShiftform.controls['Smoker'].value,
      UserId:this.userid,
      UserType: Number(this.userType),
      PatientId: this.addReCaregiverAgencyShiftform.controls['PatientId'].value,
      PatientName: PatientName,
      AgencyId:this.addReCaregiverAgencyShiftform.controls['AgencyId'].value,
    }	
    let skill = this.addReCaregiverAgencyShiftform.controls['Skills'].value;
    if(skill =='0'){
      this.submitted = true;
      this.loaderflag = false;
      this._toasterService.info(CommonErrorMessages.FillMendatoryFields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return ;
    }

     this.submitted = true; 
     if (this.addReCaregiverAgencyShiftform.invalid) {
      this.submitted = true;
      this.loaderflag = false;
      return ;
    }
    
    if (this.addReCaregiverAgencyShiftform.valid) {
      if(model.Id==0){
        this._manageCAShiftService.SaveAgencyShiftService(model).subscribe((response:any)=>{
        if(response.data!=null){
          this.loaderflag = false;
          this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
             timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
           });
          this.router.navigate(["Dashboard/Agency-Open-shift"]);
         }
         else{
          this.loaderflag = false;
          this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });

         }
       })
      }
      else{
        this._manageCAShiftService.UpdateAgencyShiftService(model).subscribe((response:any)=>{
          if(response.statusCode !=null){
            this.loaderflag = false;
            this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
             this.router.navigate(["Dashboard/Agency-Open-shift"]);
           }
           else{
            this.loaderflag = false;
            this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
  
           }
         })
      }
    }
  }
  else{
    this.loaderflag = false;
    this._toasterService.info(CommonErrorMessages.FillMendatoryFields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
  }
    this.loaderflag = false;
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
        //this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
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

  getCaregiverAgencyShiftData(Id:any):any{
    this.addbtn = false;
    this.publishbtn = true;
    this.loaderflag = true;
    this.title = 'Apply Shift';
    this._manageCAShiftService.GetCaregiverAgencyShiftData(Id).subscribe((response:any) => {
      if(response.data != "") {
      this.addReCaregiverAgencyShiftform.controls['Id'].setValue(response.data[0].ShiftId);
      this.addReCaregiverAgencyShiftform.controls['ShiftNo'].setValue(response.data[0].ShiftNo);
      this.addReCaregiverAgencyShiftform.controls['ShiftAddress'].setValue(response.data[0].ShiftAddress);       
      this.addReCaregiverAgencyShiftform.controls['CaregiverGender'].setValue(response.data[0].CaregiverGender);
      this.addReCaregiverAgencyShiftform.controls['Description'].setValue(response.data[0].Description);
      this.addReCaregiverAgencyShiftform.controls['CaregiverGender'].setValue(response.data[0].CaregiverGender);
      this.addReCaregiverAgencyShiftform.controls['StartTime'].setValue(response.data[0].ShiftStartTime);
      this.addReCaregiverAgencyShiftform.controls['EndTime'].setValue(response.data[0].ShiftEndTime);
      this.addReCaregiverAgencyShiftform.controls['Duration'].setValue(response.data[0].Duration);
      this.addReCaregiverAgencyShiftform.controls['BreakTime'].setValue(response.data[0].BreakTime);
      this.addReCaregiverAgencyShiftform.controls['ShiftType'].setValue(response.data[0].ShiftType);
      this.addReCaregiverAgencyShiftform.controls['ShiftPay'].setValue(response.data[0].ShiftPay);
      this.addReCaregiverAgencyShiftform.controls['RatePay'].setValue(response.data[0].RatePay);
      this.addReCaregiverAgencyShiftform.controls['ShiftRepeat'].setValue(response.data[0].ShiftRepeat);
      this.addReCaregiverAgencyShiftform.controls['ShiftLocation'].setValue(response.data[0].ShiftLocation);
      this.addReCaregiverAgencyShiftform.controls['City'].setValue(response.data[0].City);
      this.addReCaregiverAgencyShiftform.controls['ZipCode'].setValue(response.data[0].ZipCode);
      this.addReCaregiverAgencyShiftform.controls['Notes'].setValue(response.data[0].Notes);
      this.addReCaregiverAgencyShiftform.controls['IsHighPriority'].setValue(response.data[0].IsHighPriority);
      this.addReCaregiverAgencyShiftform.controls['StartDate'].setValue(response.data[0].ShiftDate);
      this.addReCaregiverAgencyShiftform.controls['Smoker'].setValue(response.data[0].Smoker);
      this.addReCaregiverAgencyShiftform.controls['Diagnosis'].setValue(response.data[0].Diagnosis);
      this.addReCaregiverAgencyShiftform.controls['Pets'].setValue(response.data[0].PetName);
      this.addReCaregiverAgencyShiftform.controls['ShiftUser'].setValue(response.data[0].UserId);
      if(response.data[0].Skills!=null){
      this.tempShift = response.data[0].Skills.split(',');  
      this.addReCaregiverAgencyShiftform.controls['Skills'].setValue(this.tempShift);
      }
      let PtempName = response.data[0].FirstName;
      let LtempName = response.data[0].LastName;
      let PatientName = PtempName+' '+ LtempName;
      //debugger
      if(Number(response.data[0].UserId)==Number(this.userid)){
        this.addReCaregiverAgencyShiftform.controls['PatientName'].setValue(PatientName);
        this.isReadonly=true;
      }
      else{
        let encryptedPatient = CryptoJS.AES.encrypt(PatientName, this.key);
        this.addReCaregiverAgencyShiftform.controls['PatientName'].setValue(encryptedPatient);
        this.isReadonly=true;
        
      }
      this.addReCaregiverAgencyShiftform.controls['PatientId'].setValue(response.data[0].PatientId);
      if(response.data[0].Qualification!=null){
        this.tempQualification = response.data[0].Qualification.split(',');  
        this.addReCaregiverAgencyShiftform.controls['CaregiverQualification'].setValue(this.tempQualification);
      }
      this.loaderflag = false;
     }
   })
   //this.loaderflag = false;
  }

  CheckStartEndTime(event:any,type:any):any{
    // debugger
    let evlength = event.length;
    if(evlength<8){
      event= [event.slice(0, 0),'0', event.slice(0)].join('');
    }
   
   if(type=='Start'){
     this.timeStart =event.slice(0,2);
     this.timeStartAt =event.slice(6,8);
   }
   if(type=='End'){
    this.timeEnd =event.slice(0,2);
    this.timeEndAt =event.slice(6,8);
   }  
   if(this.timeStart!=0 && this.timeEnd!=0){
   if(this.timeStartAt==this.timeEndAt){ 
   if(Number(this.timeEnd) <= Number(this.timeStart)){
     this._toasterService.toastrConfig.preventDuplicates = true;
     this._toasterService.error("End Time should be greater than Start Time", "", {
      timeOut: 5000, positionClass: 'toast-top-right', closeButton: true
    });
    //return false;    
    // this.addUserShiftform.controls['ShiftStartTime'].setValue("");
    }
   }   
   }
  }

  Shiftinfo(){
    this.popupshiftNo =  this.addReCaregiverAgencyShiftform.controls['ShiftNo'].value,
    this.popupStartDate =  this.addReCaregiverAgencyShiftform.controls['StartDate'].value,
    this.PopupStarttime = this.addReCaregiverAgencyShiftform.controls['StartTime'].value,
    this.PopupEndTime = this.addReCaregiverAgencyShiftform.controls['EndTime'].value
  }


}
