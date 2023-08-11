import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../Services/LoginService/login.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonErrorMessages } from '../../../../Utilities/common/CommonErrorMessage';
import { LocalStorageService } from "../../../../core/storage/localstorage.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_logo: string = "assets/images/logo.png";
  bottom_img: string = "assets/images/bottom_img.png";

  public errorMsg: boolean = false;
  public rememberFlag: boolean = false;
  public showPassword: boolean = false;
  submitted!: boolean;
  loaderflag:boolean = false;
  constructor(private router: Router, 
    private _LoginService: LoginService, 
    private cookieService: CookieService,
    private localStorage: LocalStorageService,
    private _toasterService: ToastrService,) 
    { }

  ngOnInit(): void { }
  //Method for sign-Up component access from login page --
  SignUpControl() {
    this.router.navigate(['/auth/company-registration'])
  }

  //Login Users methods
  Login(loginDetails: NgForm): void {
    this.loaderflag= true;
    this.errorMsg = false;
    if (loginDetails.value.IsRememberMe != '' && loginDetails.value.IsRememberMe != null) {
      this.rememberFlag = loginDetails.value.IsRememberMe;
    }
    if (loginDetails.valid) {
      const params = {
        Username: loginDetails.value.username,
        Password: loginDetails.value.password,
        RemmemberMe: this.rememberFlag
      }
      this._LoginService.loginService(params).subscribe((res: any) => {
        debugger
        if (res.data.length != undefined) {
          debugger
          this.localStorage.setAccessToken(res.access_token);
          this.localStorage.setUserType(res.data[0].roleid);
          this.localStorage.setCompanyID(res.data[0].companyid);
          this.localStorage.setUserId(res.data[0].personid);
          this.localStorage.setUsername(res.data[0].username);//set using back end added by pk 21-02-2022
          this.localStorage.setAcpPartnerID(res.data[0].acppartnerid);
          this.localStorage.setFirstName(res.data[0].firstname);
          this.localStorage.setMiddleName(res.data[0].middlename);
          this.localStorage.setLastName(res.data[0].lastname);
          if(res.data[0].CompanyName !=null){this.localStorage.setCompanyName(res.data[0].CompanyName)}
          if(res.data[0].AcpPartnerName !=null){this.localStorage.setAcpPartnerName(res.data[0].AcpPartnerName)}
          
          if (res.data.userType == 1) {
            // It means Super Admin LogedIn --
            this.router.navigate(['/platform-admin']);
            return;
          }
       else
       {
        this.GetSetUserRoleAndPermissions(res);
       }
         

        }
        else {
          this.loaderflag = false;
          this.errorMsg = true;
        }
      })
    }
    else {
      this.submitted = true;
      this.loaderflag= false;
      this.errorMsg = true;
      return;
    }
     this.loaderflag = false;
  }
  //Forgot password method--
  ForgotPassword(dataObj: NgForm) {
    const params = {
      Username: dataObj.value.email,
      Action: dataObj.value.Action
    }
    this._LoginService.forgotPasswordService(dataObj).subscribe((response: any) => {
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  NavigateAccordingUserType(res:any)
  {
    debugger
   if (res.data[0].roleid == 2) {
      // It means Client or Hospital Payer LogedIn --
      this.localStorage.setAcpPartnerID(res.data[0].acppartnerid);
      this.router.navigate(['/super-admin']);
      return;
    }
    else if (res.data[0].roleid == 16) {
      //It means Caregiver or Health Care Professional LogedIn--
      this.localStorage.setAcpPartnerID(res.data[0].acppartnerid);
      this.router.navigate(['/super-admin']);
      return;
    }
    else if (res.data[0].roleid == 17 || res.data[0].roleid == 18 ) {
      //It means Caregiver or Health Care Professional LogedIn--
      this.localStorage.setAcpPartnerID(res.data[0].acppartnerid);
      this.router.navigate(['/AcpPartnerAdmin']);
      return;
    }
    else if (res.data[0].roleid == 15) {
      //It means Caregiver or Health Care Professional LogedIn--
      this.router.navigate(['/PlatformAdmin']);
      return;
    }
    else  {
      //It means Caregiver or Health Care Professional LogedIn--
      this.router.navigate(['/super-admin']); // will transfer to installer,assessor and backoffice 

      this.loaderflag = false;
      return;
    }

  }
  GetSetUserRoleAndPermissions(res:any)
  {
    // this.rolePermissionService.getRolePermissionsForUser(res.data.organizationID,res.data.userType).subscribe((response: any) => {
    // this.userRolePermissionService.setUserRoleAndPermission(response);
    // this.NavigateAccordingUserType(res);
    // });
    this.NavigateAccordingUserType(res);
  }
  
}
