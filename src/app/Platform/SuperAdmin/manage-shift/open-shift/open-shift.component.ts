import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManageUserShiftService} from '../../../Services/manageUserShiftService/manage-user-shift.service';
import { AgencyModel} from '../../../Model/AgencyModel'
import { Sort } from "@angular/material/sort";
import { DefaultNumber } from '../../../../Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { ExportToExcelService } from '../../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { StylePaginatorDirective } from "../../../../Utilities/contract/PaginatorStyleDirective"; 
import { SendInviteComponent} from '../send-invite/send-invite.component';
import { DialogModel } from 'src/app/Platform/Model/DialogModel';
import { AuthService } from 'src/app/auth/auth.service';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import { CoreService } from 'src/app/core.service';

@Component({
  selector: 'app-open-shift',
  templateUrl: './open-shift.component.html',
  styleUrls: ['./open-shift.component.css']
})
export class OpenShiftComponent implements OnInit {
  name = "Angular " + VERSION.major;
  title: string = 'Open Shifts';
  isFilter: boolean = false;
  userShiftForm!: FormGroup;
  hide : boolean = false;
  search : string ='';
  status: string ="1";
  userId:any;
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["shiftNo","title", "caregiver","shiftType", "shiftStartDate", "shiftEndDate", "shiftStartTime", "duration","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  loaderflag:boolean = false;
  pageChangeEvent(event:any) {}
  filterCard: boolean = false;
  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;
  isDisabled:boolean = true;
  maxDate = new Date();
  DiagnosisList:DropdownList[]=[];

  constructor( 
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _manageUserShiftService: ManageUserShiftService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
    public coreService:CoreService) { }
    
  ngOnInit(): void {
    this.userId=this.authService.userID;
    this.CreateFormGroup();
    this.GetUserShiftDropDownList();
    this.GetUserShiftList("searching");
  }

  filterCardToggle(){
    this.filterCard = !this.filterCard;
  }

  CreateFormGroup(): void {
    this.userShiftForm = this.fb.group({
      Search: new FormControl(""),
      Diagnosis:new FormControl(""),
      ShiftDate: new FormControl(""),
      City: new FormControl(""),
      ZipCode:new FormControl(""),
    })
  }
    // Method for get all user shift list for manage screen--
  GetUserShiftList(type:any){
      this.loaderflag = true;
      let shiftDate = this.coreService.formatDateString(this.userShiftForm.controls['ShiftDate'].value);
      const model ={
        Status: this.status,
        Search: this.userShiftForm.controls['Search'].value,
        Diagnosis: this.userShiftForm.controls['Diagnosis'].value,
        ShiftDate: shiftDate,
        City: this.userShiftForm.controls['City'].value,
        ZipCode:this.userShiftForm.controls['ZipCode'].value,
        PageIndex : this.pageIndex,
        PageSize : this.pagesize
        }
        this._manageUserShiftService.GetUserShiftListService(model).subscribe((response:any)=>{
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
       }
      })
  }

     // Method for get dropdownlist
     GetUserShiftDropDownList(){
      this.loaderflag=true;
      this._manageUserShiftService.GetUserShiftDropDownListService(this.userId).subscribe((response:ResponseStatus<DropdownList[]>)=>{
      this.DiagnosisList = response.data;
      this.DiagnosisList = this.DiagnosisList.filter(p=>p.FlagId == DefaultNumber.Nine)
      this.DiagnosisList.unshift({ FlagId: DefaultNumber.Nine, Label: "Please Select", Id: "" });
      this.loaderflag=false;
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
        case 'shiftNo': return compare(a.ShiftNo, b.ShiftNo, isAsc);
        case 'title': return compare(a.Title, b.Title, isAsc);
        case 'caregiver': return compare(a.Patient, b.Patient, isAsc);
        case 'shiftType': return compare(a.ShiftType, b.ShiftType, isAsc);
        case 'shiftStartDate': return compare(a.ShiftStartDate, b.ShiftStartDate, isAsc);
        case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'shiftEndDate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'duration': return compare(a.Duration, b.Duration, isAsc);
        default: return 0;
      }
    });
  }    
  
  exportAsXLSX(): void {
    this.loaderflag=true;
    const items =<any>[];
    let exportsize = environment.defaultExportSize;
    const model ={
      Status: this.status,
      Search: this.userShiftForm.controls['Search'].value,
      Diagnosis: this.userShiftForm.controls['Diagnosis'].value,
      ShiftDate: this.coreService.formatDateString(this.userShiftForm.controls['ShiftDate'].value),
      City: this.userShiftForm.controls['City'].value,
      ZipCode:this.userShiftForm.controls['ZipCode'].value,
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
        "Patient Name": element.Patient,
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
     const workbook: XLSX.WorkBook = { Sheets: { "Open Shifts": worksheet }, SheetNames: ["Open Shifts"] };
     this.exportToExcelService.exportAsExcelFile(items, "Open Shifts",workbook);
     this.loaderflag=false;
    }    
    });
  }

  Print():any{
    window.print();
  }

  SendInvite(ShiftId:any,ShiftDate:any):any{
    const model: DialogModel = {
      Id: ShiftId,
      HeaderText: "",
      Type:ShiftDate,
    };
    const dialogRef = this.dialog.open(SendInviteComponent, {
      data: model,
      width: "40vw",
      maxWidth: "40vw",
      maxHeight: "50vh",
      height: "50vh"
    });
    this.dialogCtrl.nativeElement.focus();
    dialogRef.afterClosed().subscribe(result => { });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


