import { Component, OnInit, ViewChild,ElementRef,Inject, ChangeDetectorRef } from '@angular/core';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManagePlanService} from '../../../Services/managePlanService/manage-plan.service';
import { ExportToExcelService } from '../../../Services/exportToExcelService/export-to-excel.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { AuthService } from "../../../../auth/auth.service";
import { ResponseStatus } from '../../../Model/ResponseStatusModel';
import { DropdownList } from '../../../Model/DropDownModel';
import { DialogModel } from '../../../Model/DialogModel';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { NumberHelper } from 'src/app/Utilities/contract/number-helper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AddAssociateService } from 'src/app/Platform/Services/associateService/add-associate.service';
import Swal from 'sweetalert2';
import { Sort } from '@angular/material/sort';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-associate-members',
  templateUrl: './associate-members.component.html',
  styleUrls: ['./associate-members.component.css']
})
export class AssociateMembersComponent implements OnInit {
  title: string = 'Associates';
  isFilter: boolean = false;
  userId:any;
  agencyform!: FormGroup;
  search: string = '';
  loaderflag: boolean = false;
  public agencyList: any = [];
  valueflag: boolean = false;
  hide : boolean = false;
  id : any;
  referralid:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ["associateName", "contactNo", "email", "address", "associatewith","status","action"];
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  pageChangeEvent(event:any) {}

  constructor( 
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogModel,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _managePlanService: ManagePlanService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    private _numberHelper:NumberHelper,
    private _addAssociateService: AddAssociateService,
    private cd: ChangeDetectorRef,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.CreateFormControl();
    this.id   = this.dialogData.Id;
    this.referralid   = this.dialogData.Type;
    if(this.id != 0){
    this.GetAssociateList();
    }    
  }

  CreateFormControl(): void {
    this.agencyform = this._formBuilder.group({
      Search: new FormControl("")
    });
  }

  GetAssociateList() {
    this.loaderflag = true;
    this.search = this.agencyform.controls['Search'].value
    this._addAssociateService.GetAssociateListService(this.referralid,this.search, this.pageIndex, this.pagesize).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;
      this.recordcount = this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
      if (this.recordcount > 0) {
        this.loaderflag = false;
        this.hide = true;
      }
      else {
        this.loaderflag = false;
        this.hide = false;
      }
    })
  }

  deleteAssociate(id:any){
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
        this._addAssociateService.DeleteAssociate(id).subscribe((response:any) => {
          if(response.message='OK'){
            Swal.fire(
              'Deleted!',
              'Associate has been deleted.',
              'success'
            )
            this.GetAssociateList();
          }
        })
      }
    })
  }

  ActiveDeactiveAssociate(PlanId:any,value:any){
    if(value ==false ){
      this.valueflag = true;
      }
      else{
        this.valueflag = false;
      }
      const model={
        AssociateId : PlanId,
        CheckValue:this.valueflag,
      }
      this._addAssociateService.ActiveDeactiveAssociate(model).subscribe((response:any) => {
        if(response != null){
          this.GetAssociateList();
         }
       });
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'agencyName': return compare(a.AgencyName, b.AgencyName, isAsc);
        case 'contactName': return compare(a.FirstName, b.FirstName, isAsc);
        case 'userName': return compare(a.UserName, b.UserName, isAsc);
        case 'contactNo': return compare(a.PhoneNumber, b.PhoneNumber, isAsc);
        case 'email': return compare(a.AgencyEmail, b.AgencyEmail, isAsc);
        case 'address': return compare(a.Address1, b.Address1, isAsc);
        case 'status': return compare(a.IsActive, b.IsActive, isAsc);
        // case 'caregiverAssocciate': return compare(, isAsc);
        default: return 0;
      }
    });
  }

  exportAsXLSX(): void {
    const items =<any>[];
    this.pagesize = 100000;
    this._addAssociateService.GetAssociateListService(this.referralid,this.search,this.pageIndex,this.pagesize)
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
          "Associate Name": element.AssociateName,
          "Contact": element.ContactNumber,
          "Email": element.Email,  
          "Address": element.Address,             
          "Associated With": element.AssociatedWith,
       
       };
       items.push(excelData);
      });
     }
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
     const workbook: XLSX.WorkBook = { Sheets: { "Associate List": worksheet }, SheetNames: ["Associate List"] };
     this.exportToExcelService.exportAsExcelFile(items, "Associate List",workbook);
    }    
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
