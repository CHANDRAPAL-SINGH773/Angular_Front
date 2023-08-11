import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/Shared/core-services/logout.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';

@Component({
  selector: 'app-acp-partner-header',
  templateUrl: './acp-partner-header.component.html',
  styleUrls: ['./acp-partner-header.component.scss']
})
export class AcpPartnerHeaderComponent implements OnInit {
  public ApplicationTitle:any;
  public RoleID:any;
  public UserProfile:any;
  fName:string;
  mName:string;
  lName:string;
  constructor(private router: Router,private logoutService: LogoutService,private localStorage1: LocalStorageService,) { }

  ngOnInit(): void {
    this.RoleID= this.localStorage1.getUserType();
    if(this.RoleID==2 || this.RoleID==16){this.ApplicationTitle= this.localStorage1.getCompanyName();}
    else if(this.RoleID==17 || this.RoleID==18){this.ApplicationTitle= this.localStorage1.getAcpPartnerName();}
    else if(this.RoleID==15){this.ApplicationTitle= 'Fraztec Application';}
    else {this.ApplicationTitle= '';}
  this.fName=this.localStorage1.getFirstName();
  this.mName=this.localStorage1.getMiddleName();
  this.lName=this.localStorage1.getLastName();
  if(this.fName!='null'){this.UserProfile=this.fName;}
  if(this.mName!='null'){this.UserProfile+=' '+this.mName;}
  if(this.lName!='null'){this.UserProfile+=' '+this.lName;}
  //this.UserProfile=this.fName+''+this.mName+''+this.lName;
  }

  onLogout = (): void => {
    debugger
    localStorage.clear();
    this.logoutService.performLogout();
    this.router.navigate(['/']);
  };
  resetPassword = (): void => {
    debugger
    this.router.navigate(['/auth/ResetPassword']);
  };

}
