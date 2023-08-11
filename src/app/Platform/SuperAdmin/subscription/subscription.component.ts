import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../../Services/subscriptionService/subscription-service.service';
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from "@angular/material/sort";
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import {PDFDownloadService} from '../../Services/downloadPDF.service';
import { CustomPhoneFormatPipe } from 'src/app/Utilities/contract/custom-phone-format';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { AddEditSubscriptionPlanComponent } from './add-edit-subscription-plan/add-edit-subscription-plan.component';
import { DialogModel } from '../../Model/DialogModel';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscription: boolean = true;
  paymentConfirm: boolean = false;
  planloglist: boolean = true;
  formpayment: boolean = false;
  hide : boolean = false;
  userType:any;
  userId:any;
  useremail :any;
  fullName:any;
    // mat Table settings
  search : string ='';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["orderno","paymentdatetime", "amount","discountgiven", "plantype", "status","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  loaderflag:boolean = false;
 //------------Payment parameters -------//
  orderNo : any;
  totalAmount:any;
  discountAmount:any;
  amount:any;
  id:any;
  phone:any;
  address:any;
  paymentDate:any;
  orderData :any[];
  plandata : any[];
  monthlyPlanAmount :any;
  annualPlanAmount :any;
  subscribedTo :any;
  pageChangeEvent(event:any) {}
  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;

  constructor(
    private  _subscriptionService: SubscriptionService,
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private fb: FormBuilder,
    public authService: AuthService,
    public pdfService : PDFDownloadService,
    public cd: ChangeDetectorRef,
    private _customPhoneFormat :CustomPhoneFormatPipe,
    private router: Router,
    private readonly localStorage: LocalStorageService,)
     { }

  ngOnInit(): void {
    this.loaderflag =true;
    this.userId =this.authService.userID;
    this.userType = this.authService.userType;
    this.useremail  = this.authService.email;
    this.fullName = this.authService.fullUserName;
    this.phone = this._customPhoneFormat.transform(this.authService.phone);
    this.address = this.authService.address;
    this.subscribedTo = moment(this.authService.subscribedTo).format('MMM DD,yyyy');
    this.GetUserSubscriptionList('searching');
    this.getPlanDetailsforUser();
    this.loaderflag =false;
  }

  getPlanDetailsforUser():any{
    this._subscriptionService.GetSubscriptionPlan(this.userType).subscribe((response:any)=>{  
      if(response !=null)
      {
        this.plandata=response.data;
        this.monthlyPlanAmount = response.data[0].MonthlyPlan;
        this.annualPlanAmount = response.data[0].AnnualPlan;
      }
     })
  }

  choosenPlanPay(){
    this.planloglist = false;
    this.formpayment = true;
  }

  payNow(){
    this.paymentConfirm= true;
    this.subscription= false;
  }

    // Method for get all user shift list for manage screen--
  GetUserSubscriptionList(type:any){
       this.loaderflag = true;
       this.search= '';
       this._subscriptionService.GetSubscriptionPaymentLogList(this.search,this.pageIndex,this.pagesize,this.userId).subscribe((response:any)=>{
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
  }

  
  UpgradePlan():any{
    const model: DialogModel = {
      Id: 0,
      HeaderText: "Edit Plan",
      Type:0,
    };
    const dialogRef = this.dialog.open(AddEditSubscriptionPlanComponent, {
      width: "380px",
      data: model
    }); 
    this.dialogCtrl.nativeElement.focus();
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

  DownloadFile(orderid:any,orderNo :any):any{
   this.loaderflag =true;
   this._subscriptionService.GetUserOrderDetail(orderid,this.useremail,this.userId).subscribe((response:any)=>{  
     if(response !=null)
     {
       this.orderData=response.data;
       this.orderNo=response.data.orderNo;
       this.paymentDate = moment(response.data.paymentDate).format('MMM DD,yyyy');
       this.totalAmount=response.data.totalAmount;
       this.discountAmount=response.data.discountAmount;
       this.amount=response.data.amount;
       this.loaderflag =false;
       this.cd.detectChanges();
       this.Getfile(orderNo);
     }
    })
  }

  Getfile(orderNo:any):void{
    this.loaderflag =true;
    const data = document.getElementById("print-section");
    if(data) {
    this.pdfService.DownloadPDF(data,"OrderSummary"+orderNo+".pdf");
   } else {
    this.pdfService.DownloadPDF(data,"OrderSummary"+orderNo+".pdf");
   }
   this.loaderflag =false;
  }

  CancelSubscription(){
    this.CancellationConfirmation(this.userId);

  }

  CancellationConfirmation(id:any){
    const model ={
      userId: this.userId}
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
     }).then((result) => {
      if (result.isConfirmed) {
        this._subscriptionService.CancelSubscription(model).subscribe((response:any) => {
          if(response.message='OK'){
            Swal.fire(
              'Cancelled!',
              'Your Subscription has been cancelled .',
              'success'
            )
            localStorage.clear();
            this.router.navigate(["/login"]);
          }
        })
      }
    })
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
