import { Component, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from "@angular/material/sort";
import { DefaultNumber } from './../../../Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { ExportToExcelService } from './../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ManageStaffService } from '../../Services/staffManagementService/manage-staff.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AddAgencyService } from '../../Services/addAgencyService/add-agency.service';
@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  name = "Angular " + VERSION.major;
  isFilter: boolean = false;
  manageStaffForm!: FormGroup;
  hide : boolean = false;
  search : string ='';
  status: string ="1";
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["shiftname","designation", "contact","email", "address", "status", "block", "Action",];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  loaderflag:boolean = false;
  valueflag: boolean = false;
  userid :any;
  userType:any;
  agenyId:any
  pageChangeEvent(event:any) {}

  constructor( 
    public dialog: MatDialog, 
    private _manageStaffService: ManageStaffService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
    private _AddAgencyService : AddAgencyService) { }
    
  ngOnInit(): void {
    this.CreateFormGroup();
    this.userid = this.authService.userID;
    this.userType = this.authService.userType;
    this.getAgencyId(this.userid);
    
  }

  CreateFormGroup(): void {
    this.manageStaffForm = this.fb.group({
      Search: new FormControl("")
    })
  }

  getAgencyId(id : number):void {
    let data:any ; 
    this._AddAgencyService.GetAgencyID(id).subscribe((response:any) => {
    if(response.data != "") {
             this.agenyId = (response.data[0].AgencyId);
             this.GetAgencyStaffShiftList("searching");
            }
          })
        }

    // Method for get all released shift list for manage screen--
  GetAgencyStaffShiftList(type:any){
      this.loaderflag = true;
      if(type=="Paging")
      {
        this.recordcount = this.pageIndex * this.pagesize;
      }
      else {
        this.recordcount = DefaultNumber.Zero;
        this.pageIndex = DefaultNumber.Zero;
      }
        this.search= this.manageStaffForm.controls['Search'].value
        this._manageStaffService.GetStaffListService( this.agenyId,this.status,this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
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
        }
      })
      this.loaderflag = false;
  }

//Method used for change patient family status--
changeStaffStatus(staffId:any, value:any){
  if(value ==1 ){
    this.valueflag = true;
    }
    else{
      this.valueflag = false;
    }
  const model={
    StaffId : staffId,
    StaffValue:this.valueflag 
  }
  this._manageStaffService.ChangeStaffStatus(model).subscribe((response:any) => {
    if(response != null){
      this.GetAgencyStaffShiftList('Searching');
    }
  }
  )
}
//Method used for block unblock staff--
BlockUnblockStaff(staffId:any, value:any){
    if(value ==1 ){ this.valueflag = true;}
    else{ this.valueflag = false; }
    const model={
      StaffId : staffId,
      StaffValue:this.valueflag
    }
    this._manageStaffService.BlockUnblockStaff(model).subscribe((response:any) => {
      if(response != null){
        this.GetAgencyStaffShiftList('Searching');
      }})
    }

    deleteAgencyStaff(id:any){
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
        this._manageStaffService.DeletedStaff(id).subscribe((response:any) => {
          if(response.message='OK'){

            Swal.fire(
              'Deleted!',
              'Staff has been deleted successfully.',
              'success'
            )
           this.GetAgencyStaffShiftList('Searching');
          }
        })
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
        case 'shiftname': return compare(a.ShiftNo, b.ShiftNo, isAsc);
        case 'designation': return compare(a.CreatedOn, b.CreatedOn, isAsc);
        case 'contact': return compare(a.Qualificationname, b.Qualificationname, isAsc);
        case 'email': return compare(a.ShiftType, b.ShiftType, isAsc);
        case 'address': return compare(a.ShiftStartDate, b.ShiftStartDate, isAsc);
        case 'status': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'block': return compare(a.ShiftTime, b.ShiftTime, isAsc);
        default: return 0;
      }
    });
  }    
  
    exportAsXLSX(): void {
      const items =<any>[];
      this.pagesize = 100000;
      this._manageStaffService.GetStaffListService(this.userid,this.status,this.search,this.pageIndex,this.pagesize)
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
            "StaffName": element.FirstName,
            "Employee Type": element.EmployeeType,             
            "Contact No": element.Contact,
            "Email": element.Email,
            "Address": element.Address,  
         };
         items.push(excelData);
        });
       }
       const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
       const workbook: XLSX.WorkBook = { Sheets: { "Staff List": worksheet }, SheetNames: ["Staff List"] };
       this.exportToExcelService.exportAsExcelFile(items, "Staff List",workbook);
      }    
      });
      }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
