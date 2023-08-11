import { Component, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManageUserShiftService} from '../../Services/manageUserShiftService/manage-user-shift.service';
import { Sort } from "@angular/material/sort";
import { DefaultNumber } from '../../../Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { ManageCaregiverAgencyService } from '../../Services/manageCaregiverAgency/manage-caregiver-agency.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/auth.service';
import { DropdownList } from '../../Model/DropDownModel';
import { ResponseStatus } from '../../Model/ResponseStatusModel';
import { CoreService } from 'src/app/core.service';
@Component({
  selector: 'app-agency-invited-shift',
  templateUrl: './agency-invited-shift.component.html',
  styleUrls: ['./agency-invited-shift.component.css']
})
export class AgencyInvitedShiftComponent implements OnInit {
  name = "Angular " + VERSION.major;
  title: string = 'Invited Shifts';
  isFilter: boolean = false;
  releaseShiftForm!: FormGroup;
  hide : boolean = false;
  search : string ='';
  status: string ="6";
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["shiftNo","releasedate", "patientname", "shifttype", "startdate", "enddate", "shifttime", "priority","duration","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  loaderflag:boolean = false;
  userId:any;
  pageChangeEvent(event:any) {}
  isDisabled:boolean = true;
  maxDate = new Date();
  filterCard: boolean = false;
  DiagnosisList:DropdownList[]=[];

  constructor( 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _manageCAService: ManageCaregiverAgencyService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
    private _manageUserShiftService: ManageUserShiftService,
    public coreService:CoreService) { }
    
  ngOnInit(): void {
    this.userId = this.authService.userID;
    this.CreateFormGroup();
    this.GetUserShiftDropDownList();
    this.GetCaregiverAgencyShiftList("searching");
  }

  CreateFormGroup(): void {
    this.releaseShiftForm = this.fb.group({
      Search: new FormControl(""),
      Diagnosis:new FormControl(""),
      ShiftDate: new FormControl(""),
      City: new FormControl(""),
      ZipCode:new FormControl(""),
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

  filterCardToggle(){
    this.filterCard = !this.filterCard;
  }
    // Method for get all released shift list for manage screen--
  GetCaregiverAgencyShiftList(type:any){
      this.loaderflag = true;
      let shiftDate = this.coreService.formatDateString(this.releaseShiftForm.controls['ShiftDate'].value);
      const model ={
        Status: this.status,
        Search: this.releaseShiftForm.controls['Search'].value,
        Diagnosis: this.releaseShiftForm.controls['Diagnosis'].value,
        ShiftDate: shiftDate,
        City: this.releaseShiftForm.controls['City'].value,
        ZipCode:this.releaseShiftForm.controls['ZipCode'].value,
        PageIndex : this.pageIndex,
        PageSize : this.pagesize,
        UserId:this.userId
        }
        this._manageCAService.GetCaregiverAgencyShiftListService(model).subscribe((response:any)=>{
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
          this.hide = false;
          this.loaderflag = false;
          this.isDisabled=true;
        }
      })
      
  }

  deleteReleaseShift(id:any){
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
        this._manageCAService.DeletedReferralShift(id).subscribe((response:any) => {
          if(response.message='OK'){

            Swal.fire(
              'Deleted!',
              'Shift has been deleted successfully.',
              'success'
            )
           this.GetCaregiverAgencyShiftList('Searching');
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
        case 'shiftNo': return compare(a.ShiftNo, b.ShiftNo, isAsc);
        case 'releasedate': return compare(a.CreatedOn, b.CreatedOn, isAsc);
        case 'qualification': return compare(a.Qualificationname, b.Qualificationname, isAsc);
        case 'shifttype': return compare(a.ShiftType, b.ShiftType, isAsc);
        case 'startdate': return compare(a.ShiftStartDate, b.ShiftStartDate, isAsc);
        case 'enddate': return compare(a.ShiftEndDate, b.ShiftEndDate, isAsc);
        case 'shifttime': return compare(a.ShiftTime, b.ShiftTime, isAsc);
        case 'duration': return compare(a.referanceDuration, b.referanceDuration, isAsc);
        default: return 0;
      }
    });
  }    
  
  // method is used for export to excel --
    exportAsXLSX(): void {
      const items =<any>[];
      let exportsize = environment.defaultExportSize;
      const model ={
        Status: this.status,
        Search: this.releaseShiftForm.controls['Search'].value,
        Diagnosis: this.releaseShiftForm.controls['Diagnosis'].value,
        ShiftDate: this.coreService.formatDateString(this.releaseShiftForm.controls['ShiftDate'].value),
        City: this.releaseShiftForm.controls['City'].value,
        ZipCode:this.releaseShiftForm.controls['ZipCode'].value,
        PageIndex : this.pageIndex,
        PageSize : exportsize,
        UserId:this.userId
        }
      this._manageCAService.GetCaregiverAgencyShiftListService(model)
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
            "Shift": element.ShiftNo,
            "Qualification": element.Qualificationname,             
            "Patient Name": '',
            "Shift Type": element.ShiftType,
            "Start Date": moment(element.ShiftStartDate).format("MM/DD/YYYY"),   
            "End Date": moment(element.ShiftEndDate).format("MM/DD/YYYY"),
            "Shift Time": element.ShiftTime,
            "duration": element.referanceDuration, 
         };
         items.push(excelData);
        });
       }
       const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
       const workbook: XLSX.WorkBook = { Sheets: { "Agency Open Shift": worksheet }, SheetNames: ["Agency Open Shift"] };
       this.exportToExcelService.exportAsExcelFile(items, "Agency Open Shift",workbook);
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
