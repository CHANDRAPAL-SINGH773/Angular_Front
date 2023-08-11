import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/Shared/core-services/logout.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 // @Input() ApplicationTitle: string;
 public ApplicationTitle:any;
 public RoleID:any;
  constructor(private router: Router,private logoutService: LogoutService,private localStorage1: LocalStorageService,) { }

  ngOnInit(): void {
    this.RoleID= this.localStorage1.getUserType();
    if(this.RoleID==2 || this.RoleID==16){this.ApplicationTitle= this.localStorage1.getCompanyName();}
    else if(this.RoleID==17 || this.RoleID==18){this.ApplicationTitle= this.localStorage1.getAcpPartnerName();}
    else if(this.RoleID==15){this.ApplicationTitle= 'Fraztec Application';}
    else {this.ApplicationTitle= '';}
  }

  onLogout = (): void => {
    localStorage.clear();
    this.logoutService.performLogout();
    this.router.navigate(['/']);
  };
  resetPassword = (): void => {
    this.router.navigate(['/auth/ResetPassword']);
  };
}

