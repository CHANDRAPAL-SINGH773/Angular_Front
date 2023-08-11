import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { rolesmodal, programModel } from '../../staff/list-staff/list-staff.component';
import { RoleServicesService } from '../role-services.service';
import { AddRoleComponent } from '../add-role/add-role.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit {
  
  Search: CommonDropdownModel = {
    Search: '',
    Id: 1,
    PageNumber: 1,
    PageSize: 5,
    companyID: 0,
    acpPartnerID: 0,
  };

  Mode: string;
  sortDir = 1;
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  isDisabled: boolean = true;
  hide: boolean = false;
  forimageurl: any = environment.imageUrl;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  attachment: File;
  countries: any[] = [];
  states: any[] = [];
  totalCount: number = 0;
  rolesmodal: Array<rolesmodal> = [];
  programModal: Array<programModel> = [];

  roleID: number = 0;
  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) { }
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'roleName',
    'isRequired',
    'trainingCount',
    'action'
  ];
  
  matStartDate: Date;
  matEndDate: Date;
  filteredList: any[] = [];
  roleList: any;
  pageChangeEvent(event: any) { }

  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private localstorage: LocalStorageService,
    private _toasterService: ToastrService,
    private fb: FormBuilder,
    private roleService : RoleServicesService,
  ) { }

  ngOnInit(): void {
    this.getRoleList();
    this.GetCountryMaster()
  }

  

  public nextPage(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex + 1;
    this.Search.PageSize = limit;
    this.Search.PageNumber = skip;
    this.getRoleList();
  }

  getRoleList() {  
    this.roleService.GetRoleList(this.localstorage.getCompanyID(),this.localstorage.getAcpPartnerID()).subscribe((res)=>{
      this.roleList = res.responseData;
      this.dataSource = this.roleList
      this.totalCount = res.data.responseData.totalCount;
    })
  }

  GetCountryMaster() {
    this.commonService.getCountries().subscribe((country: any) => {
      if (country.data != null) {
        this.countries = country.data.responseData;
        // console.log(this.countries);
      }
    });
  }

  OnCountryChange(Country: any) {
    if (Country.value > 0) {
      this.getStateByCountryId(Country.value);
    }
  }

  getStateByCountryId(CountryId: number) {
    this.commonService.getStates(CountryId).subscribe((res: any) => {
      if (res.data.statusCode == 200) {
        this.states = res.data.responseData;
      } else {
        this.states = [];
      }
    });
  }


  deleteRole(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let obj = {
          roleID: data.roleID,
          deletedBy: this.localstorage.getUserId()
        }
        this.roleService.DeleteRole(data).subscribe(res => {
          if (res.statusCode == '200') {
            this._toasterService.success(CommonSuccessMessages.RoleDeleted, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
            this.getRoleList();
          } else {
            this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
          }
        })
      }
    })
  }


  AddRole(): void {
    const dialogRef = this.dialog.open(AddRoleComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getRoleList();
      if (result == 'success') {
      }
    });
  }

  editRole(data:any){
      let documentModal;
      documentModal = this.dialog.open(AddRoleComponent, {
        data
      })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save' || result == 'close'){
          this.getRoleList();
        }
      });
    }

  SearchRole(){
    this.getRoleList();
  }
  // ClearSearch(){
  //   this.clientId=0;
  //   this.selectedClient=null;
  //   this.search='';
  //   this.GetProjectList();
  // }

}
