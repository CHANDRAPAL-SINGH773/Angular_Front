import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';
import { GetAllMasterService } from '../../Services/Masters/get-all-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { AddCaregiverService } from '../../Services/addCaregiverService/add-caregiver.service';
import { AddMasterService } from '../../Services/Masters/add-master.service';
import Swal from 'sweetalert2';
import { DialogModel } from '../../Model/DialogModel';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CustomValidators } from 'src/app/Shared/custom.validator';
@Component({
  selector: 'app-manage-masters',
  templateUrl: './manage-masters.component.html',
  styleUrls: ['./manage-masters.component.css']
})
export class ManageMastersComponent implements OnInit {
  displayedColumns: string[] = ["name","maintype","status","action"];  
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
  mastertype:any = '';
  submitted:any;
  addSkillform!:FormGroup;
  showModalBox: boolean = false;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  ModelTitle:any = 'Add New';

  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;
  @ViewChild('masterModel') masterModel: any;
  constructor( public dialog: MatDialog, private _addMasterService : AddMasterService,  private _addcaregiverService: AddCaregiverService,  private _toasterService: ToastrService, private fb: FormBuilder,private _getMasterService : GetAllMasterService,private route: ActivatedRoute,private router: Router) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit(): void {
 
    this.mastertype = this.route.snapshot.params['type'];
    if (this.mastertype == 'Department') {
      this.GetDepartMentMasterList();
    }
    if (this.mastertype == 'Qualification') {
      this.GetQualificationMasterList();
    }
    if (this.mastertype == 'Employee') {
      this.GetEmployeeMasterList();
    }
    if (this.mastertype == 'Skill') {
      this.GetSkillList();
    }
    if (this.mastertype == 'Diagnosis') {
      this.GetDiagnosisList();
    }
    this.CreateFormGroup();
  }
  CreateFormGroup(): void {
    this.addSkillform = this.fb.group({
      MasterName:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      MainType: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      MasterId:new FormControl(""),
    })
  }
  //Method is used for get department type master list data --
    GetDepartMentMasterList() {
      this.loaderflag = true;
      this._getMasterService.GetDepartmentTypeMaster().subscribe((response: any) => {
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

//Method is used for get qualification master
GetQualificationMasterList() {
  this.loaderflag = true;
  this._getMasterService.GetQualificationMaster().subscribe((response: any) => {
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

//Method is used for get Employee Type master list--
GetEmployeeMasterList() {
  this.loaderflag = true;
  this._getMasterService.GetEmployeeTypeMaster().subscribe((response: any) => {
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


//Method for get Qualification master--
GetSkillList() {
  this.loaderflag = true;
    this._getMasterService.getSkillsMaster().subscribe((response: any) => {
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
      }})
}

//Method for get Qualification master--
GetDiagnosisList() {
  this.loaderflag = true;
  this._getMasterService.getDiagnosisMaster().subscribe((response: any) => {
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
    }})
}
    DeleteMasterItem(type:any,Id:any):any{
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
          if(type=='Department'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
                this.GetDepartMentMasterList();
            }
          })
        }
        else if(type=='Employee'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
                this.GetEmployeeMasterList();
            }
          })
        }
        else if(type=='Qualification'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
                this.GetQualificationMasterList();
            }
          })
        }

        else if(type=='Skill'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
                this.GetSkillList();
            }
          })
        }

        else if(type=='Diagnosis'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
                this.GetDiagnosisList();
            }
          })
        }
        }
      })
    }
    changeMasterStatus(MasterId:Number, MasterValue:any, MasterType:any):any{
      if(MasterValue ==1 ){
        this.valueflag = true;
        }
        else{
          this.valueflag = false;
        }
      const model={
        MasterId : MasterId,
        MasterValue:this.valueflag ,
        MasterType: MasterType
      }
      this._addMasterService.ChangeMasterStatus(model).subscribe((response:any) => {
        if(response != null){
          if(MasterType == 'Department'){
            this.GetDepartMentMasterList();
          }
          if(MasterType == 'Employee'){
            this.GetEmployeeMasterList();
          }
          if(MasterType == 'Qualification'){
            this.GetQualificationMasterList();
          }
          if(MasterType == 'Skill'){
            this.GetSkillList();
          }
          if(MasterType == 'Diagnosis'){
            this.GetDiagnosisList();
          }
        }
      }
      )

    }


  //Method used for switching one page to another page--
  switchPage(event:any):void {
    this.pageIndex = event.pageIndex;
    if (this.pagesize !== event.pageSize) {
      this.pagesize = event.pageSize;
      this.mastertype = this.route.snapshot.params['type'];
      if (this.mastertype == 'Department') {
        this.GetDepartMentMasterList();
      }
      if (this.mastertype == 'Qualification') {
        this.GetQualificationMasterList();
      }
      if (this.mastertype == 'Employee') {
        this.GetEmployeeMasterList();
      }
      if (this.mastertype == 'Skill') {
        this.GetSkillList();
      }
      if (this.mastertype == 'Diagnosis') {
        this.GetDiagnosisList();
      }
    } else {
      this.pagesize = event.pageSize;
      this.mastertype = this.route.snapshot.params['type'];
      if (this.mastertype == 'Department') {
        this.GetDepartMentMasterList();
      }
      if (this.mastertype == 'Qualification') {
        this.GetQualificationMasterList();
      }
      if (this.mastertype == 'Employee') {
        this.GetEmployeeMasterList();
      }
      if (this.mastertype == 'Skill') {
        this.GetSkillList();
      }
      if (this.mastertype == 'Diagnosis') {
        this.GetDiagnosisList();
      }
    }
    
  }
 //method is used for add new skill--
 AddNewMaster(type:any):any{
  if(type =='Skill'){
  if(this.addSkillform.valid){
    const model ={
    SkillName: this.addSkillform.controls['MasterName'].value
    }
    
    if (this.addSkillform.invalid) {
      return;
    }
    if (this.addSkillform.valid) {
      this._addMasterService.AddNewSkillsService(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this._toasterService.success(CommonSuccessMessages.NewSkillAdded, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          let btn = (<HTMLInputElement>document.getElementById("closepopup"));
          btn.click();
          this.GetSkillList();
        }
      })
    }
  }
  else{
    this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
    }); 
  }
  }
    else if(type =='Department'){
      if(this.addSkillform.valid){
        const model ={
        MasterName: this.addSkillform.controls['MasterName'].value
        }
        
        if (this.addSkillform.invalid) {
          return;
        }
        if (this.addSkillform.valid) {
          this._addMasterService.AddNewDepartmentService(model).subscribe((response: any) => {
            if (response.statusCode == 200) {
              this._toasterService.success(CommonSuccessMessages.newDepartment, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
              let btn = (<HTMLInputElement>document.getElementById("closepopup"));
              btn.click();
              this.GetDepartMentMasterList();
            }
          })
        }
      }
      else{
        this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
      }

    }
    else if(type =='Employee'){
      if(this.addSkillform.valid){
        const model ={
        MasterName: this.addSkillform.controls['MasterName'].value
        }
        
        if (this.addSkillform.invalid) {
          return;
        }
        if (this.addSkillform.valid) {
          this._addMasterService.AddNewEmployeeService(model).subscribe((response: any) => {
            if (response.statusCode == 200) {
              this._toasterService.success(CommonSuccessMessages.newemployee, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
              let btn = (<HTMLInputElement>document.getElementById("closepopup"));
              btn.click();
              this.GetEmployeeMasterList();
            }
          })
        }
      }
      else{
        this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            }); 
      }
    }
    else if(type =='Qualification'){
      if(this.addSkillform.valid){
        const model ={
        MasterName: this.addSkillform.controls['MasterName'].value
        }
        
        if (this.addSkillform.invalid) {
          return;
        }
        if (this.addSkillform.valid) {
          this._addMasterService.AddNewQualificationService(model).subscribe((response: any) => {
            if (response.statusCode == 200) {
              this._toasterService.success(CommonSuccessMessages.newqualification, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
              let btn = (<HTMLInputElement>document.getElementById("closepopup"));
              btn.click();
              this.GetQualificationMasterList();
            }
          })
        }
      }
      else{
        this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            }); 
      }
    }
    else if(type =='Diagnosis'){
      if(this.addSkillform.valid){
        const model ={
        MasterName: this.addSkillform.controls['MasterName'].value
        }
        
        if (this.addSkillform.invalid) {
          return;
        }
        if (this.addSkillform.valid) {
          this._addMasterService.AddNewDiagnosisService(model).subscribe((response: any) => {
            if (response.statusCode == 200) {
              this._toasterService.success(CommonSuccessMessages.newdiagnosis, "", {
                timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              });
              let btn = (<HTMLInputElement>document.getElementById("closepopup"));
              btn.click();
              this.GetDiagnosisList();
            }
          })
        }
      }
      else{
        this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
      }
    }
    
  
  else {
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}

