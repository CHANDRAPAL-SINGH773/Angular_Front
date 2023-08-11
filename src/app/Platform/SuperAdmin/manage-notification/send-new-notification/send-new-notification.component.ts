import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { DataEditor } from 'src/app/Platform/Services/data-editor.service';

@Component({
  selector: 'app-send-new-notification',
  templateUrl: './send-new-notification.component.html',
  styleUrls: ['./send-new-notification.component.css']
})
export class SendNewNotificationComponent implements OnInit {

  constructor(private router: Router, 
    private fb: FormBuilder,
    private _notificationService : ManageNotificationService, 
    private _toasterService: ToastrService,  
    private _getAllMasterService :GetAllMasterService,
    public authService: AuthService,
    private dataEditor : DataEditor,
    ) {    
     }
   SendNewNotification!: FormGroup;
   submitted:any;
   pagesize:number= DefaultNumber.Ten;
   pageIndex: number = DefaultNumber.Zero;
   pageSizeList = environment.pageSizeList;
   hide : boolean = false;
   search : string ='';
   templateList:any =[];
   planTypeList:any =[];
   userId:any;

  ngOnInit(): void {
    this.userId = this.authService.userID;
    this.CreateFormGroup();
    this.GetNotificationTemplateList();
  }
  CreateFormGroup(): void {
    this.SendNewNotification = this.fb.group({
      SelectTemplate: new FormControl("", [Validators.required]),
      SelectReceiver: new FormControl("", Validators.required),
      Title: new FormControl("", Validators.required),
      Note: new FormControl("", [Validators.required,]),
    })
}
    //Method is used for Get Notification List --
    GetNotificationTemplateList():any{
      this._notificationService.GetAllNotificationTemplateList(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
        this.templateList =  response.data;
      })
      this.GetPlanType();
      }
  //Method for get plan type master--
   GetPlanType(){
     this._getAllMasterService.getPlanTypeMaster().subscribe((response:any)=>{
     this.planTypeList = response.data;
     })
   } 
    //Method is used for Send New Notifications --
    SendNewNotifications():any{
      if(this.SendNewNotification.valid){
      let tempReciverObj = this.SendNewNotification.controls["SelectReceiver"].value;
      const model ={
      SelectTemplate:this.SendNewNotification.controls["SelectTemplate"].value,
      SelectReceiver:tempReciverObj,
      Title:this.SendNewNotification.controls["Title"].value,
      Note:this.SendNewNotification.controls["Note"].value,
      UserId:this.userId
      }
      this._notificationService.SendNewNotificationService(model).subscribe((response:any)=>{      
        if (response.data!=null) {
          this._toasterService.success(CommonSuccessMessages.NotificationSent, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.router.navigate(["/Dashboard/ManageNotification"]);        
        }
      })
      }
      else{
      this._toasterService.info(CommonErrorMessages.FillMendatoryFields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      }
    }
}
