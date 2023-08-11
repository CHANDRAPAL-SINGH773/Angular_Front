import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FileSize } from 'src/app/Shared/Enums/file-size.enum';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { SignUpService } from 'src/app/auth/Logins/Services/SignUpService/sign-up.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PlatformAdminServiceService } from '../platform-admin-service.service';

@Component({
  selector: 'app-registrationmodal',
  templateUrl: './registrationmodal.component.html',
  styleUrls: ['./registrationmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationmodalComponent implements OnInit {
  CompanyImage: string = 'assets/images/profile-icon.svg';
  loaderflag: boolean = false;
  attachment: File;
  countries: any = [];
  states: any = [];
  isEdit = false
  selectedCountry: number = 0
  selectedState: number = 0;
  userId: any
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  comRegisterForm: FormGroup;
  formHeading: string = "Add Company"
  constructor(
    private fb: FormBuilder, private coommonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RegistrationmodalComponent>,
    private _toasterService: ToastrService,
    private _signUpService: SignUpService,
    private localstorage: LocalStorageService,
    private platformAdmin: PlatformAdminServiceService

  ) { }

  ngOnInit(): void {
    this.userId = Number(this.localstorage.getUserId());
    console.log("Data From Child", this.data)
    if (this.data.element) {
      this.EditForm();
      this.getAllCountry();
      this.formHeading = "Edit Company"
      this.isEdit = true
      this.GetCompanyDetailById(this.data.element.c_ID);

    }
    else {
      this.CreateForm()
      this.getAllCountry();
    }

  }

  CreateForm() {
    this.comRegisterForm = this.fb.group({
      CompanyName: new FormControl("", Validators.required),
      ABN_ACN: new FormControl("", Validators.required),
      WebURL: new FormControl(""),
      MobileNumber: new FormControl(""),
      EmailID: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*')]),
      UserName: new FormControl("", Validators.required),
      Password: new FormControl("", Validators.required),
      ConPassword: new FormControl("", Validators.required),
      Address1: new FormControl(""),
      Address2: new FormControl(""),
      CountryID: new FormControl("", Validators.required),
      StateID: new FormControl("", Validators.required),
      City: new FormControl(""),
      PostalCode: new FormControl(""),
    });
  }
  EditForm() {
    this.comRegisterForm = this.fb.group({
      CompanyName: new FormControl("", Validators.required),
      ABN_ACN: new FormControl("",Validators.required),
      WebURL: new FormControl(""),
      MobileNumber: new FormControl(""),
      EmailID: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*')]),
      Address1: new FormControl(""),
      Address2: new FormControl(""),
      CountryID: new FormControl("", Validators.required),
      StateID: new FormControl("", Validators.required),
      City: new FormControl(""),
      PostalCode: new FormControl(""),
    });
  }

  getAllCountry() {

    this.coommonService.getCountries().subscribe((res: any) => {
      if (res.data.responseData) {
        this.countries = res.data.responseData
      }
      else {
        this.countries = [];
      }
    })
  }

  onAttachment(file: any): any {
    const extension = file.srcElement.files[0].name.substring(
      file.srcElement.files[0].name.lastIndexOf('.') + 1
    );
    if (this.checkSupportedFileFormats(extension)) {
      this.attachment = file.srcElement.files[0];
      if (this.attachment.size > FileSize.DefaultFileSize) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'File size is greater then defined size!',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        const formData = new FormData();
        this.attachment = file;
        if (file.target.files[0]) {
          formData.append('Image', file.target.files[0]);
          formData.append('ProfileLink', 'StaffProfileImg');
          this.coommonService
            .UploadProfileService(formData)
            .subscribe((profilePath: any) => {
              debugger;
              this.CompanyImage = profilePath.responseData;
            });
        }
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Allow only JPG, PNG, GIF!',
        showConfirmButton: false,
        timer: 1500
      })
    }

  }
  checkSupportedFileFormats(type: string): boolean {
    const supportedFileFormats: string[] = ['png', 'jpeg', 'jpg', 'gif'];
    if (supportedFileFormats.includes(type.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }
  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };
  OnCountryChange(Country: any) {
    this.selectedCountry = Country.value;
    if (Country.value > 0) {
      this.getStateByCountryId(Country.value);
    }
  }
  getStateByCountryId(CountryId: number) {
    this.coommonService.getStates(CountryId).subscribe((res: any) => {
      if (res.data.statusCode == 200) {
        this.states = res.data.responseData
        console.log("states", this.states);
      }
      else {
        this.states = [];
      }
    })
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  checkIsValidPassword() {
    if (this.comRegisterForm.controls['Password'].value != this.comRegisterForm.controls['ConPassword'].value) {
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error(CommonErrorMessages.PasswordMismatch, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
  }
  SignUp() {
    this.loaderflag = true;
    if (this.comRegisterForm.valid && this.comRegisterForm.controls['Password'].value === this.comRegisterForm.controls['ConPassword'].value) {
      const params = {
        CompanyName: this.comRegisterForm.controls['CompanyName'].value,
        ABN_ACN: this.comRegisterForm.controls['ABN_ACN'].value != "" ? this.comRegisterForm.controls['ABN_ACN'].value : null,
        WebURL: this.comRegisterForm.controls['WebURL'].value != "" ? this.comRegisterForm.controls['WebURL'].value : null,
        MobileNumber: this.comRegisterForm.controls['MobileNumber'].value != "" ? this.comRegisterForm.controls['MobileNumber'].value : null,
        EmailID: this.comRegisterForm.controls['EmailID'].value,
        UserName: this.comRegisterForm.controls['UserName'].value,
        Password: this.comRegisterForm.controls['Password'].value,
        Address1: this.comRegisterForm.controls['Address1'].value != "" ? this.comRegisterForm.controls['Address1'].value : null,
        Address2: this.comRegisterForm.controls['Address2'].value != "" ? this.comRegisterForm.controls['Address2'].value : null,
        CountryID: this.comRegisterForm.controls['CountryID'].value != "" ? this.comRegisterForm.controls['CountryID'].value : null,
        StateID: this.comRegisterForm.controls['StateID'].value != "" ? this.comRegisterForm.controls['StateID'].value : null,
        City: this.comRegisterForm.controls['City'].value != "" ? this.comRegisterForm.controls['City'].value : null,
        PostalCode: this.comRegisterForm.controls['PostalCode'].value != "" ? this.comRegisterForm.controls['PostalCode'].value : null,
        // file:this.file,
        ProfieImgUrl: this.CompanyImage,
        CurrentUsr: this.userId
      }
      this._signUpService.SignUpService(params).subscribe((response: any) => {
        if (response.statusCode == '200') {

          this.loaderflag = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 2200,

          });
          this.closeDialog('close');
          return;


        }
        else {
          this.loaderflag = false;
          this.loaderflag = false;
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: response.message,
            showConfirmButton: false,
            timer: 2200,

          });
          this.closeDialog('close');
          return;
        }
      })
    }
    else {
      this.loaderflag = false;
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error(CommonErrorMessages.FillMendatoryFields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
  }
  closeDialog(action: string): void {
    this.dialogRef.close(action);
  }
  GetCompanyDetailById(companyId: any) {
    this.coommonService.GetCompanyDetailByID(companyId).subscribe((response: any) => {
      if (response.statusCode == 200) {

        console.log("All Company Details", response)
        this.CompanyImage = response.responseData[0].profieImgUrl
        if (response.responseData[0].countryID > 0) {
          this.getStateByCountryId(response.responseData[0].countryID);
        }
        this.comRegisterForm.patchValue({
          CompanyName: response.responseData[0].c_Name,
          ABN_ACN: response.responseData[0].abN_ACN,
          WebURL: response.responseData[0].webUrl,
          MobileNumber: response.responseData[0].c_MobileNo,
          EmailID: response.responseData[0].c_EmailID,
          Address1: response.responseData[0].c_Address1,
          Address2: response.responseData[0].c_Address2,
          CountryID: response.responseData[0].countryID,
          StateID: response.responseData[0].stateId,
          City: response.responseData[0].city,
          PostalCode: response.responseData[0].postalCode,
        })
        this.CompanyImage = response.responseData[0].profieImgUrl

      }
      else {

      }
    })
  }
  EditCompany() {
    this.loaderflag = true;
    const params = {
      CompanyName: this.comRegisterForm.controls['CompanyName'].value,
      ABN_ACN: this.comRegisterForm.controls['ABN_ACN'].value != "" ? this.comRegisterForm.controls['ABN_ACN'].value : null,
      WebURL: this.comRegisterForm.controls['WebURL'].value != "" ? this.comRegisterForm.controls['WebURL'].value : null,
      MobileNumber: this.comRegisterForm.controls['MobileNumber'].value != "" ? this.comRegisterForm.controls['MobileNumber'].value : null,
      EmailID: this.comRegisterForm.controls['EmailID'].value,
      Address1: this.comRegisterForm.controls['Address1'].value != "" ? this.comRegisterForm.controls['Address1'].value : null,
      Address2: this.comRegisterForm.controls['Address2'].value != "" ? this.comRegisterForm.controls['Address2'].value : null,
      CountryID: this.comRegisterForm.controls['CountryID'].value != "" ? this.comRegisterForm.controls['CountryID'].value : null,
      StateID: this.comRegisterForm.controls['StateID'].value != "" ? this.comRegisterForm.controls['StateID'].value : null,
      City: this.comRegisterForm.controls['City'].value != "" ? this.comRegisterForm.controls['City'].value : null,
      PostalCode: this.comRegisterForm.controls['PostalCode'].value != "" ? this.comRegisterForm.controls['PostalCode'].value : null,
      ProfieImgUrl: this.CompanyImage,
      CurrentUsr: this.userId,
      UserId: this.data.element.companyUser.userId,
      CompanyID:this.data.element.c_ID
    }
    this.platformAdmin.UpdateCompany(params).subscribe((response: any) => {
      if (response.statusCode == '200') {
        this.loaderflag = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,

        });
        this.closeDialog('close');
        return;


      }
      else {
        this.loaderflag = false;
        this.loaderflag = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,

        });
        this.closeDialog('close');
        return;
      }
    })

  }
}
