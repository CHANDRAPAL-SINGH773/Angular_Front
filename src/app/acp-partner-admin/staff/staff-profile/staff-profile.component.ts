import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.css']
})
export class StaffProfileComponent implements OnInit {
  userForm: FormGroup;
  changePassForm: FormGroup;
  LoginUserName: any;
  buttonflag: boolean = false;
  imagepath: any = environment.imageUrl;
  userProfile: any;
  constructor(  private router: Router,
    private route: ActivatedRoute, fb: FormBuilder) {
    this.userForm = fb.group({
      Name: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      EmailID: new FormControl('', [Validators.required]),
      PhoneNumber: new FormControl(''),
      JobTitle: new FormControl(''),
      UserName: new FormControl('', [Validators.required])
    });

    this.changePassForm = fb.group({
      CurrentPassword: new FormControl('', [Validators.required]),
      NewPassword: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required])
    });
  }


  userId: any;
  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.getuserDetails(this.userId);
  }
  getuserDetails(UserId: any) {
    // this.profileservice.getProfileDetails(UserId).subscribe((res: any) => {
    //   if (res.data != null) {

    //     let userData = res.data.responseData[0];
    //     this.LoginUserName = userData.UserName;
    //     this.userForm.controls['Name'].setValue(userData.FirstName);
    //     this.userForm.controls['LastName'].setValue(userData.LastName);
    //     this.userForm.controls['EmailID'].setValue(userData.Email);
    //     this.userForm.controls['PhoneNumber'].setValue(userData.Phone);
    //     this.userForm.controls['JobTitle'].setValue(userData.TypeName);
    //     this.userForm.controls['UserName'].setValue(userData.UserName);
    //     this.userProfile = this.imagepath + userData.ProfileImg
    //   }

    // })
  }

  editButtonevent() {
    this.buttonflag = true;
  }
  updateUserProfileInfo() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const modal = {
        UserId: this.userId,
        FirstName: this.userForm.controls['Name'].value,
        LastName: this.userForm.controls['LastName'].value,
        Email: this.userForm.controls['EmailID'].value,
        Phone: this.userForm.controls['PhoneNumber'].value,
        UserName: this.userForm.controls['UserName'].value
      }
      // this.profileservice.UpdateUserProfile(modal).subscribe((res: any) => {
      //   if (res.responseData.responseData[0].status == 1) {
      //     Swal.fire({
      //       position: 'center',
      //       icon: 'success',
      //       title: 'Details updated successfully',
      //       showConfirmButton: false,
      //       timer: 1500
      //     })
      //     this.buttonflag = false;
      //   }
      // })
    }
    else {
      // alert("Please fill all details");
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill all details!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
