import { Component, OnInit, ViewChild,ElementRef,Inject } from '@angular/core';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageUserShiftService} from '../../../Services/manageUserShiftService/manage-user-shift.service';
import { ExportToExcelService } from '../../../Services/exportToExcelService/export-to-excel.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { AuthService } from "../../../../auth/auth.service";
import { ResponseStatus } from '../../../Model/ResponseStatusModel';
import { DropdownList } from '../../../Model/DropDownModel';
import { DialogModel } from '../../../Model/DialogModel';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { NumberHelper } from 'src/app/Utilities/contract/number-helper';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { AddAgencyService } from 'src/app/Platform/Services/addAgencyService/add-agency.service';

@Component({
  selector: 'app-assign-shift-caregiver',
  templateUrl: './assign-shift-caregiver.component.html',
  styleUrls: ['./assign-shift-caregiver.component.css']
})
export class AssignShiftCaregiverComponent implements OnInit {
  loaderflag:boolean = false;
  planForm!: FormGroup;
  shiftId:any;
  shiftDate:any;
  userId:any;
  agencyList:DropdownList[] =[];
  caregiverList:DropdownList[] =[];
  public _imageUrl: string = '';
  submitted!: boolean;
  title:any;
  fileTypeMessage: string;
  fileSizeMessage: string;
  agencyId:any;
  constructor( 
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogModel,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder, 
    private _toasterService: ToastrService ,
    public dialog: MatDialog, 
    private _manageUserShiftService: ManageUserShiftService,
    private fb: FormBuilder,
    private exportToExcelService: ExportToExcelService,
    public authService: AuthService,
    private _numberHelper:NumberHelper,
    private _AddAgencyService : AddAgencyService,
    ) { }

  ngOnInit(): void {
    this.title="Assign Shift";
    this.fileTypeMessage = CommonErrorMessages.AssignCaregiver;
    this.fileSizeMessage = "";
    this.CreateFormGroup();
    this.userId = this.authService.userID;
    this.shiftId   = this.dialogData.Id;
    this.shiftDate   = this.dialogData.Type;
    this.getAgencyData(this.userId);
  }

  CreateFormGroup(): void {
    this.planForm = this.fb.group({
      Id:new FormControl(0),
      ShiftId:new FormControl("0"),
      ShiftDate:new FormControl("0"),
      AgencyId:new FormControl("0"),
      CaregiverId:new FormControl("0"),     
      UserId:this.userId,
    })
  }

         //method for get Agency Details --
         getAgencyData(id : number):void {
          let data:any ; 
          this._AddAgencyService.GetAgencyProfileData(id).subscribe((response:any) => {
          if(response.data != null) {
            debugger
               this.agencyId = response.data[0].AgencyId;
               this.planForm.controls['AgencyId'].setValue(response.data[0].AgencyId);
               this.GetPlanDropDownList(response.data[0].AgencyId);
                  }
            })
           }


    // Method for get dropdownlist
   GetPlanDropDownList(agencyid:any){
    this._manageUserShiftService.GetAssignDropdownListService(agencyid).subscribe((response:ResponseStatus<DropdownList[]>)=>{
    this.caregiverList = response.data;
    this.caregiverList = this.caregiverList.filter(p=>p.FlagId == DefaultNumber.One)
    this.caregiverList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "0" });
    })
  } 


  SendInvite(){
    //debugger
    // let Agency = Number(this.planForm.controls['AgencyId'].value);
    let Cargiver = Number(this.planForm.controls['CaregiverId'].value);
    if(Cargiver==0)
    {
      this._toasterService.error(CommonErrorMessages.AssignCaregiver, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return ;
    }
   const model ={
    Id: this.planForm.controls['Id'].value,
    ShiftId: this.shiftId,
    ShiftDate: this.shiftDate,
    AgencyId: this.planForm.controls['AgencyId'].value,
    CaregiverId: this.planForm.controls['CaregiverId'].value,  
    UserId: this.userId,
  }
   this.submitted = true; 
   if (this.planForm.invalid) {
    this.submitted = true;
    return ;
  }
  if (this.planForm.valid) {
    if(model.Id==0){
      this._manageUserShiftService.AssigncaregivertoShiftService(model).subscribe((response:any)=>{
      if(response.statusCode != null){
        if(response.data!=null){
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.success(CommonSuccessMessages.CaregiverAssigned, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        location.reload();
      }
      else {
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
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
