import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ForgotPasswordService} from '../../Services/ForgotPassword/forgot-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSuccessMessages} from '../../../../Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { LogoutService } from 'src/app/Shared/core-services/logout.service';
@Component({
  selector: 'app-link-reset-password',
  templateUrl: './link-reset-password.component.html',
  styleUrls: ['./link-reset-password.component.css']
})
export class LinkResetPasswordComponent implements OnInit {

  loaderflag:boolean = false;
  constructor(private router: Router,private logoutService: LogoutService,
    private _forgotpassword: ForgotPasswordService, 
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private _toasterService: ToastrService,private location: Location,
    public authService: AuthService,) { }

  public userId :any;
  public boolEmailLink=false;
  public Validatepasswordflag : boolean= false;
  ngOnInit(): void {
    debugger
      this.route.queryParams.subscribe(params => {
      this.userId =  params['userId'];
      //this.userId = this.authService.userID;
      this.boolEmailLink=true;
    })
    
  }

resetPassword(dataObj:NgForm) {
  debugger
  // if(this.userId ==undefined){
  //   debugger  
  // this.userId = Number(this.localStorage.getUserId());
  // }
  let newpass = dataObj.value.password;
  let conPass = dataObj.value.confirmPassword;
  if (newpass == conPass) {
    const Modal = {
      UserID: this.userId,
    //  OldPassword: dataObj.value.currentPassword,
      NewPassword: newpass,
      ModifyBy:this.userId,
      EmailLink:this.boolEmailLink
    }
    this._forgotpassword.ChangeUserPasswordWithMailLink(Modal).subscribe((res: any) => {
      debugger
      if(res.statusCode =='200'){
        if(res.message=="")
        {
          this.loaderflag = false;
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error(res.message, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          return;
        }
        else{
        this.loaderflag = false;  
        this._toasterService.toastrConfig.preventDuplicates = true;  
        this._toasterService.success(CommonSuccessMessages.SuccessResetPassword, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.onLogout();
        this.redirectToLogin()
        }
       }
      else if (res.responseData.responseData[0].status == 2) {
         alert("Current Password is incorrect");
        
      }
    })
  } else {
     alert("Confirm password doesn't match");
  }
}
redirectToLogin(){
  debugger
  this.router.navigate(['/auth']);
  }
onLogout = (): void => {
  debugger
  this.localStorage.clear();
  this.logoutService.performLogout();
 // this.router.navigate(['/']);
};
onBackClick() {
  this.location.back();
}

}
