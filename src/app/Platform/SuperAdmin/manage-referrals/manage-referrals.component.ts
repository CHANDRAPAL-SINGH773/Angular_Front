import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ManageReferralService} from '../../Services/manageReferralsService/manage-referral.service';
import { AgencyModel} from '../../Model/AgencyModel'
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AgencyList } from '../manage-agencies/manage-agencies.component';
import { DialogModel } from '../../Model/DialogModel';
import {AssociateMembersComponent} from './associate-members/associate-members.component';

@Component({
  selector: 'app-manage-referrals',
  templateUrl: './manage-referrals.component.html',
  styleUrls: ['./manage-referrals.component.css']
})
export class ManageReferralsComponent implements OnInit {

  title: string = 'Manage Referrals';
  isFilter: boolean = false;
  Referralform!: FormGroup;
  public agencyList: any =[];
  // mat Table settings
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["logo","BuisnessName","CPFirstName","UserName", "BuisnessContactNo", "BuisnessEmail", "BuisnessAddress","AssociateMember", "status", "block"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize:number= environment.defaultPageSize;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  hide : boolean = false;
  search : string ='';
  status: string ="1";
  valueflag :boolean = false;
  loaderflag:boolean = false;
  pageChangeEvent(event:any) {}
  totalPages = environment.defaultshowTotalPages;
  isDisabled:boolean = true;

  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;

  constructor( 
     private _formBuilder: FormBuilder,
     private _toasterService: ToastrService ,
     public dialog: MatDialog, 
     private _manageReferralService: ManageReferralService,
     private exportToExcelService: ExportToExcelService,
     private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.CreateFormControl();
    this.GetReferralList("searching");
  }


  CreateFormControl():void {
    this.Referralform = this._formBuilder.group({
      Search: new FormControl("")
    });
  
  } 

    // Method for get all Referral list for manage screen--
    GetReferralList(type:any){
      this.loaderflag = true;
      if(type=="Paging")
      {
        this.recordcount = this.pageIndex * this.pagesize;
      }
      else {
        this.recordcount = DefaultNumber.Zero;
        this.pageIndex = DefaultNumber.Zero;
      }
      this.search= this.Referralform.controls['Search'].value
      this._manageReferralService.GetReferralListService(this.status,this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
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
    } 
    sortData(sort: Sort) {
      const data = this.dataSource.data.slice();
      if (!sort.active || sort.direction === '') {
        this.dataSource.data = data;
        return;
      }
  
      this.dataSource.data = data.sort((a:any,b:any) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {        
          case 'BuisnessName': return compare(a.BuisnessName, b.BuisnessName, isAsc);
          case 'CPFirstName': return compare(a.CPFirstName, b.CPFirstName,isAsc);
          case 'UserName': return compare(a.UserName, b.UserName, isAsc);
          case 'BuisnessContactNo': return compare(a.BuisnessContactNo, b.BuisnessContactNo, isAsc);
          case 'BuisnessEmail': return compare(a.BuisnessEmail, b.BuisnessEmail, isAsc);
          case 'BuisnessAddress': return compare(a.BuisnessAddress, b.BuisnessAddress, isAsc);
          case 'AssociateMember': return compare(a.MemberCount, b.MemberCount, isAsc);
          case 'status': return compare(a.IsActive, b.IsActive, isAsc);
          // case 'ReferralAssocciate': return compare(, isAsc);
          default: return 0;
        }
      });     
    }

    changeReferralStatus(ReferralId:any,value:any){
      if(value ==1 ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
      const model={
        ReferralId : ReferralId,
        ReferralValue:this.valueflag
      }
      this._manageReferralService.ChangeReferralStatus(model).subscribe((response:any) => {
        if(response != null){
          this.GetReferralList("searching");
        }
      }
      )
    }

    BlockUnblockReferral(ReferralId:any,value:any){
       
      if(value ==1 ){
      this.valueflag = true;
      }
      else{
        this.valueflag = false;
      }
      const model={
        ReferralId : ReferralId,
        ReferralValue:this.valueflag,
      }
      this._manageReferralService.BlockUnblockReferral(model).subscribe((response:any) => {
        if(response != null){
          this.GetReferralList("searching");
        }
      }
      )
    }

    deleteReferral(id:any){
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
          this._manageReferralService.DeletedReferral(id).subscribe((response:any) => {
            if(response.message='OK'){

              Swal.fire(
                'Deleted!',
                'Referral has been deleted successfully.',
                'success'
              )
              this.GetReferralList("searching");
            }
          })
        }
      })
    } 
   
    OpenPopup(referralId:any,userId:any):any{
      const model: DialogModel = {
        Id: referralId,
        HeaderText: "",
        Type:userId,
      };
      const dialogRef = this.dialog.open(AssociateMembersComponent, {
        data: model,
        width: "80vw",
        maxWidth: "80vw",
        maxHeight: "80vh",
        height: "80vh"
      });
      //this.dialogCtrl.nativeElement.focus();
      dialogRef.afterClosed().subscribe(result => { });


    }

    exportAsXLSX(): void {
        const items =<any>[];
        let exportSize = environment.defaultExportSize;
        this._manageReferralService.GetReferralListService(this.status,this.search,this.pageIndex,exportSize)
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
              "Referral Name": element.BuisnessName ,
              "User Name": element.UserName,             
              "Contact No": element.BuisnessContactNo,
              "Email": element.BuisnessEmail,
              "Address":element.BuisnessAddress, 
           
           };
           items.push(excelData);
          });
         }
         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
         const workbook: XLSX.WorkBook = { Sheets: { "Referral List": worksheet }, SheetNames: ["Referral List"] };
         this.exportToExcelService.exportAsExcelFile(items, "Referral List",workbook);
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
