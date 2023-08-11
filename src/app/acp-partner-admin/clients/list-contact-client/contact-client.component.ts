import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { environment } from 'src/environments/environment';
import { rolesmodal, programModel } from '../../staff/list-staff/list-staff.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import Swal from 'sweetalert2';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';
import { MatDialog } from '@angular/material/dialog';
import { AddContactClientComponent } from '../add-contact-client/add-contact-client.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-contact-client',
  templateUrl: './contact-client.component.html',
  styleUrls: ['./contact-client.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ContactClientComponent implements OnInit {
  
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
   @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
   @ViewChild(MatSort) sort: MatSort;
  attachment: File;
  totalCount: number = 0;
  rolesmodal :Array<rolesmodal> = []; 
  programModal:Array<programModel> = [];
  displayedColumns = ['Name','Address','Action'];
  
  addressList:any[];
  clientSiteID: any;
  contactClientList: any;
  ContactClientID: Number=0;
  constructor( private localstorage:LocalStorageService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private _toasterService:ToastrService,
    private modelService:NgbModal,
    private dialog: MatDialog) { 

    }

  ngOnInit(): void {
  this.GetClientContactList();
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
  //   this.GetClientContactList();
  // }

  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.GetClientContactList();
  }

  GetClientContactList() {
    let obj = {
        search:'',
        pageNumber:this.filterModel.pageNumber,
        pageSize:this.filterModel.pageSize,
        companyID: this.localstorage.getCompanyID(),
        acpPartnerID:this.localstorage.getAcpPartnerID() 
      };
      this.commonService.GetClientContactList(obj).subscribe((res) => {
        if(res.statusCode=='200'){
          this.contactClientList=res.responseData.items;
          this.dataSource=this.contactClientList;
          this.totalCount=res.responseData.totalCount;

        }
    });
  }
  AddMode(){

    let documentModal;
    documentModal = this.dialog.open(AddContactClientComponent, { data: {},panelClass:['custom_dialog', 'addclientcontact'] })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save' || result == 'close'){
        this.GetClientContactList();
      }
    });

  }

  EditMode(element:any){

    let documentModal;
    documentModal = this.dialog.open(AddContactClientComponent, { data: {item:element,mode:'edit'},panelClass:['custom_dialog', 'addclientcontact'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.GetClientContactList();
      }
    });
  }

  view(element:any){
    let documentModal;
    documentModal = this.dialog.open(AddContactClientComponent, { data: {item:element,mode:'view'},panelClass:['custom_dialog', 'addclientcontact'] })
    documentModal.afterClosed().subscribe((result: string) => {
      
      if (result == 'save' || result == 'close'){
        this.GetClientContactList();
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
          contactClientID:data.contactClientID,
          deletedBy:this.localstorage.getUserId()
        }
        this.commonService.deleteContactClient(obj).subscribe(res=>{
          if(res.statusCode=='200'){
                this._toasterService.success(CommonSuccessMessages.ReferralDeleted, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
                    this.GetClientContactList();
              }else{
                    this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                    });
              }
        })
      }
    })
  } 
  
  
    
}
