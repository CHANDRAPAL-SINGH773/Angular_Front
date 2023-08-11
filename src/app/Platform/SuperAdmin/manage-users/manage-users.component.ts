import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ManageUserService} from '../../Services/manageUserService/manage-user.service';
import { DefaultNumber } from '../../../Shared/Enums/Default.enums';
import { Sort } from "@angular/material/sort";
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

   title: string = 'Manage Users';
   isFilter: boolean = false;
   userForm!: FormGroup;
   search :string='';
   hide : boolean = false;
   // mat Table settings
   @ViewChild(MatPaginator) paginator: MatPaginator;
   displayedColumns: string[] = ["logo","name", "email","userName", "role", "status", "block","action"];  
   dataSource : MatTableDataSource<any> = new MatTableDataSource();
   recordcount: number = DefaultNumber.Zero;
   pagesize = environment.defaultPageSize;
   totalPages = environment.defaultshowTotalPages;
   pageIndex: number = DefaultNumber.Zero;
   pageSizeList = environment.pageSizeList;
   pageChangeEvent(event:any) {}
   loaderflag:boolean = false;
   valueflag :boolean = false;
   isDisabled:boolean = true;

  constructor( 
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _manageUserService: ManageUserService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService) { }

  ngOnInit(): void {
    this.CreateFormGroup();
    this.GetUserList();
  }

  CreateFormGroup(): void {
    this.userForm = this.fb.group({
      Search: new FormControl("")
    })
  }
 
    // Method for get all caregiver list for manage screen--
    GetUserList(){
      this.loaderflag = true;
      this.search= this.userForm.controls['Search'].value
       this._manageUserService.GetUserListService(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
       if(response.data!=null){
       this.dataSource =  new MatTableDataSource(response.data);
       this.dataSource.paginator = this.paginator;
       this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
       if(this.recordcount>0)
       {
         this.loaderflag = false;
         this.hide= true;
         this.isDisabled=false;
       }
       else{
         this.loaderflag = false;
         this.hide = false;
         this.isDisabled=true;
       }
      }
      else{
        this.loaderflag = false;
        this.hide = false;
      }
      })
    }

    deleteUser(id:any){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this._manageUserService.DeleteUser(id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'User has been deleted.',
                'success'
              )
              this.GetUserList();
            }
          })
        }
      })
    }

    ActiveDeactiveUser(UserId:any,value:any){
      if(value ==false ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
        const model={
          UserId : UserId,
          CheckValue:this.valueflag,
        }
        this._manageUserService.ActiveDeactiveUser(model).subscribe((response:any) => {
          if(response != null){
            this.GetUserList();
           }
         });
    }

    BlockUnBlockUser(UserId:any,value:any){
      if(value ==false ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
        const model={
          UserId : UserId,
          CheckValue:this.valueflag,
        }
        this._manageUserService.BlockUnBlockUser(model).subscribe((response:any) => {
          if(response != null){
            this.GetUserList();
           }
         });
    }

    //--Client-Side Sorting
    sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a:any,b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {        
        case 'name': return compare(a.EmpName, b.EmpName, isAsc);
        case 'title': return compare(a.Title, b.Title, isAsc);
        case 'email': return compare(a.Email, b.Email, isAsc);
        case 'userName': return compare(a.UserName, b.UserName, isAsc);
        case 'role': return compare(a.RoleName, b.RoleName, isAsc);
        default: return 0;
      }
    });
    }  

  exportAsXLSX(): void {
  const items =<any>[];
  let exportsize = environment.defaultExportSize;
  this._manageUserService.GetUserListService(this.search,this.pageIndex,exportsize)
  .subscribe((response: any) => {
    if (response.Data !== null) {
      debugger
      this.dataSource =  new MatTableDataSource(response.data);
      this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
      if(this.recordcount > 0) {
       const obj=<any>[];
       const list = this.dataSource.data as Array<any>;
       list.forEach(element => {
       const excelData = {
      "Name": element.EmpName,
      "Email": element.Email,             
      "UserName": element.UserName,
      "RoleName": element.RoleName,
      "Status":element.IsActive   
     };
     items.push(excelData);
    });
   }
   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
   const workbook: XLSX.WorkBook = { Sheets: { "Users List": worksheet }, SheetNames: ["Users List"] };
   this.exportToExcelService.exportAsExcelFile(items, "UsersList",workbook);
  }    
  });
}

Print():any{
  window.print();
}
     
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
