import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { DataSharingService} from '../../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { DropdownList } from 'src/app/Platform/Model/DropDownModel';
import { ResponseStatus } from 'src/app/Platform/Model/ResponseStatusModel';
import { CredentialingServiceService } from 'src/app/Platform/Services/credentialing-service/credentialing-service.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable, Observer } from 'rxjs';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-add-new-credentialing',
  templateUrl: './add-new-credentialing.component.html',
  styleUrls: ['./add-new-credentialing.component.css']
})
export class AddNewCredentialingComponent implements OnInit {
  addCredentialingform!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  loaderflag:boolean = false;
  credentialingList:DropdownList[] =[];
  ExpirationTypeList:DropdownList[] =[];
  CaregiverList:DropdownList[] =[];
  CredentialList:DropdownList[] =[];
  userId:any;
  maxDate =new Date();
  fileNameObj:any = 'Choose file.';
  public CLOSE_ON_SELECTED = false; 
  public init = new Date();
  public resetModel = new Date(0);
  minDate = new Date();
  dateModel:any = [];
  Credentialingform:boolean = true;
  CredentialingTable:boolean = false;
  PcredentialList:any=[];
  Addbtnflag: boolean = true;
  Editbtnflag:boolean = false;
  modalReference: NgbModalRef;
  ImgFile: boolean = false;
  wordFile: boolean = false;
  pdfFile: boolean = false;
  uploadedImg:any;
  ViewModalImage:any;
  name = "Mr";
  base64Image: any;
  @ViewChild('picker', { static: true }) _picker!: MatDatepicker<Date>;
   public _imageUrl: string = '';
   constructor(
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _credentialingService : CredentialingServiceService,
    private _dataSharingService:DataSharingService,
    private _UploadImageService : UploadImageServiceService,
    private _authservice : AuthService,
    private ngbmodelService: NgbModal,) { }

  ngOnInit(): void {
    this.minDate = new Date();
    this.CreateFormGroup();

    this._dataSharingService.changeHeader("Manage Credential")
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
      this.Credentialingform = false;
      this.CredentialingTable = true;
    this.GetCredentialingList(this.id);}

    this.userId = this._authservice.userID;
    this.GetCredentialsDropDownList()
  }


  CreateFormGroup(): void {
    this.addCredentialingform = this.fb.group({  
      CredentialCategory:  new FormControl("", Validators.required),
      Caregiver: new FormControl("",[Validators.required,]),
      DocumentName:new FormControl("",[Validators.required,]),
      LicenseNumber:new FormControl("", [Validators.required,]),
      ExpirationDate: new FormControl("",Validators.required),
      UploadedDocument:new FormControl("",Validators.required),
      Status: new FormControl("",[Validators.required,]),
      ExpirationReminderAlert: new FormControl("", Validators.required),
      SendNotificationTo: new FormControl("",[Validators.required,]),
      Notes: new FormControl("",[Validators.required,]),
      AgencyId:new FormControl(""),
      UserId:new FormControl(""),
      Id:new FormControl(""),
      CredentialId:new FormControl("0"),
    })
  }

  GetCredentialsDropDownList(){
    this.loaderflag=true;
    this._credentialingService.GetCredentialingDropDownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{

    this.credentialingList = response.data;
    this.credentialingList = this.credentialingList.filter(p=>p.FlagId == DefaultNumber.One)
    this.credentialingList.unshift({ FlagId: DefaultNumber.One, Label: "Please Select", Id: "" });

    this.CredentialList = response.data;
    this.CredentialList = this.CredentialList.filter(p=>p.FlagId == DefaultNumber.One)
    

    this.ExpirationTypeList = response.data;
    this.ExpirationTypeList = this.ExpirationTypeList.filter(p=>p.FlagId == DefaultNumber.Two)
    this.ExpirationTypeList.unshift({ FlagId: DefaultNumber.Two, Label: "Please Select", Id: "" });

    this.CaregiverList = response.data;
    this.CaregiverList = this.CaregiverList.filter(p=>p.FlagId == DefaultNumber.Three)
    this.CaregiverList.unshift({ FlagId: DefaultNumber.Three, Label: "Please Select", Id: "" });
    })
    this.loaderflag=false;
   } 

