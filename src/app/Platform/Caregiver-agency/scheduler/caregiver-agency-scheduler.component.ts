import { Component, OnInit, ViewChild, ElementRef,Inject } from '@angular/core';
import {scheduler } from "dhtmlx-scheduler";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Platform/Model/DialogModel';
import { ManageSchedulerService } from '../../Services/manageSchedulerService/manage-scheduler.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SchedulerInfoModel} from '../../Model/SchedulerInfo';
import * as moment from 'moment';
import { AuthService } from "../../../auth/auth.service";
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { AddAgencyService } from '../../Services/addAgencyService/add-agency.service';

@Component({
  selector: 'app-caregiver-agency-scheduler',
  templateUrl: './caregiver-agency-scheduler.component.html',
  styleUrls: ['./caregiver-agency-scheduler.component.css']
})

export class CaregiverAgencySchedulerComponent implements OnInit {
  schedulerform!: FormGroup;
  schedulerView:number = 0;
  _id:any;
  _ev: any;
  settings:any;
  schedulerDate: any;
  old_mode:any;
  old_date:any;
  mode:string ="view";
  date:any;
  curentDate:any;
  userId: any;
  schedulerdataList:any[];
  schedulerInfoList:SchedulerInfoModel[] =[];
  html = function(id: string) { return document.getElementById(id); };
  @ViewChild("scheduler_here", {static: true}) schedulerContainer: ElementRef;
  loaderflag:boolean = false;
  
  constructor(
    private _manageSchedulerService:ManageSchedulerService,
    private router: Router, 
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    public authService: AuthService,
    private _AddAgencyService : AddAgencyService,) { }

  ngOnInit(): void {
    this.loaderflag=true;
    this.CreateFormGroup();
    this.userId = this.authService.userID;
    this.getAgencyData( this.userId);
    this.schedulersetup();
    this.getSchedulerCardInfo();     
    this.loaderflag=false;
  }

  getAgencyData(id : number):void {
    let data:any ; 
    this._AddAgencyService.GetAgencyProfileData(id).subscribe((response:any) => {
    if(response.data != null) {
      this.schedulerform.controls['AgencyId'].setValue(response.data[0].AgencyId);
      }
    })
}

  CreateFormGroup(): void {
    this.schedulerform = this.fb.group({
      Id:0,
      EventText: new FormControl("", Validators.required),
      StartDate: new FormControl(""),
      EndDate: new FormControl(""),
      StartTime: new FormControl("", Validators.required),
      EndTime: new FormControl("", Validators.required),
      UserId:this.userId,
      IsAvailable:true,
      AgencyId: new FormControl(""),
    })
}

  schedulersetup():any{
    var custom_form = document.getElementById("addAvailableTime");
    const _settings = this.settings;
    const _mode = this.mode;
    scheduler.config.xml_date = "%m/%d/%Y %H:%i";  
    scheduler.config.limit_start = new Date(); 
    scheduler.config.limit_view  = true;
    scheduler.init(this.schedulerContainer.nativeElement, new Date(), "month");
    scheduler.showLightbox = function(id){
    scheduler.deleteEvent(id);
    return false;
      //var ev = scheduler.getEvent(id);
      //scheduler.startLightbox(id,custom_form as HTMLElement);
    }
    this.getSchedulerData();
    scheduler.plugins({
      tooltip: true
    });
    scheduler.templates.tooltip_date_format=function (date){
      debugger
      var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
      return formatFunc(date);
    }
    scheduler.templates.tooltip_text = function(start,end,event) {
      debugger
     return "<b>Event:</b> "+event.text+"<br/><b>Start date:</b> "+
     moment(start).format("MM/DD/yyyy hh:mm")+"<br/><b>End date:</b> "+moment(end).format("MM/DD/yyyy hh:mm");
    };

  }

  onClose():any{
    var event_id = scheduler.getState().lightbox_id;
    var AddAvailable_form = document.getElementById("addAvailableTime") as HTMLElement;
    //scheduler.endLightbox(true, AddAvailable_form);
    //scheduler.deleteEvent(event_id); 
  }

   save_form() {
    debugger
    this.loaderflag = true;
    var AddAvailable_form = document.getElementById("addAvailableTime") as HTMLElement;
    var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
    ev.text = this.schedulerform.controls['EventText'].value;
    ev.start_date = ev.start_date;
    ev.end_date = ev.end_date;
    const model ={
      Id:0,
      EventId: ev.id.toString(),
      EventText: this.schedulerform.controls['EventText'].value,
      StartDate: moment(ev.start_date).format('MM/DD/yyyy')+' '+this.schedulerform.controls['StartTime'].value,
      EndDate: moment(ev.end_date).format('MM/DD/yyyy')+' '+this.schedulerform.controls['EndTime'].value,
      StartTime : this.schedulerform.controls['StartTime'].value,
      EndTime : this.schedulerform.controls['EndTime'].value,   
      UserId : this.userId,  
    }
    if (this.schedulerform.invalid) {
      this.loaderflag = false;
      return ;
    }
    if (this.schedulerform.valid) {
      if(model.Id==0){
        this._manageSchedulerService.SaveSchedulerService(model).subscribe((response:any)=>{
        if(response.statusCode == 200){
          debugger
          this.loaderflag = false;
          this._toastrService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
             timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
           });
           scheduler.endLightbox(true, AddAvailable_form);
           this.loaderflag = false;
           location.reload();
         }
       })
      }    
  }
  else{
    scheduler.endLightbox(false, AddAvailable_form);    
    this.loaderflag = false;
  }
}

  getSchedulerData(){
  this.loaderflag = true;
  let AgencyId= this.schedulerform.controls['AgencyId'].value;
  this._manageSchedulerService.GetAgencySchedulerDataService(this.userId).subscribe((response:any)=>{
  this.schedulerdataList = [];
  response.data.forEach((element: { id: any; start_date: any; end_date: any; text: any; }) => {
            this.schedulerdataList.push({
              id: element.id,
              start_date: element.start_date,
              end_date: element.end_date,            
              text: `${element.text}`
            });
  scheduler.parse(this.schedulerdataList);
   });
   this.loaderflag = false;
  })
  // this.loaderflag = false;
  }


  getSchedulerCardInfo(){
     this.loaderflag = true;
     let AgencyId= this.schedulerform.controls['AgencyId'].value;
     this._manageSchedulerService.GetAgencySchedulerInfoListService(this.userId).subscribe((response:any)=>{
     this.schedulerInfoList = response.data;
     this.curentDate = moment(response.data[0].ShiftStartDate).format("MMM DD,YYYY");
     this.loaderflag = false;
    })
    this.loaderflag = false;
  }
}


