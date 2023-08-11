import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from "@angular/material/sort";
import { environment } from 'src/environments/environment';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { ManageUserShiftService } from 'src/app/Platform/Services/manageUserShiftService/manage-user-shift.service';
import { ExportToExcelService } from 'src/app/Platform/Services/exportToExcelService/export-to-excel.service';

@Component({
  selector: 'app-cancelled-shift',
  templateUrl: './cancelled-shift.component.html',
  styleUrls: ['./cancelled-shift.component.css']
})
export class CancelledShiftComponent implements OnInit {
  title: string = 'Cancelled Shifts';
  isFilter: boolean = false;
  userShiftForm!: FormGroup;
  hide : boolean = false;
  search : string ='';
  status: string ="7";
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["shiftNo","title", "caregiver","shiftType", "shiftStartDate", "shiftEndDate", "shiftStartTime", "duration","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  pageChangeEvent(event:any) {}
  loaderflag:boolean = false;
  isDisabled:boolean = true;

  constructor( 
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _manageUserShiftService: ManageUserShiftService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService) { }
    
  ngOnInit(): void {
    this.CreateFormGroup();
    this.GetUserShiftList();
  }

  CreateFormGroup(): void {
    this.userShiftForm = this.fb.group({
      Search: new FormControl("")
    })
  }

    // Method for get all user shift list for manage screen--
    GetUserShiftList(){
      //debugger
      this.loaderflag = true;
      this.search= this.userShiftForm.controls['Search'].value;
      const model ={
        Status: this.status,
        Search: this.userShiftForm.controls['Search'].value,
        PageIndex : this.pageIndex,
        PageSize : this.pagesize
       }
        this._manageUserShiftService.GetUserShiftListService(model).subscribe((response:any)=>{
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
      })
      this.loaderflag = false;
    }

    switchPage(event:any):void {
      this.pageIndex = event.pageIndex;
      if (this.pagesize !== event.pageSize) {
        this.pagesize = event.pageSize;
        this.GetUserShiftList();
      } else {
        this.pagesize = event.pageSize;
        this.GetUserShiftList();
      }
    }

    onAllUserPaginateChange(event: any): void {
     // const matTable = document.getElementById("matTable");
     // matTable.scrollTop = 0;
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
        case 'shiftNo': return compare(a.ShiftNo, b.ShiftNo, isAsc);
        case 'title': return compare(a.Title, b.Title, isAsc);
        case 'caregiver': return compare(a.Caregiver, b.Caregiver, isAsc);
        case 'shiftType': return compare(a.ShiftType, b.ShiftType, isAsc);
        case 'shiftStartDate': return compare(a.ShiftStartDate, b.ShiftStartDate, isAsc);
        case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'duration': return compare(a.Duration, b.Duration, isAsc);
        default: return 0;
      }
    });
  }   
  ShiftAction(shiftID:any,action:any ){

    const model={
      ShiftId :shiftID,
      Action:action
    }
    this._manageUserShiftService.AppliedShiftActionService(model).subscribe((response: any) => {
      if (response != null) {
        this._toasterService.success(CommonSuccessMessages.Shiftstatuschange, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
      }
      this.GetUserShiftList();
    }
    )

  } 
  
  exportAsXLSX(): void {
    const items =<any>[];
    let exportsize = environment.defaultExportSize;
    const model ={
      Status: this.status,
      Search: this.userShiftForm.controls['Search'].value,
      PageIndex : this.pageIndex,
      PageSize : exportsize
     }
    this._manageUserShiftService.GetUserShiftListService(model)
    .subscribe((response: any) => {
      if (response.Data !== null) {
        this.dataSource =  new MatTableDataSource(response.data);
        this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
        if(this.recordcount > 0) {
         const obj=<any>[];
         const list = this.dataSource.data as Array<any>;
         list.forEach(element => {
         const excelData = {
        "Shift#": element.ShiftNo,
        "Title": element.Title,             
        "Caregiver Name": element.Caregiver,
        "Shift Type": element.ShiftType,
        "Start Date": moment(element.ShiftStartDate).format("MM/DD/YYYY"),   
        "End Date": moment(element.ShiftEndDate).format("MM/DD/YYYY"),
        "Shift Time": element.ShiftStartTime,
        "duration": element.Duration,
       };
       items.push(excelData);
      });
     }
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
     const workbook: XLSX.WorkBook = { Sheets: { "Cancelled Shifts": worksheet }, SheetNames: ["Cancelled Shifts"] };
     this.exportToExcelService.exportAsExcelFile(items, "Cancelled Shifts",workbook);
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
