import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AddDocumentComponent implements OnInit {
  loader=false;
  companyId:number=0;
 acpPartnerId:number=0;
 userId:number=0;
  addDocumentForm: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  file:any[]=[]
  constructor(private dialogModalRef: MatDialogRef<AddDocumentComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
     private formBuilder: FormBuilder,private Acp_Partner:AcpPartnerService,private _toasterService: ToastrService) {
  }

  ngOnInit() {
    this.companyId=Number(localStorage.getItem('companyID'));
    this.acpPartnerId=Number(localStorage.getItem('acpPartnerID'));
    this.userId=Number(localStorage.getItem('user_id'));
    this.addDocumentForm = this.formBuilder.group({
      title: []
    });

  }
  get formControls() {
    return this.addDocumentForm.controls;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }


  handleImageChange(e:any) {
    this.file.push(e.target.files[0]);
    let fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
  removeFile(index: number) {
    this.file.splice(index,1)
    this.fileList.splice(index, 1);
  }
  onSubmit() {
    this.loader=true
let filesToUpload: File[] = this.file;
const formData = new FormData();

Array.from(filesToUpload).map((file, index) => {
  return formData.append("file" + index, file, file.name);
});
this.Acp_Partner.UploadDocs(this.companyId,this.acpPartnerId,this.addDocumentForm.controls['title'].value,formData).subscribe((res: any) => {
  if(res.statusCode==200){
    this.loader=false
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: res.message,
      showConfirmButton: false,
      timer: 2200,

    });

    this.closeDialog('close');
    return;
    
  }
  else{
    this.loader=false
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: res.message,
      showConfirmButton: false,
      timer: 2200,

    });
    this.closeDialog('close');
    return;
    
  }
})

  }

}
