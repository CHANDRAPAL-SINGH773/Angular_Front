import { Component, OnInit, ViewChild,Inject, ChangeDetectorRef } from '@angular/core';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../auth/auth.service";
import { DialogModel } from '../../../Platform/Model/DialogModel';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AddAssociateService } from 'src/app/Platform/Services/associateService/add-associate.service';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {
  title: string = 'Notification Detail';
  isFilter: boolean = false;
  userId:any;
  agencyform!: FormGroup;
  search: string = '';
  loaderflag: boolean = false; 
  valueflag: boolean = false;
  hide : boolean = false;
  id : any;
  NotificationId:any;
  notificationData: any = [];
 

  constructor( 
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogModel,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder, 
    public dialog: MatDialog, 
    private fb: FormBuilder,
    private _addAssociateService: AddAssociateService,
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    private _notificationService : ManageNotificationService,
    ) { }

  ngOnInit(): void {
    this.CreateFormControl();
    this.id   = this.dialogData.Id;
    this.NotificationId   = this.dialogData.Type;
    if(this.id != 0){
     this.GetNotificationData();
    }    
  }

  CreateFormControl(): void {
    this.agencyform = this._formBuilder.group({
      Search: new FormControl("")
    });
  }

  GetNotificationData() {
    this.loaderflag = true;
    this._notificationService.GetNotificationData(this.id,this.NotificationId).subscribe((response: any) => {    
      if (response.data !=null) {
          this.notificationData = response.data;
          this.loaderflag = false;        
      }
      else {
        this.loaderflag = false;
      }
    })
  }
}
