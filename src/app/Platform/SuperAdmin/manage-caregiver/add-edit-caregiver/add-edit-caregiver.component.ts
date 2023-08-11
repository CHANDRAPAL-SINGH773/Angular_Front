import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {scheduler } from "dhtmlx-scheduler";
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddCaregiverService } from '../../../Services/addCaregiverService/add-caregiver.service'
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { DataSharingService } from 'src/app/Shared/data-sharing.service';
import { UploadImageServiceService } from 'src/app/Shared/uploadImage/upload-image-service.service';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/Shared/custom.validator';

@Component({ 
  encapsulation: ViewEncapsulation.None,
  selector: 'app-add-edit-caregiver',
  templateUrl: './add-edit-caregiver.component.html',
  styleUrls: ['./add-edit-caregiver.component.css'],
})

export class AddEditCaregiverComponent implements OnInit {
  submitted!: boolean;
  countryList: any;
  stateList: any;
  departmentList: any;
  OrganizationList: any;
  employeeTypeList: any;
  addEditCaregiverform!: FormGroup;
  SkillList: any =[];
  QualificationList: any;
  educationTableList: boolean = true;
  educationFillDetail: boolean = false;
  experienceTableList: boolean = true;
  experienceAddDetail: boolean = false;
  addEditCaregiverAdminform!: FormGroup;
  addEditCaregiverQualificationform!: FormGroup;
  addEditCaregiverExperinceform!: FormGroup;
  addRatingForm!: FormGroup;
  addSkillform!:FormGroup;
  id: number = 0;
  _id:any;
  _ev: any;
  addButtonflag: boolean = true;
  updateButtonflag: boolean = false;
  caregiverQualificationList: any = [];
  schedulerView: number = 0;
  caregiverExperinceList: any = [];
  caregiverRatingList: any = [];
  attachment?: File;
  selectedFile?: File;
  imageSrc?: any;
  fileNameObj:any = 'Choose file.';
  BindSkillList:any;
  selectedSkill:boolean = false;
  tempSkillArray:any =[];
  settings:any;
  schedulerDate: any;
  old_mode:any;
  old_date:any;
  mode:any;
  date:any;
  addEducationflag:boolean = true;
  genderTypeList: any =[];
  addNewExperincebtnflag:boolean = true;
  openfromFlag:any;
  removeActionButton:boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  userid:any;
  patientId :any;
  modalReference: NgbModalRef;
  totalReview:any;
  Reviewcounts:any
  addreviewBtn: boolean = true;
  RatingFoundorNot: boolean = false;
  noReview:boolean = true;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  AvgReview:any;
  RatingStatus:Number;
  maxDate = new Date();
  IsInvite: boolean = false;
  loaderflag : boolean = false;
  html = function(id: string) { return document.getElementById(id); };
  @ViewChild("scheduler_here", {static: true}) schedulerContainer: ElementRef;

  constructor(private _getAllMasterService: GetAllMasterService,
    private router: Router,
    private fb: FormBuilder,
    private _addcaregiverService: AddCaregiverService,
    private _toasterService: ToastrService,
    private _dataSharingService: DataSharingService,
    private route: ActivatedRoute,
    private _UploadImageService : UploadImageServiceService,
    public dialog: MatDialog,
    private ngbmodelService: NgbModal,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.userid = this.authService.userID;
    this.id = parseInt(this.route.snapshot.params['id']);
    this.openfromFlag = this.route.snapshot.params['deleteid'];
    this.patientId = this.openfromFlag;  
    this.getdropdowns();
    if (this.id != 0) {
      this.getCareGiverData(this.id);
      this.getCareGiverQualification(this.id);
      this.getCareGiverExperince(this.id);
    }
    if(this.openfromFlag <= 0){
      this.removeActionButton = true;
      this.addreviewBtn = false;
    } 
    this.schedulersetup();  
  }

  ngAfterViewInit() {
    this.dialog.closeAll();
  }


  ratingModel(event: any): void {
   this.selectedValue = 0;
  this.modalReference =this.ngbmodelService.open(event,{ centered: true }); //here modalservice is NgbModal
  
  }
 
  closeRatingPopup(){
    this.modalReference.close();
  }

  countStar(star:any) {
    this.selectedValue = star;
    console.log('Value of star', star);
    this.addRatingForm.controls['RatingStar'].setValue(star);
  }

  schedulersetup():any{
    var custom_form = document.getElementById("addAvailableTime");
    const _settings = this.settings;
    const _mode = this.mode;
    scheduler.config.xml_date = "%m/%d/%Y %H:%i";  
    scheduler.config.limit_start = new Date(); 
    scheduler.config.limit_view  = false;
    scheduler.config.details_on_dblclick = false;
    scheduler.config.details_on_create = false;  
    scheduler.init(this.schedulerContainer.nativeElement, new Date(), "month");
    scheduler.showLightbox = function(id){
    debugger
    scheduler.deleteEvent(id); 
    return false;
      //var ev = scheduler.getEvent(id);
     // scheduler.startLightbox(id,custom_form as HTMLElement);
    }
  }
  onClose():any{
    var event_id = scheduler.getState().lightbox_id;
    var AddAvailable_form = document.getElementById("addAvailableTime") as HTMLElement;
    scheduler.endLightbox(true, AddAvailable_form);
    scheduler.deleteEvent(event_id); 
  }
  save_form() {
    //debugger
    var AddAvailable_form = document.getElementById("addAvailableTime") as HTMLElement;
    var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
    ev.text = "Event";
    // ev.custom1 = html("custom1").value;
    // ev.custom2 = html("custom2").value;
    // ev.start_date = parseDate(html("form_start_date").value);
    // ev.end_date = parseDate(html("form_end_date").value);
    scheduler.endLightbox(true, AddAvailable_form);
  }

