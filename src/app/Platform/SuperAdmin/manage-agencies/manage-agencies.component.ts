import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManageAgencyService } from '../../Services/manageAgencyService/manage-agency.service';
import { AgencyModel } from '../../Model/AgencyModel'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Sort } from '@angular/material/sort';
import { DefaultNumber } from '../../../Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


export interface AgencyList {
  logo: string;
  agencyName: string;
  contactName: string;
  userName: string;
  contactNo: string;
  email: string;
  address: string;
  caregiverAssocciate: string;
  status: string;
  block: string;
  action: string;
  addresses?: InnerAgencyList[] | MatTableDataSource<InnerAgencyList>; 
}

export interface InnerAgencyList {
  logo:string;
  contactname: string;
  contactno: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-manage-agencies',
  templateUrl: './manage-agencies.component.html',
  styleUrls: ['./manage-agencies.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageAgenciesComponent implements OnInit {
  title: string = 'Manage Agencies';
  isFilter: boolean = false;
  agencyform!: FormGroup;
  search: string = '';
  fromRecords: number = 1;
  toRecords: number = 2;
  page = 1;
  totalRecord: number = 5;
  recordCount: number = 0;
  pageSize: any = environment.imageUrl;
  loaderflag: boolean = false;

  public agencyList: any = [];
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  valueflag: boolean = false;
  hide : boolean = false;
  isDisabled:boolean = true;
  pageChangeEvent(event:any) {}

  // for new table
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<InnerAgencyList>>;

  usersData: AgencyList[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns = ["logo", "agencyName", "contactName", "userName", "contactNo", "email", "address", "caregiverAssocciate", "status", "block", "action"];
 // innerDisplayedColumns = ["logo","contactname", "contactno", "email", "address"];
  expandedElement: AgencyList | null;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private _toasterService: ToastrService,
    public dialog: MatDialog,
    private _manageAgencyService: ManageAgencyService,
    private exportToExcelService: ExportToExcelService,
    private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.CreateFormControl();
    this.GetAgencyList();
  }

  toggleRow(element: AgencyList) {
    element.addresses && (element.addresses as MatTableDataSource<InnerAgencyList>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<InnerAgencyList>).sort = this.innerSort.toArray()[index]);
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<InnerAgencyList>).filter = filterValue.trim().toLowerCase());
  }

  CreateFormControl(): void {
    this.agencyform = this._formBuilder.group({
      Search: new FormControl("")
    });
  }

  GetAgencyList() {
    this.loaderflag = true;
    this.search = this.agencyform.controls['Search'].value
    this._manageAgencyService.GetAgencyListService(this.search, this.pageIndex, this.pagesize).subscribe((response: any) => {
      if(response.data !=null){
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;
      this.recordcount = this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
      if (this.recordcount > 0) {
         this.loaderflag = false;
         this.hide=true;
         this.isDisabled = false;
      }
      else {
         this.loaderflag = false;
         this.hide=false;
         this.isDisabled = false;
       }
     }
     else{
         this.loaderflag = false;
         this.hide=false;
     }
    })
  }

  switchPage(event: any): void {
    this.pageIndex = event.pageIndex;
    if (this.pagesize !== event.pageSize) {
      this.pagesize = event.pageSize;
      this.GetAgencyList();
    } else {
      this.pagesize = event.pageSize;
      this.GetAgencyList();
    }
  }
  changeAgencyStatus(AgencyId: any, value: any) {
    const model = {
      AgencyId: AgencyId,
      AgencyValue: value
    }
    this._manageAgencyService.ChangeAgencyStatus(model).subscribe((response: any) => {
      if (response != null) {
        this.GetAgencyList();
      }
    }
    )
  }
  BlockUnblockAgency(AgencyId: any, value: any) {

    if (value == 1) {
      this.valueflag = true;
    }
    else {
      this.valueflag = false;
    }
    const model = {
      AgencyId: AgencyId,
      AgencyValue: this.valueflag,
    }
    this._manageAgencyService.BlockUnblockAgency(model).subscribe((response: any) => {
      if (response != null) {
        this.GetAgencyList();
      }
    }
    )
  }
  deleteAgency(id: any) {
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
        this._manageAgencyService.DeletedAgency(id).subscribe((response: any) => {
          if (response.message = 'OK') {

            Swal.fire(
              'Deleted!',
              'Agency has been deleted successfully.',
              'success'
            )
            this.GetAgencyList();
          }
        })
      }
    })
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
    const items = <any>[];
    let exportsize = environment.defaultExportSize;
    this._manageAgencyService.GetAgencyListService(this.search, this.pageIndex, exportsize)
      .subscribe((response: any) => {
        if (response.Data !== null) {
          debugger
          this.dataSource = new MatTableDataSource(response.data);
          this.recordcount = this.dataSource.data.length > 0 ? this.dataSource.data.length : 0;
          if (this.recordcount > 0) {
            const obj = <any>[];
            const list = this.dataSource.data as Array<any>;
            list.forEach(element => {
              const excelData = {
                "Agency Name": element.AgencyName,
                "Contact Name": element.FirstName,
                "UserName": element.UserName,
                "Contact No": element.PhoneNumber,
                "Email": element.AgencyEmail,
                "Address": element.Address,

              };
              items.push(excelData);
            });
          }
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
          const workbook: XLSX.WorkBook = { Sheets: { "Agency List": worksheet }, SheetNames: ["Agency List"] };
          this.exportToExcelService.exportAsExcelFile(items, "Agency List", workbook);
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
