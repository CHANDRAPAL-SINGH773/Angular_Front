import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { AddAgencyService} from '../../../Services/addAgencyService/add-agency.service';
import { DataSharingService} from '../../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import Swal from 'sweetalert2';
import { SeverityType } from 'src/app/core/messaging/severity-type.enum';
import { CustomValidators } from 'src/app/Shared/custom.validator';

@Component({
  selector: 'app-add-edit-agency',
  templateUrl: './add-edit-agency.component.html',
  styleUrls: ['./add-edit-agency.component.css']
})
export class AddEditAgencyComponent implements OnInit {
  addAgencyform!: FormGroup;
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
  countryList:any;
  stateList:any;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;

   public _imageUrl: string = '';
   constructor(
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _AddAgencyService : AddAgencyService,
    private _dataSharingService:DataSharingService,
    private _UploadImageService : UploadImageServiceService,
    private _getAllMasterService :GetAllMasterService) { }

  ngOnInit(): void {
    this.GetCountry();
    this.GetState();
    this.CreateFormGroup();

    this._dataSharingService.changeHeader("Manage Agencies")
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    this.getAgencyData(this.id);}
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }

    //Method for get country master--
    GetCountry(){
      this._getAllMasterService.GetCountryMaster().subscribe((response:any)=>{
       this.countryList = response.data;
      })
    } 
       //Method for get State master--
       GetState(){
        this._getAllMasterService.GetStateMaster().subscribe((response:any)=>{
        this.stateList = response.data;
        })
        } 
 
  CreateFormGroup(): void {
    this.addAgencyform = this.fb.group({  
     
      BusinessName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AgencyPersonFirstName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AgencyPersonLastName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      // SelectedClient: new FormControl(0,[Validators.required]),
      AgencyEmail: ["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      AgencyPhone: new FormControl("", Validators.required),
      // AgencyAddress: new FormControl("", Validators.required),
      AgencyBusinessAddress: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AgencyLogo:new FormControl(""),
      AgencyCity: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AgencyZIPCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      AgencyState: new FormControl(undefined,[Validators.required]),
      AgencyCountry: new FormControl(undefined,[Validators.required,]),

      FirstName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      LastName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Email:["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      Phone: new FormControl("",Validators.required),
      Address: new FormControl("",Validators.required),
      City: new FormControl("",Validators.required),
      ZIPCode: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      State: new FormControl(undefined,[Validators.required]),
      Country: new FormControl(undefined,[Validators.required,]),
      UserName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Password:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ConfirmPassword:["",[Validators.required]],
      UserType : 3,
      AgencyId:new FormControl(""),
      UserId:new FormControl(""),
    })
}
// success(){
//   Swal.fire({
//     html: '<div class="common-wrap"> <div class="icon-wrap"><img src="../../../../assets/images/tick-icon.svg"></div> <div class="text-wrap"><h4>Success</h4> <p>Agency added successfully!</p></div> </div>',
//     customClass: "custom-swal success",
//     showCloseButton: true,
//     showConfirmButton: false,
//   });
// }
// error(msg:any){

//   Swal.fire({
//     html: '<div class="common-wrap"> <div class="icon-wrap"><img src="../../../../assets/images/info-icon.svg"></div> <div class="text-wrap"><h4>Error</h4> <p>'+msg+'</p></div> </div>',
//     customClass: "custom-swal error",
//     showCloseButton: true,
//     showConfirmButton: false,
//   });
// }
// Update(){
//   Swal.fire({
//     html: '<div class="common-wrap"> <div class="icon-wrap"><img src="../../../../assets/images/tick-icon.svg"></div> <div class="text-wrap"><h4>Success</h4> <p>Agency updated successfully!</p></div> </div>',
//     customClass: "custom-swal success",
//     showCloseButton: true,
//     showConfirmButton: false,
//   });
// }

get formControls() { return this.addAgencyform.controls; }
//method for Add new Agency --
saveAgency(): any {
  // debugger;

  let password = this.addAgencyform.controls['Password'].value;
  let confirmPassWord = this.addAgencyform.controls['ConfirmPassword'].value;
  if(password != confirmPassWord){
    // this._toasterService.error(CommonErrorMessages.PasswordMismatch);
    return;
  }
  const model ={
                // SelectedClient: Number(this.addAgencyform.controls['SelectedClient'].value),
                BusinessName: this.addAgencyform.controls['BusinessName'].value,
                AgencyPersonFirstName: this.addAgencyform.controls['AgencyPersonFirstName'].value,
                AgencyPersonLastName: this.addAgencyform.controls['AgencyPersonLastName'].value,
                AgencyEmail:this.addAgencyform.controls['AgencyEmail'].value,
                AgencyPhone: this.addAgencyform.controls['AgencyPhone'].value,
                // AgencyAddress: this.addAgencyform.controls['AgencyAddress'].value,
                AgencyBusinessAddress: this.addAgencyform.controls['AgencyBusinessAddress'].value,
                AgencyLogo: this.addAgencyform.controls['AgencyLogo'].value,
                AgencyCountry: Number(this.addAgencyform.controls['AgencyCountry'].value),
                AgencyState: Number(this.addAgencyform.controls['AgencyState'].value),
                AgencyCity: this.addAgencyform.controls['AgencyCity'].value,
                AgencyZIPCode: this.addAgencyform.controls['AgencyZIPCode'].value,


                FirstName: this.addAgencyform.controls['FirstName'].value,
                LastName: this.addAgencyform.controls['LastName'].value,
                Email: this.addAgencyform.controls['Email'].value,
                Phone: this.addAgencyform.controls['Phone'].value,
                Address: this.addAgencyform.controls['Address'].value,
                Country: Number(this.addAgencyform.controls['Country'].value),
                State: Number(this.addAgencyform.controls['State'].value),
                City: this.addAgencyform.controls['City'].value,
                ZIPCode: this.addAgencyform.controls['ZIPCode'].value,
                UserName: this.addAgencyform.controls['UserName'].value,
                Password: this.addAgencyform.controls['Password'].value,
                ConfirmPassword: this.addAgencyform.controls['ConfirmPassword'].value,
                UserType: 3,

}
   this.submitted = true; 
   if (this.addAgencyform.invalid) {
    this.submitted = true;
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
    return ;
  }
  if (this.addAgencyform.valid) {
    this._AddAgencyService.SaveAgencyService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        // this.success();
        this._toasterService.success(CommonSuccessMessages.AgencyAdded, "", {

          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true

        });
        // this._toasterService.success(CommonSuccessMessages.UpdateRecord);
        this.router.navigate(["/Dashboard/ManageAgencies"]);
      }
    })
  }
}
//method for get Agency Details --
getAgencyData(id : number):void {
  // debugger;
  let data:any ; 
  this._AddAgencyService.GetAgencyData(id).subscribe((response:any) => {
            if(response.data != "") {

              this.Addbuttonflag= false;
              this.UpdateButtonflag= true;
            // this.getStateDropList(data.result.countryId) 
           this.addAgencyform.controls['BusinessName'].setValue(response.data[0].AgencyName);
           this.addAgencyform.controls['AgencyPersonFirstName'].setValue(response.data[0].PersonFirstname);
           this.addAgencyform.controls['AgencyPersonLastName'].setValue(response.data[0].PersonLastname);
           this.addAgencyform.controls['AgencyEmail'].setValue(response.data[0].AgencyEmail);
          this.imageSrc = response.data[0].Logo;
           this.addAgencyform.controls['AgencyPhone'].setValue(response.data[0].AgencyPhone);
           this.addAgencyform.controls['AgencyBusinessAddress'].setValue(response.data[0].AgencyBusinessAdress);
           this.addAgencyform.controls['AgencyLogo'].setValue(response.data[0].Logo);
           this.addAgencyform.controls['AgencyCountry'].setValue(response.data[0].AgencyCountry);
           this.addAgencyform.controls['AgencyState'].setValue(response.data[0].AgencyState);
           this.addAgencyform.controls['AgencyCity'].setValue(response.data[0].AgencyCity);
           this.addAgencyform.controls['AgencyZIPCode'].setValue(response.data[0].AgencyZipcode);

           this.addAgencyform.controls['FirstName'].setValue(response.data[0].AdminFirstName);
           this.addAgencyform.controls['LastName'].setValue(response.data[0].AdmainLastName);
           this.addAgencyform.controls['Email'].setValue(response.data[0].AdminEmail);
           this.addAgencyform.controls['Phone'].setValue(response.data[0].AdminPhone);
           this.addAgencyform.controls['Address'].setValue(response.data[0].AdminAddress);
           this.addAgencyform.controls['Country'].setValue(response.data[0].AdminCountry);
           this.addAgencyform.controls['State'].setValue(response.data[0].AdmainState);
           this.addAgencyform.controls['City'].setValue(response.data[0].AdminCity);
           this.addAgencyform.controls['ZIPCode'].setValue(response.data[0].AdminZipCode);
           this.addAgencyform.controls['UserName'].setValue(response.data[0].AdminuserName);
           this.addAgencyform.controls['Password'].setValue(response.data[0].AdminPassword);
           this.addAgencyform.controls['ConfirmPassword'].setValue(response.data[0].AdminPassword);

          
           this.addAgencyform.controls['UserId'].setValue(response.data[0].UserId);
           this.addAgencyform.controls['AgencyId'].setValue(response.data[0].AgencyId);
           this.imageSrc =   data.result.oldLogo;
          }
        })
      }
      // Method For Update Agency Details --
      UpdateAgency(): any{
        debugger;

        let password = this.addAgencyform.controls['Password'].value;
        let confirmPassWord = this.addAgencyform.controls['ConfirmPassword'].value;
        if(password != confirmPassWord){
          this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
          return;
        }
        
        const model ={
                     // SelectedClient: Number(this.addAgencyform.controls['SelectedClient'].value),
                BusinessName: this.addAgencyform.controls['BusinessName'].value,
                AgencyPersonFirstName: this.addAgencyform.controls['AgencyPersonFirstName'].value,
                AgencyPersonLastName: this.addAgencyform.controls['AgencyPersonLastName'].value,
                AgencyEmail:this.addAgencyform.controls['AgencyEmail'].value,
                AgencyPhone: this.addAgencyform.controls['AgencyPhone'].value,
                // AgencyAddress: this.addAgencyform.controls['AgencyAddress'].value,
                AgencyBusinessAddress: this.addAgencyform.controls['AgencyBusinessAddress'].value,
                AgencyLogo: this.addAgencyform.controls['AgencyLogo'].value,
                AgencyCountry: Number(this.addAgencyform.controls['AgencyCountry'].value),
                AgencyState: Number(this.addAgencyform.controls['AgencyState'].value),
                AgencyCity: this.addAgencyform.controls['AgencyCity'].value,
                AgencyZIPCode: this.addAgencyform.controls['AgencyZIPCode'].value,


                FirstName: this.addAgencyform.controls['FirstName'].value,
                LastName: this.addAgencyform.controls['LastName'].value,
                Email: this.addAgencyform.controls['Email'].value,
                Phone: this.addAgencyform.controls['Phone'].value,
                Address: this.addAgencyform.controls['Address'].value,
                Country: Number(this.addAgencyform.controls['Country'].value),
                State: Number(this.addAgencyform.controls['State'].value),
                City: this.addAgencyform.controls['City'].value,
                ZIPCode: this.addAgencyform.controls['ZIPCode'].value,
                UserName: this.addAgencyform.controls['UserName'].value,
                Password: this.addAgencyform.controls['Password'].value,
                ConfirmPassword: this.addAgencyform.controls['ConfirmPassword'].value,
                UserType: 3,
                AgencyId: this.addAgencyform.controls['AgencyId'].value,
                UserId: this.addAgencyform.controls['UserId'].value,
      }
         this.submitted = true; 
         if (this.addAgencyform.invalid) {
          this.submitted = true;
          return ;
        }
        if (this.addAgencyform.valid) {
          this._AddAgencyService.UpdateAgencyService(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            // this.Update();
            // this._toasterService.success(CommonSuccessMessages.UpdateRecord);
            this._toasterService.success(CommonSuccessMessages.AgencyUpdated, "", {

              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    
            });
            
            this.router.navigate(["/Dashboard/ManageAgencies"]);
          }
          })
        }
      }
      // Send Invitation Email for  user--
      sendInvitation(): any {
        debugger;
      
        let password = this.addAgencyform.controls['password'].value;
        let confirmPassWord = this.addAgencyform.controls['confirmPassword'].value;
        if(password != confirmPassWord){
          this._toasterService.error(CommonErrorMessages.PasswordMismatch);
          return;
        }
        this.addAgencyform.controls['agencyLogo'].setValue(this.fileName);
        let model = this.addAgencyform.value;
        this.submitted = true;
        model.isInvitationSend = true;
        if (this.addAgencyform.invalid) {
          this.submitted = true;
          return ;
        }
        if (this.addAgencyform.valid) {
          this._AddAgencyService.SaveAgencyService(model).subscribe((data:any) => {
            if (data.statusCode === 'OK') {
              if(data.result == -1)
              {
             this._toasterService.warning(CommonSuccessMessages.UserAlreadyExist);
        
              }
              else{
                this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully);
               this.router.navigate(["/Dashboard/ManageAgencies"]);
              }
            } else {
              
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error(CommonErrorMessages.ProcessingError, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
         });


             
            }
          });
        }
      }
      //upload agency profile image--
      Upload():void{
        debugger;
        const formData = new FormData();
        if (this.attachment) {
          formData.set("file", this.attachment, this.attachment.name);
        }
        else{
          return;
        }
      }
      //Method is used for next and previous button click--
    nextPreviousButtonWorking(flag:any){
      let BusinessName = this.addAgencyform.controls['BusinessName'].value
      let AgencyPersonFirstName = this.addAgencyform.controls['AgencyPersonFirstName'].value
      let AgencyPersonLastName = this.addAgencyform.controls['AgencyPersonLastName'].value
      let AgencyEmail= this.addAgencyform.controls['AgencyEmail'].value
      let AgencyPhone = this.addAgencyform.controls['AgencyPhone'].value
      let  AgencyBusinessAddress = this.addAgencyform.controls['AgencyBusinessAddress'].value
      let  AgencyCity=  this.addAgencyform.controls['AgencyCity'].value
      let AgencyZIPCode= this.addAgencyform.controls['AgencyZIPCode'].value
      if(BusinessName != '' && AgencyPersonFirstName != '' && AgencyPersonLastName != '' && AgencyEmail!= '' && AgencyPhone!='' && AgencyBusinessAddress!= '' && AgencyCity!= '' && AgencyZIPCode != ''){
        
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
          formData.append('ProfileLink', 'AgencyProfiles');
          
          this._UploadImageService.UploadProfileService(formData).subscribe((profilePath:any) => {
            this.imageSrc=   this.createImgPath(profilePath.data.value);
            this.addAgencyform.controls['AgencyLogo'].setValue(this.imageSrc);
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

