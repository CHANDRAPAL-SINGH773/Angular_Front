import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-requested-by-caregiver-shift',
  templateUrl: './requested-by-caregiver-shift.component.html',
  styleUrls: ['./requested-by-caregiver-shift.component.css']
})
export class RequestedByCaregiverShiftComponent implements OnInit {
  isSubscribed:any;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
   
  }

}
