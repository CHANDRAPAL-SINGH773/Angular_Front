import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddReferralService } from '../../../Services/addReferralService/add-referral.service'
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from 'src/app/Shared/data-sharing.service';
import { UploadImageServiceService } from 'src/app/Shared/uploadImage/upload-image-service.service';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Platform/Model/DialogModel';
import { DatePipe } from '@angular/common';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/Shared/custom.validator';

@Component({ 
  encapsulation: ViewEncapsulation.None,
  selector: 'app-add-edit-referrals',
  templateUrl: './add-edit-referrals.component.html',
  styleUrls: ['./add-edit-referrals.component.css'],
})

export class AddEditReferralsComponent implements OnInit {
  addReferralform!: FormGroup;
  fileUPloadForm!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  userType: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  countryList:any;
  stateList:any;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  loaderflag:boolean = false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  public _imageUrl: string = '';
  html = function(id: string) { return document.getElementById(id); };
  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;

  constructor(private _getAllMasterService: GetAllMasterService,
    private router: Router,
    private fb: FormBuilder,
    private _addreferralService: AddReferralService,
    private _toasterService: ToastrService,
    private _dataSharingService: DataSharingService,
    private route: ActivatedRoute,
    private _UploadImageService : UploadImageServiceService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.loaderflag=true;
    this.userid = this.authService.userID;
    this.GetCountry();
    this.GetState();
    this.CreateFormGroup();
    this._dataSharingService.changeHeader("Manage Referrals")
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    this.getReferralData(this.id);}
    this.loaderflag=false;
  }

    //Method for get country master--
    GetCountry(){
      this._getAllMasterService.GetCountryMaster().subscribe((response:any)=>{
       this.countryList = response.data;
       this.countryList.unshift({CountryName: "Please Select", CountryId: ""});
      })
    } 
       //Method for get State master--
    GetState(){
        this._getAllMasterService.GetStateMaster().subscribe((response:any)=>{
        this.stateList = response.data;
        this.stateList.unshift({StateName: "Please Select", StateId: ""});
        })
    } 
 
  CreateFormGroup(): void {
    this.addReferralform = new FormGroup({
      BuisnessName: new FormControl()
     });
      this.addReferralform = this.fb.group({     
      BuisnessName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CPFirstName:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CPLastName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      BuisnessEmail: ["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      BuisnessContactNo: new FormControl("", Validators.required),
      AlternateBuisnessContactNo: new FormControl("", Validators.required),
      BuisnessAddress: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Logo:new FormControl(""),
      ReferralCity: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ReferralZipCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ReferralState: new FormControl("",[Validators.required]),
      ReferralCountry: new FormControl("",[Validators.required,]),

      FirstName:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      LastName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Email:  ["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      Phone: new FormControl("",Validators.required),
      Address:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      City: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ZIPCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      State: new FormControl("0",[Validators.required]),
      Country: new FormControl("0",[Validators.required,]),
      UserName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Password:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ConfirmPassword:["",[Validators.required]],
      UserType : 5,
      ReferralId:new FormControl(""),
      UserId:new FormControl(""),
    })
  }

  get formControls() { return this.addReferralform.controls; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
  
 //method for Add new Referral --
  saveReferral(): any {
  // debugger;
  this.loaderflag=true;
  let password = this.addReferralform.controls['Password'].value;
  let confirmPassWord = this.addReferralform.controls['ConfirmPassword'].value;
  if(password != confirmPassWord){
    this._toasterService.error(CommonErrorMessages.PasswordMismatch, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
    this.loaderflag=false;
    return;
  }
  const model ={
                BuisnessName: this.addReferralform.controls['BuisnessName'].value,
                CPFirstName: this.addReferralform.controls['CPFirstName'].value,
                CPLastName: this.addReferralform.controls['CPLastName'].value,
                BuisnessEmail:this.addReferralform.controls['BuisnessEmail'].value,
                BuisnessContactNo: this.addReferralform.controls['BuisnessContactNo'].value,
                AlternateBuisnessContactNo: this.addReferralform.controls['AlternateBuisnessContactNo'].value,
                BuisnessAddress: this.addReferralform.controls['BuisnessAddress'].value,
                Logo: this.addReferralform.controls['Logo'].value,
                ReferralCountry: Number(this.addReferralform.controls['ReferralCountry'].value),
                ReferralState: Number(this.addReferralform.controls['ReferralState'].value),
                ReferralCity: this.addReferralform.controls['ReferralCity'].value,
                ReferralZipCode: this.addReferralform.controls['ReferralZipCode'].value,

                FirstName: this.addReferralform.controls['FirstName'].value,
                LastName: this.addReferralform.controls['LastName'].value,
                Email: this.addReferralform.controls['Email'].value,
                Phone: this.addReferralform.controls['Phone'].value,
                Address: this.addReferralform.controls['Address'].value,
                Country: Number(this.addReferralform.controls['Country'].value),
                State: Number(this.addReferralform.controls['State'].value),
                City: this.addReferralform.controls['City'].value,
                ZIPCode: this.addReferralform.controls['ZIPCode'].value,
                UserName: this.addReferralform.controls['UserName'].value,
                Password: this.addReferralform.controls['Password'].value,
                ConfirmPassword: this.addReferralform.controls['ConfirmPassword'].value,
                UserType: 5,
                UserId:this.userid,
  }
   this.submitted = true; 
   if (this.addReferralform.invalid) {
    this.submitted = true;
    this.loaderflag = false;
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
    return ;
  }
  if (this.addReferralform.valid) {
    this._addreferralService.SaveReferralService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        if(response.data!=null){
          this.addReferralform.controls['ReferralId'].setValue(response.data);       
          this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
          });
          //this.router.navigate(["/Dashboard/ManageAgencies"]);  
          this.loaderflag = false;                   
          this.Addbuttonflag = false;
          this.UpdateButtonflag = true;
        }
          else{
            this._toasterService.error(""+response.message+"", "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
            }); 
            this.loaderflag = false;
          }
        }
    })
  }
}

     //method for get Referral Details --
     getReferralData(id : number):void {
   // debugger;
    let data:any ; 
    this._addreferralService.GetReferralData(id).subscribe((response:any) => {
          if(response.data != "") {
           this.Addbuttonflag= false;
           this.UpdateButtonflag= true;
            // this.getStateDropList(data.result.countryId) 
           this.addReferralform.controls['BuisnessName'].setValue(response.data[0].BuisnessName);
           this.addReferralform.controls['CPFirstName'].setValue(response.data[0].CPFirstName);
           this.addReferralform.controls['CPLastName'].setValue(response.data[0].CPLastName);
           this.addReferralform.controls['BuisnessEmail'].setValue(response.data[0].BuisnessEmail);
           this.imageSrc = response.data[0].Logo;
           this.addReferralform.controls['BuisnessContactNo'].setValue(response.data[0].BuisnessContactNo);
           this.addReferralform.controls['AlternateBuisnessContactNo'].setValue(response.data[0].AlternateBuisnessContactNo);
           this.addReferralform.controls['BuisnessAddress'].setValue(response.data[0].BuisnessAddress);
           this.addReferralform.controls['Logo'].setValue(response.data[0].Logo);
           this.addReferralform.controls['ReferralCountry'].setValue(response.data[0].ReferralCountry);
           this.addReferralform.controls['ReferralState'].setValue(response.data[0].ReferralState);
           this.addReferralform.controls['ReferralCity'].setValue(response.data[0].ReferralCity);
           this.addReferralform.controls['ReferralZipCode'].setValue(response.data[0].ReferralZipCode);

           this.addReferralform.controls['FirstName'].setValue(response.data[0].AdminFirstName);
           this.addReferralform.controls['LastName'].setValue(response.data[0].AdmainLastName);
           this.addReferralform.controls['Email'].setValue(response.data[0].AdminEmail);
           this.addReferralform.controls['Phone'].setValue(response.data[0].AdminPhone);
           this.addReferralform.controls['Address'].setValue(response.data[0].AdminAddress);
           this.addReferralform.controls['Country'].setValue(response.data[0].AdminCountry);
           this.addReferralform.controls['State'].setValue(response.data[0].AdmainState);
           this.addReferralform.controls['City'].setValue(response.data[0].AdminCity);
           this.addReferralform.controls['ZIPCode'].setValue(response.data[0].AdminZipCode);
           this.addReferralform.controls['UserName'].setValue(response.data[0].AdminuserName);
           this.addReferralform.controls['Password'].setValue(response.data[0].AdminPassword);
           this.addReferralform.controls['ConfirmPassword'].setValue(response.data[0].AdminPassword);
         
           this.addReferralform.controls['UserId'].setValue(response.data[0].UserId);
           this.addReferralform.controls['ReferralId'].setValue(response.data[0].ReferralId);
           this.imageSrc =   data.result.oldLogo;
          }
        })
      }

      // Method For Update Referral Details --
      UpdateReferral(): any{
        this.loaderflag = true;
        let password = this.addReferralform.controls['Password'].value;
        let confirmPassWord = this.addReferralform.controls['ConfirmPassword'].value;
        if(password != confirmPassWord){
          this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
            this.loaderflag = false;
            return;
           }       
         const model ={                    
                BuisnessName: this.addReferralform.controls['BuisnessName'].value,
                CPFirstName: this.addReferralform.controls['CPFirstName'].value,
                CPLastName: this.addReferralform.controls['CPLastName'].value,
                BuisnessEmail:this.addReferralform.controls['BuisnessEmail'].value,
                BuisnessContactNo: this.addReferralform.controls['BuisnessContactNo'].value,
                AlternateBuisnessContactNo: this.addReferralform.controls['AlternateBuisnessContactNo'].value,
                BuisnessAddress: this.addReferralform.controls['BuisnessAddress'].value,
                Logo: this.addReferralform.controls['Logo'].value,
                ReferralCountry: Number(this.addReferralform.controls['ReferralCountry'].value),
                ReferralState: Number(this.addReferralform.controls['ReferralState'].value),
                ReferralCity: this.addReferralform.controls['ReferralCity'].value,
                ReferralZipCode: this.addReferralform.controls['ReferralZipCode'].value,

                FirstName: this.addReferralform.controls['FirstName'].value,
                LastName: this.addReferralform.controls['LastName'].value,
                Email: this.addReferralform.controls['Email'].value,
                Phone: this.addReferralform.controls['Phone'].value,
                Address: this.addReferralform.controls['Address'].value,
                Country: Number(this.addReferralform.controls['Country'].value),
                State: Number(this.addReferralform.controls['State'].value),
                City: this.addReferralform.controls['City'].value,
                ZIPCode: this.addReferralform.controls['ZIPCode'].value,
                UserName: this.addReferralform.controls['UserName'].value,
                Password: this.addReferralform.controls['Password'].value,
                ConfirmPassword: this.addReferralform.controls['ConfirmPassword'].value,
                UserType: 5,
                ReferralId: this.addReferralform.controls['ReferralId'].value,
                UserId:this.userid,
      }
         this.submitted = true; 
         if (this.addReferralform.invalid) {
          this.submitted = true;
          this.loaderflag = false;
          return ;
        }
        if (this.addReferralform.valid) {
          this._addreferralService.UpdateReferralService(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            if(response.data!=null){
            this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
            });   
            this.loaderflag = false;        
            this.router.navigate(["/Dashboard/ManageReferrals"]);
            }
            else{
              this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
              }); 
              this.loaderflag = false;
            }
           }
          })
        }
      }

      // Send Invitation Email for  user--
      sendInvitation(): any { 
        this.loaderflag = true;
        let ReferralId = this.addReferralform.controls['ReferralId'].value;
        if(ReferralId != null && ReferralId != undefined && ReferralId != 0){
          this._addreferralService.SendInviteReferralService(ReferralId).subscribe((response:any) => {
            if(response.statusCode == 200){
              if(response.data!=null){
              this._toasterService.success(CommonSuccessMessages.InviteSend, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
              });   
              this.loaderflag = false;        
              this.router.navigate(["/Dashboard/ManageReferrals"]);
              }
              else{
                this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                  timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
                }); 
                this.loaderflag = false;
              }
             }
          });
        }
        else{
          this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
          }); 
          this.loaderflag = false;
        }
      }

     //Method is used for next and previous button click--
      nextPreviousButtonWorking(flag:any){
      let BuisnessName = this.addReferralform.controls['BuisnessName'].value
      let CPFirstName = this.addReferralform.controls['CPFirstName'].value
      let CPLastName = this.addReferralform.controls['CPLastName'].value
      let BuisnessEmail= this.addReferralform.controls['BuisnessEmail'].value
      let BuisnessContactNo = this.addReferralform.controls['BuisnessContactNo'].value
      let  BuisnessAddress = this.addReferralform.controls['BuisnessAddress'].value
      let  ReferralCity=  this.addReferralform.controls['ReferralCity'].value
      let ReferralZipCode= this.addReferralform.controls['ReferralZipCode'].value
      if(BuisnessName != '' && CPFirstName != '' && CPLastName != '' && BuisnessEmail!= '' && BuisnessContactNo!='' && BuisnessAddress!= '' && ReferralCity!= '' && ReferralZipCode != ''){
        
      if(flag =='next'){
        let btn = (<HTMLInputElement>document.getElementById("v-pills-two-tab"));
        btn.click();
         }
      else{
         let btn = (<HTMLInputElement>document.getElementById("v-pills-one-tab"));
         btn.click();
         }
      }
      else{        
      }
      }

      // Method for browse file attachment---
      onAttachment(file?: any): any {
        const formData = new FormData();
        this.attachment = file;
        console.log(file.target.files[0])
        if(file.target.files[0].type == 'image/jpeg' || file.target.files[0].type =='image/png' || file.target.files[0].type =='image/svg' || file.target.files[0].type =='image/jpg'){
          if(file.target.files[0].size <= 1000000){
            if (file.target.files[0] ) {
              formData.append('Image', file.target.files[0]);
              formData.append('ProfileLink', 'ReferralProfiles');
              
              this._UploadImageService.UploadProfileService(formData).subscribe((profilePath:any) => {
                this.imageSrc=   this.createImgPath(profilePath.data.value);
                this.addReferralform.controls['Logo'].setValue(this.imageSrc);
              })
            }
          }
          else{
            this._toasterService.error(CommonErrorMessages.fileSize, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
          }
      
      }
      else{
        this._toasterService.error(CommonErrorMessages.invalidFormat, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
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

