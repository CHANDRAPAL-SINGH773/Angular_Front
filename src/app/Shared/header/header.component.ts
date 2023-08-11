import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataEditor } from 'src/app/Platform/Services/data-editor.service';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { environment } from 'src/environments/environment';
import { AuthService } from "../../auth/auth.service";
import { DefaultNumber } from '../Enums/Default.enums';
import { NotificationDetailComponent } from "../../Shared/view-all-notification/notification-detail/notification-detail.component";
import { DialogModel } from 'src/app/Platform/Model/DialogModel';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   useremail : any;
   fullName : any;
   userId : any;
   profile: any;
   imageSrc?: any;
   notificationCount:any = 0;
   userType :any;
   isSubscribed:any;
   disabledControl:any;
   Notificationdata:any =[];
   pagesize = environment.defaultPageSize;
   search = '';
   status=3;
   pageIndex: number = DefaultNumber.Zero;
  constructor(public authService: AuthService,
     private _notificationService : ManageNotificationService,
     private route: ActivatedRoute,
     private router: Router, 
     private dataEditor : DataEditor,
     public dialog: MatDialog) 
     {
       dataEditor.PushnotificationData.subscribe((res: { data: any; } | null) => {
        if(res == null){
          this.GetNotifications();
        }
        else{        
            this.GetNotifications();
          }      
      });
    }

  ngOnInit(): void {
    this.fullName = this.authService.fullUserName;
    this.useremail  = this.authService.email;
    this.userId = this.authService.userID;
    this.profile = this.authService.profilePicture;
    this.imageSrc = this.profile;
    this.userType = this.authService.userType;
    this.isSubscribed = this.authService.isSubscribed;
    if(this.isSubscribed==true){
      this.disabledControl = 1;
    }
    else{
      this.disabledControl = 0;
    }
    this._notificationService.startConnection();
    this._notificationService.addNotificationRecievedListener(); 
  }
GetNotifications():any{
this.userId =this.authService.userID;
this.useremail=this.authService.email;
this.userType =this.authService.userType;
this.pagesize = environment.defaultPageSize
this.pageIndex = DefaultNumber.Zero;
this.search='';
this.status=3;
this._notificationService.GetUserNotificationList(this.userId,this.status,this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
  if(response.data.length>0){
   this.notificationCount =   response.data[0].UnReadNotification;
   this.Notificationdata = response.data;
  }
  else{
    this.notificationCount =  0;
    this.Notificationdata = [];
  }
 })
}

logout(): void {
  localStorage.clear();
  this.router.navigate(["/login"]);
}

OpenNotificationDetail(Id:any,NotificationId:any):any{
  const model: DialogModel = {
    Id: Id,
    HeaderText: "",
    Type:NotificationId,
  };
  const dialogRef = this.dialog.open(NotificationDetailComponent, {
    data: model,
    width: "50vw",
    maxWidth: "50vw",
    maxHeight: "50vh",
    height: "50vh"
  });
  //this.dialogCtrl.nativeElement.focus();
  dialogRef.afterClosed().subscribe(result => { });

}

ClearAllNotifications():any{
  this.userId =this.authService.userID; 
  this._notificationService.ClearAllNotification(this.userId).subscribe((response:any)=>{
    if(response.data!=null){
      this.notificationCount =  0;
      this.Notificationdata = [];
    }
   })   
 }

}
