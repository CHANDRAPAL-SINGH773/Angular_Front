import { Component, OnInit } from '@angular/core';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { AuthService } from "../../auth/auth.service";
import { SubscriptionService } from 'src/app/Platform/Services/subscriptionService/subscription-service.service';
import { CustomPhoneFormatPipe } from '../../Utilities/contract/custom-phone-format'
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {
   useremail : any;
   fullName : any;
   userId : any;
   profile: any;
   imageSrc?: any;
   notificationCount:any;
   userType :any;
   loaderflag:boolean = false;
   orderData :any[];
   orderNo : any;
   totalAmount:any;
   discountAmount:any;
   amount:any;
   id:any;
   phone:any;
   address:any;
   paymentDate:any;
   localData :any;
   tempData :any[];
  constructor(public authService: AuthService,
     private _notificationService : ManageNotificationService,
     private _customPhoneFormat :CustomPhoneFormatPipe,
     private route: ActivatedRoute,
     private _subscriptionService :SubscriptionService,
     private router: Router,
     private readonly localStorage: LocalStorageService,) { }

  ngOnInit(): void {
    this.fullName = this.authService.fullUserName;
    this.useremail  = this.authService.email;
    this.userId = this.authService.userID;
    this.phone = this._customPhoneFormat.transform(this.authService.phone);
    this.address = this.authService.address;
    this.userType = this.authService.userType;
    this.id = parseInt(this.route.snapshot.params['id']);
    if(this.id !=null){
      this.getOrderforUser();
    }
  }

  getOrderforUser():any{
    this.loaderflag =true;
    this._subscriptionService.GetUserOrderDetail(this.id,this.useremail,this.userId).subscribe((response:any)=>{  
      if(response !=null)
      {
        this.orderData=response.data;
        this.orderNo=response.data.orderNo;
        this.paymentDate = moment(response.data.paymentDate).format('MMM DD,yyyy');
        this.totalAmount=response.data.totalAmount;
        this.discountAmount=response.data.discountAmount;
        this.amount=response.data.amount;
        this.loaderflag =false;
      }
      this.ContinueConfirmation(this.userId);
      this.loaderflag =false;
     })    
  }

  ContinueConfirmation(id:any){
    const model ={
      userId: this.userId}
     Swal.fire({
      title: 'Confirmation?',
      text: "You want to continue to use the service!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
     }).then((result) => {
      if (result.isConfirmed) {   
        localStorage.clear();
        if(this.userType==5)
        {
          this.router.navigate(["/Dashboard/referral-profile/"+this.userId+""]); 
        }
        else if(this.userType==4){
          this.router.navigate(["/Dashboard/agency-profile/"+this.userId+""]);
        }
        else if(this.userType==3){
          this.router.navigate(["/Dashboard/caregiver-profile/"+this.userId+""]);
        }
        else{
        this.router.navigate(["/login"]);
        }
      }
    })
  }

}
