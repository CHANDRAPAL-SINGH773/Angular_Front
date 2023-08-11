import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../add-project/add-project.component';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { ProjectService } from '../project.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FilterModel, Metadata } from 'src/app/lib/Models/AcpPartmerModel';
import { environment } from 'src/environments/environment';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ListProjectComponent implements OnInit {
  loader=false;
  companyId:any
  acpPartnerId:any
  userId:any
  search=''
  clientId:any=0
  selectedClient:any=''
  clientList:any
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) set paginator(value: MatPaginator) { }
  @ViewChild(MatSort) sort: MatSort;
  metaData: Metadata = new Metadata();
  filterModel: FilterModel = new FilterModel();
  pagesize = environment.defaultPageSize;
  pageSizeList = environment.pageSizeList;
  projectStatus:any
  displayedColumns = [
    'projectNo',
    'client',
    'site',
    'program',
    'Acp_Partner',
    'Status',
     'Action'
  ];
  constructor(private dialogModal: MatDialog,private localstorage: LocalStorageService,private projectservice:ProjectService
    ,private commonService: CommonService,private router: Router) { }

  ngOnInit(): void {
    this.companyId=Number(this.localstorage.getCompanyID());
    this.acpPartnerId=Number(this.localstorage.getAcpPartnerID());
    this.userId=Number(this.localstorage.getUserId());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterModel = new FilterModel();
    this.metaData=new Metadata();
    
    this.GetProjectList();
    this.GetProjectStatus();
    this.GetClients(this.companyId,this.acpPartnerId);
  }

  AddProject(){
    let documentModal;
    documentModal = this.dialogModal.open(AddProjectComponent, { data: {},panelClass:['custom_dialog', 'addproject'] })
    documentModal.afterClosed().subscribe((result: string) => {
      if (result == 'save' || result == 'close'){
        this.GetProjectList();
      }
    });
  }

  GetProjectList(){
    this.loader = true;
    let obj={
      companyID:this.companyId,
      acpPartnerID:this.acpPartnerId,
      search:this.search,
      pageNumber:this.filterModel.pageNumber,
      pageSize:this.filterModel.pageSize,
      clientId:this.clientId
    }
    this.projectservice.getProject(obj).subscribe((response: any) => {
      if (response != null){
        this.dataSource = new MatTableDataSource(response.responseData.items);
        this.metaData.totalRecords=response.responseData.totalCount;
        this.metaData.totalPages=response.responseData.totalPages;
        this.metaData.currentPage=response.responseData.pageNumber;
        this.dataSource.sort = this.sort;
        this.loader = false;
      }
      else{
        this.loader = false;
      }
       
    })
  }
  onPageOrSortChange(changeState?: any) {
    this.filterModel.pageNumber = changeState.pageIndex + 1;
    this.filterModel.pageSize = changeState.pageSize;
    this.GetProjectList();
  }
  DeleteProject(element:any){
    if(element.projectId){
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader=true;
    this.projectservice.deleteProject(element.projectId,element.companyId,element.acpPartnerId,this.userId).subscribe((response: any) => {
      if (response.statusCode==200){
        this.loader=false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,
    
        });

        this.filterModel.pageNumber = 1;
        this.filterModel.pageSize = environment.defaultPageSize;
        
        this.GetProjectList();
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
        this.filterModel.pageNumber = 1;
        this.filterModel.pageSize = environment.defaultPageSize;
         this.GetProjectList();
      }
    });
        }
      })
    }
  }
  EditProject(element:any){
      let documentModal;
      documentModal = this.dialogModal.open(AddProjectComponent, { data: {element},panelClass:['custom_dialog', 'addproject'] })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save' || result == 'close'){
          this.GetProjectList();
        }
      });
    }

  GetProjectStatus(){
    this.projectStatus=CommonErrorMessages.getStatus()
   }
   changeStatus(eve:any,ele:any){
    if(eve.target.value>0 && ele.projectId>0){
      this.loader=true;
      let obj={
        ProjectId:ele.projectId,
        StatusId:eve.target.value,
        CompanyId:ele.companyId,
        AcpPartnerId:ele.acpPartnerId,
        UserId:this.userId
      }
      this.projectservice.changeProjectStatus(obj).subscribe((response: any) => {
        if (response.statusCode==200){
          this.loader=false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: response.message,
            showConfirmButton: false,
            timer: 2200,
      
          });
  
          this.filterModel.pageNumber = 1;
          this.filterModel.pageSize = environment.defaultPageSize;
          this.GetProjectList();
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
          this.filterModel.pageNumber = 1;
          this.filterModel.pageSize = environment.defaultPageSize;
           this.GetProjectList();
        }
      });
    }
   }


   GetClients(companyId:any,Acp_PartnerId:any){
    this.loader = true;
    let obj={
      companyID:companyId,
      acpPartnerID:Acp_PartnerId,
      clientId:0,
      search:'',
      pageNumber:1,
      pageSize:1000000
    }
    this.commonService.getClient(obj).subscribe((response: any) => {
      if (response.responseData.items !=null){
        this.clientList = response.responseData.items;
        this.loader = false;
      }
      else{
        this.clientList = [];
        this.loader = false;
      }
       
    })
  }
  SelectedClient(cleintsDetail:any){
    this.clientId=cleintsDetail.value;
  }
  SearchProject(){
    this.GetProjectList();
  }
  ClearSearch(){
    this.clientId=0;
    this.selectedClient=null;
    this.search='';
    this.GetProjectList();
  }
  ViewProject(projectDetails:any){
    this.router.navigate(['AcpPartnerAdmin/project/viewproject', projectDetails.projectId]);
  }
  

}
