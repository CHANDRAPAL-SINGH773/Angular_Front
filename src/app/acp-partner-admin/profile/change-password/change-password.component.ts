
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogoutService } from 'src/app/Shared/core-services/logout.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ForgotPasswordService } from 'src/app/auth/Logins/Services/ForgotPassword/forgot-password.service';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
  loaderflag:boolean = false;
  constructor(private router: Router,
    private _forgotpassword: ForgotPasswordService, 
    private route: ActivatedRoute,
    private _toasterService: ToastrService,
    public authService: AuthService,) { }

  public userId :any;
  public boolEmailLink=false;
  public Validatepasswordflag : boolean= false;
  ngOnInit(): void {

    this.userId = Number(localStorage.getItem('user_id'));
  }

resetPassword(dataObj:NgForm) {
  if(this.userId<=0){
    this.loaderflag = false;  
    this._toasterService.toastrConfig.preventDuplicates = true;  
    this._toasterService.success("User Not Found", "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
  
    return;
  }
  let newpass = dataObj.value.password;
  let conPass = dataObj.value.confirmPassword;
  if (newpass == conPass && dataObj.valid) {
    const Modal = {
      UserID: this.userId,
      OldPassword: dataObj.value.currentPassword,
      NewPassword: newpass,
      ModifyBy:this.userId,
      EmailLink:this.boolEmailLink
    }
    this._forgotpassword.ChangeUserPassword(Modal).subscribe((res: any) => {
      if(res.statusCode =='200'){
        if(res.message=="")
        {
          this.loaderflag = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 2200,
      
          });
          return;
        }
        else{
        this.loaderflag = false;  
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
        this.redirectToLogin()
        }
       }
      else if (res.responseData.responseData[0].status == 2) {
        this.loaderflag = false;  
        this._toasterService.toastrConfig.preventDuplicates = true;  
        this._toasterService.error("Current Password is incorrect", "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
      
        return;
        
      }
    })
  } else {
    this.loaderflag = false;  
    this._toasterService.toastrConfig.preventDuplicates = true;  
    this._toasterService.error("Confirm password doesn't match", "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
  
    return;
  }
}

onBackClick() {
  //this.location.back();
}
redirectToLogin(){
  this.router.navigate(['/auth']);
  }
}
