import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { ManageUserShiftService} from '../../../Services/manageUserShiftService/manage-user-shift.service';
import { DataSharingService} from '../../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import {DefaultNumber} from '../../../../Shared/Enums/Default.enums';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AuthService } from "../../../../auth/auth.service";
import * as moment from "moment";
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { ManageReferralShiftService } from 'src/app/Platform/Services/manageReferralService/manage-referral-shift.service';

@Component({
  selector: 'app-add-edit-shift',
  templateUrl: './add-edit-shift.component.html',
  styleUrls: ['./add-edit-shift.component.css']
})
export class AddEditShiftComponent implements OnInit {
  addUserShiftform!: FormGroup;
  fileUPloadForm!: FormGroup;
  loaderflag:boolean = false;
  userid: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  pageType:any;
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
  SkillList:DropdownList[]=[];
  DiagnosisList:DropdownList[]=[];
  GenderList:DropdownList[]=[];
  PetsList:DropdownList[]=[];
  ShiftTemplateList:DropdownList[]=[];
  PatientList:any;
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
  tempSkills:any;
  pageFlag:any;
  buttonflag:boolean= true;
  title:any = "Create New Shift";
  timeStart:any = 0;
  timeEnd:any=0;
  timeStartAt:any="";
  timeEndAt:any="";

  constructor( 
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _manageUserShiftService : ManageUserShiftService,
    private _dataSharingService:DataSharingService,
    private _uploadImageService : UploadImageServiceService,
    public authService: AuthService,
    private _manageReferralShiftService : ManageReferralShiftService,) { }

  ngOnInit(): void {
    this.userid = this.authService.userID;
    this.minDate = new Date();
    this.CreateFormGroup();
    this.GetUserShiftDropDownList();
    this.id   = parseInt(this.route.snapshot.params['id']);
    this.pageFlag   = this.route.snapshot.params['type'];
    this.userid = this.authService.userID;
    if(this.id != 0){
    this.getUserShiftData(this.id);}
    if(this.pageFlag =="AP"){
    this.title = "Applied Shift";
    this.buttonflag = false;
    }
    else if(this.pageFlag =="CS"){
      this.title = "Cancelled Shift";
      this.buttonflag = false;
    }
    else if(this.pageFlag =="add"){
      this.title = "Create New Shift";
      this.buttonflag = true;

    }
    else if(this.pageFlag =="edit"){
      this.title = "Edit Shift";
      this.buttonflag = true;
    }
    else if(this.pageFlag =="view"){
      this.title = "Shift Details";
      this.buttonflag = false;
    }
    else{
      this.title = "Create New Shift";
      this.buttonflag = true;
    }
  }

  CreateFormGroup(): void {
    this.addUserShiftform = this.fb.group({
      Id:new FormControl("0"),
      ShiftNo: new FormControl(""),
      Title: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AssignTo: new FormControl("0"),
      Qualification: new FormControl([""]),
      Description: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ShiftDate: new FormControl(""),
      ShiftStartTime: new FormControl("",Validators.required),
      ShiftEndTime: new FormControl("",Validators.required),
      ShiftType: new FormControl("",Validators.required),
      ShiftPay: new FormControl("",Validators.required),
      RatePay: new FormControl("",Validators.required),
      ShiftRepeat: new FormControl(""),
      Country:new FormControl("USA"),
      ShiftLocation:new FormControl ("",Validators.required),
      City:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ZipCode:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Notes: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      UserId:new FormControl(0),
      IsHighPriority : new FormControl(false,Validators.required), 
      Smoker:new FormControl("0"),
      Diagnosis:new FormControl("",Validators.required),
      Skills:new FormControl([""],Validators.required),
      Pets:new FormControl("0"), 
      Address:["", [Validators.required]], 
      ShiftTemplate:new FormControl("0"), 
      PatientName:["", [Validators.required]],
      PatientId:new FormControl("0"),
      Gender:new FormControl(""),
      BreakTime:new FormControl("")
    })
}

  searchPatientByName(){
  let patientName =   this.addUserShiftform.controls['PatientName'].value
  this._manageReferralShiftService.GetPatientList(patientName).subscribe((response:any)=>{
    if(response.data!=null){
    this.PatientList = response.data 
    }
    else{
    this.PatientList = [];
    }
   })
  }