AddMasterModel():any{
  this.Addbuttonflag = true;
  this.UpdateButtonflag =false;
  this.addSkillform.controls['MasterName'].setValue('');
  this.addSkillform.controls['MainType'].setValue('')
  this.ModelTitle = 'Add New';

}
//Method is used for edit master data--
EditMasterData(type:any, masterId:number, masterName:any){
this.Addbuttonflag = false;
this.UpdateButtonflag =true;
this.ModelTitle = 'Update';
let PopupDialog = (<HTMLInputElement>document.getElementById("editModelButton"))
PopupDialog.click();

  if(type == 'Department'){
   this.addSkillform.controls['MasterName'].setValue(masterName);
   this.addSkillform.controls['MainType'].setValue(type)
   this.addSkillform.controls['MasterId'].setValue(masterId)
   }
  if(type == 'Employee'){
    this.addSkillform.controls['MasterName'].setValue(masterName);
    this.addSkillform.controls['MainType'].setValue(type)
    this.addSkillform.controls['MasterId'].setValue(masterId)
  }
  if(type == 'Qualification'){
    this.addSkillform.controls['MasterName'].setValue(masterName);
    this.addSkillform.controls['MainType'].setValue(type)
    this.addSkillform.controls['MasterId'].setValue(masterId)
  }
  if(type == 'Skill'){
    this.addSkillform.controls['MasterName'].setValue(masterName);
    this.addSkillform.controls['MainType'].setValue(type)
    this.addSkillform.controls['MasterId'].setValue(masterId)
  }
  if(type == 'Diagnosis'){
    this.addSkillform.controls['MasterName'].setValue(masterName);
    this.addSkillform.controls['MainType'].setValue(type)
    this.addSkillform.controls['MasterId'].setValue(masterId)
  }

}
updateMasterdata(){
  this.mastertype
  if(this.addSkillform.valid){
  const modal={
    MasterType :this.addSkillform.controls['MainType'].value,
    MasterId: this.addSkillform.controls['MasterId'].value,
    MasterName:this.addSkillform.controls['MasterName'].value
   }
  this._addMasterService.UpdateMasterDataService(modal).subscribe((response:any)=>{
    if (response.statusCode == 200) {
      this._toasterService.success(CommonSuccessMessages.MasterUpdated, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      let btn = (<HTMLInputElement>document.getElementById("closepopup"));
      btn.click();
      if( this.mastertype == 'Department'){
        this.GetDepartMentMasterList();
      }
      if( this.mastertype == 'Employee'){
        this.GetEmployeeMasterList();
      }
      if( this.mastertype == 'Qualification'){
        this.GetQualificationMasterList();
      }
      if( this.mastertype == 'Skill'){
        this.GetSkillList();
      }
      if( this.mastertype == 'Diagnosis'){
        this.GetDiagnosisList();
      }
    }
  })
}
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
      case 'maintype': return compare(a.Type, b.Type, isAsc);
      case 'status': return compare(a.UserName, b.UserName, isAsc);
      default: return 0;
    }
  });
  
}
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}