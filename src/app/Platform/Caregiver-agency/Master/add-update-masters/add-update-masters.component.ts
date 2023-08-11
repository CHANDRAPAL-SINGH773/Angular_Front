import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { environment } from 'src/environments/environment';

import { ActivatedRoute, Router } from '@angular/router';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';


import Swal from 'sweetalert2';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { AddMasterService } from 'src/app/Platform/Services/Masters/add-master.service';
import { AddCaregiverService } from 'src/app/Platform/Services/addCaregiverService/add-caregiver.service';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
@Component({
  selector: 'app-add-update-masters',
  templateUrl: './add-update-masters.component.html',
  styleUrls: ['./add-update-masters.component.css']
})
export class AddUpdateMastersComponent implements OnInit {
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
  addMasterform!:FormGroup;
  showModalBox: boolean = false;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  ModelTitle:any = 'Add New';

  @ViewChild("popupDialog")dialogCtrl!: ElementRef<any>;
  @ViewChild('masterModel') masterModel: any;
  constructor( public dialog: MatDialog, private _addMasterService : AddMasterService, 
     private _addcaregiverService: AddCaregiverService,  
     private _toasterService: ToastrService, 
     private fb: FormBuilder,private _getMasterService : GetAllMasterService,
     private route: ActivatedRoute,private router: Router) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit(): void {
 
    this.mastertype = this.route.snapshot.params['type'];
    this.getOfficeMastersList();
    this.CreateFormGroup();
  }

  getOfficeMastersList():any{
    this._getMasterService.getOfficeMastersList().subscribe((response: any) => {
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


  CreateFormGroup(): void {
    this.addMasterform = this.fb.group({
      MasterName:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      MainType: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      MasterId:new FormControl(""),
    })
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
          if(type=='Office'){
          this._addMasterService.DeleteMasterData(type,Id).subscribe((response:any) => {
            if(response.message='OK'){
              Swal.fire(
                'Deleted!',
                'Record has been deleted successfully.',
                'success'
              )
            }
            this.getOfficeMastersList();
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
          this.getOfficeMastersList();
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
    
    } else {
      this.pagesize = event.pageSize;
      this.mastertype = this.route.snapshot.params['type'];

    }
    
  }
 //method is used for add new skill--
 AddNewMaster(type:any):any{
  if(type =='Office'){
  if(this.addMasterform.valid){
    const model ={
      MasterName: this.addMasterform.controls['MasterName'].value
    }
    
    if (this.addMasterform.invalid) {
      return;
    }
    if (this.addMasterform.valid) {
      this._addMasterService.AddNewOfficeService(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this._toasterService.success(CommonSuccessMessages.NewSkillAdded, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          let btn = (<HTMLInputElement>document.getElementById("closepopup"));
          btn.click();
          this.getOfficeMastersList();
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
   
  
  else {
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}

AddMasterModel():any{
  this.Addbuttonflag = true;
  this.UpdateButtonflag =false;
  this.addMasterform.controls['MasterName'].setValue('');
  this.addMasterform.controls['MainType'].setValue('')
  this.ModelTitle = 'Add New';

}
//Method is used for edit master data--
EditMasterData(type:any, masterId:number, masterName:any){
this.Addbuttonflag = false;
this.UpdateButtonflag =true;
this.ModelTitle = 'Update';
let PopupDialog = (<HTMLInputElement>document.getElementById("editModelButton"))
PopupDialog.click();

this.addMasterform.controls['MasterName'].setValue(masterName);
this.addMasterform.controls['MainType'].setValue('Office');
this.addMasterform.controls['MasterId'].setValue(masterId)
}
updateMasterdata(){
  this.mastertype
  if(this.addMasterform.valid){
  const modal={
    MasterType :this.addMasterform.controls['MainType'].value,
    MasterId: this.addMasterform.controls['MasterId'].value,
    MasterName:this.addMasterform.controls['MasterName'].value
   }
  this._addMasterService.UpdateMasterDataService(modal).subscribe((response:any)=>{
    if (response.statusCode == 200) {
      this._toasterService.success(CommonSuccessMessages.MasterUpdated, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      let btn = (<HTMLInputElement>document.getElementById("closepopup"));
      btn.click();
      this.getOfficeMastersList();
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