  PatientValue(value:number){
    this.addUserShiftform.controls['PatientId'].setValue(value);
  }

   // Method for get dropdownlist
   GetUserShiftDropDownList(){
    this.loaderflag=true;
    this._manageUserShiftService.GetUserShiftDropDownListService(this.userid).subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.shiftTypeList = response.data;
    this.shiftTypeList = this.shiftTypeList.filter(p=>p.FlagId == DefaultNumber.One)
    this.shiftTypeList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "" });

    this.shiftPayList = response.data;
    this.shiftPayList = this.shiftPayList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.shiftPayList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "" });

    this.shiftRepeatList = response.data;
    this.shiftRepeatList = this.shiftRepeatList.filter(p=>p.FlagId == DefaultNumber.Three)
    this.shiftRepeatList.unshift({ FlagId: DefaultNumber.Three, Label: "Please Select", Id: "" });

    this.ratePayList = response.data;
    this.ratePayList = this.ratePayList.filter(p=>p.FlagId == DefaultNumber.Four)
    this.ratePayList.unshift({ FlagId: DefaultNumber.Four, Label: "Please Select", Id: "" });

    this.qualificationList = response.data;
    this.qualificationList = this.qualificationList.filter(p=>p.FlagId == DefaultNumber.Five)
    //this.qualificationList.unshift({ FlagId: DefaultNumber.Five, Label: "Select All", Id: "0" });

    this.assignedList = response.data;
    this.assignedList = this.assignedList.filter(p=>p.FlagId == DefaultNumber.Six)
    this.assignedList.unshift({ FlagId: DefaultNumber.Six, Label: "Please Select", Id: "" });

    this.shiftLocationList = response.data;
    this.shiftLocationList = this.shiftLocationList.filter(p=>p.FlagId == DefaultNumber.Seven)
    this.shiftLocationList.unshift({ FlagId: DefaultNumber.Seven, Label: "Please Select", Id: "" });

    this.SkillList = response.data;
    this.SkillList = this.SkillList.filter(p=>p.FlagId == DefaultNumber.Eight);
    //this.shiftLocationList.unshift({ FlagId: DefaultNumber.Seven, Label: "Please Select", Id: "0" });

    this.DiagnosisList = response.data;
    this.DiagnosisList = this.DiagnosisList.filter(p=>p.FlagId == DefaultNumber.Nine)
    this.DiagnosisList.unshift({ FlagId: DefaultNumber.Nine, Label: "Please Select", Id: "" });

    this.PetsList = response.data;
    this.PetsList = this.PetsList.filter(p=>p.FlagId == DefaultNumber.Ten)
    this.PetsList.unshift({ FlagId: DefaultNumber.Ten, Label: "Please Select", Id: "" });
    
    this.ShiftTemplateList = response.data;
    this.ShiftTemplateList = this.ShiftTemplateList.filter(p=>p.FlagId == DefaultNumber.Eleven)
    this.ShiftTemplateList.unshift({ FlagId: DefaultNumber.Eleven, Label: "Please Select", Id: ""});
    
    this.GenderList = response.data;
    this.GenderList = this.GenderList.filter(p=>p.FlagId == DefaultNumber.Tweleve)
    this.GenderList.unshift({ FlagId: DefaultNumber.Tweleve, Label: "Please Select", Id: ""});
    this.loaderflag=false;
    })
   } 

   GetTemplateData(id:any){
    this.dateModel = [];
    this.loaderflag = true;
    if(id.value==0){
      this.addUserShiftform.controls['Description'].setValue(""); 
      this.dateModel =[];
      this.addUserShiftform.controls['ShiftStartTime'].setValue("");
      this.addUserShiftform.controls['ShiftEndTime'].setValue("");
      this.addUserShiftform.controls['BreakTime'].setValue("");
      this.addUserShiftform.controls['ShiftType'].setValue("0");
      this.addUserShiftform.controls['ShiftPay'].setValue("0");
      this.addUserShiftform.controls['RatePay'].setValue("0");
      this.addUserShiftform.controls['Notes'].setValue("");
      this.addUserShiftform.controls['Title'].setValue(""); 
      this.addUserShiftform.controls['Qualification'].setValue([""]);
      this.loaderflag = false;
    }
    else{
    this._manageReferralShiftService.GetShiftTemplateData(id.value).subscribe((response:any) => {
     if(response.data != "") {
     this.addUserShiftform.controls['Description'].setValue(response.data[0].Description); 
     this.dateModel.push(moment(response.data[0].StartDate).format('MM/DD/yyyy'));
     this.addUserShiftform.controls['ShiftStartTime'].setValue(response.data[0].StartTime);
     this.addUserShiftform.controls['ShiftEndTime'].setValue(response.data[0].EndTime);
     this.addUserShiftform.controls['BreakTime'].setValue(response.data[0].BreakTime);
     this.addUserShiftform.controls['ShiftType'].setValue(response.data[0].ShiftType);
     this.addUserShiftform.controls['ShiftPay'].setValue(response.data[0].ShiftPay);
     this.addUserShiftform.controls['RatePay'].setValue(response.data[0].RateOfPay);
     this.addUserShiftform.controls['Notes'].setValue(response.data[0].Notes);
     this.addUserShiftform.controls['Title'].setValue(response.data[0].Title); 
     if(response.data[0].Qualification != null){
      this.tempQualification = response.data[0].Qualification.split(','); 
      this.addUserShiftform.controls['Qualification'].setValue(this.tempQualification);
     } 
     this.loaderflag = false;
    }
   })
   }
   }

   getUserShiftData(id:any){
   this.loaderflag = true;
   this._manageUserShiftService.GetUserShiftData(id).subscribe((response:any) => {
    if(response.data != "") {
    this.addUserShiftform.controls['Id'].setValue(response.data[0].ShiftId);
    this.addUserShiftform.controls['ShiftNo'].setValue(response.data[0].ShiftNo);
    if(response.data[0].Title != null){
    this.addUserShiftform.controls['Title'].setValue(response.data[0].Title);
    }
    if(response.data[0].AssignedTo != null){
      this.addUserShiftform.controls['AssignTo'].setValue(response.data[0].AssignedTo.toString()); 
    }
    if(response.data[0].Qualification != null){
      this.tempQualification = response.data[0].Qualification.split(','); 
      this.addUserShiftform.controls['Qualification'].setValue(this.tempQualification);
    } 
    this.addUserShiftform.controls['Description'].setValue(response.data[0].Description);
    this.dateModel.push(moment(response.data[0].ShiftDate).format('MM/DD/yyyy'));
    this.addUserShiftform.controls['ShiftStartTime'].setValue(response.data[0].ShiftStartTime);
    this.addUserShiftform.controls['ShiftEndTime'].setValue(response.data[0].ShiftEndTime);
    this.addUserShiftform.controls['ShiftType'].setValue(response.data[0].ShiftType);
    this.addUserShiftform.controls['ShiftPay'].setValue(response.data[0].ShiftPay);
    this.addUserShiftform.controls['RatePay'].setValue(response.data[0].RatePay);
    this.addUserShiftform.controls['ShiftRepeat'].setValue(response.data[0].ShiftRepeat);
    this.addUserShiftform.controls['ShiftLocation'].setValue(response.data[0].ShiftLocation);
    this.addUserShiftform.controls['City'].setValue(response.data[0].City);
    this.addUserShiftform.controls['ZipCode'].setValue(response.data[0].ZipCode);
    this.addUserShiftform.controls['Notes'].setValue(response.data[0].Notes);
    this.addUserShiftform.controls['IsHighPriority'].setValue(response.data[0].IsHighPriority);
    this.addUserShiftform.controls['Diagnosis'].setValue(response.data[0].Diagnosis);   
    this.addUserShiftform.controls['Pets'].setValue(response.data[0].PetName);
    this.addUserShiftform.controls['Smoker'].setValue(response.data[0].Smoker);
    this.addUserShiftform.controls['Address'].setValue(response.data[0].ShiftAddress);
    this.addUserShiftform.controls['ShiftTemplate'].setValue(response.data[0].TemplateId);
    let PtempName = response.data[0].FirstName;
    let LtempName = response.data[0].LastName;
    let PatientName = PtempName+' '+ LtempName;
    this.addUserShiftform.controls['PatientName'].setValue(PatientName);
    this.addUserShiftform.controls['PatientId'].setValue(response.data[0].PatientId);
    this.addUserShiftform.controls['Gender'].setValue(response.data[0].Gender);
    this.addUserShiftform.controls['BreakTime'].setValue(response.data[0].Breaktime);
    if(response.data[0].Skills != null){
      this.tempSkills = response.data[0].Skills.split(','); 
      this.addUserShiftform.controls['Skills'].setValue(this.tempSkills);
    }
    this.loaderflag = false;
   }
 })
 this.loaderflag = false;
   }

  saveUserShift(){
    this.loaderflag = true;
    const model ={
      Id: this.addUserShiftform.controls['Id'].value,
      Title: this.addUserShiftform.controls['Title'].value,
      ShiftNo: this.addUserShiftform.controls['ShiftNo'].value,
      AssignTo: this.addUserShiftform.controls['AssignTo'].value,
      Qualification:this.addUserShiftform.controls['Qualification'].value,
      Description: this.addUserShiftform.controls['Description'].value,
      ShiftDate: this.dateModel,
      ShiftStartTime: this.addUserShiftform.controls['ShiftStartTime'].value,
      ShiftEndTime: this.addUserShiftform.controls['ShiftEndTime'].value,
      ShiftType: this.addUserShiftform.controls['ShiftType'].value,
      ShiftPay: this.addUserShiftform.controls['ShiftPay'].value,
      RatePay: this.addUserShiftform.controls['RatePay'].value,
      ShiftRepeat: this.addUserShiftform.controls['ShiftRepeat'].value,
      ShiftLocation: this.addUserShiftform.controls['ShiftLocation'].value,
      City: this.addUserShiftform.controls['City'].value,
      ZipCode: this.addUserShiftform.controls['ZipCode'].value,
      Notes: this.addUserShiftform.controls['Notes'].value,
      IsHighPriority: this.addUserShiftform.controls['IsHighPriority'].value,
      UserId:this.userid,
      Diagnosis: this.addUserShiftform.controls['Diagnosis'].value,
      Skills: this.addUserShiftform.controls['Skills'].value,
      Pets: this.addUserShiftform.controls['Pets'].value,
      Smoker: this.addUserShiftform.controls['Smoker'].value,
      Address:this.addUserShiftform.controls['Address'].value,
      ShiftTemplate:this.addUserShiftform.controls['ShiftTemplate'].value,
      PatientName:this.addUserShiftform.controls['PatientName'].value,    
      PatientId:this.addUserShiftform.controls['PatientId'].value,
      Gender:this.addUserShiftform.controls['Gender'].value,
      BreakTime:this.addUserShiftform.controls['BreakTime'].value,

    }	
     this.submitted = true; 
     if (this.addUserShiftform.invalid) {
      this.submitted = true;
      this.loaderflag = false;
      return ;
    }
    if (this.addUserShiftform.valid) 
    {
      if(model.Id==0){
        this._manageUserShiftService.SaveUserShiftService(model).subscribe((response:any)=>{
        if(response.statusCode == 200){
          this.loaderflag = false;
          this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
             timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
           });
          this.router.navigate(["/Dashboard/openshift"]);
         }
       })
      }
      else{
        this._manageUserShiftService.UpdateUserShiftService(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            this.loaderflag = false;
            this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
            this.router.navigate(["/Dashboard/openshift"]);
           }
         })
      }
    }
    else{
      this.loaderflag = false;
      this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });

    }    
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
        if(this.dateModel.length>0){
        let a = this.dateModel.filter(p=>p == moment(date).format('MM/DD/yyyy'));
        if(a.length>0){
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error("Date :"+a+" is already selected", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          }); return;
        }
        else{this.dateModel.push(moment(date).format('MM/DD/yyyy'));}
        }
        else{this.dateModel.push(moment(date).format('MM/DD/yyyy'));}
      } 
      else {
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

}
