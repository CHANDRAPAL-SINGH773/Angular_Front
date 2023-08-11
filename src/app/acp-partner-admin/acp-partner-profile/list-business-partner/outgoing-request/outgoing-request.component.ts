import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';
import { environment } from 'src/environments/environment';
import { BusinessPartnerServiceService } from '../business-partner-service.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-outgoing-request',
  templateUrl: './outgoing-request.component.html',
  styleUrls: ['./outgoing-request.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class OutgoingRequestComponent implements OnInit {
  loader=false;
  companyId:any
  acpPartnerId:any
  userId:any
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  metaData: Metadata = new Metadata();
  filterModel: FilterModel = new FilterModel();
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  searchCompanyName=''
  searchCompanyEmail=''
  displayedColumns = [
    'active',
    'Name',
    'Email',
    'Mobile',
    'Type',
    'Status',
    'Action'
  ];
  constructor(private bpservice:BusinessPartnerServiceService,
    private localstorage: LocalStorageService,
    private _toasterService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {

    this.companyId=Number(this.localstorage.getCompanyID());
    this.acpPartnerId=Number(this.localstorage.getAcpPartnerID());
    this.userId=Number(this.localstorage.getUserId());


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterModel = new FilterModel();
    this.metaData=new Metadata();
    this.GetOutgoingBPRequest();
  }

  GetOutgoingBPRequest(){
    this.loader=true;
    this.bpservice.GetOutgoingBusinessPartnerList(this.companyId,this.acpPartnerId,this.filterModel.pageNumber,this.filterModel.pageSize,this.searchCompanyName,this.searchCompanyEmail).subscribe((response: any) => {
      if (response != null){
        this.dataSource = new MatTableDataSource(response.responseData.items);
        this.metaData.totalRecords=response.responseData.totalCount;
        this.metaData.totalPages=response.responseData.totalPages;
        this.metaData.currentPage=response.responseData.pageNumber;
        this.dataSource.sort = this.sort;
        this.loader=false;
      }

      else{
        this.loader=false;;
      }
    });
  }
  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.GetOutgoingBPRequest();
  }
  DeleteBPForData(bpDetail:any){
    this.loader=true;
    this.bpservice.DeleteBusinessPartner(bpDetail.businessPartnerId,this.userId).subscribe((response: any) => {
      if (response.statusCode==200){
        this.loader=false;;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,
    
        });

        this.filterModel.pageNumber = 1;
        this.filterModel.pageSize = environment.defaultPageSize;
        this.GetOutgoingBPRequest();
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

  searchMethodforOut(companyName:string,companyEmail:string){
  this.searchCompanyName=companyName
  this.searchCompanyEmail=companyEmail
  this.filterModel.pageNumber = 1;
  this.filterModel.pageSize = environment.defaultPageSize;
  this.GetOutgoingBPRequest()
  }
  ViewBP(bpDetails:any){
    this.router.navigate(['AcpPartnerAdmin/AcpPartner/bpDetail', bpDetails.businessPartnerId]);
  }
  DeleteBP(bpDetail: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      this.DeleteBPForData(bpDetail);
      }
    })
   }

}
