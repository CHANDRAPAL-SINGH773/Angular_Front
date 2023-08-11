import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ManageCaregiverService} from '../../Services/manageCaregiverService/manage-caregiver.service';
import { AgencyModel} from '../../Model/AgencyModel'
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import * as XLSX from "xlsx";
import * as moment from "moment";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { AddAgencyService } from '../../Services/addAgencyService/add-agency.service';
@Component({
  selector: 'app-manage-agency-caregiver',
  templateUrl: './manage-agency-caregiver.component.html',
  styleUrls: ['./manage-agency-caregiver.component.css']
})
export class ManageAgencyCaregiverComponent implements OnInit {

  title: string = 'Manage Caregiver';
  isFilter: boolean = false;
  caregiverform!: FormGroup;
  public agencyList: any =[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["logo","caregiverName","userName", "contactNo", "email", "address", "rating", "status", "block","action"];  
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
  userId :any;
  agencyId :any;

  constructor( 
     private _formBuilder: FormBuilder,
     private _toasterService: ToastrService ,
     public dialog: MatDialog, 
     private _manageCaregiverService: ManageCaregiverService,
     private exportToExcelService: ExportToExcelService,
     public authService: AuthService,
     private _AddAgencyService : AddAgencyService,
     ) { }
  ngOnInit(): void {
    this.userId=this.authService.userID;   
    this.CreateFormControl();
    this.getAgencyData(this.userId);
    //this.GetCareGiverList("searching");
  }

  CreateFormControl():void {
    this.caregiverform = this._formBuilder.group({
      Search: new FormControl(""),
      AgencyId: new FormControl("")
    });
  
  } 

       //method for get Agency Details --
    getAgencyData(id : number):void {
        let data:any ; 
        this._AddAgencyService.GetAgencyProfileData(id).subscribe((response:any) => {
        if(response.data != null) {
          debugger
             this.agencyId = response.data[0].AgencyId;
             this.caregiverform.controls['AgencyId'].setValue(response.data[0].AgencyId);
             this.GetCareGiverList("searching");
                }
          })
         }

    // Method for get all caregiver list for manage screen--
    // Method for get all caregiver list for manage screen--
    GetCareGiverList(type:any){
      this.loaderflag = true;
      if(type=="Paging")
      {
        this.recordcount = this.pageIndex * this.pagesize;
      }
      else {
        this.recordcount = DefaultNumber.Zero;
        this.pageIndex = DefaultNumber.Zero;
      }
      debugger
      this.search= this.caregiverform.controls['Search'].value;
      this.agencyId= this.caregiverform.controls['AgencyId'].value;
      this._manageCaregiverService.GetCaregiverListService(this.agencyId,this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
       if(response.data.length == 0){
        this.loaderflag = false;
        this.hide= true;
        this.isDisabled=true;
       }
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
          case 'caregiverName': return compare(a.AgencyName, b.AgencyName, isAsc);
          case 'userName': return compare(a.FirstName, b.FirstName, isAsc);
          case 'contactNo': return compare(a.PhoneNumber, b.PhoneNumber, isAsc);
          case 'email': return compare(a.AgencyEmail, b.AgencyEmail, isAsc);
          case 'address': return compare(a.Address1, b.Address1, isAsc);
          case 'status': return compare(a.IsActive, b.IsActive, isAsc);
          // case 'caregiverAssocciate': return compare(, isAsc);
          default: return 0;
        }
      });
      
    }
    changeCaregiverStatus(caregiverId:any,value:any){
      if(value ==1 ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
      const model={
        CaregiverId : caregiverId,
        CaregiverValue:this.valueflag
      }
      this._manageCaregiverService.ChangeCaregiverStatus(model).subscribe((response:any) => {
        if(response != null){
          this.GetCareGiverList("searching");
        }
      }
      )
    }
    BlockUnblockCaregiver(CaregiverId:any,value:any){
       
      if(value ==1 ){
      this.valueflag = true;
      }
      else{
        this.valueflag = false;
      }
      const model={
        CaregiverId : CaregiverId,
        CaregiverValue:this.valueflag,
      }
      this._manageCaregiverService.BlockUnblockcaregiver(model).subscribe((response:any) => {
        if(response != null){
          this.GetCareGiverList("searching");
        }
      }
      ) 
    }
    deleteCaregiver(id:any){
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
          this._manageCaregiverService.DeletedCaregiver(id).subscribe((response:any) => {
            if(response.message='OK'){

              Swal.fire(
                'Deleted!',
                'Caregiver has been deleted successfully.',
                'success'
              )
              this.GetCareGiverList("searching");
            }
          })
        }
      })
    } 

    exportAsXLSX(): void {
      const items =<any>[];
      let exportsize = environment.defaultExportSize;
      this.search= this.caregiverform.controls['Search'].value;
      this._manageCaregiverService.GetCaregiverListService(this.agencyId,this.search,this.pageIndex,exportsize)
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
          "Caregiver Name": element.FirstName +' '+element.LastName,
          "User Name": element.UserName,             
          "Contact No": element.Phone,
          "Email": element.Email,
          "Address":element.city+' '+element.Zipcode,   
         
         };
         items.push(excelData);
        });
       }
       const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
       const workbook: XLSX.WorkBook = { Sheets: { "Caregiver List": worksheet }, SheetNames: ["Caregiver List"] };
       this.exportToExcelService.exportAsExcelFile(items, "Caregiver List",workbook);
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
