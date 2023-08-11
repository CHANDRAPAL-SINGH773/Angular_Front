import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AcpPartmerModel, FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { first } from 'rxjs';
import { ExportToExcelService } from 'src/app/Platform/Services/exportToExcelService/export-to-excel.service';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import Swal from 'sweetalert2';

import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import { FileSize } from 'src/app/Shared/Enums/file-size.enum';

@Component({
  selector: 'app-list-acp-partner',
  templateUrl: './list-acp-partner.component.html',
  styleUrls: ['./list-acp-partner.component.scss']
  //providers: [HeaderComponent]
})
export class ListAcpPartnerComponent implements OnInit {
  
  loader: boolean = false;
  acpPartnerImage: string = 'assets/images/profile-icon.svg';
  isSubmitted = false;
  submitted!: boolean;
  acpPartnerID: number;
  acpPartner:AcpPartmerModel
  acpPartners: any[] = [];
  Search:CommonDropdownModel = { Search: '', Id: 1, PageNumber: 1, PageSize: 10, companyID: 0, acpPartnerID: 0 };
  Mode: string;
  ImageStatus: string;
  metaData: Metadata = new Metadata();
  acpPartnerTypes: any[];
  countries: any[];
  states: any[];
  cities: any[];
  sortDir = 1; //1= 'ASE' -1= DSC
  filterModel: FilterModel = new FilterModel();
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  isDisabled: boolean = true;
  loaderflag: boolean = false;
  recordCount: number = 0;
  hide: boolean = false;
  hide2: boolean = true;
  recordcount: number = 0;
  totalAcpPartner: number;
  forimageurl: any = environment.imageUrl;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  attachment: File;
  totalCount: number = 0;
  IsAddAcpPartner: boolean = false;
  IsViewAcpPartner: boolean = false;
  IsEditAcpPartner: boolean = false;
  IsDeleteAcpPartner: boolean = false;
  moduleKey: string = 'acpPartner';
  IsAcpPartnerPage: boolean = true;
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'acpPartnerName',
    'typeId',
    'name',
    'address',
    'mobileno',
    'email',
    'country',
    'state',
    'city',
    'dateOfReg',
    'isActive'
    ,'action'
  ];
  matStartDate: Date;
  matEndDate: Date;
  filteredList: any[] = [];
  pageChangeEvent(event: any) { }

  constructor(
    private acpPartnerService: AcpPartnerService,
    public datepipe: DatePipe,
    public commonService: CommonService,
    private localStorage: LocalStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private exportToExcelService: ExportToExcelService,
    private formBuilder: FormBuilder,
  ) { }
  @Output() public acpPartnersEvent = new EventEmitter<any>();

  AcpPartnerForm = this.formBuilder.group({
    acpPartnerId: new FormControl(''),
    AcpPartnerName: ['',[Validators.required, CustomValidators.noWhitespaceValidator]],
    AcpPartnerTypeId: new FormControl('', [Validators.required]),
    FirstName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    LastName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    Email: ['', [Validators.email , CustomValidators.noWhitespaceValidator]],
    PhoneNo: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    UserName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    Password: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    Address1: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
    Address2: ['', [CustomValidators.noWhitespaceValidator]],
    CountryID: new FormControl('', [Validators.required]),
    StateID: new FormControl('', [Validators.required]),
    City: new FormControl('', [Validators.required]),
    PostalCode: ['',[Validators.required,CustomValidators.noWhitespaceValidator]],
    ProfieImgUrl: new FormControl(''),
    AcpPartnerUserID:new FormControl('')
  });

  ngOnInit(): void {
    // if (this.roleAndPermission.IsModulePermission(this.moduleKey)) {
    //   this.IsacpPartnerPage = true;
    //   this.IsAddacpPartner = this.roleAndPermission.IsPermission(this.moduleKey, 'ADD_acpPartner');
    //   this.IsViewacpPartner = this.roleAndPermission.IsPermission(this.moduleKey, 'VIEW_acpPartner');
    //   this.IsEditAcpPartner = this.roleAndPermission.IsPermission(this.moduleKey, 'EDIT_acpPartner');
    //   this.IsDeleteAcpPartner = this.roleAndPermission.IsPermission(this.moduleKey, 'DELETE_acpPartner');
      this.Mode = 'Add';
      this.ImageStatus='Empty';
      this.metaData=new Metadata();
      this.commonService.getCountries().subscribe((res: any) => {
        debugger
        if (res != null) {
          this.countries = res.data.responseData;
          this.countries.unshift({
            countryname: 'Select Country',
            countryid: '',
          });
        }
      });
       this.getAcpPartner();
    // }
    // else
    //   this.router.navigate(['/super-admin/dashboard']);
  }
 
  isPasswordNotStrong = (formGroup: FormGroup): any => {
    const password = formGroup.controls['Password']?.errors?.['pattern'];
    if (password)
      return true;
  }
  getacpPartnerType(id: number) {

    return this.acpPartnerTypes.filter((x: any) => x.Id == id && x.FlagId == 2)[0]
      .Label;
  }

  onCountryChange(selectedCountry: any) {
    this.commonService
      .getStates(selectedCountry.value)
      .subscribe((res: any) => {
        debugger
        if (res != null) {
          this.states = res.data.responseData;
          this.states.unshift({ stateName: 'Select State', stateID: '' });
        }
      });
  }

  onStateChange(selectedState: any) {
    debugger
    this.commonService.getCities(selectedState.value).subscribe((res: any) => {
      if (res != null) {
        debugger
        this.cities = res.data.responseData;
        this.cities.unshift({ cityName: 'Select City', cityID: '' });
      }
    });
  }

  onKeyUp(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Search.PageNumber = 1;
    this.Search.Search = filterValue;

    if (filterValue.trim() == "") {
      this.getAcpPartner();
    }
    else {
      this.acpPartnerService
        .searchAcpPartner(this.Search)
        .pipe(first())
        .subscribe((res: any) => {
          if (res.data == null || res.data.length == 0) {
            this.dataSource = new MatTableDataSource<any>();
            this.totalCount = 0;
            this.loaderflag = false;
            this.hide = false;
            this.isDisabled = false;
          }
          else {
            this.acpPartners = res.data;
            this.dataSource = new MatTableDataSource(this.acpPartners);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.totalCount = this.acpPartners[0].Count;

            if (this.totalCount > 0) {
              this.loaderflag = false;
              this.hide = true;
              this.isDisabled = false;
            }
            else {
              this.loaderflag = false;
              this.hide = false;
              this.isDisabled = false;
            }
          }
        });
    }
  }

  getAcpPartner() {
    this.loader = true;
    this.acpPartnerService.searchAcpPartner(this.Search).subscribe((res: any) => {
      debugger
      if (res != null) {
        this.acpPartners = res.responseData.items;
       
      }
      this.totalAcpPartner = res.responseData.totalCount;
      if (res.responseData != null) {
        this.dataSource = new MatTableDataSource(this.acpPartners);
        this.metaData.totalRecords=res.responseData.totalCount;
        this.totalCount=res.responseData.totalCount;
        this.metaData.totalPages=res.responseData.totalPages;
        this.metaData.currentPage=res.responseData.pageNumber;
        this.dataSource.sort = this.sort;
        this.totalAcpPartner = this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
        if (this.totalAcpPartner > 0) {
          this.hide = true;
          this.loader = false;
        }
        else {
          this.hide = false;
          this.loader = false;
        }
      }
    });
  }
  getAcpPartnerNew() {
    debugger
    this.acpPartnerService.searchAcpPartner(this.Search).subscribe((res: any) => {
      debugger
      if (res != null) {
        this.acpPartners = res.responseData.items;
      }
      this.totalAcpPartner = res.responseData.totalCount;
      if (res.responseData != null) {
        this.dataSource = new MatTableDataSource(this.acpPartners);
        this.metaData.totalRecords=res.responseData.totalCount;
        this.totalCount=res.responseData.totalCount;
        this.metaData.totalPages=res.responseData.totalPages;
        this.metaData.currentPage=res.responseData.pageNumber;
        this.dataSource.sort = this.sort;
        this.totalAcpPartner = this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
        if (this.totalAcpPartner > 0) {
          this.hide = true;
        }
        else {
          this.hide = false;
        }
         this.loader = false;
      }
    });
  }
  convert() {
    var doc = new jsPDF();
    var col = ["acpPartner Name", "acpPartner Type", "Phone", "Location", "Address", "Status"];
    var rows: any[] = [];
    let status: string;
    let transaction: string;

    this.acpPartners.forEach(element => {
      var myFormattedDate = moment(element.DateAndTime).format('YYYY-MM-DD');
      element.IsActive == 1 ? (status = "Active") : (status = "Inactive");
      var temp = [element.acpPartnerName, element.acpPartnerType, element.PhoneNumber, element.CountryName, element.Address1, status];
      rows.push(temp);
    });
    doc.setFont('helvetica')
    doc.setFontSize(8)

   // doc.autoTable(col, rows);
    doc.save('acpPartner.pdf');
  }


  onSubmit() {
    debugger
    this.isSubmitted = true;
    if (this.AcpPartnerForm.invalid) {
      this.AcpPartnerForm.markAllAsTouched();
      return;
    }
    if (this.acpPartnerID > 0) {
      this.updateacpPartner(this.AcpPartnerForm.value, this.acpPartnerID);
    } else {
      this.addacpPartner(this.AcpPartnerForm.value, this.acpPartnerID);
    }
    this.getAcpPartner();

  }

  // clear acpPartner form for add new acpPartner --
  newAcpPartner() {
    debugger
    this.AcpPartnerForm.controls['Password'].enable();
    this.Mode = 'Add';
    this.ImageStatus='Empty';
    this.acpPartnerImage = 'assets/images/profile-icon.svg';
    this.acpPartnerID = 0;
    this.AcpPartnerForm.reset();
    this.enableDisableAllControls(true);
    this.AcpPartnerForm.controls['UserName'].enable();
    this.AcpPartnerForm.controls['AcpPartnerTypeId'].setValue('');
    this.AcpPartnerForm.controls['CountryID'].setValue('');
    this.AcpPartnerForm.controls['StateID'].setValue('');
    this.AcpPartnerForm.controls['City'].setValue('');
  }

  //Method is used for add acpPartner --
  addacpPartner(dataObj: any, acpPartnerID: number) {
    dataObj.CompanyID = this.localStorage.getCompanyID();
    dataObj.acpPartner_id = this.localStorage.getAcpPartnerID();
    dataObj.AcpPartnerID = acpPartnerID;
    dataObj.UserId = this.localStorage.getUserId();
    this.loader = true;
    this.acpPartnerService.saveAcpPartner(dataObj).subscribe((response: any) => {
      debugger
    //  this.loader = false;
      if (response != null) {
        if (response.statusCode === 200) {
          
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Acp/Partner saved successfully! ',
            showConfirmButton: false,
            timer: 2000,
          });
          let btn = <HTMLInputElement>document.getElementById('closeModal');
          btn.click();
          this.getAcpPartnerNew();
        //  this.componentB.acpPartnerChangeEvent();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: response.message,
            showConfirmButton: false,
            timer: 3000,
          });
          this.loader = false;
        }
      }
    });
  }

  // Methodi is used for update acpPartner details --
