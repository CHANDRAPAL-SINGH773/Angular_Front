import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth/auth.service";
import { CommonErrorMessages } from "../Utilities/common/CommonErrorMessage";
import { Observable } from "rxjs";
import { LocalStorageService } from "../core/storage/localstorage.service";
import { LogoutService } from "../Shared/core-services/logout.service";

@Injectable()

export class AuthGuard implements CanActivate {

    href:any;
    constructor(
      private route: Router,
      private storageService: LocalStorageService,
      private logoutService: LogoutService
     // ,private rolePermissionService:UserRoleAndPermissionService
     ) {
      }


      canActivate():
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      const isTokenExpired = this.storageService.isTokenExpired();
      const userType = this.storageService.getUserType();
      const user = this.storageService.getLoggedInUser();
      this.href = this.route.url.split('/');
      if (isTokenExpired || !(user || userType)) {
        this.logoutService.performLogout();
        this.route.navigate(['/auth/login']);
        return false;
      }
      
  
      if (!isTokenExpired) 
      {
        return true;
       }
  
      this.logoutService.performLogout();
      this.route.navigate(['/auth/login']);
      return false;
    }


    // constructor
    //     (
    //         private router: Router,
    //         private authenticationService: AuthService,
    //         private _toasterService: ToastrService
    //     ) { }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //     const isLoggedIn = this.authenticationService.isAuthenticated;
    //     if (!isLoggedIn) {
    //         //this.router.navigateByUrl("/login");
    //         this.router.navigate(["login"], { queryParams: { returnUrl: state.url } });
    //         this._toasterService.toastrConfig.preventDuplicates = true;
    //         this._toasterService.error(CommonErrorMessages.SessionExpired, "", {
    //             timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    //           });
    //     }
    //     return isLoggedIn;
    // }
}
