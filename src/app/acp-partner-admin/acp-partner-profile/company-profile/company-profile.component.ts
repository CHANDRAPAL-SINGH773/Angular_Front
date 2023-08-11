import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { CommonService } from 'src/app/lib/Models/Common/common.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  isSubmitted = false;
  submitted!: boolean;
  IsAcpPartnerPage: boolean = true;
  loaderflag: boolean = false;
  matStartDate: Date;
  matEndDate: Date;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  hide: boolean = false;
  totalCount: number = 0;
  Search:{PageSize:2};
  Mode: string;
  CompanyProfileForm:FormGroup;
  companyProfile:any;
  statesList:any;
  countryList:any;
  states:any;
  displayedColumns = [
    
  ];
  constructor(
    public commonService: CommonService,
    private fb: FormBuilder,
    private localstorage:LocalStorageService
  ) { }

  ngOnInit(): void {
    this.CompanyProfileForm=this.fb.group({
      Name:new FormControl(''),
      Type:new FormControl(''),
      Email:new FormControl(''),
      MobileNumber:new FormControl(''),
      AddressLine1 :new FormControl(''),
      AddressLine2:new FormControl(''),
      Country:new FormControl(''),
      State:new FormControl(''),
      City:new FormControl(''),
      PostCode:new FormControl(''),
      WebsiteURL:new FormControl(''),
      ABNorACN:new FormControl(''),
      Description:new FormControl(''),
      OrganizationName:new FormControl(''),
      OrgDateOfAcredation:new FormControl(''),
      AcredationID:new FormControl(''),
      // AcredationID:new FormControl(''),
      SchemaAcredationID:new FormControl(''),
      Theme:new FormControl('')
    })
    this.getCountries()
    this.GetCompanyDetailByID()
  }
  getCountries(){
    this.commonService.getCountries().subscribe((response:any)=>{
      this.countryList= response.data.responseData;
  })}
  // getStates(id:any){
  //   this.commonService.getStates(id).subscribe((response:any)=>{
  //     this.statesList= response.data.responseData;

  // })}
  GetCompanyDetailByID(){
    
      let companyID= this.localstorage.getCompanyID()
      debugger
    
    this.commonService.GetCompanyDetailByID(companyID).subscribe((response:any)=>{
      // this.getStates(response.responseData.country)
       this.updateFormDetails(response.responseData[0]);
  } )}
  updateFormDetails(data: any) {
    this.CompanyProfileForm.patchValue({
      Name:data.c_Name,
      Type:data.c_TypeName,
      Email:data.c_EmailID
      ,
      MobileNumber:data.c_MobileNo,
      AddressLine1 :data.c_Address1,
      AddressLine2:data.c_Address2,
      Country:data.countryName,
      State:data.stateName,
      City:data.city,
      PostCode:data.postalCode,
      WebsiteURL:data.webUrl,
      ABNorACN:data.abN_ACN,
      Description:data.desc,
      // OrganizationName:data.,
      OrgDateOfAcredation:data.acredationDate,
      AcredationID:data.acredationId,
      // AcredationID:new FormControl(''),
      SchemaAcredationID:data.schemaCredationalId,
      Theme:data.themeName
    })
    this.CompanyProfileForm.disable()
  }
  CreateFormGroup() {}
  onKeyUp(event: any) {

  }
  filltercompanyProfile(){}
  profileCompany(){}
  nextPage(event: any){}
  onCountryChange(event: any){}
  onStateChange(event: any){}
  convert() {}
  onSubmit(){}
}
