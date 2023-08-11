import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from 'src/app/Shared/core-services/logout.service';

@Component({
  selector: 'app-platform-admin-header',
  templateUrl: './platform-admin-header.component.html',
  styleUrls: ['./platform-admin-header.component.scss']
})
export class PlatformAdminHeaderComponent implements OnInit {
  constructor(private router: Router,private logoutService: LogoutService) { }

  ngOnInit(): void {
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
