import { Component, OnInit, ViewChild, ElementRef,Inject } from '@angular/core';
import {scheduler } from "dhtmlx-scheduler";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Platform/Model/DialogModel';
// import {AddAvailableTimeComponent} from '../manage-caregiver/add-available-time/add-available-time.component';
import { ManageSchedulerService } from '../../Services/manageSchedulerService/manage-scheduler.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SchedulerInfoModel} from '../../Model/SchedulerInfo';
import * as moment from 'moment';
import { AuthService } from "../../../auth/auth.service";
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})

export class SchedulerComponent implements OnInit {
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
    public authService: AuthService) { }

  ngOnInit(): void {
    this.loaderflag = true;
    this.schedulersetup();
    this.getSchedulerCardInfo();
    this.userId = this.authService.userID;
    this.CreateFormGroup();
    this.loaderflag = false;
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
      IsAvailable:true
    })
}

  schedulersetup():any{
    var custom_form = document.getElementById("addAvailableTime");
    const _settings = this.settings;
    const _mode = this.mode;
    scheduler.config.xml_date = "%m/%d/%Y %H:%i";  
    scheduler.config.limit_start = new Date(); 
    scheduler.config.limit_view  = false;
    scheduler.config.details_on_dblclick = false;
    scheduler.config.details_on_create = false;  
    scheduler.init(this.schedulerContainer.nativeElement, new Date(), "month");
    scheduler.showLightbox = function(id){
    debugger
    scheduler.deleteEvent(id); 
    return false;
      //var ev = scheduler.getEvent(id);
     // scheduler.startLightbox(id,custom_form as HTMLElement);
    }
    this.getSchedulerData();
    scheduler.plugins({
      tooltip: true
    });
    scheduler.templates.tooltip_date_format=function (date){     
      var formatFunc = scheduler.date.date_to_str("%Y-%m-%d %H:%i");
      return formatFunc(date);
    }
    scheduler.templates.tooltip_text = function(start,end,event) {      
     return "<b>Event:</b> "+event.text+"<br/><b>Start date:</b> "+
     moment(start).format("MM/DD/yyyy hh:mm")+"<br/><b>End date:</b> "+moment(end).format("MM/DD/yyyy hh:mm");
    };

  }

  onClose():any{
    var event_id = scheduler.getState().lightbox_id;
    var AddAvailable_form = document.getElementById("addAvailableTime") as HTMLElement;
    //scheduler.endLightbox(true, AddAvailable_form);
    // scheduler.deleteEvent(event_id); 
  }

   save_form() {
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
  this._manageSchedulerService.GetSchedulerDataService().subscribe((response:any)=>{
  if(response.data !=null){
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
  }
  })
  }


  getSchedulerCardInfo(){
     this.loaderflag = true;
     this._manageSchedulerService.GetSchedulerInfoListService().subscribe((response:any)=>{
      if(response.data.length>0){
         debugger
         this.schedulerInfoList = response.data;
         this.curentDate = moment(response.data[0].ShiftStartDate).format("MMM DD,YYYY");
         this.loaderflag = false;
      }
      else{
        this.loaderflag = false;
      }
     })
  
  }

}


