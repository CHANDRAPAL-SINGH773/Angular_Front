import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { AcpPartnerService } from '../../acp_services/acp-partner.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { template } from 'lodash';
import { BusinessPartnerServiceService } from '../../acp-partner-profile/list-business-partner/business-partner-service.service';
import { Metadata } from 'src/app/lib/Models/AcpPartmerModel';

@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.css']
})
export class ListStaffComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('AddStaff') AddStaff: ElementRef;

  StaffForm!: FormGroup;
  partnerFilterForm!: FormGroup;
  submitted!: boolean;
  Mode: string;
  sortDir = 1;
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  isDisabled: boolean = true;
  hide: boolean = false;
  forimageurl: any = environment.imageUrl;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  attachment: File;
  totalCount: number = 0;
  rolesmodal: Array<rolesmodal> = [];
  programModal: Array<programModel> = [];
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  Search: CommonDropdownModel = { Search: '', Id: 1, PageNumber: 1, PageSize: 10, companyID: 0, acpPartnerID: 0 };
  displayedColumns = ['name', 'email', 'mobile', 'role', 'department', 'status', 'pendingTraining', 'action'];
  matStartDate: Date;
  matEndDate: Date;
  filteredList: any[] = [];
  StaffRole: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  staffsList: any;
  departmentTypeList: any[] = [];
  programList: any[] = [];
  userRoleList: any[] = [];
  selectedRoleArray: any[] = [];
  selectedPrograms: any[] = [];
  partnerStaffList: any[] = [];
  filterRole: any[] = [];
  partnerStaff: boolean = false;
  pageChangeEvent(event: any) { }
  metaData: Metadata = new Metadata();
  acpPartner: number = Number(localStorage.getItem('acpPartnerID'));
  companyId: number = Number(localStorage.getItem('companyID'));
  useId: number = Number(localStorage.getItem('user_id'));
  getListParams: CommonDropdownModel = { Search: '', Id: 0, PageNumber: 1, PageSize: 5, companyID: 0, acpPartnerID: 0 };
  loader: boolean = false;
  selectedIndex = 0;
  modalReference: any;
  constructor(
    public datepipe: DatePipe,
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private _acpPartner: AcpPartnerService,
    private _toasterService: ToastrService,
    private dialog: MatDialog,
    private bpservice:BusinessPartnerServiceService,
  ) { }
  @Output() public acpPartnersEvent = new EventEmitter<any>();
  ngOnInit(): void {
    this.CreateStaffFormGroup();
    this.GetCountryMaster();
    this.getdepartmentMaster();
    this.getUserole();
    this.getStaffProgramMaster();
    this.getListParams = {
      Search: '', Id: 0, PageNumber: 1, PageSize: 5, acpPartnerID: Number(localStorage.getItem('acpPartnerID')),
      companyID: Number(localStorage.getItem('companyID'))
    };
    this.GetStafffList(this.getListParams);
    this.CreatePartnerFormGroup();
  }
  showPassword: boolean = false;
  cshowPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConPasswordVisibility() {
    this.cshowPassword = !this.cshowPassword;
  }

  //Create here staff form controls--
  CreateStaffFormGroup() {
    this.StaffForm = this.formBuilder.group({
      StaffId: new FormControl(0),
      UserId: new FormControl(Number(localStorage.getItem('user_id'))),
      AcpPartnerId: new FormControl(Number(localStorage.getItem('acpPartnerID'))),
      CompanyId: new FormControl(Number(localStorage.getItem('companyID'))),
      FirstName: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      LastName: new FormControl('', [Validators.required]),
      Email: ['', [Validators.required, Validators.email, CustomValidators.noWhitespaceValidator]],
      PhoneNo: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      UserName: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      Password: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      ConfirmPassword: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      DepartmentId: new FormControl('', [Validators.required]),
      Address1: ['', [CustomValidators.noWhitespaceValidator]],
      Address2: ['', [CustomValidators.noWhitespaceValidator]],
      CountryID: new FormControl('', [Validators.required]),
      StateID: new FormControl('', [Validators.required]),
      City: new FormControl('', [Validators.required]),
      PostalCode: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
      StaffRole: new FormControl('', [Validators.required]),
      StaffProgram: new FormControl('', [Validators.required]),
    });
  }

  CreatePartnerFormGroup() {
    this.partnerFilterForm = this.formBuilder.group({
      UserId: new FormControl(Number(localStorage.getItem('user_id'))),
      AcpPartnerId: new FormControl(Number(localStorage.getItem('acpPartnerID'))),
      CompanyId: new FormControl(Number(localStorage.getItem('companyID'))),
      SelectedStaffName: new FormControl(0),
      SelectedRoleId: new FormControl(0),
      SelectedPartnerId: new FormControl(0)
    });
  }

  addstafform(param: any, template: TemplateRef<any>) {
    this.StaffForm.reset();
    this.Mode = param;
    if (param == 'Add') {
      this.dialog.open(template);
    }
    this.CreateStaffFormGroup();
  }

  SubmitStaff(param: any) {
    this.StaffForm.reset();
    this.Mode = param;
  }

  ModalDisappear() {
    let ele = <HTMLInputElement>document.getElementById('closeModal');
    ele.click();
  }

  GetCountryMaster() {
    this.commonService.getCountries().subscribe((country: any) => {
      if (country.data != null) {
        this.countries = country.data.responseData;
        console.log(this.countries);
      }
    })
  }

  OnCountryChange(Country: any) {
    if (Country.value > 0) {
      this.getStateByCountryId(Country.value);
    }
  }

  getStateByCountryId(CountryId: number) {
    this.commonService.getStates(CountryId).subscribe((res: any) => {
      if (res.data.statusCode == 200) {
        this.states = res.data.responseData
      }
      else {
        this.states = [];
      }
    })
  }

  getdepartmentMaster() {
    this._acpPartner.DepartmentList().subscribe((departmentList: any) => {
      if (departmentList != null) {
        this.departmentTypeList = departmentList.data.responseData;
      }
      else {
        this.departmentTypeList = [];
      }
    })
  }

  OnSubmitClick() {
    if (this.StaffForm.valid) {
      const pwd = this.StaffForm.controls['Password'].value;
      const cpwd = this.StaffForm.controls['ConfirmPassword'].value;

      if (pwd === cpwd) {
        const roles = this.StaffForm.controls['StaffRole'].value;
        this.rolesmodal = roles.map((role: any) => ({
          RoleId: role,
          IsChecked: true
        }));

        const programs = this.StaffForm.controls['StaffProgram'].value;
        this.programModal = programs.map((program: any) => ({
          ProgramId: program,
          IsChecked: true
        }));

        this.addUpdateStaff(this.StaffForm.value);
      }
      else {
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.error("Password and Confirm Password should be same!", "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
      }
    }
    else {
      this.StaffForm.markAllAsTouched();
    }
  }

  addUpdateStaff(addStaffObj: any) {
    addStaffObj.StaffRole = this.rolesmodal;
    addStaffObj.StaffProgram = this.programModal;
    let staffIdCheck = this.StaffForm.controls['StaffId'].value;
    this.useId = this.StaffForm.controls['UserId'].value;
    if (staffIdCheck == 0) {
      this._acpPartner.AddStaffService(this.StaffForm.value).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.ModalDisappear()
          this.StaffForm.reset();
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.success("Staff added successfully!", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.GetStafffList(this.getListParams);
        }
        else if (response.statusCode == 400) {
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error("User already exist!", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
        }
      })
    }
    else {
      this._acpPartner.AddStaffService(this.StaffForm.value).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.ModalDisappear();
          this.StaffForm.reset();
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.success("Staff Updated Successfully!", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.GetStafffList(this.getListParams);
        }
        else if (response.statusCode == 400) {
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error("Something wrong!", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
        }
      })
    }
  }



  getdataByStaffId(staffId: any, userId: any) {
    this.loader = true;
    this._acpPartner.GetbyStaffId(this.getListParams, staffId, userId).subscribe((response: any) => {
      if (response.responseData != null) {

        this.AddStaff.nativeElement.click()
        this.Mode = 'Edit';
        this.getStateByCountryId(response.responseData[0].countryID);
        this.StaffForm.controls['StaffId'].setValue(response.responseData[0].staffId);
        this.StaffForm.controls['UserId'].setValue(response.responseData[0].userId);
        this.StaffForm.controls['FirstName'].setValue(response.responseData[0].firstName);
        this.StaffForm.controls['LastName'].setValue(response.responseData[0].lastName);
        this.StaffForm.controls['Email'].setValue(response.responseData[0].email);
        this.StaffForm.controls['PhoneNo'].setValue(response.responseData[0].phoneNo);
        this.StaffForm.controls['UserName'].setValue(response.responseData[0].userName);
        this.StaffForm.controls['Password'].setValue("Pass");
        this.StaffForm.controls['DepartmentId'].setValue(response.responseData[0].departmentId);
        this.StaffForm.controls['Address1'].setValue(response.responseData[0].address1);
        this.StaffForm.controls['Address2'].setValue(response.responseData[0].address2);
        this.StaffForm.controls['City'].setValue(response.responseData[0].city);
        this.StaffForm.controls['PostalCode'].setValue(response.responseData[0].postalCode);
        this.StaffForm.controls['ConfirmPassword'].setValue("Pass")
        this.commonService.getCountries().subscribe((country: any) => {
          if (country.data != null) {
            this.countries = country.data.responseData;
            this.StaffForm.controls['CountryID'].setValue(response.responseData[0].countryID);
          }
        })
        this.StaffForm.controls['StateID'].setValue(response.responseData[0].stateID);
        let roles = response.responseData[0].staffRole;
        if (roles != null) {
          for (let i = 0; i < roles.length; i++) {
            let role = roles[i].roleId;
            this.selectedRoleArray.push(role);
          }
          this.StaffForm.controls['StaffRole'].setValue(this.selectedRoleArray);
        } else {
          this.selectedRoleArray = [];
        }
        let program = response.responseData[0].staffProgram;
        if (program != null) {
          for (let j = 0; j < program.length; j++) {
            let programs = program[j].programId;
            this.selectedPrograms.push(programs);
          }
          this.StaffForm.controls['StaffProgram'].setValue(this.selectedPrograms);
        } else {
          this.selectedPrograms = [];
        }
      }
    })

    this.loader = false;
  }





  GetStafffList(params: any) {
    this.loader = true;
    params.userId = 0;
    this._acpPartner.GetStaffList(this.getListParams).subscribe((response: any) => {
     
      if(response.statusCode == 200){
        this.staffsList = response.responseData.items;
      if (response.responseData.items.length > 0){
        this.totalCount = response.responseData.totalPages;
      this.dataSource = new MatTableDataSource(response.responseData.items);
      this.metaData.totalRecords=response.responseData.totalCount;
      this.totalCount=response.responseData.totalCount;
      this.metaData.totalPages=response.responseData.totalPages;
      this.metaData.currentPage=response.responseData.pageNumber;
      this.dataSource.sort = this.sort;
      this.hide = true;
      this.loader = false;
      }
      }
      else{
        this.hide = false;
        this.loader = false;
      }

    })
    if (this.totalCount > 0) {
      this.hide = false;
    }
    else {
      this.hide = true;
    }
  }


  deleteStaff(staffid: any, userID: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const modal = {
          StaffId: staffid,
          UserId: userID,
          AcpPartnerId: Number(localStorage.getItem("acpPartnerID")),
          CompanyId: Number(localStorage.getItem("companyID")),
        }
        this._acpPartner.DeleteStaff(modal).subscribe((response: any) => {
          if (response.message = 'OK') {
            Swal.fire(
              'Deleted!',
              'Staff has been deleted successfully.',
              'success'
            )
            this.GetStafffList(this.getListParams);
          }
        })
      }
    })
  }


  getUserole() {
    this._acpPartner.UserRoleList().subscribe((rolelsit: any) => {
      if (rolelsit != null) {
        this.userRoleList = rolelsit.data.responseData;
      }
    })
  }

  getStaffProgramMaster() {
    this._acpPartner.ProgramMasterList().subscribe((programList: any) => {
      if (programList != null) {
        this.programList = programList.data.responseData;
      }
      else {
        this.programList = [];
      }
    })
  }

  onTabChange(index: any) {
    this.selectedIndex = index.index
    if (this.selectedIndex == 0) {
      this.getListParams.acpPartnerID = this.acpPartner;
      this.GetStafffList(this.getListParams);
      this.partnerFilterForm.reset();
    }
    if (this.selectedIndex == 1) {

      this.GetApprovedBPRequest();
      this.totalCount = 0;
      this.partnerStaffList = [];
      this.dataSource = new MatTableDataSource(this.partnerStaffList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.hide = false;
      this.loader = false;
    }
  }

  // GetPartnerStaff() {
  //   this.loader = true;
  //   let staffId = Number(this.partnerFilterForm.controls['SelectedStaffName'].value);
  //   let roleId = Number(this.partnerFilterForm.controls['SelectedRoleId'].value);
  //   let partnerID = Number(this.partnerFilterForm.controls['SelectedPartnerId'].value);

  //   if (roleId != 0) {
  //     let ttl = this.staffsList.filter(x => x.staffId == staffId);
  //     let rol = ttl[0].staffRole;
  //     let filtered = rol.filter(y => y.roleId == roleId)
  //     this.partnerStaffList = this.staffsList.filter(x => x.staffId == staffId || x.acpPartnerId == partnerID);
  //   }
  //   else {
  //     this.partnerStaffList = this.staffsList.filter(x => x.staffId == staffId || x.acpPartnerId == partnerID);
  //   }

  //   if (staffId != 0 || roleId != 0 || partnerID != 0) {
  //     if (this.partnerStaffList != null)
  //       if (this.partnerStaffList.length > 0)
  //         this.totalCount = this.partnerStaffList.length;
  //     this.dataSource = new MatTableDataSource(this.partnerStaffList);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.hide = true;
  //     this.loader = false;
    
  //     if (this.totalCount > 0) {
  //       this.hide = true;
  //     }
  //     else {
  //       this.hide = false;
  //     }
  //   }
  //   else {
  //     this._toasterService.error("Please select any one filter!", "", {
  //       timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  //     });
  //   }

  // }

  // getAcpPartner() {
  //   this._acpPartner.searchAcpPartner(this.Search).subscribe((res: any) => {
  //     let partnerList = res.responseData.items;
  //     this.partnerStaffList = partnerList.filter(x => x.typeId == 2)
  //   });
  // }

  GetPartnerStaff(){
    let partnerID = Number(this.partnerFilterForm.controls['SelectedPartnerId'].value);
    this.getListParams.acpPartnerID = partnerID;
    this.GetStafffList(this.getListParams);
  }

  GetApprovedBPRequest(){
    this.loader=true;
    this.bpservice.GetApproveBusinessPartnerList(this.companyId,this.acpPartner,1,100000,'','').subscribe((response: any) => {
      if (response != null){
        this.partnerStaffList = response.responseData.items
      }

      else{
        this.loader=false;
      }
    });
  }

  onPageOrSortChange(changeState?: any) {
    this.getListParams.PageNumber = changeState.pageIndex+1;
    this.getListParams.PageSize = changeState.pageSize;
    this.GetStafffList(this.getListParams);
  }
}

export class rolesmodal {
  StaffRoleId: number;
  RoleId: number;
  RoleName: string;
  IsChecked: boolean;
}

export class programModel {
  StaffProgramId: number;
  ProgramId: number;
  ProgramName: string;
  IsChecked: boolean;
}