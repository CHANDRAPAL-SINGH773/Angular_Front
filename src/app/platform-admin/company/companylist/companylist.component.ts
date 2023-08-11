import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlatformAdminServiceService } from '../platform-admin-service.service';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';
import { environment } from 'src/environments/environment';
import { forEach } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistrationmodalComponent } from '../registrationmodal/registrationmodal.component';
import {FormControl} from '@angular/forms';
import {TooltipPosition} from '@angular/material/tooltip';
import { ViewCompanyComponent } from '../view-company/view-company.component';


@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class CompanylistComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  metaData: Metadata = new Metadata();
  filterModel: FilterModel = new FilterModel();
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  loader=false;
  companyName:string=''
  displayedColumns = [
    // 'serialNo',
    'CompanyName',
    'RegDate',
    'EmailId',
    'Address',
    'countryID',
    //'selectcountry',
    'stateID',
    'city',
    // 'postalCode',
    'status',
    'action'
  ];
  constructor(private platformAdminServiceService:PlatformAdminServiceService,private _toasterService: ToastrService,private dialog: MatDialog) { }

  title = 'matDialog';
  dataFromDialog: any;

  newReg(): void {
    const dialogRef = this.dialog.open(RegistrationmodalComponent, { data:{},
      panelClass: ['custom_dialog', 'new_registration']
    })
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result == 'save' || result == 'close'){
        this.getcompanyList();
      }
    });
 }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterModel = new FilterModel();
    this.metaData=new Metadata();
    this.getcompanyList()
  }
  getcompanyList(){
    this.loader=true;
    debugger
    this.platformAdminServiceService.getCompanyList(this.filterModel.searchText,this.filterModel.pageNumber,this.filterModel.pageSize).subscribe((response: any) => {
    debugger
      if (response != null){
        console.log("all Data",response)
        this.loader=false;
        this.dataSource = new MatTableDataSource(response.responseData.items);
        this.metaData.totalRecords=response.responseData.totalCount;
        this.metaData.totalPages=response.responseData.totalPages;
        this.metaData.currentPage=response.responseData.pageNumber;
        this.dataSource.sort = this.sort;
      }
      else{
        this.loader=false;
      }
 
    });
  }
  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.getcompanyList();
  }
  changeStatus(status:any,element:any){
    let UserId:any;
    let statusname:any;
    let IsActive:boolean;
    if(status.target.value !=null || status.target.value !=undefined || status.target.value !=''){
      if(status.target.value=='Approved'){
        IsActive=element.companyUser.isActive;
        statusname='Accept';
        UserId=element.companyUser.userId;
      }
     else if(status.target.value=='Rejected'){
        statusname='Reject';
        IsActive=element.companyUser.isActive;
        UserId=element.companyUser.userId;
      }
      else{
        statusname='Pending';
        IsActive=element.companyUser.isActive;
        UserId=element.companyUser.userId;
      }
      let data={
        UserId:UserId,
        Status:statusname,
        IsActive:IsActive,
        IsDelete:false

      } 
      this.changeComStatus(data);

    }
  }
  activeDeactive(status:any,element:any){
      let data={
      UserId:element.companyUser.userId,
      Status:element.companyUser.statusName,
      IsActive:status.checked,
      IsDelete:false
    }
this.changeComStatus(data);
  }


changeComStatus(data:any){
  this.loader=true;
        this.platformAdminServiceService.changeStatus(data).subscribe((response: any) => {
          if (response.statusCode==200){
            this.loader=false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: response.message,
              showConfirmButton: false,
              timer: 2200,
  
            });
            this.getcompanyList()
          }
          else{
            this.loader=false;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: response.message,
              showConfirmButton: false,
              timer: 2200,
  
            });
          }

        });
}

deleteCompany(element: any) {
  console.log("To Be Deleted",element)
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let data={
        UserId:element.companyUser.userId,
        Status:element.companyUser.statusName,
        IsActive:element.companyUser.isActive,
        IsDelete:true
      }
    this.changeComStatus(data);
    }
  })
 }
 editCompany(element:any){
  const dialogRef = this.dialog.open(RegistrationmodalComponent, { data:{element},
    panelClass: ['custom_dialog', 'new_registration']
  })
  dialogRef.afterClosed().subscribe((result: string) => {
    if (result == 'save' || result == 'close'){
      this.getcompanyList();
    }
  });
 }
 viewCompany(element:any){
  const dialogRef = this.dialog.open(ViewCompanyComponent, { data:{element},
    panelClass: ['custom_dialog', 'viewcompany']
  })
  dialogRef.afterClosed().subscribe((result: string) => {
    if (result == 'save' || result == 'close'){

    }
  });
 }
 clearSearch(){
  this.companyName='';
  this.filterModel.searchText='';
  this.filterModel.pageNumber=1;
  this.filterModel.pageSize=10;
  this.getcompanyList();
 }
 searchCompany(){
  this.filterModel.searchText=this.companyName;
  this.getcompanyList();
 }
}
