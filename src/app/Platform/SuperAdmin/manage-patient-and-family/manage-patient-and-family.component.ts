import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { ManagePatientFamilyService } from '../../Services/manage-patient-family.service';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import Swal from 'sweetalert2'; 
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-manage-patient-and-family',
  templateUrl: './manage-patient-and-family.component.html',
  styleUrls: ['./manage-patient-and-family.component.css']
})
export class ManagePatientAndFamilyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["logo","name","username", "contactNo","location", "agency",  "DOB", "status", "block","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize:number= environment.defaultPageSize;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  hide : boolean = false;
  valueflag: boolean = false;
  patientAndFamilyform!: FormGroup;
  loaderflag:boolean = false;
  search : string ='';
  pageChangeEvent(event:any) {}
  totalPages = environment.defaultshowTotalPages;
  isDisabled:boolean = true;

  constructor(
     private exportToExcelService: ExportToExcelService ,
     private router: Router, 
     private _formBuilder: FormBuilder,
     public dialog: MatDialog,
     public _PatientFamilyService:ManagePatientFamilyService) { }

  ngOnInit(): void {
    this.CreateFormControl();
    this.GetPatientFamilyList();
  }
  CreateFormControl():void {
    this.patientAndFamilyform = this._formBuilder.group({
    Search: new FormControl("")
    });
  }

//Get Patient and family List for manage screen--
  GetPatientFamilyList(){
    this.loaderflag = true;
    this.search= this.patientAndFamilyform.controls['Search'].value
    this._PatientFamilyService.GetPatientFamilyListService(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
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
//Method used for change patient family status--
  changePatientFamilyStatus(patientfamilyId:any, value:any){
    if(value ==1 ){
      this.valueflag = true;
      }
      else{
        this.valueflag = false;
      }
    const model={
      PatientId : patientfamilyId,
      StatusValue:this.valueflag 
    }
    this._PatientFamilyService.ChangePatientFamilyStatus(model).subscribe((response:any) => {
      if(response != null){
        this.GetPatientFamilyList();
      }
    }
    )
  }
//Method used for block unblock patient family--
  BlockUnblockPatientFamily(patientfamilyId:any, value:any){
      if(value ==1 ){ this.valueflag = true;}
      else{ this.valueflag = false; }
      const model={
        PatientId : patientfamilyId,
        StatusValue:this.valueflag
      }
      this._PatientFamilyService.BlockUnblockPatientFamily(model).subscribe((response:any) => {
        if(response != null){
          this.GetPatientFamilyList();
        }})
      }
//Method used for Delete patient family--
  

  DeletePatientFamily(id:any){
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
        this._PatientFamilyService.DeletedPatientFamily(id).subscribe((response:any) => {
          if(response.message='OK'){

            Swal.fire(
              'Deleted!',
              'Patient has been deleted successfully.',
              'success'
            )
            this.GetPatientFamilyList();
          }
        })
      }
    })
  } 
//Method used for shorting manage screen data--
  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a:any,b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {        
        case 'name': return compare(a.Name, b.Name, isAsc);
        case 'type': return compare(a.Type, b.Type, isAsc);
        case 'userName': return compare(a.UserName, b.UserName, isAsc);
        case 'contactNo': return compare(a.PhoneNumber, b.PhoneNumber, isAsc);
        case 'location': return compare(a.Location, b.Location, isAsc);
        case 'agency': return compare(a.Agency, b.Agency, isAsc);
        case 'shift': return compare(a.Shift, b.Shift, isAsc);
        case 'status': return compare(a.Status, b.Status, isAsc);
        default: return 0;
      }
    });
    
  }
  exportAsXLSX(): void {
    const items =<any>[];
    let exportSize = environment.defaultExportSize;
    this._PatientFamilyService.GetPatientFamilyListService(this.search,this.pageIndex,exportSize)
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
        "Name": element.Patientname,
        "Type": element.Type,             
        "UserName": element.UserName,
        "Contact": element.Contact,
        "Address":element.Location, 
        "Agency": element.AgencyName  
       
       };
       items.push(excelData);
      });
     }
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
     const workbook: XLSX.WorkBook = { Sheets: { "Patient List": worksheet }, SheetNames: ["Patient List"] };
     this.exportToExcelService.exportAsExcelFile(items, "Patient List",workbook);
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
