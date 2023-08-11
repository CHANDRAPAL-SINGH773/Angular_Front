import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service';
import { AuthService } from "../../../auth/auth.service";
import { ManageUserService} from '../../Services/manageUserService/manage-user.service';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isReadonly: boolean = true;
  userProfileForm!: FormGroup;
  fileUPloadForm!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  userId :any;
  loaderflag:boolean = false;
  // @ViewChild('file') file!: ElementRef<any>;
  constructor(  
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router, 
    private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _uploadImageService : UploadImageServiceService,
    public authService: AuthService,
    private _manageUserService : ManageUserService,) { }

  ngOnInit(): void {
    this.loaderflag=true;
    this.createFormGroup();
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    this.getUserData(this.id);}
    this.loaderflag=false;
  }

  getUserData(id:any){
    this._manageUserService.GetUserData(id,'admin').subscribe((response:any) => {
      if(response.data != "") {
      this.userProfileForm.controls['UserId'].setValue(response.data[0].UserId);
      this.userProfileForm.controls['FirstName'].setValue(response.data[0].FirstName);
      this.userProfileForm.controls['LastName'].setValue(response.data[0].LastName);
      this.userProfileForm.controls['Email'].setValue(response.data[0].Email);
      this.userProfileForm.controls['Phone'].setValue(response.data[0].Phone);
      this.userProfileForm.controls['CompanyName'].setValue(response.data[0].Company);
      this.userProfileForm.controls['Location'].setValue(response.data[0].Address);
      this.userProfileForm.controls['Profile'].setValue(response.data[0].Profile);
      this.imageSrc = response.data[0].Profile;
      }
    })
  }

  editProfile(){
    this.isReadonly = false;
  }

  createFormGroup(): void {
    this.userProfileForm = this.fb.group({
      FirstName: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      Email: new FormControl("", [Validators.required, Validators.email]),
      Phone: new FormControl("",Validators.required),
      CompanyName: new FormControl("",Validators.required),
      Location: new FormControl("0",[Validators.required,]),
      UserId:this.userId,
      Profile:new FormControl(""),
    })
  }

  UpdateUserProfile(){
    this.loaderflag=true;
    const model ={
      FirstName: this.userProfileForm.controls['FirstName'].value,
      LastName: this.userProfileForm.controls['LastName'].value,
      Email: this.userProfileForm.controls['Email'].value,
      Phone: this.userProfileForm.controls['Phone'].value,
      CompanyName: this.userProfileForm.controls['CompanyName'].value, 
      Location: this.userProfileForm.controls['Location'].value,       
      UserId: this.userProfileForm.controls['UserId'].value,
      Profile: this.userProfileForm.controls['Profile'].value,
    }
     this.submitted = true; 
     if (this.userProfileForm.invalid) {
      this.submitted = true;
      this.loaderflag = false;
      return ;
    }
    if (this.userProfileForm.valid) {
        this._manageUserService.SaveAdminUserService(model).subscribe((response:any)=>{
        if(response.statusCode == 200){
          this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.loaderflag=false;
          this.router.navigate(["/Dashboard"]);
         }
       })    
    }
  }

    // Method for browse file attachment---
    onAttachment(file?: any): any {
     const formData = new FormData();
     this.attachment = file;
     console.log(file.target.files[0])
     if (file.target.files[0] ) {
      formData.append('Image', file.target.files[0]);
      formData.append('ProfileLink', 'Profile');            
        this._uploadImageService.UploadAdminProfileService(formData).subscribe((profilePath:any) => {
        this.imageSrc=   this.createImgPath(profilePath.data);
        this.userProfileForm.controls['Profile'].setValue(this.imageSrc);
      })
     }
   }

   createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };

  resetFileUploader() { 
    this.imageSrc='';
  }


}
