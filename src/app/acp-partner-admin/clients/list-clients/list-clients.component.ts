import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import {
  programModel,
  rolesmodal,
} from '../../staff/list-staff/list-staff.component';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddClientsComponent } from '../add-clients/add-clients.component';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss'],
})
export class ListClientsComponent implements OnInit {

  submitted: boolean=false;
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
  metaData: Metadata = new Metadata();

  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  filterModel: FilterModel = new FilterModel();

  isDisabled: boolean = true;
  hide: boolean = false;
  forimageurl: any = environment.imageUrl;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  attachment: File;
  loader=false;
  totalCount: number = 0;
  rolesmodal: Array<rolesmodal> = [];
  programModal: Array<programModel> = [];
  clientId: number=0;
  @ViewChild(MatPaginator, { static: false }) set paginator(
    value: MatPaginator
  ) {}
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = [
    'activeName',
    'email',
    'mobile',
    'status',
    'action'
  ];
  matStartDate: Date;
  matEndDate: Date;
  filteredList: any[] = [];
  clientList: any;
  pageChangeEvent(event: any) {}
   @ViewChild('addClientListModal') public childModal:any;

  constructor(
    private commonService: CommonService,
    private localstorage: LocalStorageService,
    private _toasterService:ToastrService,
    private fb: FormBuilder,
    private modelService:NgbModal,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getClient();
  }
  
  // public nextPage(event: any) {
  //   const limit = event.pageSize;
  //   const skip = event.pageIndex + 1;
  //   this.Search.PageSize = limit;
  //   this.Search.PageNumber = skip;
  //   this.getClient();
  // }

  onPageOrSortChange(changeState?: any) {
    
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.getClient();
  }

  getClient() {
    this.loader=true
    let obj = {
      companyID: this.localstorage.getCompanyID(),
      acpPartnerID: this.localstorage.getAcpPartnerID(),
      search: '',
      pageNumber: this.filterModel.pageNumber,
      pageSize: this.filterModel.pageSize,
    };
    this.commonService.getClient(obj).subscribe((res) => {
      if(res){
      this.loader=false
      this.clientList = res.responseData.items;
      this.dataSource=this.clientList
      this.totalCount=res.responseData.totalCount;
      }else{
        this.loader=false
      }
    });
  }

  delete(data:any){
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let obj={
          clientId :data.clientID,
          deletedBy:this.localstorage.getUserId()
        }
        this.commonService.deleteClient(obj).subscribe(res=>{
          if(res.statusCode=='200'){
                this._toasterService.success(CommonSuccessMessages.ReferralDeleted, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
                    this.getClient();
              }else{
                    this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
              }
        })
      }
    })
  }
  AddMode(){

    let documentModal;
    documentModal = this.dialog.open(AddClientsComponent, { data: {},panelClass:['custom_dialog', 'addclient'] })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save' || result == 'close'){
        this.getClient();
      }
    });

    // this.Mode='Add'
    // this.clientId=0
    // this.ClientForm.reset()
  }

  EditMode(element:any){

    let documentModal;
    documentModal = this.dialog.open(AddClientsComponent, { data: {item:element,mode:'edit'},panelClass:['custom_dialog', 'addclient'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.getClient();
      }
    });
  }
  view(element:any){
    let documentModal;
    documentModal = this.dialog.open(AddClientsComponent, { data: {item:element,mode:'view'},panelClass:['custom_dialog', 'addclient'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.getClient();
      }
    });

  }
  activeDeactive(event :any,element:any){
    debugger
    Swal.fire({
      title: 'Change Status ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let data={
              clientID:element.clientID,
              isActive:event.checked,
          }
          this.commonService.statusClient(data).subscribe(res=>{
          if(res.statusCode=='200'){
                this._toasterService.success(CommonSuccessMessages.statusChanged, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
                    this.getClient();
              }else{
                    this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
              }
            })
      }
      else{
        this.getClient()
      }
    })
  }
}
