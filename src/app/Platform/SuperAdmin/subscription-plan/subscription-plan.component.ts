import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ManagePlanService} from '../../Services/managePlanService/manage-plan.service';
import { AgencyModel} from '../../Model/AgencyModel'
import { Sort } from "@angular/material/sort";
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { ExportToExcelService } from '../../Services/exportToExcelService/export-to-excel.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { AuthService } from "../../../auth/auth.service";
import { ResponseStatus } from '../../Model/ResponseStatusModel';
import { DropdownList } from '../../Model/DropDownModel';
import { AddEditPlanComponent } from './add-edit-plan/add-edit-plan.component';
import { DialogModel } from '../../Model/DialogModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit {
  loaderflag:boolean = false;
  planForm!: FormGroup;
  search :string='';
  hide : boolean = false;
  // mat Table settings
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ["planName","planType", "state","monthlyplanprice", "annualplanprice", "active","action"];  
  dataSource : MatTableDataSource<any> = new MatTableDataSource();
  recordcount: number = DefaultNumber.Zero;
  pagesize = environment.defaultPageSize;
  totalPages = environment.defaultshowTotalPages;
  pageIndex: number = DefaultNumber.Zero;
  pageSizeList = environment.pageSizeList;
  pageChangeEvent(event:any) {}
  submitted!: boolean;
  userId:any;
  stateList:DropdownList[] =[];
  planTypeList:DropdownList[] =[];
  displayStyle = "none";
  valueflag :boolean = false;
  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;

  constructor(
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _managePlanService: ManagePlanService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loaderflag=true;
    this.CreateFormGroup();
    this.GetPlanList();
    this.userId = this.authService.userID;
    this.GetPlanDropDownList();
    this.loaderflag=false;
  }

  CreateFormGroup(): void {
    this.planForm = this.fb.group({
      Id:new FormControl(0),
      PlanName:new FormControl("", Validators.required),
      PlanType:new FormControl("0", Validators.required),
      State:new FormControl("0", Validators.required),
      MonthlyPlan:new FormControl("0", Validators.required),
      AnnualPlan:new FormControl("0", Validators.required),
      UserId:this.userId,
    })
  }

    // Method for get dropdownlist
   GetPlanDropDownList(){
    this._managePlanService.GetDropdownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.stateList = response.data;
    this.stateList = this.stateList.filter(p=>p.FlagId == DefaultNumber.One)
    this.stateList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "0" });
    this.planTypeList = response.data;
    this.planTypeList = this.planTypeList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.planTypeList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "0" });
    })
  } 

      // Method for get all subscription plan list for manage screen--
      GetPlanList(){
        this.loaderflag = true;
        this.search= '';
         this._managePlanService.GetSubscriptionPlanList(this.search,this.pageIndex,this.pagesize).subscribe((response:any)=>{
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
          case 'planName': return compare(a.PlanName, b.PlanName, isAsc);
          case 'planType': return compare(a.PlanType, b.PlanType, isAsc);
          case 'state': return compare(a.State, b.State, isAsc);
          case 'monthlyplanprice': return compare(a.MonthlyPlan, b.MonthlyPlan, isAsc);
          case 'annualplanprice': return compare(a.AnnualPlan, b.AnnualPlan, isAsc);
          default: return 0;
        }
      });
     }  

     deleteUser(id:any){
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
          this._managePlanService.DeleteSubscriptionPlan(id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Subscription Plan has been deleted.',
                'success'
              )
              this.GetPlanList();
            }
          })
        }
      })
    }

    ActiveDeactivePlan(PlanId:any,value:any){
      if(value ==false ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
        const model={
          PlanId : PlanId,
          CheckValue:this.valueflag,
        }
        this._managePlanService.ActiveDeactivePlan(model).subscribe((response:any) => {
          if(response != null){
            this.GetPlanList();
           }
         });
    }

    addEditPlanData(id:any){
      const model: DialogModel = {
        Id: id,
        HeaderText: "Edit Plan",
        Type:0,
      };
      const dialogRef = this.dialog.open(AddEditPlanComponent, {
        width: "380px",
        data: model
      }); 
      this.dialogCtrl.nativeElement.focus();
      dialogRef.afterClosed().subscribe(result => { });

    }

    saveSubscriptionPlan(){
      debugger
      const model ={
        Id: this.planForm.controls['Id'].value,
        PlanName: this.planForm.controls['PlanName'].value,
        PlanType: this.planForm.controls['PlanType'].value,
        State: this.planForm.controls['State'].value,
        MonthlyPlan: this.planForm.controls['MonthlyPlan'].value,
        AnnualPlan: this.planForm.controls['AnnualPlan'].value,     
        UserId: this.userId,
      }
       this.submitted = true; 
       if (this.planForm.invalid) {
        this.submitted = true;
        return ;
      }
      if (this.planForm.valid) {
        if(model.Id==0){
          this._managePlanService.SaveSubscriptionPlan(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            this._toasterService.toastrConfig.preventDuplicates = true;
            this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
            location.reload();
           }
         })
        }
        else{
          this._managePlanService.UpdateSubscriptionPlan(model).subscribe((response:any)=>{
            if(response.statusCode == 200){
              this._toasterService.toastrConfig.preventDuplicates = true;
              this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
              location.reload();
              // this.router.navigate(["/Dashboard/ManageUsers"]);
             }
           })
        }
      }
    }
  
  
    exportAsXLSX(): void {
    const items =<any>[];
    this.pagesize = 100000;
    this._managePlanService.GetSubscriptionPlanList(this.search,this.pageIndex,this.pagesize)
    .subscribe((response: any) => {
      if (response.Data !== null) {
        debugger
        this.dataSource =  response.data;
        this.recordcount =  this.dataSource.data.length > 0 ? this.dataSource.data.length :0;
        if(this.recordcount > 0) {
         const obj=<any>[];
         const list = this.dataSource.data as Array<any>;
         list.forEach(element => {
         const excelData = {
        "Name": element.EmpName,
        "Email": element.Email,             
        "UserName": element.UserName,
        "RoleName": element.RoleName,
        "Status":element.IsActive   
       };
       items.push(excelData);
      });
     }
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
     const workbook: XLSX.WorkBook = { Sheets: { "Users List": worksheet }, SheetNames: ["Users List"] };
     this.exportToExcelService.exportAsExcelFile(items, "UsersList",workbook);
    }    
    });
    }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
