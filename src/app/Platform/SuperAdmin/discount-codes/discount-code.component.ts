import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManagePlanService} from '../../Services/managePlanService/manage-plan.service';
import { AgencyModel} from '../../Model/AgencyModel'
import { Sort } from "@angular/material/sort";
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { AuthService } from "../../../auth/auth.service";
import { ResponseStatus } from '../../Model/ResponseStatusModel';
import { DropdownList } from '../../Model/DropDownModel';
import { AddEditDiscountCodeComponent } from './add-edit-discount-code/add-edit-discount-code.component';
import { DialogModel } from '../../Model/DialogModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-discount-code',
  templateUrl: './discount-code.component.html',
  styleUrls: ['./discount-code.component.css']
})
export class DiscountCodeComponent implements OnInit {
  loaderflag:boolean = false;
  planForm!: FormGroup;
  search :string='';
  hide : boolean = false;
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["codeName","discountType", "states","value","starttime", "endtime","limit","taken","remaning","status", "active","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  pageChangeEvent(event:any) {}
  submitted!: boolean;
  userId:any;
  stateList:DropdownList[] =[];
  planTypeList:DropdownList[] =[];
  displayStyle = "none";
  valueflag :boolean = false;
  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;

  constructor(
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _managePlanService: ManagePlanService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loaderflag = true;
    this.GetDiscountCodeList();
    this.userId = this.authService.userID;
    this.loaderflag = false;
  }

    // Method for get all subscription plan list for manage screen--
    GetDiscountCodeList(){
        this.loaderflag = true;
        this.search= '';
         this._managePlanService.GetDiscountCodeList(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
         this.dataSource =  new MatTableDataSource(response.data);
         this.dataSource.paginator = this.paginator;
         this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
         if(this.recordcount>0)
         {
          this.loaderflag = false;
           this.hide= true;
         }
         else{
           this.hide = false;
           this.loaderflag = false;
         }
        })
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
          case 'codeName': return compare(a.CodeName, b.CodeName, isAsc);
          case 'discountType': return compare(a.DiscountType, b.DiscountType, isAsc);
          case 'states': return compare(a.States, b.States, isAsc);
          case 'value': return compare(a.Value, b.Value, isAsc);
          case 'starttime': return compare(a.StartTime, b.StartTime, isAsc);
          case 'endtime': return compare(a.EndTime, b.EndTime, isAsc);
          case 'limit': return compare(a.Limit, b.Limit, isAsc);
          case 'taken': return compare(a.Taken, b.Taken, isAsc);
          case 'remaning': return compare(a.Remaning, b.Remaning, isAsc);
          case 'status': return compare(a.Status, b.Status, isAsc);
          default: return 0;
        }
      });
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
          this._managePlanService.DeleteDiscountCode(id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Discount Code has been deleted.',
                'success'
              )
              this.GetDiscountCodeList();
            }
          })
        }
      })
    }

    ActiveDeactivePlan(discountId:any,value:any){
      if(value ==false ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
        const model={
          DiscountId : discountId,
          CheckValue:this.valueflag,
        }
        this._managePlanService.ActiveDeactiveDiscountCode(model).subscribe((response:any) => {
          if(response != null){
            this.GetDiscountCodeList();
           }
         });
    }

    addEditDiscountCode(id:any){
      const model: DialogModel = {
        Id: id,
        HeaderText: "Edit Plan",
        Type:0,
      };
      const dialogRef = this.dialog.open(AddEditDiscountCodeComponent, {
        width: "380px",
        data: model
      }); 
      this.dialogCtrl.nativeElement.focus();
      dialogRef.afterClosed().subscribe(result => { });

    }
  
    exportAsXLSX(): void {
    const items =<any>[];
    this.pagesize = 100000;
    this._managePlanService.GetSubscriptionPlanList(this.search,this.pageIndex,this.pagesize)
    .subscribe((response: any) => {
      if (response.Data !== null) {
        debugger
        this.dataSource =  response.data;
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

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
