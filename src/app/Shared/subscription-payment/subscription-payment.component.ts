import { Component, OnInit } from '@angular/core';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { AuthService } from "../../auth/auth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomPhoneFormatPipe } from '../../Utilities/contract/custom-phone-format'
import * as moment from 'moment';
import { SubscriptionService } from 'src/app/Platform/Services/subscriptionService/subscription-service.service';
import { CommonSuccessMessages } from '../../Utilities/common/CommonSuccessMessage';
import { CommonErrorMessages } from '../../Utilities/common/CommonErrorMessage';
import { NumberHelper } from 'src/app/Utilities/contract/number-helper';


@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.css']
})
export class SubscriptionPaymentComponent implements OnInit {
   addUserSubscription!: FormGroup;
   discountForm!: FormGroup;
   useremail : any;
   fullName : any;
   userId : any;
   phone: any;
   address: any;
   imageSrc?: any;
   notificationCount:any;
   userType :any;
   loaderflag:boolean = false;
   addedmonthDate : any;
   currentdate : any;
   plandata : any[];
   discountdata : any[];
   submitted!: boolean;
   discountApplied:any
   planAmount:number = 0.00;
   discountpercent:number=0.00;
   discountAmount:number=0.00;
   totalTax:number=0.00;
   totalAmount:number=0.00;
   public mask = {
    guide: false,
    showMask: false,
    mask: ['(',/\d/, /\d/,')', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
  };


  constructor(public authService: AuthService,
     private _notificationService : ManageNotificationService,
     private route: ActivatedRoute,
     private router: Router,
     private fb: FormBuilder,
     private _customPhoneFormat :CustomPhoneFormatPipe,
     private _subscriptionService :SubscriptionService,
     private _toasterService: ToastrService,
     private _numberHelper:NumberHelper,) { }

  ngOnInit(): void {
    this.fullName = this.authService.fullUserName;
    this.useremail  = this.authService.email;
    this.userId = this.authService.userID;
    this.phone = this._customPhoneFormat.transform(this.authService.phone);
    this.address = this.authService.address;
    this.userType = this.authService.userType;
    this.currentdate = moment(new Date()).format('DD MMM');
    this.addedmonthDate = moment(new Date(new Date().setMonth(new Date().getMonth() + 1))).format('DD MMM,yyyy');
    this.CreateFormGroup();
    this.getPlanDetailsforUser();
  }

  CreateFormGroup(): void {
    this.addUserSubscription = this.fb.group({
      Id:0,
      NameOnCard: new FormControl("", Validators.required),
      CardNumber: new FormControl("", Validators.required),
      CVV: new FormControl("", Validators.required),
      ExpiryMonth: new FormControl("",Validators.required),
      ExpiryYear: new FormControl("",Validators.required),
      Amount: new FormControl(""),
      DiscountId : new FormControl(""),
      DiscountPercent : new FormControl(""),
      DiscountAmount : new FormControl(""),
      TotalAmount : new FormControl(""),
      UserId:this.userId,
      UserEmail : this.useremail,
      UserName : this.fullName,
      IsMonthly:new FormControl(),
    });

    this.discountForm = this.fb.group({
      DiscountApplied: new FormControl("",),
    });
    }

  getPlanDetailsforUser():any{
    this.loaderflag=true;
    this._subscriptionService.GetSubscriptionPlan(this.userType).subscribe((response:any)=>{  
      if(response !=null)
      {
        this.plandata=response.data;
        this.addUserSubscription.controls['Amount'].setValue(response.data[0].MonthlyPlan);
        this.planAmount=response.data[0].MonthlyPlan;
        if(response.data[0].IsMonthly==true){
        this.addUserSubscription.controls['IsMonthly'].setValue(true);
        }
        else{
          this.addUserSubscription.controls['IsMonthly'].setValue(false);  
        }
        this.calculateAmount();
        this.loaderflag=false;
      }
     })
  }

  payNow():any{
    this.loaderflag=true;
    const model ={
      Id: 0,
      FirstName: this.addUserSubscription.controls['NameOnCard'].value,
      CardNumber: this.addUserSubscription.controls['CardNumber'].value.toString(),
      CVV: this.addUserSubscription.controls['CVV'].value.toString(),
      ExpiryMonth: this.addUserSubscription.controls['ExpiryMonth'].value.toString(),
      ExpiryYear: this.addUserSubscription.controls['ExpiryYear'].value.toString(),
      Amount: Number(this.addUserSubscription.controls['Amount'].value),
      UserId: Number(this.userId),
      DiscountId: Number(this.addUserSubscription.controls['DiscountId'].value),
      DiscountPercent: Number(this.addUserSubscription.controls['DiscountPercent'].value),
      DiscountAmount: Number(this.addUserSubscription.controls['DiscountAmount'].value),
      TotalAmount: Number(this.addUserSubscription.controls['TotalAmount'].value),
      UserEmail: this.useremail,
      UserName: this.fullName,
      IsMonthly:true,
    }
    if (this.addUserSubscription.invalid) {
      this.submitted = true;
      this.loaderflag = false;
      return ;
    }
    if (this.addUserSubscription.valid) {
      this._subscriptionService.SaveUserSubscription(model).subscribe((response:any)=>{
        if(response.data !=null){
          this._toasterService.success(CommonSuccessMessages.PaymentSuccessful, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.loaderflag = false;
          this.router.navigate(["Dashboard/payment-confirmation/"+response.data+""]);
         }
         else{
            this._toasterService.warning(CommonErrorMessages.TransactionFailed, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.loaderflag = false;
         }
       })
    }
  }

  checkPromoCode():any{
    let Promotext = this.discountForm.controls['DiscountApplied'].value;
    this._subscriptionService.CheckPromoCode(Promotext).subscribe((response:any)=>{  
      if(response.data.length >0)
      {
        this.discountdata = response.data;
        this.addUserSubscription.controls['DiscountId'].setValue(response.data[0].DiscountId);
        this.addUserSubscription.controls['DiscountPercent'].setValue(response.data[0].Value);
        this.discountpercent = response.data[0].Value;
        this.calculateAmount();
      }
      else{
        this._toasterService.warning(CommonErrorMessages.DiscountNotAvailable, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
      }
     })
  }

  calculateAmount():any{
    let planAmt = this.planAmount;
    let discount = this.discountpercent;
    let discAmt = planAmt * discount/100;
    this.discountAmount = discAmt
    this.addUserSubscription.controls['DiscountAmount'].setValue(this.discountAmount);
    this.totalAmount = planAmt-discAmt;
    this.addUserSubscription.controls['TotalAmount'].setValue(this.totalAmount);
  }

  checkIsNumber(event:any) {
    let result = this._numberHelper.keyPressNumbers(event);
    return result;
  }

  checkInputFormat() {
    var mask='creditcard'    
          switch (mask.toString().toLowerCase()) {
            case 'creditcard': {
             // this.mask = '0000 0000 0000 0000';
              this.mask = {
                guide: false,
                showMask: false,
                mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]
              };
              return this.mask;
            }
            case 'phonenumber': {
             // this.mask = '(00)0000000000';
              this.mask = {
                guide: false,
                showMask: false,
                mask: ['(',/\d/, /\d/,')', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
              };
              return this.mask;
            }
          }     
        return this.mask;
      }


}
