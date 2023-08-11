import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManageNotificationService } from 'src/app/Platform/Services/manageNotificationService/manage-notification.service';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { DataSharingService } from 'src/app/Shared/data-sharing.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _dataSharingService:DataSharingService,private fb: FormBuilder, private _toasterService: ToastrService,private _notificationService : ManageNotificationService, private router: Router) { }
  AddNotificationTemplate!: FormGroup;
  submitted:any;
  id: number =0;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;
  uniqueTemplate:boolean =false;
  ngOnInit(): void {
    this.CreateFormGroup();
    this._dataSharingService.changeHeader("Manage Agencies")
    this.id = parseInt(this.route.snapshot.params['id']);
    if (this.id != 0) {
      this.getTemplateData(this.id);
 
    }
  }
  CreateFormGroup(): void {
    
    this.AddNotificationTemplate = this.fb.group({
      TemplateName: new FormControl("", [Validators.required]),
      Title: new FormControl("", Validators.required),
      Note: new FormControl("", [Validators.required,]),
      TemplateId: new FormControl(""),
    })
}
AddNewTemplate():any{
  if(this.uniqueTemplate == false){
  if(this.AddNotificationTemplate.valid){
const model ={
  TemplateName : this.AddNotificationTemplate.controls["TemplateName"].value,
  Title: this.AddNotificationTemplate.controls["Title"].value,
  Note:this.AddNotificationTemplate.controls["Note"].value
}
this._notificationService.AddNotificationTemplateService(model).subscribe((response:any)=>{

  if (response.statusCode == 200) {
    this._toasterService.success(CommonSuccessMessages.TemplateAdded, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    this.router.navigate(["/Dashboard/ManageNotificationTemplate"]);
  }
})
  }
  else{
    this._toasterService.info(CommonErrorMessages.FillMendatoryFields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}
else{
  this._toasterService.info(CommonErrorMessages.EnterUniqueTitle, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
}
}
//Method is used for get template data--
getTemplateData(id : number):void {
this._notificationService.GetTemplateData(id).subscribe((response:any)=>{
  this.Addbuttonflag= false;
  this.UpdateButtonflag= true;
  if(response.data != null && response.data != undefined){
  this.AddNotificationTemplate.controls['TemplateName'].setValue(response.data[0].TemplateName);
  this.AddNotificationTemplate.controls['Title'].setValue(response.data[0].TemplateTitle);
  this.AddNotificationTemplate.controls['Note'].setValue(response.data[0].Note);
  this.AddNotificationTemplate.controls['TemplateId'].setValue(response.data[0].TemplateId);
  }
})
}

UpdateTemplate():any{
  if(this.uniqueTemplate == false){
  if(this.AddNotificationTemplate.valid){
const model ={
  TemplateName : this.AddNotificationTemplate.controls["TemplateName"].value,
  Title: this.AddNotificationTemplate.controls["Title"].value,
  Note:this.AddNotificationTemplate.controls["Note"].value,
  TemplateId:Number( this.AddNotificationTemplate.controls["TemplateId"].value),

}
this._notificationService.UpdateNotificationTemplateService(model).subscribe((response:any)=>{

  if (response.statusCode == 200) {
    this._toasterService.success(CommonSuccessMessages.TemplateUpdated, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    this.router.navigate(["/Dashboard/ManageNotificationTemplate"]);
  }
})
  }
  else{
    this._toasterService.info(CommonErrorMessages.FillMendatoryFields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
  }
}
else{
  this._toasterService.info(CommonErrorMessages.EnterUniqueTitle, "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
}
}
checkUniqueTemplateValidation():void{
const title = this.AddNotificationTemplate.controls["Title"].value;

  this._notificationService.CheckUniqueTemplateValidation(title).subscribe((response:any)=>{
    this.uniqueTemplate = false;
    if(response.data.length != 0){
      this.uniqueTemplate = true;
   
    }
  })
}

}