  getdropdowns(){
    //this.loaderflag =true;
    this.GetCountry();
    this.GetState();
    this.GetDepartmentType();
    this.GetEmployeeType();
    this.GetQualificationList();
    this.GetSkillList();
    this.GetGenderType();
    this.GetOrganizationDetails();
    this.CreateFormGroup();    
   // this.loaderflag =false;
  }

// openPopUp(id:any):any{
//   const model: DialogModel = {
//     Id: id,
//     HeaderText: "Edit Plan",
//     Type:0,
//   };
  // const dialogRef = this.dialog.open(AddAvailableTimeComponent, {
  //   width: "375px",
  //   data: model
  // }); 
  // this.dialogCtrl.nativeElement.focus();
  // dialogRef.afterClosed().subscribe(result => { }); 
// }

  //Method for get country master--
  GetCountry() {
    this._getAllMasterService.GetCountryMaster().subscribe((response: any) => {
      this.countryList = response.data;
      this.countryList.unshift({ CountryName: "Please Select", Id: "" });
    })
  }
  //Method for get State master--
  GetState() {
    this._getAllMasterService.GetStateMaster().subscribe((response: any) => {
      this.stateList = response.data;
      this.stateList.unshift({ StateName: "Please Select", StateId: "" });
    })
  }
  //Method for get Departmenttype master--
  GetDepartmentType() {
    this._getAllMasterService.GetDepartmentTypeMaster().subscribe((response: any) => {
      this.departmentList = response.data;
      this.departmentList.unshift({ DepartmentName: "Please Select", DepartmentId: "" });
    })
  }
  //Method for get Departmenttype master--
  GetEmployeeType() {
    this._getAllMasterService.GetEmployeeTypeMaster().subscribe((response: any) => {
      this.employeeTypeList = response.data;
      this.employeeTypeList.unshift({ EmployeeType: "Please Select", EmployeeId: "" });
    })
  }
  //Method for get Qualification master--
  GetQualificationList() {
    this._getAllMasterService.GetQualificationMaster().subscribe((response: any) => {
      this.QualificationList = response.data;
      this.QualificationList.unshift({ Qualificationname: "Please Select", QualificationId: "" });
    })
  }

 //Method for get gender type master--
   GetGenderType() {
    this._getAllMasterService.GetGenderTypeMaster().subscribe((response: any) => {
    this.genderTypeList = response.data;
    this.genderTypeList.unshift({ GenderType: "Please Select", GenderId: "" });
  })
   }
  //Method for get Qualification master--
   GetSkillList() {
    this._getAllMasterService.getSkillsMaster().subscribe((response: any) => {
      this.SkillList = response.data;
      for(var i=0; i<this.SkillList.length; i++){
        this.SkillList[i].isSelected=false;
      }
      this.setSelectedSkills();
    })
   }
//Method for bind selected skills --
   setSelectedSkills(){   
    if(this.BindSkillList != undefined){
    for(var i=0; i< this.BindSkillList.length; i++){
      for(var j=0; j<this.SkillList.length;j++){
        if(this.BindSkillList[i] == this.SkillList[j].SkillId)
        this.SkillList[j].isSelected= true;
      }     
    }
  }
   }
  //Method for get organization master--
   GetOrganizationDetails() {
    this._getAllMasterService.getOrganizationMaster().subscribe((response: any) => {
      this.OrganizationList = response.data;
      this.OrganizationList.unshift({ AgencyName: "Please Select", AgencyId: "" });
    })
   }

   togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
   }

   togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
   }

   onAttachment(file?: any): any {
    const formData = new FormData();
    this.attachment = file;
    console.log(file.target.files[0])
    if(file.target.files[0].type == 'image/jpeg' || file.target.files[0].type =='image/png' || file.target.files[0].type =='image/svg' || file.target.files[0].type =='image/jpg'){
      if(file.target.files[0].size <= 1000000){
    if (file.target.files[0] ) {
      formData.append('Image', file.target.files[0]);
      formData.append('ProfileLink', 'CaregiverProfiles');
      
      this._UploadImageService.UploadCaregiverProfileService(formData).subscribe((profilePath:any) => {
        this.imageSrc=   this.createImgPath(profilePath.data.value);
        this.addEditCaregiverform.controls['CaregiverLogo'].setValue(this.imageSrc);
      })
    }
  }
  else{
    this._toasterService.error(CommonErrorMessages.fileSize, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
  }

}
else{
this._toasterService.error(CommonErrorMessages.invalidFormat, "", {
  timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
});
}
  }

  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };

  RemoveFile(){
    this.fileNameObj = 'Choose File.';
    this.addEditCaregiverExperinceform.controls['DocumentName'].setValue('');
  }
  // Method for browse file attachment(caregiver profile upload)---
  onDocumentsAttachment(file?: any): any {
    const formData = new FormData();
    this.attachment = file;
    console.log(file.target.files[0])
    if (file.target.files[0] ) {
      this.fileNameObj = file.target.files[0].name;
      formData.append('Image', file.target.files[0]);
      formData.append('ProfileLink', 'CaregiverDocuments');
      
      this._UploadImageService.UploadCaregiverDocumentService(formData).subscribe((profilePath:any) => {
        let imageSrc=   this.createImgPath(profilePath.data.value);
        this.addEditCaregiverExperinceform.controls['DocumentName'].setValue(imageSrc);
      })
    }
  }

  CreateFormGroup(): void {
    this.addEditCaregiverform = this.fb.group({
      OrganizationName: new FormControl(""),
      Department: new FormControl("", [Validators.required,]),
      Position: new FormControl("", Validators.required),
      EmployeeType: new FormControl("", Validators.required),
      DOJ: new FormControl("", Validators.required),
      DOB: new FormControl("", Validators.required),
      Age: new FormControl("", Validators.required),
      PoliceVerification:  new FormControl(""),
      Country: new FormControl("", Validators.required),
      State: new FormControl("", Validators.required),
      City:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      ZipCode: new FormControl("", Validators.required),
      CGFirstName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CGLastName:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Gender: new FormControl("", Validators.required),
      ContactNo: new FormControl("", Validators.required),
      AdminId: new FormControl(""),
      CaregiverLogo : new FormControl(""),
      CGAddress: new FormControl("", Validators.required),
      CaregiverId: new FormControl(""),

    })
    this.addEditCaregiverAdminform = this.fb.group({
      CAFirstName:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CALastName:  ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CAEmail:  ["", [Validators.required,CustomValidators.noWhitespaceValidator,Validators.email]],
      CAUserName: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CAPassword: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CALastLogin: new FormControl("", Validators.required),
      AdminId: new FormControl(""),
    })
    this.addEditCaregiverQualificationform = this.fb.group({
      Qualification: new FormControl("", [Validators.required]),
      Institition:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      Field: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      DateCompletion: new FormControl("", Validators.required),
      CaregiverId: new FormControl(""),
      QualificationId: new FormControl(""),
    })

    this.addEditCaregiverExperinceform = this.fb.group({
      Company: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      JobTitle: new FormControl("", [Validators.required,]),
      FromDate:new FormControl("", [Validators.required]),
      ToDate:   new FormControl("", [Validators.required]),
      Duration: ["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      DocumentName: new FormControl("", Validators.required),
      CaregiverId: new FormControl(""),
      ExperinceId:new FormControl(""),
    })

    this.addSkillform = this.fb.group({
      SkillName: new FormControl("", [Validators.required]),
    })

    this.addRatingForm = this.fb.group({
      PatientId: new FormControl(""),
      RatingStar: new FormControl("", [Validators.required,]),
      DoNotSendBack:new FormControl(""),
      Comment:["", [Validators.required,CustomValidators.noWhitespaceValidator]],
      CaregiverId: new FormControl(""),
    })
  }

  //method is used for add new skill--
  AddNewSkill():any{
    if(this.addSkillform.valid){
      const model ={
      SkillName: this.addSkillform.controls['SkillName'].value
      }
      this.submitted = true;
      if (this.addSkillform.invalid) {
        this.submitted = true;
        return;
      }
      if (this.addSkillform.valid) {
        this._addcaregiverService.AddNewSkillsService(model).subscribe((response: any) => {
          if (response.statusCode == 200) {
            this._toasterService.success(CommonSuccessMessages.NewSkillAdded, "", {

              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  
            });
            //this._toasterService.success(CommonSuccessMessages.SuccessRecord);
          }
        })
      }
    }
    else {
      this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
    }
  }

  //method for add new care giver Admin Section Details ---
  AddcaregiverAdminDetails(): any {
    this.loaderflag =true;
    let password = this.addEditCaregiverAdminform.controls['CAPassword'].value
    let confirmPwd = this.addEditCaregiverAdminform.controls['CALastLogin'].value
    if (password != confirmPwd) {
      this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loaderflag =false;
      return;
    }
    if (this.addEditCaregiverAdminform.valid) {
      const model = {
        CAFirstName: this.addEditCaregiverAdminform.controls['CAFirstName'].value,
        CALastName: this.addEditCaregiverAdminform.controls['CALastName'].value,
        CAEmail: this.addEditCaregiverAdminform.controls['CAEmail'].value,
        CAUserName: this.addEditCaregiverAdminform.controls['CAUserName'].value,
        CAPassword: this.addEditCaregiverAdminform.controls['CAPassword'].value,
        CALastLogin: this.addEditCaregiverAdminform.controls['CALastLogin'].value,
        UserType : 3,
        CreatedBy : this.userid
      };
      this.submitted = true;
      if (this.addEditCaregiverAdminform.invalid) {
        this.submitted = true;
        this.loaderflag =false;
        return;
      }
      if (this.addEditCaregiverAdminform.valid) {
        this._addcaregiverService.SavecaregiverAdminDetailsService(model).subscribe((response: any) => {
          if (response.message =="") {           
            let res = parseInt(response.data);
            this.addEditCaregiverform.controls['AdminId'].setValue(res);
            this.loaderflag =false;
            this.IsInvite = true;
            this.addButtonflag = false;
            this._toasterService.success(CommonSuccessMessages.CaregtiverAdminAdded, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
         }
         else{
          this._toasterService.error(""+response.message+"", "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.loaderflag =false;
         }
        })
      }
    } else {
      this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
      this.loaderflag =false;
    }
  }

  SendInvite():any{
    this.loaderflag =true;
    let UserId=Number(this.addEditCaregiverform.controls['AdminId'].value);
    this._addcaregiverService.SendCaregiverInviteService(UserId).subscribe((response: any) => {
      if (response.message=="") {
        this._toasterService.success(CommonSuccessMessages.InviteSend, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.IsInvite = false;
        this.addButtonflag = true;
        this.loaderflag =false;
     }
     else{
        this._toasterService.error(""+response.message+"", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loaderflag =false;
     }
    })

  }

  //method for add new care giver ---
  Addcaregiver(): any {
    this.loaderflag =true;
    if (this.addEditCaregiverform.valid) {
     const AdminId = Number(this.addEditCaregiverform.controls['AdminId'].value)
      if(AdminId != null && AdminId != undefined && AdminId != 0 ){
      const model = {
        OrganizationName: String(this.addEditCaregiverform.controls['OrganizationName'].value),
        Department: Number(this.addEditCaregiverform.controls['Department'].value),
        Position: this.addEditCaregiverform.controls['Position'].value,
        EmployeeType: Number(this.addEditCaregiverform.controls['EmployeeType'].value),
        DOB: this.addEditCaregiverform.controls['DOB'].value,
        DOJ: this.addEditCaregiverform.controls['DOJ'].value,
        Age: Number(this.addEditCaregiverform.controls['Age'].value),
        PoliceVerification: this.addEditCaregiverform.controls['PoliceVerification'].value,
        Country: Number(this.addEditCaregiverform.controls['Country'].value),
        State: Number(this.addEditCaregiverform.controls['State'].value),
        City: this.addEditCaregiverform.controls['City'].value,
        ZipCode: this.addEditCaregiverform.controls['ZipCode'].value,
        CGFirstName: this.addEditCaregiverform.controls['CGFirstName'].value,
        CGLastName: this.addEditCaregiverform.controls['CGLastName'].value,
        Gender: this.addEditCaregiverform.controls['Gender'].value,
        AdminId: Number(this.addEditCaregiverform.controls['AdminId'].value),
        Logo: this.addEditCaregiverform.controls['CaregiverLogo'].value,
        ContactNo: this.addEditCaregiverform.controls['ContactNo'].value,
        CaregiverId: Number(this.addEditCaregiverform.controls['CaregiverId'].value),
        CGAddress: this.addEditCaregiverform.controls['CGAddress'].value,
        CreatedBy : this.userid
      };
  
      this.submitted = true;
      if (this.addEditCaregiverform.invalid) {
        this.submitted = true;
        return;
      }
      if (this.addEditCaregiverform.valid) {
        this._addcaregiverService.SavecaregiverService(model).subscribe((response: any) => {
          if (response.data !=null) {
            this.loaderflag =false;
            let res = parseInt(response.message)
            this.addEditCaregiverform.controls['CaregiverId'].setValue(res);
            this.addEditCaregiverQualificationform.controls['CaregiverId'].setValue(res);
            this.addEditCaregiverExperinceform.controls['CaregiverId'].setValue(res);
            this.id = res
            this._toasterService.success(CommonSuccessMessages.CaregiverBasicDetailAdded, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
          }
          else{
            this.loaderflag =false;
            this._toasterService.info(response.Message, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });

          }
        })
      }
    }
    else{
     this.loaderflag =false;
     this._toasterService.info(CommonSuccessMessages.SaveCaregiverAdminWarn, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
     }
   }
    else {  }
  }

  //add care giver Qualification Details --
  AddCaregiverQualification(): any {
    this.loaderflag =true;
    if (this.addEditCaregiverQualificationform.valid) {
      const careID = this.addEditCaregiverform.controls['CaregiverId'].value
      if(careID != null && careID != undefined && careID != 0){
      const model = {
        Qualification: String(this.addEditCaregiverQualificationform.controls['Qualification'].value),
        Institition: this.addEditCaregiverQualificationform.controls['Institition'].value,
        Field: this.addEditCaregiverQualificationform.controls['Field'].value,
        DateCompletion: this.addEditCaregiverQualificationform.controls['DateCompletion'].value,
        CaregiverId: this.id,
        CreatedBy : this.userid
      };
      this.submitted = true;
      if (this.addEditCaregiverQualificationform.invalid) {
        this.submitted = true;
        this.loaderflag =false;
        return;
      }
      if (this.addEditCaregiverQualificationform.valid) {
        this._addcaregiverService.SavecaregiverQualificationDetails(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
         this.loaderflag =false;
         this._toasterService.success(CommonSuccessMessages.AddcaregiverQualification, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          
        });
        this.getCareGiverQualification(this.id)
        let btn = (<HTMLInputElement>document.getElementById("caregiverCancelBtn"));
        btn.click();   
        this.addEditCaregiverQualificationform.reset();
          }
        })
      }
    }
    else{
      this.loaderflag =false;
      this._toasterService.info(CommonSuccessMessages.SaveCaregiverWarn, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
    }
  }
    else { this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        }); 
        this.loaderflag =false;
  }}

  //add care giver Qualification Details --
  UpdateCaregiverQualification(): any {
    this.loaderflag =true;
    if (this.addEditCaregiverQualificationform.valid) {
      const careID = this.addEditCaregiverform.controls['CaregiverId'].value
      if(careID != null && careID != undefined && careID != 0){
      const model = {
        Qualification: String(this.addEditCaregiverQualificationform.controls['Qualification'].value),
        Institition: this.addEditCaregiverQualificationform.controls['Institition'].value,
        Field: this.addEditCaregiverQualificationform.controls['Field'].value,
        DateCompletion: this.addEditCaregiverQualificationform.controls['DateCompletion'].value,
        CaregiverId:this.id,
        QualificationId: Number(this.addEditCaregiverQualificationform.controls['QualificationId'].value),
        CreatedBy : this.userid
      };
      this.submitted = true;
      if (this.addEditCaregiverQualificationform.invalid) {
        this.submitted = true;
        this.loaderflag =false;
        return;
      }
      if (this.addEditCaregiverQualificationform.valid) {
        this._addcaregiverService.UpdatecaregiverQualificationDetails(model).subscribe((response: any) => {
          if (response.statusCode == 200) {
         this.loaderflag =false;
         this._toasterService.success(CommonSuccessMessages.UpdatecaregiverQualification, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.getCareGiverQualification(this.id)
        let btn = (<HTMLInputElement>document.getElementById("caregiverCancelBtn"));
        btn.click();
   
        this.addEditCaregiverQualificationform.reset();
          }
        })
      }
    }
    else{
      this._toasterService.info(CommonSuccessMessages.SaveCaregiverWarn, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loaderflag =false;
    }
  }
    else { this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        }); 
        this.loaderflag =false;
  }}

  //Method is used for get qualification details for edit--
  GetCGQualificationForEdit(QualificationId:any){
    this.loaderflag =true;
    this._addcaregiverService.GetcaregiverQualificationForEdit(QualificationId).subscribe((response: any) => {
      if (response.statusCode != null) {
        this.loaderflag =false;
        this.addButtonflag = false;
        this.addEducationflag = false;
        this.updateButtonflag =true;
        this.educationTableList = false;
        this.educationFillDetail = true;
        this.addEditCaregiverQualificationform.controls['Qualification'].setValue(response.data[0].Qualification);
        this.addEditCaregiverQualificationform.controls['Institition'].setValue(response.data[0].Institition);
        this.addEditCaregiverQualificationform.controls['Field'].setValue(response.data[0].Field);
        this.addEditCaregiverQualificationform.controls['DateCompletion'].setValue(response.data[0].DateCompletion);
        this.addEditCaregiverQualificationform.controls['QualificationId'].setValue(response.data[0].Id);
      }
    })

  }


  DeleteCaregiverQualification(qualificationId:any, caregiverId:any ){
    this.loaderflag =true;
    const model ={
      QualificationId :qualificationId,
      CaregiverId :caregiverId,
      CreatedBy : this.userid
    }
    this._addcaregiverService.DeletecaregiverQualification(model).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this._toasterService.success(CommonSuccessMessages.CaregiverQualificationdeleted, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.getCareGiverQualification(this.id);
        this.loaderflag =false;
      }
    })
  }

  //add care giver Qualification Details --
  AddCaregiverExperince(): any {
    this.loaderflag =true;
    if (this.addEditCaregiverExperinceform.valid) {
      const model = {
        Company: this.addEditCaregiverExperinceform.controls['Company'].value,
        JobTitle: this.addEditCaregiverExperinceform.controls['JobTitle'].value,
        FromDate: this.addEditCaregiverExperinceform.controls['FromDate'].value,
        ToDate: this.addEditCaregiverExperinceform.controls['ToDate'].value,
        Duration: this.addEditCaregiverExperinceform.controls['Duration'].value,
        DocumentName: this.addEditCaregiverExperinceform.controls['DocumentName'].value,
        CaregiverId: this.id,
        CreatedBy : this.userid
      };
      this.submitted = true;
      if (this.addEditCaregiverExperinceform.invalid) {
        this.submitted = true;
        this.loaderflag =false;
        return;
      }
      if (this.addEditCaregiverExperinceform.valid) {
        this._addcaregiverService.SavecaregiverExperinceDetails(model).subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.loaderflag =false;
            this._toasterService.success(CommonSuccessMessages.CaregiverExperinceAdded, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true            
            });
            this.getCareGiverExperince(this.id)
            let btn = (<HTMLInputElement>document.getElementById("caregiveExprince"));
            btn.click();
            this.RemoveFile();
            this.addEditCaregiverExperinceform.reset();
            // this.router.navigate(["/Dashboard/ManageCaregiver"]);
          }
        })
      }
    }
    else {  this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });  
      this.loaderflag =false;
    }
  }
  //Method is used for get Experince details for edit--
  GetCGExpeinceForEdit(ExperinceId:any){
    this.loaderflag =true;
    this._addcaregiverService.GetcaregiverExperinceForEdit(ExperinceId).subscribe((response: any) => {
      if (response.data != null) {
        this.loaderflag =false;
        this.experienceTableList = false;
        this.experienceAddDetail = true;
        this.addNewExperincebtnflag = false;
        this.addEditCaregiverExperinceform.controls['Company'].setValue(response.data[0].Company);
        this.addEditCaregiverExperinceform.controls['JobTitle'].setValue(response.data[0].JobTitle);
        this.addEditCaregiverExperinceform.controls['FromDate'].setValue(response.data[0].FromDate);
        this.addEditCaregiverExperinceform.controls['ToDate'].setValue(response.data[0].ToDate);
        this.addEditCaregiverExperinceform.controls['Duration'].setValue(response.data[0].Duration);
        this.addEditCaregiverExperinceform.controls['DocumentName'].setValue(response.data[0].Document);
        this.addEditCaregiverExperinceform.controls['ExperinceId'].setValue(response.data[0].Id);

        if(response.data[0].Document != null && response.data[0].Document != undefined){
          var splitted = response.data[0].Document.split("CaregiverDocuments"); 
          var name = splitted[1].split('\\')
          this.fileNameObj =name[1];
          }
      }
    })
  }

 //Update care giver Experince Details --
 UpdateCaregiverExperince(): any {
  this.loaderflag =true;
  if (this.addEditCaregiverExperinceform.valid) {
    const model = {
      Company: this.addEditCaregiverExperinceform.controls['Company'].value,
      JobTitle: this.addEditCaregiverExperinceform.controls['JobTitle'].value,
      FromDate: this.addEditCaregiverExperinceform.controls['FromDate'].value,
      ToDate: this.addEditCaregiverExperinceform.controls['ToDate'].value,
      Duration: this.addEditCaregiverExperinceform.controls['Duration'].value,
      DocumentName: this.addEditCaregiverExperinceform.controls['DocumentName'].value,
      CaregiverId: this.id,
      ExperinceId :this.addEditCaregiverExperinceform.controls['ExperinceId'].value,
      CreatedBy : this.userid
    };
    this.submitted = true;
    if (this.addEditCaregiverExperinceform.invalid) {
      this.submitted = true;
      this.loaderflag =false;
      return;
    }
    if (this.addEditCaregiverExperinceform.valid) {
      this._addcaregiverService.UpdatecaregiverExperinceDetails(model).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.loaderflag =false;
          this._toasterService.success(CommonSuccessMessages.CaregiverExperinceUpdated, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.getCareGiverExperince(this.id)
          let btn = (<HTMLInputElement>document.getElementById("caregiveExprince"));
          btn.click();
          this.RemoveFile();
          this.addEditCaregiverExperinceform.reset();
        }
      })
    }
  }
  else {  this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });  
      this.loaderflag =false;
    }
}

  DeleteCaregiverExperince(experinceId:any, caregiverId:any ){
    this.loaderflag =true;
    const model ={
      ExperinceId :experinceId,
      CaregiverId :caregiverId,
      CreatedBy : this.userid
    }
    this._addcaregiverService.DeletecaregiverExperince(model).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this._toasterService.success(CommonSuccessMessages.CaregiverQualificationdeleted, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.getCareGiverExperince(this.id)
        this.loaderflag =false;
      }
    })
  }


  //method for get particular Caregiver Details --
  getCareGiverData(id: number): void {
    this.loaderflag =true;
    this.getCaregiverRatings(this.id);
    this.addButtonflag = false;
    this.updateButtonflag = true;
    let data: any;
    this._addcaregiverService.GetCareGiverData(id).subscribe((response: any) => {
      if (response.data != "") {
        this.addEditCaregiverAdminform.controls['CAFirstName'].setValue(response.data[0].CAFirstName);
        this.addEditCaregiverAdminform.controls['CALastName'].setValue(response.data[0].CALastName);
        this.addEditCaregiverAdminform.controls['CAEmail'].setValue(response.data[0].AdminEmail);
        this.addEditCaregiverAdminform.controls['CAUserName'].setValue(response.data[0].UserName);
        this.addEditCaregiverAdminform.controls['CAPassword'].setValue(response.data[0].Password);
        this.addEditCaregiverAdminform.controls['CALastLogin'].setValue(response.data[0].Password);
        
        this.addEditCaregiverform.controls['AdminId'].setValue(response.data[0].UserId);
        this.addEditCaregiverform.controls['OrganizationName'].setValue(response.data[0].OrganizationName);
        this.addEditCaregiverform.controls['Department'].setValue(response.data[0].Department);
        this.addEditCaregiverform.controls['Position'].setValue(response.data[0].Position);
        this.addEditCaregiverform.controls['EmployeeType'].setValue(response.data[0].EmployeeType);
        this.addEditCaregiverform.controls['DOJ'].setValue(response.data[0].DOJ);
        this.addEditCaregiverform.controls['DOB'].setValue(response.data[0].DOB);
        this.addEditCaregiverform.controls['Age'].setValue(response.data[0].Age);
        if(response.data[0].PoliceVerification!=null){
        this.addEditCaregiverform.controls['PoliceVerification'].setValue(response.data[0].PoliceVerification);
        }
        this.addEditCaregiverform.controls['Country'].setValue(response.data[0].Country);
        this.addEditCaregiverform.controls['State'].setValue(response.data[0].State);
        this.addEditCaregiverform.controls['City'].setValue(response.data[0].City);
        this.addEditCaregiverform.controls['ZipCode'].setValue(response.data[0].ZipCode);
        this.addEditCaregiverform.controls['CGFirstName'].setValue(response.data[0].FirstName);
        this.addEditCaregiverform.controls['CGLastName'].setValue(response.data[0].LastName);
        this.addEditCaregiverform.controls['Gender'].setValue( parseInt(response.data[0].Gender));
        this.addEditCaregiverform.controls['ContactNo'].setValue(response.data[0].ContactNo);
        this.addEditCaregiverform.controls['CGAddress'].setValue(response.data[0].Address);        
        
        this.addEditCaregiverform.controls['CaregiverId'].setValue(response.data[0].CaregiverId);
        this.addEditCaregiverQualificationform.controls['CaregiverId'].setValue(response.data[0].CaregiverId);
        this.addEditCaregiverExperinceform.controls['CaregiverId'].setValue(response.data[0].CaregiverId);
        this.addEditCaregiverform.controls['CaregiverLogo'].setValue(response.data[0].Logo);
        this.imageSrc = response.data[0].Logo;
        this.BindSkillList = JSON.parse("[" + response.data[0].Skills + "]");
        this.RemoveFile();
        this.loaderflag =false;
      }
    })
  }
  //method for get particular Caregiver qualification Details --
  getCareGiverQualification(id: number): void {
    this._addcaregiverService.GetCaregiverQualification(id).subscribe((response: any) => {
      this.caregiverQualificationList = response.data;
    }
    )
  }
  //method for get particular Caregiver Experince Details --
  getCareGiverExperince(id: number): void {
    this._addcaregiverService.GetCaregiverExperince(id).subscribe((response: any) => {
      this.caregiverExperinceList = response.data;
    }
    )
  }

  //Method for update care giver admin details--
  UpdatecaregiverAdminDetails() {
  let password = this.addEditCaregiverAdminform.controls['CAPassword'].value
    let confirmPwd = this.addEditCaregiverAdminform.controls['CALastLogin'].value
    if (password != confirmPwd) {
      this._toasterService.info(CommonErrorMessages.PasswordMismatch, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          }); 

      return;
    }
    if (this.addEditCaregiverAdminform.valid) {
      const model = {
        AdminId : this.addEditCaregiverform.controls['AdminId'].value,
        CAFirstName: this.addEditCaregiverAdminform.controls['CAFirstName'].value,
        CALastName: this.addEditCaregiverAdminform.controls['CALastName'].value,
        CAEmail: this.addEditCaregiverAdminform.controls['CAEmail'].value,
        CAUserName: this.addEditCaregiverAdminform.controls['CAUserName'].value,
        CAPassword: this.addEditCaregiverAdminform.controls['CAPassword'].value,
        CALastLogin: this.addEditCaregiverAdminform.controls['CALastLogin'].value,
        CreatedBy : this.userid
      };
      this.submitted = true;
      if (this.addEditCaregiverAdminform.invalid) {
        this.submitted = true;
        return;
      }
      if (this.addEditCaregiverAdminform.valid) {
        this._addcaregiverService.UpdatecaregiverAdminDetailsService(model).subscribe((response: any) => {
          if (response.statusCode == 200) {
            let res = parseInt(response.data[0]);
            this.addEditCaregiverform.controls['AdminId'].setValue(res);
            this._toasterService.success(CommonSuccessMessages.CaregtiverAdminUpdated, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true 
            });
          }
        })
      }
    } else {
        this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });  
    }
  }

  //method for Update care giver ---
  UpdateCaregiver(): any {
     if (this.addEditCaregiverform.valid) {
      const AdminId = Number(this.addEditCaregiverform.controls['AdminId'].value)
       if(AdminId != null && AdminId != undefined && AdminId != 0 ){
       const model = {
         OrganizationName: String(this.addEditCaregiverform.controls['OrganizationName'].value),
         Department: Number(this.addEditCaregiverform.controls['Department'].value),
         Position: this.addEditCaregiverform.controls['Position'].value,
         EmployeeType: Number(this.addEditCaregiverform.controls['EmployeeType'].value),
         DOB: this.addEditCaregiverform.controls['DOB'].value,
         DOJ: this.addEditCaregiverform.controls['DOJ'].value,
         Age: Number(this.addEditCaregiverform.controls['Age'].value),
         PoliceVerification: this.addEditCaregiverform.controls['PoliceVerification'].value,
         Country: Number(this.addEditCaregiverform.controls['Country'].value),
         State: Number(this.addEditCaregiverform.controls['State'].value),
         City: this.addEditCaregiverform.controls['City'].value,
         ZipCode: this.addEditCaregiverform.controls['ZipCode'].value,
         CGFirstName: this.addEditCaregiverform.controls['CGFirstName'].value,
         CGLastName: this.addEditCaregiverform.controls['CGLastName'].value,
         Gender: String(this.addEditCaregiverform.controls['Gender'].value),
         AdminId: Number(this.addEditCaregiverform.controls['AdminId'].value),
         Logo: this.addEditCaregiverform.controls['CaregiverLogo'].value,
         ContactNo: this.addEditCaregiverform.controls['ContactNo'].value,
         CaregiverId: Number(this.addEditCaregiverQualificationform.controls['CaregiverId'].value),
         CGAddress: this.addEditCaregiverform.controls['CGAddress'].value,
         CreatedBy : this.userid
       };
   
       this.submitted = true;
       if (this.addEditCaregiverform.invalid) {
         this.submitted = true;
         return;
       }
       if (this.addEditCaregiverform.valid) {
         this._addcaregiverService.UpdateCaregiverService(model).subscribe((response: any) => {
           if (response.statusCode == 200) {
             let res = parseInt(response.message)
             this.addEditCaregiverQualificationform.controls['CaregiverId'].setValue(res);
             this.addEditCaregiverExperinceform.controls['CaregiverId'].setValue(res);
             this._toasterService.success(CommonSuccessMessages.CaregiverBasicDetailUpdated, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            });
           }
         })
       }
     }
     else{
      this._toasterService.info(CommonSuccessMessages.SaveCaregiverAdminWarn, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
      }
    }
     else { this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });  }
  }




  UpdateEduDetail(){
    this.educationTableList = false;
    this.educationFillDetail = true;
  }
  UpdateExperinceDetail(){
    this.experienceTableList = false;
    this.experienceAddDetail = true;
  }
  CancleEducation(){
    this.addEducationflag = true;
    this.educationTableList = true;
    this.educationFillDetail = false;
    this.addEditCaregiverQualificationform.reset();
  }
  AddEduDetail() {
    this.addButtonflag = true;
    this.updateButtonflag = false;
    this.educationTableList = false;
    this.educationFillDetail = true;
  }
  AddExperience() {
 
    this.addButtonflag = true;
    this.updateButtonflag = false;
    this.experienceTableList = false;
    this.experienceAddDetail = true;
  }
  CancleExperience() {
    this.addNewExperincebtnflag = true; 
    this.experienceTableList = true;
    this.experienceAddDetail = false;
    this.RemoveFile();
    this.addEditCaregiverExperinceform.reset();
  }

  selectSkill(index:any,i:number){
    this.selectedSkill = index;
    
    
    if(this.SkillList[i].isSelected){
      this.SkillList[i].isSelected=false;
    }
    else{
      this.SkillList[i].isSelected=true;
    }
      // for(i=0; i<this.tempSkillArray.length; i++){
      //   if(index ==this.tempSkillArray){
      //     this.tempSkillArray.pop(index);
      //   }
      // }
    // (<HTMLInputElement>document.getElementById(index)).style="selected";
    // this.selectedSkill = index;
  }

  AddCaregiverSkill(){
    this.getSkillsSetId();
    let CareId = Number(this.addEditCaregiverQualificationform.controls['CaregiverId'].value)
    if(CareId ==0 ){
      CareId = this.id
    }
    const model={
      CaregiverId: CareId,
      CaregiverSkills : this.tempSkillArray.toString(),
    }
    this._addcaregiverService.insertCaregiverSkillDetails(model).subscribe((response: any) => {
      if (response.statusCode == 200) {
        let res = parseInt(response.message)
        this._toasterService.success(CommonSuccessMessages.CaregiverSkillAdded, "", {
         timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
       });
      }
    })
  }
 getSkillsSetId(){
  for(var i=0; i<this.SkillList.length;i++){
    if(this.SkillList[i].isSelected){
      this.tempSkillArray.push(this.SkillList[i].SkillId);
    }
  }
 }

 resetFileUploader() { 
  this.imageSrc='';
 }

  //add caregiver Rating by patient--
  AddCaregiverRating(): any {
    if (this.addRatingForm.valid) {
      let ratingStar=  this.addRatingForm.controls['RatingStar'].value;
      if (ratingStar <3){
        this.RatingStatus = 1;
      }
      else{
        this.RatingStatus = 0;
      }
      const model = {
        PatientId: Number(this.patientId),
        RatingStar: this.addRatingForm.controls['RatingStar'].value,
        DoNotSendBack: this.addRatingForm.controls['DoNotSendBack'].value,
        Comment: this.addRatingForm.controls['Comment'].value,
        CaregiverId: this.id,
        UserId : this.userid,
        Status: this.RatingStatus,
        CreatedBy : this.userid
      };
   
      this.submitted = true;
      if (this.addRatingForm.invalid) {
        this.submitted = true;
        return;
      }
      if (this.addRatingForm.valid) {
        this._addcaregiverService.AddCaregiverRating(model).subscribe((response: any) => {
          if (response.statusCode == 200) {          
            this._toasterService.success(CommonSuccessMessages.caregiverrating, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true             
            });
            this.getCaregiverRatings(this.id);
            let btn = (<HTMLInputElement>document.getElementById("ratingCancleBtn"));
            btn.click();
            this.addRatingForm.reset();
          }
        })
    setTimeout(() => {
   if (ratingStar <3){
    this._toasterService.info(CommonSuccessMessages.Ratingwarning, "", {
      timeOut: 8000, positionClass: 'toast-top-right', closeButton: true
    });
     }
    }, 3000);}
    }
    else {     
      this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true     
        }); 
      }        
  }

  getCaregiverRatings(Id:any){
    this._addcaregiverService.GetCaregiverService(Id).subscribe((response: any) => {
      this.caregiverRatingList = response.data; 
      if(response.data.length >0){
        this.Reviewcounts = response.data[0].TotalReview;
        let total = response.data[0].avgCount;
        let rounded = Math.round(total * 10) / 10
        this.AvgReview = rounded
      }
      
      if(response.data.length >0){
        this.RatingFoundorNot = true;
        this.noReview = false;
        this.totalReview = true;
      }
      else{
        this.noReview = true;
      }
      if(Number(this.patientId) > 0 ){    
        this.totalReview = true;      
      }
     }
    )
  }
}

