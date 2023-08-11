import { Component,Inject ,OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-business-partner',
  templateUrl: './add-business-partner.component.html',
  styleUrls: ['./add-business-partner.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AddBusinessPartnerComponent implements OnInit {
  loader=false;
  BusinessPartnerForm:FormGroup;
  companyId:any
  acpPartnerId:any
  userId:any
  programActivitylist:any=[];
  businessPartnerList:any;
  toppingList: any;
  submitted!: boolean;
  activities:any
  file:any[]=[]
  fileList: any = [];
  dataURL: any;
  default1:any;
   constructor(private dialogModalRef: MatDialogRef<AddBusinessPartnerComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: any,
     private fb: FormBuilder,private localstorage: LocalStorageService,
     public commonService: CommonService,private _toasterService: ToastrService,
     private Acp_Partner:AcpPartnerService) { }

  ngOnInit(): void {
    this.companyId=Number(this.localstorage.getCompanyID());
    this.acpPartnerId=Number(this.localstorage.getAcpPartnerID());
    this.userId=Number(this.localstorage.getUserId());
    this.CreateFormGroup();
    this.GetBusinessPartner();
  }
  CreateFormGroup() {
    this.BusinessPartnerForm = this.fb.group({
      BusinessPartner: new FormControl("",Validators.required),
      BusinessActivity: new FormControl({ value: '', disabled: true },Validators.required),
      SelectProgram: new FormControl({ value: '', disabled: true },Validators.required),
      Comment: new FormControl(""),
      //UploadDocument: new FormControl("")

    })
  }

  GetBusinessPartner(){
    if(this.companyId>0){
      this.loader=true;
      let obj={
        CompanyID:Number(this.companyId),
        search:'',
        pageNumber:1,
        pageSize:1000000,
        sortColumn:'',
        sortOrder:''

      }
      this.commonService.getBuisnessPartner(obj).subscribe((response:any)=>{
        if(response.statusCode==200){
          this.businessPartnerList = response.responseData.items;
          this.loader=false;
        }
        else{
          this.businessPartnerList=[];
          this.loader=false;
        }

        })
    }
    else{
      this.loader=false;
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Company Not Found", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }



  }
  onSubmit() {
    if(this.BusinessPartnerForm.invalid){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please fill required fields", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
    if( this.BusinessPartnerForm.controls["BusinessActivity"].value=="" || this.BusinessPartnerForm.controls["SelectProgram"].value==""){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("selected business partner not working on any Program and activities", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }


    this.default1=0;
    this.loader=true;
    const formData = new FormData();

    for (let i = 0; i < this.file.length; i++) {
      const file: File = this.file[i];
      formData.append('files', file, file.name);
    }
    formData.append("BuisnessPartnerID",this.default1);
    formData.append("CompanyID",this.companyId);
    formData.append("AcpPartnerId",this.acpPartnerId);
    formData.append("PartnerId",this.BusinessPartnerForm.value.BusinessPartner);
    formData.append("BusinessActivityID",this.default1);
    formData.append("Activity",this.BusinessPartnerForm.controls["BusinessActivity"].value==""?'false':'true');
    formData.append("Program",this.BusinessPartnerForm.controls["SelectProgram"].value==""?'false':'true');
    formData.append("Comment",this.BusinessPartnerForm.value.Comment);
    formData.append("CreatedBy",this.userId);
    this.commonService.addBuisnessPartner(formData).subscribe((response:any)=>{
      if (response.statusCode==200){
        this.loader=false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
        this.closeDialog('close');
        return;
      }
      else{
        this.loader=false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
      }
      })
  }
  onAttachment(file: any): any {
    const extension = file.srcElement.files[0].name.substring(
      file.srcElement.files[0].name.lastIndexOf('.') + 1
    );
  }
  GetProgram(){
    this.commonService.getProgram().subscribe((response:any)=>{
      this.toppingList = response.responseData;
      })
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  onSelectionChange(id:any){
    if(id.value>0){
      this.getProgramActivities(id.value)
    }
  }

  getProgramActivities(AcpPartnerId:any){
        //this.loader=true;
    if(this.companyId>0 && AcpPartnerId>0)
    {
    this.Acp_Partner.GetProgramActivities(this.companyId,AcpPartnerId).subscribe((res: any) => {
      if(res.statusCode==200){
        debugger;
        //this.loader=false
        this.programActivitylist=res.responseData;
        if(res.responseData){
        this.activities=res.responseData.activitiesModel.filter((x:any)=>x.isChecked==true)

        const selectedProgramIds = this.programActivitylist.programs
        .filter((pa:any) => pa.isChecked)
        .map((pa:any) => pa.programId);
  
        this.BusinessPartnerForm.get('SelectProgram')?.patchValue(selectedProgramIds);
        if(this.activities.length>0){
          this.BusinessPartnerForm.get('BusinessActivity')?.patchValue('1');
        }
        else{
          this.BusinessPartnerForm.get('BusinessActivity')?.patchValue('');
        }







        
        }
        return;
      }
      else{
        //this.loader=false
        this.programActivitylist=[];
        return;
      }
    })
  }
  else{
    //this.loader=false
  }
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

}
