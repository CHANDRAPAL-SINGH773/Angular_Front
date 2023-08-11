import { Component, OnInit,Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewCompanyComponent implements OnInit {

  CompanyImage: string = 'assets/images/profile-icon.svg';
  loaderflag: boolean = false;
  attachment: File;
  countries: any = [];
  states: any = [];
  selectedCountry: number = 0
  selectedState: number = 0;
  userId: any
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  comRegisterForm: FormGroup;
  constructor(private fb: FormBuilder, private coommonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewCompanyComponent>,
    private localstorage: LocalStorageService) { }

  ngOnInit(): void {
    this.userId = Number(this.localstorage.getUserId());
    console.log("Data From Child", this.data)
    if (this.data.element) {
      this.EditForm();
      this.getAllCountry();
      this.GetCompanyDetailById(this.data.element.c_ID);

    }
  }
  EditForm() {
    this.comRegisterForm = this.fb.group({
      CompanyName: new FormControl(""),
      ABN_ACN: new FormControl(""),
      WebURL: new FormControl(""),
      MobileNumber: new FormControl(""),
      EmailID: new FormControl(""),
      Address1: new FormControl(""),
      Address2: new FormControl(""),
      CountryID: new FormControl(""),
      StateID: new FormControl(""),
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
  GetCompanyDetailById(companyId: any) {
    this.coommonService.GetCompanyDetailByID(companyId).subscribe((response: any) => {
      if (response.statusCode == 200) {
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
        this.comRegisterForm.patchValue({
          CompanyName: '',
          ABN_ACN: '',
          WebURL: '',
          MobileNumber: '',
          EmailID: '',
          Address1: '',
          Address2: '',
          CountryID: '',
          StateID:'',
          City: '',
          PostalCode: '',
        })
      }
    })
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
  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };

}