CheckExpiryDateValidation(){
  let TodayDate = new Date();
  let selectedDate = this.addCredentialingform.controls['ExpirationDate'].value;
  let Date1 = moment(TodayDate).format('MM/DD/yyyy')
  let Date2 =  moment(selectedDate).format('MM/DD/yyyy')
  if(Date1 == Date2){
    this._toasterService.error(CommonErrorMessages.DocumentExpired, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.addCredentialingform.controls['ExpirationDate'].setValue('');
  }
 
}

public dateClass = (date: Date) => {
  if (this._findDate(date) !== -1) {
    return [ 'selected' ];
  }
  return [ ];
}

public dateChanged(event: MatDatepickerInputEvent<Date>): void {
  if (event.value) {
    const date = event.value;
    const index = this._findDate(date);
    if (index === -1) {
      this.dateModel.push(moment(date).format('MM/DD/yyyy'));
    } else {
      this.dateModel.splice(index, 1)
    }
    this.resetModel = new Date();
    if (!this.CLOSE_ON_SELECTED) {
      const closeFn = this._picker.close;
      this._picker.close = () => { };
      setTimeout(() => {
        this._picker.close = closeFn;
      });
    }
  }
}

public remove(date: Date): void {
  const index = this._findDate(date);
  this.dateModel.splice(index, 1)
}

private _findDate(date: Date): number {
  return this.dateModel.map((m:Date) => +m).indexOf(+date);
}

documentModel(event: any): void {
  this.ViewModalImage = this.addCredentialingform.controls['UploadedDocument'].value;
   this.modalReference =this.ngbmodelService.open(event,{ centered: true }); //here modalservice is NgbModal
}

closeDocumentPopup(){
  this.modalReference.close();
}
//method for Add new Credentialing --
AddUpdateCredentialing(): any {
  // this.addCredentialingform.controls['UploadedDocument'].touched = true
  let credentialingId = Number(this.addCredentialingform.controls['CredentialId'].value);
  if(this.addCredentialingform.valid){
  const model ={
                CredentialCategory: Number(this.addCredentialingform.controls['CredentialCategory'].value),
                Caregiver: Number(this.addCredentialingform.controls['Caregiver'].value),
                DocumentName: this.addCredentialingform.controls['DocumentName'].value,
                ExpirationDate:this.addCredentialingform.controls['ExpirationDate'].value,
                Status: this.addCredentialingform.controls['Status'].value,
                ExpirationReminderAlert: Number(this.addCredentialingform.controls['ExpirationReminderAlert'].value),
                SendNotificationTo: this.addCredentialingform.controls['SendNotificationTo'].value,
                Notes: this.addCredentialingform.controls['Notes'].value,
                UploadedDocument: this.addCredentialingform.controls['UploadedDocument'].value,
                LicenseNumber: this.addCredentialingform.controls['LicenseNumber'].value,
                CredentialId: Number(this.addCredentialingform.controls['CredentialId'].value),
      }
   this.submitted = true; 
   if (this.addCredentialingform.invalid) {
    this.submitted = true;
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
    return ;
  }
  if (this.addCredentialingform.valid) {
    if (credentialingId == 0 ){
    this._credentialingService.SaveCredentialingService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        this._toasterService.success(CommonSuccessMessages.DocumentAdded, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.router.navigate(["/Dashboard/manage-credentialing"]);
      }
    
    })
  }
  else{
    this._credentialingService.SaveCredentialingService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        this._toasterService.success(CommonSuccessMessages.DocumentAdded, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.router.navigate(["/Dashboard/manage-credentialing"]);
      }
    
    })
  }
  }
}
else{
  this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
}
}


RemoveFile(){
  this.fileNameObj = 'Choose File.';
  this.addCredentialingform.controls['UploadedDocument'].setValue('');
}

