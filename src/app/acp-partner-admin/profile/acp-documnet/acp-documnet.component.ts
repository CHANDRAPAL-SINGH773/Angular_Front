import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AddDocumentComponent } from './add-document/add-document.component';
import { ToastrService } from 'ngx-toastr';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import Swal from 'sweetalert2';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-acp-documnet',
  templateUrl: './acp-documnet.component.html',
  styleUrls: ['./acp-documnet.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AcpDocumnetComponent implements OnInit {
  loader=false;
 companyId:any
 acpPartnerId:any
 userId:any
 documentList:any[]
  constructor(private dialogModal: MatDialog,private _toasterService: ToastrService,private Acp_Partner:AcpPartnerService) { }

  ngOnInit(): void {
    this.companyId=Number(localStorage.getItem('companyID'));
    this.acpPartnerId=Number(localStorage.getItem('acpPartnerID'));
    this.userId=Number(localStorage.getItem('user_id'));
    this.getAllDocumentList();
  }


  createModal() {

    if (this.userId >0 && this.companyId>0 && this.acpPartnerId>0) {
      let documentModal;
      documentModal = this.dialogModal.open(AddDocumentComponent, {
         data: {userId:this.userId,companyId:this.companyId,acpPartnerId:this.acpPartnerId} ,
         panelClass: ['custom_dialog', 'uploaddoc']
      })
      documentModal.afterClosed().subscribe((result: string) => {
        if (result == 'save' || result == 'close'){
          this.getAllDocumentList();
        }
      });
    }
    else {
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("No User Found", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
  }
  deleteUserDocumentToBe(doc:any){
    this.loader=true
    if(this.companyId>0 && doc.docId>0)
    {
    this.Acp_Partner.DeleteDoc(this.companyId,doc.docId).subscribe((res: any) => {
      if(res.statusCode==200){
        this.loader=false
        this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.success(res.message, "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
        this.getAllDocumentList();
        return;
      }
      else{
        this.loader=false
        this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("No User Found", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
        this.getAllDocumentList();
        return;
      }
    })
  }
  else{
    this.loader=false
  }


  }
  getUserDocument(doc:any){
    this.Acp_Partner.downloadFile(doc.fileUrl)
  }
  getAllDocumentList(){
    this.loader=true
    if(this.companyId>0 && this.acpPartnerId>0)
    {
    this.Acp_Partner.GetDocs(this.companyId,this.acpPartnerId).subscribe((res: any) => {
      if(res.statusCode==200){
        this.loader=false
        this.documentList=res.responseData;
        return;
      }
      else{
        this.documentList=[];
        this.loader=false
        return;
      }
    })
  }
  else{
    this.loader=false
  }
  }

  deleteUserDocument(doc: any) {
    console.log("To Be Deleted",doc)
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      this.deleteUserDocumentToBe(doc);
      }
    })
   }





}
