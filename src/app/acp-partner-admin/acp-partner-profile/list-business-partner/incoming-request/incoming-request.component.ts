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
  selector: 'app-incoming-request',
  templateUrl: './incoming-request.component.html',
  styleUrls: ['./incoming-request.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class IncomingRequestComponent implements OnInit {
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
    'Name',
    'Email',
    'Mobile',
    'Type',
    'Action'
  ];
  constructor(private bpservice:BusinessPartnerServiceService,
    private localstorage: LocalStorageService,private _toasterService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {

    this.companyId=Number(this.localstorage.getCompanyID());
    this.acpPartnerId=Number(this.localstorage.getAcpPartnerID());
    this.userId=Number(this.localstorage.getUserId());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterModel = new FilterModel();
    this.metaData=new Metadata();
    this.GetIncomingBPRequest();
  }

  GetIncomingBPRequest(){
    this.loader=true
    this.bpservice.GetIncomingBusinessPartnerList(this.companyId,this.acpPartnerId,this.filterModel.pageNumber,this.filterModel.pageSize,this.searchCompanyName,this.searchCompanyEmail).subscribe((response: any) => {
      if (response != null){
        console.log("All Data Coming",response.responseData.items)
        this.dataSource = new MatTableDataSource(response.responseData.items);
        this.metaData.totalRecords=response.responseData.totalCount;
        this.metaData.totalPages=response.responseData.totalPages;
        this.metaData.currentPage=response.responseData.pageNumber;
        this.dataSource.sort = this.sort;
        this.loader=false;
      }

      else{
        this.loader=false;
      }
    });
  }
  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.GetIncomingBPRequest();
  }
  changeStatus(statusName:string,bpDetail:any){
    this.loader=true
    let obj={
      BusinessPartnerId:bpDetail.businessPartnerId,
      StatusName:statusName,
      UserId:this.userId
    }
    this.bpservice.ChangeBusinessPartnerStatus(obj).subscribe((response: any) => {
      if (response.statusCode==200){
        this.loader=false
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
        this.filterModel.pageNumber = 1;
        this.filterModel.pageSize =  environment.defaultPageSize;
        
        this.GetIncomingBPRequest();
      }

    else{
      this.loader=false
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 2200,
  
      });
      
    }

      
    });
  }

  searchMethodforIn(companyName:string,companyEmail:string){
    this.searchCompanyName=companyName
    this.searchCompanyEmail=companyEmail
    this.filterModel.pageNumber = 1;
    this.filterModel.pageSize = environment.defaultPageSize;
    this.GetIncomingBPRequest()
    }
    ViewBP(bpDetails:any){
      this.router.navigate(['AcpPartnerAdmin/AcpPartner/bpDetail', bpDetails.businessPartnerId]);
    }
}