// Method for browse file attachment(caregiver profile upload)---
onDocumentsAttachment(file?: any): any {
  const formData = new FormData();
  this.attachment = file;
  console.log(file.target.files[0])
  console.log(file.target.files[0].type);
  if(file.target.files[0].type == 'image/jpeg' || file.target.files[0].type =='image/png' || file.target.files[0].type =='application/vnd.ms-word' || file.target.files[0].type =='image/svg' || file.target.files[0].type =='application/pdf'|| file.target.files[0].type =='image/jpg'  || file.target.files[0].type =='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
    if(file.target.files[0].size <= 5000000){
  if (file.target.files[0] ) {
    this.fileNameObj = file.target.files[0].name;
    formData.append('Image', file.target.files[0]);
    formData.append('ProfileLink', 'CaregiverCredentials');
    
    this._UploadImageService.UploadCaregiverCredentialService(formData).subscribe((profilePath:any) => {
      let imageSrc=   this.createImgPath(profilePath.data.value);
      this.addCredentialingform.controls['UploadedDocument'].setValue(imageSrc);
    })
  }
}
else{
  this._toasterService.error(CommonErrorMessages.fileSize5, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
}
  }
  else{
    this._toasterService.error(CommonErrorMessages.DocumentNotSupported, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
  }
}


//method is used for get particlar credentialing list--
GetCredentialingList(id:number):void{
  this._credentialingService.GetParticularCredentialingList(id).subscribe((response:any) => {
    if(response.data != "") {
this.PcredentialList = response.data;

  }
})
}
//method is used for swipe table to form-
AddNewCredentialing(){
  this.Credentialingform = true;
  this.CredentialingTable = false;
}

//method is used for swipe table to form-
EditCredentialing(id:any,flag:any){
  if(flag =='screen'){
  this.Credentialingform = true;
  this.CredentialingTable = false;
  this.Addbtnflag = false;
  this.Editbtnflag = true;
  this.GetCredentialingData(Number(id));
  }
  else{
    this.Credentialingform = false;
    this.CredentialingTable = true;
    this.Addbtnflag = false;
    this.Editbtnflag = true;
    this.GetCredentialingData(Number(id));
  }
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
      this._credentialingService.DeletedParticularCredentialing(id).subscribe((response: any) => {
        if (response.message = 'OK') {

          Swal.fire(
            'Deleted!',
            'Credential has been deleted successfully.',
            'success'
          )
        }
      })
      this.GetCredentialingList(this.id);
    }
  })
}
//method for get particular credentialing  Details --
GetCredentialingData(id : Number):void {
  // debugger;
  let data:any ; 
  this._credentialingService.GetCredentialingData(id).subscribe((response:any) => {
            if(response.data != "") {
          this.Addbuttonflag= false;
          this.UpdateButtonflag= true;
          this.addCredentialingform.controls['CredentialCategory'].setValue(response.data[0].CredentialCategory);
          this.addCredentialingform.controls['Caregiver'].setValue(response.data[0].CaregiverId);
          this.addCredentialingform.controls['DocumentName'].setValue(response.data[0].DocumentName);
          this.addCredentialingform.controls['LicenseNumber'].setValue(response.data[0].LicenseNumber);
          // this.fileNameObj = response.data[0].DocumentPath;
          this.addCredentialingform.controls['ExpirationDate'].setValue(response.data[0].ExpirationDate);
          this.addCredentialingform.controls['Status'].setValue(response.data[0].Status);
          this.addCredentialingform.controls['ExpirationReminderAlert'].setValue(response.data[0].ExpirationReminderAlert);
          this.addCredentialingform.controls['SendNotificationTo'].setValue(response.data[0].SendNotificationTo);
          this.addCredentialingform.controls['Notes'].setValue(response.data[0].Notes);
          this.addCredentialingform.controls['UploadedDocument'].setValue(response.data[0].DocumentPath);
          this.addCredentialingform.controls['CredentialId'].setValue(response.data[0].CredentialId)
          let img = response.data[0].DocumentPath
         this.uploadedImg = response.data[0].DocumentPath
         if(img != null && img != undefined){
          var splitted = response.data[0].DocumentPath.split("CaregiverCredentials"); 
          var name = splitted[1].split('\\')
          this.fileNameObj =name[1];
          var ext = name[1].split('.');
          var finalExt = ext[1];
          if(finalExt =='docx'){
            this.wordFile = true;
            this.pdfFile = false;
            this.ImgFile = false;
          }
         else if(finalExt =='pdf'){
            this.pdfFile = true;
            this.wordFile = false;
            this.ImgFile = false;
          }
          else{
            this.pdfFile = false;
            this.wordFile = false;
            this.ImgFile = true;
          }
          }
          }
        })
      }


      //  download() {
      //   fetch(this.uploadedImg)
      //     .then(response => response.blob())
      //     .then(blob => {
      //       const link = document.createElement("a");
      //       link.href = URL.createObjectURL(blob);
      //       link.download = 'Sample';
      //       link.click();
      //   })
      //   .catch(console.error);
      // }

      // SaveAs() {
        // var baseUrl = environment.ICC_API.replace('api','')
        // var finalurl = baseUrl+this.NCQAUrl
      //   this._credentialingService.download( this.uploadedImg).subscribe((blob) =>{
      //       if(blob.size>0){
      //         saveAs(blob,'Docs')
      //         }
      //     })
      // }
  
  downloadFile(){
  let fileType = this.GetFileType(this.uploadedImg);
if(this.uploadedImg != null){
  var splitted = this.uploadedImg.split("CaregiverCredentials"); 
  var name = splitted[1].split('\\')
  var filename =name[1];
  this._credentialingService.getFiles(filename).subscribe(res =>{
    this.download(res, fileType,this.uploadedImg);
  })
 }
 else{
  this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
 }
 }


download(res:any, fileType:any, uploadFile:any){
  var blob = new Blob([res], { type: fileType });
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = uploadFile.split('\\').pop();
      anchor.href = url;
      anchor.click();
}

      GetFileType(fileName: any){  
        let checkFileType =  '.' + fileName.split('.').pop().toLowerCase();
        var fileType;
        if(checkFileType == ".txt")
        {
          fileType = "text/plain";
        }
        if(checkFileType == ".pdf")
        {
          fileType = "application/pdf";
        }
        if(checkFileType == ".doc")
        {
          fileType = "application/vnd.ms-word";
        }
        if(checkFileType == ".docx")
        {
          fileType = "application/vnd.ms-word";
        }
        if(checkFileType == ".xls")
        {
          fileType = "application/vnd.ms-excel";
        }
        if(checkFileType == ".xlsx")
        {
          fileType = "application/vnd.ms-excel";
        }
        if(checkFileType == ".png")
        {
          fileType = "image/png";
        }
        if(checkFileType == ".jpg")
        {
          fileType = "image/jpeg";
        }
        return fileType;
      }

      //upload agency profile image--
      Upload():void{
        debugger;
        const formData = new FormData();
        if (this.attachment) {
          formData.set("file", this.attachment, this.attachment.name);
        }
        else{
          return;
        }
      }
    
      createImgPath = (serverPath: string) => {
        var path = `${environment.imageUrl}/${serverPath}`;
        return path;
      };

      resetFileUploader() { 
        this.imageSrc='';
      }
      
  
 

}

