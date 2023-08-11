import { Component, OnInit, ViewChild,ElementRef,Inject } from '@angular/core';
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
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';

@Component({
  selector: 'app-add-edit-subscription-plan',
  templateUrl: './add-edit-subscription-plan.component.html',
  styleUrls: ['./add-edit-subscription-plan.component.css']
})
export class AddEditSubscriptionPlanComponent implements OnInit {
  loaderflag:boolean = false;
  planForm!: FormGroup;
  id:any;
  userId:any;
  stateList:DropdownList[] =[];
  planTypeList:DropdownList[] =[];
  public _imageUrl: string = '';
  submitted!: boolean;
  title:any;
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
    public authService: AuthService,
    private _numberHelper:NumberHelper,
    ) { }

  ngOnInit(): void {
    this.title="Upgrade Plan";
    this.CreateFormGroup();
    this.GetPlanDropDownList();
    this.userId = this.authService.userID;
    this.id   = this.dialogData.Id;
    if(this.id != 0){
    //this.title="Edit Plan";
    this.getUserData(this.id);}
  }

  CreateFormGroup(): void {
    this.planForm = this.fb.group({
      Id:new FormControl(0),
      PlanName:new FormControl("", Validators.required),
      PlanType:new FormControl("", Validators.required),
      Monthly:new FormControl(true, Validators.required),
      Annualy:new FormControl(false, Validators.required),
    })
  }

    // Method for get dropdownlist
   GetPlanDropDownList(){
    this._managePlanService.GetDropdownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.stateList = response.data;
    this.stateList = this.stateList.filter(p=>p.FlagId == DefaultNumber.One)
    this.stateList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "" });
    this.planTypeList = response.data;
    this.planTypeList = this.planTypeList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.planTypeList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "" });
    })
  } 


 getUserData(id:any){
  this.loaderflag= true;
  this._managePlanService.GetSubscriptionPlanData(id).subscribe((response:any)=>{
    if(response.data !=""){
      this.planForm.controls['Id'].setValue(response.data[0].Id);
      this.planForm.controls['PlanName'].setValue(response.data[0].PlanName);
      this.planForm.controls['PlanType'].setValue(response.data[0].PlanType.toString());   
      this.planForm.controls['MonthlyPlan'].setValue(response.data[0].MonthlyPlan);
      this.planForm.controls['AnnualPlan'].setValue(response.data[0].AnnualPlan);
  
     }
   })
}

upgradeSubscriptionPlan(){
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
        if(response.data!=null){
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.success(CommonSuccessMessages.RecordSavedSuccessfully, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        location.reload();
      }
      else {
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.error(CommonErrorMessages.PlanAlreadyExist, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        return;
       }
       }
     })
    }
    else{
      this._managePlanService.UpdateSubscriptionPlan(model).subscribe((response:any)=>{
        if(response.statusCode == 200){
          if(response.data!=null){
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          location.reload();
          // this.router.navigate(["/Dashboard/ManageUsers"]);
         }
         else {
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.error(CommonErrorMessages.PlanAlreadyExist, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          return;
        }
        }        
       })
    }
  }
}

checkIsNumber(event:any) {
  let result = this._numberHelper.keyPressNumbers(event);
  return result;
}
}
