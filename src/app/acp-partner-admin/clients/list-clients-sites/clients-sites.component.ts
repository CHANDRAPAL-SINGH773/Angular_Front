import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { environment } from 'src/environments/environment';
import { rolesmodal, programModel } from '../../staff/list-staff/list-staff.component';
import { get } from 'jquery';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { ToastrService } from 'ngx-toastr';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AddClientSitesComponent } from '../add-client-sites/add-client-sites.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';

@Component({
  selector: 'app-clients-sites',
  templateUrl: './clients-sites.component.html',
  styleUrls: ['./clients-sites.component.scss']
})
export class ClientsSitesComponent implements OnInit {
  metaData: Metadata = new Metadata();
  submitted!: boolean;
  Search:CommonDropdownModel = { Search: '', Id: 1, PageNumber: 1, PageSize: 5, companyID: 0, acpPartnerID: 0 };
  Mode: string;
  sortDir = 1; 
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
  rolesmodal :Array<rolesmodal> = []; 
  programModal:Array<programModel> = [];
  clientList: any;
  clientListTemp: any;
  countryList: any;
  countryListTemp: any;
  states: any;
  statesTemp: any;
  clientSiteList: any;
  clientSiteID: number=0;
  element: HTMLElement|null;
  search: string;
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['type','address','state','action'];
  matStartDate: Date;
  matEndDate: Date;
  filteredList: any[] = [];
  StaffRole:any[] = [];
  clientId:any=null;
  pageChangeEvent(event: any) { }
   @ViewChild('addClientSiteModal') public childModal:any;

  constructor(
    private localstorage:LocalStorageService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private _toasterService:ToastrService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.getClientSite();
    this.getClientList();
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
   this.filterModel = new FilterModel();
   this.metaData=new Metadata();

  }
  
  // public nextPage(event: any) {
  //   const limit = event.pageSize;
  //   const skip = event.pageIndex + 1;
  //   this.Search.PageSize = limit;
  //   this.Search.PageNumber = skip;
  // }

  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.getClientSite();
  }

  getClientSite() {
    this.loader=true
    let obj = {
      companyID: this.localstorage.getCompanyID(),
      acpPartnerID: this.localstorage.getAcpPartnerID(),
      clientID:this.clientId,
      search: '',
      pageNumber:this.filterModel.pageNumber,
      pageSize:this.filterModel.pageSize,
    };
    this.commonService.getClientSite(obj).subscribe((res) => {
      if(res){
        this.loader=false
        this.clientSiteList = res.responseData.items;
        this.dataSource=this.clientSiteList;
        this.totalCount=res.responseData.totalCount;
      }else{
        this.loader=false
      }
    });
  }
  getClientListById(event:any){
    
    if(event==0){
    this.clientId=null
    }
    else{
      this.clientId=event;
    }
    this.getClientSite();
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
          clientSiteID :data.cSiteId,
          deletedBy:this.localstorage.getUserId()
        }
        this.commonService.deleteClientSite(obj).subscribe(res=>{
          if(res.statusCode=='200'){
                this._toasterService.success(CommonSuccessMessages.ReferralDeleted, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
                    this.getClientSite();
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
    documentModal = this.dialog.open(AddClientSitesComponent, { data: {},panelClass:['custom_dialog', 'addclientsite'] })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save' || result == 'close'){
        this.getClientSite();
      }
    });

  }

  EditMode(element:any){

    let documentModal;
    documentModal = this.dialog.open(AddClientSitesComponent, { data: {item:element,mode:'edit'},panelClass:['custom_dialog', 'addclientsite'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.getClientSite();
      }
    });
  }

  view(element:any){
    let documentModal;
    documentModal = this.dialog.open(AddClientSitesComponent, { data: {item:element,mode:'view'},panelClass:['custom_dialog', 'addclientsite'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.getClientSite();
      }
    });

  }

getClientList() {
  debugger
    let obj = {
      companyID: this.localstorage.getCompanyID(),
      acpPartnerID: this.localstorage.getAcpPartnerID(),
      search: '',
      pageNumber: this.Search.PageNumber,
      pageSize: 100000,
    };
    this.commonService.getClient(obj).subscribe((res) => {
      if(res){
      this.clientList = res.responseData.items;
    }
      // this.dataSource=this.clientList
      // this.totalCount=res.data.responseData.totalCount;
    });
  }


  
  
}
