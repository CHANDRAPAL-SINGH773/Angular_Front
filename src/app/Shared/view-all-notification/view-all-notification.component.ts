import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { AuthService } from "../../auth/auth.service";
import { SubscriptionService } from 'src/app/Platform/Services/subscriptionService/subscription-service.service';
import { CustomPhoneFormatPipe } from '../../Utilities/contract/custom-phone-format'
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultNumber } from '../Enums/Default.enums';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDetailComponent } from "./notification-detail/notification-detail.component";
import { DialogModel } from 'src/app/Platform/Model/DialogModel';


@Component({
  selector: 'app-view-all-notification',
  templateUrl: './view-all-notification.component.html',
  styleUrls: ['./view-all-notification.component.css']
})
export class ViewAllNotificationComponent implements OnInit {
  useremail : any;
  fullName : any;
  userId : any;
  profile: any;
  id:any;
  userType :any;
  title :any;
  hide : boolean = false;
  search:any;
  status=0;
  userNotifyForm!: FormGroup;
   // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["notificationDate","title", "message","received","action"];  
  dataSource :MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  pageChangeEvent(event:any) {}
  loaderflag:boolean = false;

  constructor(public authService: AuthService,
     private _notificationService : ManageNotificationService,
     private _customPhoneFormat :CustomPhoneFormatPipe,
     private route: ActivatedRoute,
     private router: Router,
     private readonly localStorage: LocalStorageService,
     public dialog: MatDialog, 
     private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.title ="Notifications";
    this.CreateFormGroup();
    this.fullName = this.authService.fullUserName;
    this.useremail  = this.authService.email;
    this.userId = this.authService.userID;
    this.userType = this.authService.userType;
    this.id = parseInt(this.route.snapshot.params['id']);
    if(this.id !=null){
      this.GetUserNotificationList();
    }
  }

  CreateFormGroup(): void {
    this.userNotifyForm = this.fb.group({
      Search: new FormControl("")
    })
  }

      // Method for get all user shift list for manage screen--
      GetUserNotificationList(){
        this.loaderflag = true;
        this.search= this.userNotifyForm.controls['Search'].value;
        this.status=0;
         this._notificationService.GetUserNotificationList(this.userId,this.status,this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
          this.dataSource =  new MatTableDataSource(response.data);
          this.dataSource.paginator = this.paginator;
          this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
          if(this.recordcount>0)
          {
            this.loaderflag = false;
            this.hide= true;
          }
          else{
            this.hide = false;
            this.loaderflag = false;
          }
        })
        this.loaderflag = false;
      }

      OpenNotificationDetail(Id:any,NotificationId:any):any{
        const model: DialogModel = {
          Id: Id,
          HeaderText: "",
          Type:NotificationId,
        };
        const dialogRef = this.dialog.open(NotificationDetailComponent, {
          data: model,
          width: "40vw",
          maxWidth: "40vw",
          maxHeight: "50vh",
          height: "50vh"
        });
        //this.dialogCtrl.nativeElement.focus();
        dialogRef.afterClosed().subscribe(result => { });
      }

      //--Client-Side Sorting
      sortData(sort: Sort) {
        const data = this.dataSource.data.slice();
        if (!sort.active || sort.direction === '') {
          this.dataSource.data = data;
          return;
        }
    
        this.dataSource.data = data.sort((a:any,b:any) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {        
            case 'shiftNo': return compare(a.ShiftNo, b.ShiftNo, isAsc);
            case 'title': return compare(a.Title, b.Title, isAsc);
            case 'caregiver': return compare(a.Caregiver, b.Caregiver, isAsc);
            case 'shiftType': return compare(a.ShiftType, b.ShiftType, isAsc);
            case 'shiftStartDate': return compare(a.ShiftStartDate, b.ShiftStartDate, isAsc);
            case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
            case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
            case 'duration': return compare(a.Duration, b.Duration, isAsc);
            default: return 0;
          }
        });
      }   


}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
