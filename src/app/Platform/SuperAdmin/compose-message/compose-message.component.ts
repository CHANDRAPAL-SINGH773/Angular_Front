import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InboxService } from '../../Services/inboxService/inbox.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { UploadImageServiceService } from 'src/app/Shared/uploadImage/upload-image-service.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface MailFrom {
  presentMailId: string;
}
export interface MailTo {
  toMailId: string;
  tomails:string;
  toName:string;
}
@Component({
  selector: 'app-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.css']
})
export class ComposeMessageComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly keysMailToCodes = [ENTER, COMMA] as const;
  mailfroms: MailFrom[] = [{presentMailId: 'CAgency@yopmail.com'}];
  mailtos: MailTo[] = [];
  composeMailForm!: FormGroup;
  htmlContent = '';
  userId:any;
  loaderflag:boolean = false;
  isReadonly:boolean = false;
  UsersList :any;
  attachment?: File;
  fileNameObj:any = 'Choose file.';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ] 
  };

  constructor(private fb: FormBuilder, private inboxService:InboxService, 
     private _authservice : AuthService,
     private _toasterService: ToastrService,
     private _UploadImageService : UploadImageServiceService,
     private router: Router) { }

  addFrom(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.mailfroms.push({presentMailId: value});
    }
    event.chipInput!.clear();
  }
  
 addMailinMsgto(value:any, Id:any, name:any){
  this.mailtos.push({toMailId: Id, tomails: value, toName:name});
 }


  addTo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      //this.mailtos.push({toMailId: '', tomails:''});
    }
    event.chipInput!.clear();
  }

  removeMail(MailTo: MailTo): void {
    const index = this.mailtos.indexOf(MailTo);
    if (index >= 0) {
      this.mailtos.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.CreateFormGroup();
    this.userId = this._authservice.userID;
  }

  CreateFormGroup(): void {
    this.composeMailForm = this.fb.group({
      Subject: new FormControl("", Validators.required),
      Message: new FormControl("", Validators.required),
      MessageTo: new FormControl("", Validators.required),
      IsHighPriority: new FormControl(""),
      AttachecdDocs: new FormControl(""),
    })
}

searchUserByEmail(){
  this.loaderflag=true;
  if(this.isReadonly==false){
  let useremail =   this.composeMailForm.controls['MessageTo'].value
  this.inboxService.GetFilterdUsersList(useremail).subscribe((response:any)=>{
    if(response.data!=null){
     this.UsersList = response.data;
     this.loaderflag = false; 
    }
    else{
      this.UsersList =[];
      this.loaderflag = false; 
    } 
   })
  }
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
    formData.append('ProfileLink', 'MessageAttachedDocs');
    
    this._UploadImageService.UploadCaregiverCredentialService(formData).subscribe((profilePath:any) => {
      let imageSrc=   this.createImgPath(profilePath.data.value);
      this.composeMailForm.controls['AttachecdDocs'].setValue(imageSrc);
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

createImgPath = (serverPath: string) => {
  var path = `${environment.imageUrl}/${serverPath}`;
  return path;
};

 compose():any {
let sender = this.mailfroms[0].presentMailId
let MsgTo:any =[];
for(let i = 0 ; i < this.mailtos.length; i++)
 {
  MsgTo.push( this.mailtos[i].toMailId);
 }
 const model ={
  UserId: this.userId,
  MessageTo : MsgTo,
  Sender:sender,
  Subject: this.composeMailForm.controls['Subject'].value,
  Message:this.composeMailForm.controls['Message'].value,
  IsHighPriority:this.composeMailForm.controls['IsHighPriority'].value,
  AttachedDocs:this.composeMailForm.controls['AttachecdDocs'].value,
  }

this.inboxService.ComposeMessagesService(model).subscribe((response=>{
  this._toasterService.info(CommonSuccessMessages.InboxMessageSent, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.router.navigate(["/Dashboard/manage-message"]);
 }))
}



}