updateacpPartner(dataObj: any, acpPartnerID: number) {
debugger
dataObj.CompanyID = this.localStorage.getCompanyID();
 dataObj.UserId = this.localStorage.getUserId();
 this.loader = true;
    this.acpPartnerService.UpdateAcpPartner(dataObj).subscribe((response: any) => {
      debugger
      if (response != null) {
        if (response.statusCode === 200) {
        
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Acp/Partner updated successfully! ',
            showConfirmButton: false,
            timer: 2200,
          });
          let btn = <HTMLInputElement>document.getElementById('closeModal');
          btn.click();
          this.getAcpPartnerNew();
        } else {
        
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: response.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
    
  }

  // method is used for edit acpPartner details --
  editAcpPartner(id: number) {
    debugger
    this.loader = true;
    let btn = <HTMLInputElement>document.getElementById('openModal');
    btn.click();
    this.Mode = 'Edit';
    this.acpPartnerID = id;
    this.AcpPartnerForm.controls['Password'].disable();
    this.AcpPartnerForm.controls['UserName'].disable();
    this.acpPartnerService.getAcpPartnerById(id).subscribe((res: any) => {
      debugger
      if (res != null) {
        let acpPartner = res.responseData;
        if(acpPartner.length==undefined){
          this.loader = false;
        }else{
        this.fillcontrols(acpPartner);
        }
        this.enableDisableAllControls(true);
        this.loader = false;
      }
    });
  }

  //method is used for view acpPartner details --
  viewAcpPartner(id: number) {
    this.loader = true;
    let btn = <HTMLInputElement>document.getElementById('openModal');
    btn.click();
    this.Mode = '';
    this.acpPartnerID = id;

    this.acpPartnerService.getAcpPartnerById(id).subscribe((res: any) => {
      debugger
      if (res != null) {
        let acpPartner = res.responseData;
        this.fillcontrols(acpPartner);
        this.enableDisableAllControls(false);
        this.loader = false;
      }
    });
  }

  //Method is used for delete acpPartner-- 
  // deleteacpPartner(row: any) {

  // if (confirm("Are you sure to delete " + row.acpPartnerName + "?")) {

  //   this.acpPartnerService.deleteacpPartner(row.acpPartnerID).pipe(first())
  //     .subscribe();
  //   this.getAcpPartner();
  //   this.ngOnInit();
  // }
  deleteAcpPartner(row: any) {
    debugger
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader = true;
        this.acpPartnerService.deleteAcpPartner(row.acpPartnerID).subscribe((response: any) => {
          debugger
          if (response.message = 'OK') {
            this.loader = false;
            Swal.fire(
              'Deleted!',
              'acpPartner has been deleted successfully.',
              'success'
            )
            this.getAcpPartner();
          }
          else {  this.loader = false;}
        })
      }
    })
  }
  // }

  // Set value on view and update acpPartner details--
  fillcontrols(acpPartner: any) {
    debugger
    this.AcpPartnerForm.controls['acpPartnerId'].setValue(acpPartner[0].acpPartnerID);
    this.AcpPartnerForm.controls['AcpPartnerName'].setValue(acpPartner[0].acpPartnerName);
    this.AcpPartnerForm.controls['AcpPartnerTypeId'].setValue(acpPartner[0].acpPartnerTypeId);
    this.AcpPartnerForm.controls['FirstName'].setValue(acpPartner[0].firstName);
    this.AcpPartnerForm.controls['LastName'].setValue(acpPartner[0].lastName);
    this.AcpPartnerForm.controls['UserName'].setValue(acpPartner[0].userName);
    this.AcpPartnerForm.controls['PhoneNo'].setValue(acpPartner[0].phoneNo);
    this.AcpPartnerForm.controls['Address1'].setValue(acpPartner[0].address1);
    this.AcpPartnerForm.controls['Address2'].setValue(acpPartner[0].address2);
    this.AcpPartnerForm.controls['CountryID'].setValue(acpPartner[0].countryID);
    this.AcpPartnerForm.controls['AcpPartnerUserID'].setValue(acpPartner[0].acpPartnerUserID);
    this.commonService.getStates(acpPartner[0].countryID).subscribe((res: any) => {
      if (res != null) {
        debugger
        this.states = res.data.responseData;
        this.states.unshift({ stateName: 'Select State', stateID: '' });
      }
    });
    this.AcpPartnerForm.controls['StateID'].setValue(acpPartner[0].stateID);
    this.AcpPartnerForm.controls['City'].setValue(acpPartner[0].city);
    this.AcpPartnerForm.controls['Email'].setValue(acpPartner[0].email);
    this.AcpPartnerForm.controls['PostalCode'].setValue(acpPartner[0].postalCode);
    debugger
    this.acpPartnerImage = environment.imageUrl + acpPartner[0].profieImgUrl;
    // if (acpPartner[0].profieImgUrl !=null)
    // {
    //   this.ImageStatus='Filled';
    //   this.acpPartnerImage = environment.imageUrl + acpPartner[0].profieImgUrl;
    // }
    // else{
    //   debugger
    //   this.ImageStatus='Empty';
    //   this.acpPartnerImage = 'assets/images/profile-icon.svg';
    // }
    
    this.AcpPartnerForm.controls['ProfieImgUrl'].setValue(acpPartner[0].profieImgUrl);
  }

  //enable and  disable all acpPartner from controls--
  enableDisableAllControls(enable: boolean) {
    if (enable) {
      this.AcpPartnerForm.controls['AcpPartnerName'].enable();
      this.AcpPartnerForm.controls['AcpPartnerTypeId'].enable();
     this.AcpPartnerForm.controls['FirstName'].enable();
     this.AcpPartnerForm.controls['LastName'].enable();
//     this.AcpPartnerForm.controls['UserName'].enable();
    // this.AcpPartnerForm.controls['Password'].enable();
     this.AcpPartnerForm.controls['PhoneNo'].enable();
      this.AcpPartnerForm.controls['Address1'].enable();
      this.AcpPartnerForm.controls['Address2'].enable();
      this.AcpPartnerForm.controls['CountryID'].enable();
      this.AcpPartnerForm.controls['StateID'].enable();
      this.AcpPartnerForm.controls['City'].enable();
      this.AcpPartnerForm.controls['Email'].enable();
      this.AcpPartnerForm.controls['PostalCode'].enable();
      this.AcpPartnerForm.controls['ProfieImgUrl'].enable();
    } else {
      this.AcpPartnerForm.controls['AcpPartnerName'].disable();
      this.AcpPartnerForm.controls['AcpPartnerTypeId'].disable();
      this.AcpPartnerForm.controls['FirstName'].disable();
     this.AcpPartnerForm.controls['LastName'].disable();
     this.AcpPartnerForm.controls['UserName'].disable();
     this.AcpPartnerForm.controls['PhoneNo'].disable();
      this.AcpPartnerForm.controls['Address1'].disable();
      this.AcpPartnerForm.controls['Address2'].disable();
      this.AcpPartnerForm.controls['CountryID'].disable();
      this.AcpPartnerForm.controls['City'].disable();
      this.AcpPartnerForm.controls['Email'].disable();
      this.AcpPartnerForm.controls['StateID'].disable();
      this.AcpPartnerForm.controls['PostalCode'].disable();
      this.AcpPartnerForm.controls['ProfieImgUrl'].disable();
    }
  }

  getRow(row: any) {
    console.warn(row);
  }

  // Method for browse file attachment---
  onAttachment(file: any): any {
    debugger
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
        debugger
        const formData = new FormData();
        this.attachment = file;
        if (file.target.files[0]) {
          formData.append('Image', file.target.files[0]);
          formData.append('ProfileLink', 'AcpPartnerProfileImg');
          debugger
          this.commonService
            .UploadProfileService(formData)
            .subscribe((profilePath: any) => {
              debugger
              this.acpPartnerImage = this.createImgPath(profilePath.responseData);
              debugger
              this.AcpPartnerForm.controls['ProfieImgUrl'].setValue(profilePath.responseData);
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

  resetFileUploader() {
    this.acpPartnerImage = '';
    //this.staffForm.controls['ProfieImgUrl'].setValue('');
  }

  // ViewacpPartner(acpPartnerId: any) {
  //   let _key = CryptoJS.enc.Utf8.parse(environment.HashKey);
  //   let _iv = CryptoJS.enc.Utf8.parse(environment.HashKey);
  //   let encrypted = CryptoJS.AES.encrypt(JSON.stringify(acpPartnerId), _key, {
  //     keySize: 16,
  //     iv: _iv,
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7,
  //   });
  //   let EncKey = encrypted.toString();
  //   this.router.navigate(['/super-admin/acpPartner/view-acpPartner', EncKey]);
  // }

  public nextPage(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex + 1;
    this.Search.PageSize = limit;
    this.Search.PageNumber = skip;

    this.getAcpPartner();
  }

  fillterAcpPartnerList() {
    if (this.matStartDate != undefined && this.matEndDate != undefined) {
      this.filteredList = this.acpPartners.filter(x => new Date((x.CreatedDate)).getTime() >= this.matStartDate.getTime() && new Date((x.CreatedDate)).getTime() <= this.matEndDate.getTime());

      if (this.filteredList == null || this.filteredList.length == 0) {
        this.dataSource = new MatTableDataSource<any>();
        this.totalCount = 0;
        this.loaderflag = false;
        this.hide = false;
        this.isDisabled = false;
      }
      else {
        this.acpPartners = this.filteredList;
        this.totalCount = this.filteredList.length;
        if (this.filteredList != null) {
          this.dataSource = new MatTableDataSource(this.filteredList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.totalCount > 0) {
            this.loaderflag = false;
            this.hide = true;
            this.isDisabled = false;
          }
          else {
            this.hide = false;
            this.loaderflag = false;
            this.isDisabled = false;
          }
        }
      }
    }
    else {
      this.getAcpPartner();
    }

  }
  // exportAsXLSX(): void {

  //   const items = <any>[];
  //   let exportsize = environment.defaultExportSize;
  //   this.acpPartnerService
  //     .searchAcpPartner(this.Search)
  //     .subscribe((response: any) => {
  //       if (response.data.length > 0) {
  //         this.dataSource = new MatTableDataSource(response.data);
  //         this.recordcount =
  //           this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
  //         if (this.recordcount > 0) {
  //           const obj = <any>[];
  //           const list = this.dataSource.data as Array<any>;
  //           list.forEach((element) => {
  //             const excelData = {
  //               acpPartnerName: element.acpPartnerName,
  //               acpPartnerType: element.acpPartnerType,
  //               PhoneNumber: element.PhoneNumber,
  //               Location: element.CountryName,
  //               Address: element.Address1,
  //             };
  //             items.push(excelData);
  //           });
  //         }
  //         // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
  //         // const workbook: XLSX.WorkBook = {
  //         //   Sheets: { 'acpPartner List': worksheet },
  //         //   SheetNames: ['acpPartner List'],
  //         // };
  //         // this.exportToExcelService.exportAsExcelFile(
  //         //   items,
  //         //   'acpPartner List',
  //         //   workbook
  //         // );
  //       } else {
  //         // alert('No data avilable in table');
  //         Swal.fire({
  //           position: 'center',
  //           icon: 'warning',
  //           title: 'No data avilable in table!',
  //           showConfirmButton: false,
  //           timer: 1500
  //         })
          
  //       }
  //       this.pagesize = environment.defaultPageSize;
  //       this.getAcpPartner();
  //     });
  // }
  onPageOrSortChange(changeState?: any) {
    debugger
   // this.filterModel.pageNumber = changeState.pageIndex + 1;
   // this.filterModel.pageSize = changeState.pageSize;
    this.Search.PageNumber=changeState.pageIndex+1;
    this.Search.PageSize=changeState.pageSize;
    this.getAcpPartner();
  }
  activeDeactive(status:any,element:any){
    debugger
    element.isActive=status.checked
    this.updateacpPartner(element,0);
  }


// changeComStatus(data:any){
//         this.platformAdminServiceService.changeStatus(data).subscribe((response: any) => {
//           if (response.statusCode==200){
//             this._toasterService.toastrConfig.preventDuplicates = true;  
//             this._toasterService.success(response.message, "", {
//               timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
//             });
//             this.getcompanyList()
//           }
//           else{
//             this._toasterService.toastrConfig.preventDuplicates = true;  
//             this._toasterService.error(response.message, "", {
//               timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
//             });
//           }

//         });
// }
}
