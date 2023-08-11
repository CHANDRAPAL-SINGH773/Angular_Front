import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Sort } from '@angular/material/sort';
import { DefaultNumber } from '../../../Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CredentialingServiceService } from '../../Services/credentialing-service/credentialing-service.service';


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
  selector: 'app-manage-credentialing',
  templateUrl: './manage-credentialing.component.html',
  styleUrls: ['./manage-credentialing.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageCredentialingComponent implements OnInit {
  title: string = 'Manage Credentials';
  isFilter: boolean = false;
  credentialingform!: FormGroup;
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
  displayedColumns = ["Caregivername", "docsexpiring", "email", "status", "action"];

  expandedElement: AgencyList | null;

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _credentialService: CredentialingServiceService,
    private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.CreateFormControl();
    this.GetCredentialingList();
  }

  CreateFormControl(): void {
    this.credentialingform = this._formBuilder.group({
      Search: new FormControl("")
    });
  }

  GetCredentialingList() {
    this.loaderflag = true;
    this.search = this.credentialingform.controls['Search'].value
    this._credentialService.GetCredentialingListService(this.search, this.pageIndex, this.pagesize).subscribe((response: any) => {
      if(response.data !=null){
      this.dataSource = new MatTableDataSource(response.data );
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
      this.GetCredentialingList();
    } else {
      this.pagesize = event.pageSize;
      this.GetCredentialingList();
    }
  }
  changeCredentialingStatus(Id: any, value: any) {
    const model = {
      CredentialingId: Id,
      CredentialValue: value
    }
    this._credentialService.ChangeCredentialingStatus(model).subscribe((response: any) => {
      if (response != null) {
        this.GetCredentialingList();
      }
    }
    )
  }
 
  deleteCredential(id: any) {
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
        this._credentialService.DeletedCredentialing(id).subscribe((response: any) => {
          if (response.message = 'OK') {

            Swal.fire(
              'Deleted!',
              'Credential has been deleted successfully.',
              'success'
            )
            this.GetCredentialingList();
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
    ["Caregivername", "docsexpiring", "email", "status", "action"];
    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Caregivername': return compare(a.AgencyName, b.AgencyName, isAsc);
        case 'docsexpiring': return compare(a.FirstName, b.FirstName, isAsc);
        case 'email': return compare(a.UserName, b.UserName, isAsc);
        case 'status': return compare(a.PhoneNumber, b.PhoneNumber, isAsc);
        default: return 0;
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
