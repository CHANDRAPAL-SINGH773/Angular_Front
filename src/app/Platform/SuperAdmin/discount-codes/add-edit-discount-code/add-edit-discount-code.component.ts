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

@Component({
  selector: 'app-add-edit-discount-code',
  templateUrl: './add-edit-discount-code.component.html',
  styleUrls: ['./add-edit-discount-code.component.css']
})
export class AddEditDiscountCodeComponent implements OnInit {
  loaderflag:boolean = false;
  discountCodeForm!: FormGroup;
  id:any;
  userId:any;
  stateList:DropdownList[] =[];
  discountTypeList:DropdownList[] =[];
  public _imageUrl: string = '';
  submitted!: boolean;
  title:any;
  tempStates :any;

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
    this.title="Add Discount Code";
    this.CreateFormGroup();
    this.GetDicountCodeDropDownList();
    this.userId = this.authService.userID;
    this.id   = this.dialogData.Id;
    if(this.id != 0){
    this.title="Edit Discount Code";
    this.getDiscountCodeData(this.id);}
  }

  CreateFormGroup(): void {
    this.discountCodeForm = this.fb.group({
      DiscountId:new FormControl(0),
      CodeName:new FormControl("",Validators.required),
      DiscountType:new FormControl("", Validators.required),
      States:new FormControl("", Validators.required),
      Value:new FormControl("", Validators.required),
      Limit:new FormControl("", Validators.required),
      StartTime:new FormControl("", Validators.required),
      EndTime:new FormControl("", Validators.required),
      UserId:this.userId
    })
  }

    // Method for get dropdownlist
    GetDicountCodeDropDownList(){
    this._managePlanService.GetDiscountCodeDropdownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.stateList = response.data;
    this.stateList = this.stateList.filter(p=>p.FlagId == DefaultNumber.One)
    this.stateList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "" });
    this.discountTypeList = response.data;
    this.discountTypeList = this.discountTypeList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.discountTypeList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "" });
    })
  } 


  getDiscountCodeData(id:any){
  this.loaderflag= true;
  this._managePlanService.GetDiscountCodeData(id).subscribe((response:any)=>{
    if(response.data !=""){
      this.discountCodeForm.controls['DiscountId'].setValue(response.data[0].DiscountId);
      this.discountCodeForm.controls['CodeName'].setValue(response.data[0].CodeName);
      this.tempStates = response.data[0].States.split(','); 
      this.discountCodeForm.controls['States'].setValue(this.tempStates);
      this.discountCodeForm.controls['DiscountType'].setValue(response.data[0].DiscountType.toString());
      this.discountCodeForm.controls['Value'].setValue(response.data[0].Value);
      this.discountCodeForm.controls['Limit'].setValue(response.data[0].Limit);
      this.discountCodeForm.controls['StartTime'].setValue(response.data[0].StartTime);
      this.discountCodeForm.controls['EndTime'].setValue(response.data[0].EndTime);
     }
   })
}

saveDiscountCode(){
  const model ={
    DiscountId: this.discountCodeForm.controls['DiscountId'].value,
    CodeName: this.discountCodeForm.controls['CodeName'].value,
    DiscountType: this.discountCodeForm.controls['DiscountType'].value,
    States :this.discountCodeForm.controls['States'].value,
    Value: this.discountCodeForm.controls['Value'].value,
    Limit: this.discountCodeForm.controls['Limit'].value,
    StartTime: this.discountCodeForm.controls['StartTime'].value,  
    EndTime: this.discountCodeForm.controls['EndTime'].value,      
    UserId: this.userId,
  }
   this.submitted = true; 
   if (this.discountCodeForm.invalid) {
    this.submitted = true;
    return ;
  }
  if (this.discountCodeForm.valid) {
    if(model.DiscountId==0){
      this._managePlanService.SaveDiscountCode(model).subscribe((response:any)=>{
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
      this._managePlanService.UpdateDiscountCode(model).subscribe((response:any)=>{
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

checkIsNumber(event:any) {
  let result = this._numberHelper.keyPressNumbers(event);
  return result;
}
}
