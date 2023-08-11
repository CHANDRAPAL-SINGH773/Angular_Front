import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-contact-client',
  templateUrl: './add-contact-client.component.html',
  styleUrls: ['./add-contact-client.component.scss']
})
export class AddContactClientComponent implements OnInit {
  ContactClientForm!:FormGroup;
  Search: any;
  submitted: boolean;
  mode:boolean=false;
  ContactClientID: number=0;
  clientSiteID: any;
  Mode: string='Add';
  tempAddress:any;
  addressList:any[];
  FormHeading:string="Add Contact Client"
  ButtonHeading:string="Add"
  // clientSiteID: any;
  contactClientList: any;
  dataSource: any;
  // ContactClientID: Number=0;

  constructor(private dialogModalRef: MatDialogRef<AddContactClientComponent>,
    private localstorage:LocalStorageService,
    private fb: FormBuilder,
    private commonService:CommonService,
    private _toasterService:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
  this.initializeContactClientForm();
  this.getClientAddressList();
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  initializeContactClientForm() {
    this.ContactClientForm=this.fb.group({
     ContactName:['',Validators.required],
     ClientSite:['',Validators.required]
    })
   }
 
   public nextPage(event: any) {
     const limit = event.pageSize;
     const skip = event.pageIndex + 1;
     this.Search.PageSize = limit;
     this.Search.PageNumber = skip;
   }

  OnSubmitClick(){
    this.submitted=true;
    this.ContactClientForm.markAllAsTouched()
    if(this.ContactClientForm.invalid)
      return
    let obj = {
        contactClientID: this.ContactClientID,
        contactClientName: this.ContactClientForm.value.ContactName,
        clientSiteID: this.clientSiteID,
        companyID: this.localstorage.getCompanyID(),
        acpPartnerID:this.localstorage.getAcpPartnerID() 
      };
      this.commonService.addContactClient(obj).subscribe((res) => {
            if(res.statusCode==200){
              Swal.fire('Details added succesfully!', 'success')
              // this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
                //       timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                //     });
                
                this.ContactClientForm.reset()
                // this.GetClientContactList()
              }else{
                  Swal.fire('Details added succesfully!', 'warning')
                  this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                  });
                }
    });
}
// GetClientContactList() {
//   let obj = {
//       search:'',
//       pageNumber:1,
//       pageSize:10,
//       companyID: this.localstorage.getCompanyID(),
//       acpPartnerID:this.localstorage.getAcpPartnerID() 
//     };
//     this.commonService.GetClientContactList(obj).subscribe((res) => {
//       if(res.statusCode=='200'){
//         this.contactClientList=res.responseData.items;
//         this.dataSource=this.contactClientList;
//       }
//   });
// }
updateClientContactForm(){
  debugger
  this.ContactClientID=this.data.item.contactClientID
    this.Mode='Edit'
    this.clientSiteID=this.data.item.clientSiteID
    this.ContactClientForm.patchValue({
        ContactName:this.data.item.contactName,
        ClientSite:this.data.item.address1+', '+this.data.item.address2
    })
  }
  getClientAddressList(){
    let obj = {
        companyID: this.localstorage.getCompanyID(),
        acpPartnerID: this.localstorage.getAcpPartnerID(),
    }
    this.commonService.GetClientContactAddress(obj).subscribe(res=>{
      debugger;
      if(res){
        this.addressList=[];
        this.tempAddress=res.responseData;
        this.tempAddress.forEach((element: { address1: any; address2: any; }) => {
        this.addressList.push(element.address1+', '+element.address2);
       });
      }
      if(this.data.item){
        if(this.data.mode=='view'){
          this.FormHeading="View Client site"
          this.mode=this.data.mode=='view'
          this.updateClientContactForm()
          this.ContactClientForm.disable();
        }
        else{
          this.Mode='Edit'
          this.FormHeading="Edit Client Site"
          this.ButtonHeading="Edit"
          this.updateClientContactForm()
        }
    }
  })
  }
  // updateClientContactForm() {
  //   this.ContactClientID=this.data.item.contactClientID
  //   this.ContactClientForm.patchValue({
  //     ContactName:,
  //     ClientSite:
  //    })
  // }

  setClientSiteID(event:any){
    this.tempAddress.forEach((element: { address1: string; address2: string; clientSiteID: any; }) => {
      if(element.address1+", "+element.address2 == event){
        this.clientSiteID= element.clientSiteID;
      }
    });
  }
  onAddContactClient(){
    this.ContactClientForm.reset();
    this.Mode='Add'

  }
}
