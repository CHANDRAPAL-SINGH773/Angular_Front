import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { BusinessPartnerServiceService } from '../../acp-partner-profile/list-business-partner/business-partner-service.service';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { values } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AddProjectComponent implements OnInit {
  ProjectForm:FormGroup;
  loader=false;
  file:any[]=[]
  fileList: any = [];
  dataURL: any;
  projectStatus:any
  installationType:any
  companyId:any
  acpPartnerId:any
  userId:any
  ApprovedBPList:any
  programActivitylist:any=[];
  activities:any
  Manpower:any
  ownManPoer=false;
  staffList:any
  clientList:any
  clientSite:any
  userType:any
  FormHeading:string="Add Project"
  ButtonHeading:string="Add"
  constructor(private dialogModalRef: MatDialogRef<AddProjectComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
    private bpservice:BusinessPartnerServiceService,private localstorage: LocalStorageService,
    private Acp_Partner:AcpPartnerService,private _acpPartner: AcpPartnerService,
    private commonService: CommonService,private _toasterService: ToastrService,private projectService:ProjectService) { }

  ngOnInit(): void {
    if(this.data.element){
      this.FormHeading="Edit Project"
      this.ButtonHeading="Edit"
      this.GetProjectDetailsById(this.data.element)
    }
    this.companyId=Number(this.localstorage.getCompanyID());
    this.acpPartnerId=Number(this.localstorage.getAcpPartnerID());
    this.userId=Number(this.localstorage.getUserId());
    this.userType=Number(this.localstorage.getUserType());
    this.CreateFormGroup();
    this.GetManPower();
    this.GetProjectStatus();
    this.GetInstallationOption();
    this.GetClients(this.companyId,this.acpPartnerId);
      }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  CreateFormGroup() {
    this.ProjectForm = this.fb.group({
      ProjectId:new FormControl("0"),
      ProjectNo: new FormControl("",Validators.required),
      Client: new FormControl("",Validators.required),
      ClientSite: new FormControl("",Validators.required),
      ManPower: new FormControl("",Validators.required),
      BusinessPartner: new FormControl(""),
      installationType: new FormControl("1",Validators.required),
      Assessor_Installer: new FormControl("",Validators.required),
      BusinessCategory: new FormControl({ value: '', disabled: true }),
      SelectProgram: new FormControl({ value: '', disabled: true }),
      StatusId: new FormControl("1"),
    })
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
  GetProjectStatus(){
   this.projectStatus=CommonErrorMessages.getStatus()
  }
  GetInstallationOption(){
  this.installationType=CommonErrorMessages.installationType()
  }
  GetManPower(){
    this.Manpower=CommonErrorMessages.Manpower()
  }

  GetApprovedBPRequest(){
      this.loader=true;
      this.bpservice.GetApproveBusinessPartnerList(this.companyId,this.acpPartnerId,1,10000000,'','').subscribe((response: any) => {
        if (response != null){
            this.ApprovedBPList=response.responseData.items;
          this.loader=false;
        }
  
        else{
          this.loader=false;
        }
      });
    }
    onBpSelection(bpDetails:any){
      if(bpDetails.value>0){
        this.getProgramActivities(bpDetails.value)
        this.getStaff(this.companyId,bpDetails.value)
      }
    }

getProgramActivities(AcpPartnerId:any){
      //this.loader=true;
  if(this.companyId>0 && AcpPartnerId>0)
  {
  this.Acp_Partner.GetProgramActivities(this.companyId,AcpPartnerId).subscribe((res: any) => {
    if(res.statusCode==200){
      //this.loader=false
      this.programActivitylist=res.responseData;
      if(res.responseData){
      this.activities=res.responseData.activitiesModel.filter((x:any)=>x.isChecked==true)

      const selectedProgramIds = this.programActivitylist.programs
      .filter((pa:any) => pa.isChecked)
      .map((pa:any) => pa.programId);
     const selectedCategory=this.programActivitylist.categories
     .filter((cat:any) => cat.isChecked)
     .map((cat:any) => cat.categoryId);
      this.ProjectForm.get('SelectProgram')?.patchValue(selectedProgramIds);
      this.ProjectForm.get('BusinessCategory')?.patchValue(selectedCategory);
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
typeChange(t:any){
  this.ProjectForm.get('installationType')?.patchValue(t.id.toString());
}
ChangeManower(mpid:any){
  this.ProjectForm.get('ManPower')?.patchValue(mpid.id.toString());
  if(mpid.id==2 || mpid.id==4){

    this.ProjectForm.get('BusinessPartner')?.patchValue('');
    this.ProjectForm.get('SelectProgram')?.patchValue('');
    this.ProjectForm.get('BusinessCategory')?.patchValue('');
    this.ApprovedBPList=[];
    this.staffList = [];
    this.GetApprovedBPRequest();
    this.ownManPoer=true;
    this.ProjectForm.get('Assessor_Installer')?.patchValue('');
   
  }
  else{
    this.ProjectForm.get('BusinessPartner')?.patchValue('');
    this.ProjectForm.get('SelectProgram')?.patchValue('');
    this.ProjectForm.get('BusinessCategory')?.patchValue('');
    this.ApprovedBPList=[];
    this.ownManPoer=false;
    this.ProjectForm.get('Assessor_Installer')?.patchValue('');
    this.staffList = [];
    this.getStaff(this.companyId,this.acpPartnerId)
  }
}

ChangeCerti(mpid:any){
  this.ProjectForm.get('Certificate')?.patchValue(mpid.id.toString());
  if(mpid.id==1){
    this.ProjectForm.get('BusinessPartner')?.patchValue('');
    this.ProjectForm.get('SelectProgram')?.patchValue('');
    this.ProjectForm.get('BusinessCategory')?.patchValue('');
    this.ApprovedBPList=[];
    this.ownManPoer=false;
    this.ProjectForm.get('Assessor_Installer')?.patchValue('');
    this.staffList = [];
    this.getStaff(this.companyId,this.acpPartnerId)
   
  }
  else{
    this.ProjectForm.get('BusinessPartner')?.patchValue('');
    this.ProjectForm.get('SelectProgram')?.patchValue('');
    this.ProjectForm.get('BusinessCategory')?.patchValue('');
    this.ApprovedBPList=[];
    this.staffList = [];
    this.GetApprovedBPRequest();
    this.ownManPoer=true;
    this.ProjectForm.get('Assessor_Installer')?.patchValue('');
  }
  
}

getStaff(companyId:any,Acp_PartnerId:any){
    this.loader = true;
    let obj={
      companyID:companyId,
      acpPartnerID:Acp_PartnerId,
      PageNumber:1,
      PageSize:1000000
    }
    this._acpPartner.GetStaffList(obj).subscribe((response: any) => {
      if (response.statusCode == 200){
        this.staffList = response.responseData.items;
        this.loader = false;
      }
      else{
        this.staffList = [];
        this.loader = false;
      }
       
    })
}




GetClients(companyId:any,Acp_PartnerId:any){
  this.loader = true;
  let obj={
    companyID:companyId,
    acpPartnerID:Acp_PartnerId,
    clientId:0,
    search:'',
    pageNumber:1,
    pageSize:1000000
  }
  this.commonService.getClient(obj).subscribe((response: any) => {
    if (response.responseData.items !=null){
      this.clientList = response.responseData.items;
      this.loader = false;
    }
    else{
      this.clientList = [];
      this.loader = false;
    }
     
  })
}

SelectedClient(client:any){
if(client.value>0){
  this.getClientSide(this.companyId,this.acpPartnerId,client.value);
}

}
SelectedInsAssor(assor:any){

}
getClientSide(companyId:any,Acp_PartnerId:any,ClientId:any){
  let obj={
    companyID:companyId,
    acpPartnerID:Acp_PartnerId,
    clientID:ClientId,
    search:'',
    pageNumber:1,
    pageSize:1000000
  }
  this.loader=true;
  this.commonService.getClientSite(obj).subscribe((response: any) => {
    if (response.responseData.items !=null){
      this.clientSite = response.responseData.items;
      this.loader = false;
    }
    else{
      this.clientSite = [];
      this.loader = false;
    }
     
  })
}


addProject(){
if(this.ProjectForm.invalid){
  this._toasterService.toastrConfig.preventDuplicates = true;
  this._toasterService.error("Please fill all required fields", "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
  return;
}

 if((this.ProjectForm.controls['ManPower'].value==2 || this.ProjectForm.controls['ManPower'].value==4) && this.ProjectForm.controls['BusinessPartner'].value==""){
    this._toasterService.toastrConfig.preventDuplicates = true;
    this._toasterService.error("Please Select Business Partner", "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    return;
  }


  if( (this.ProjectForm.controls['ManPower'].value==2 || this.ProjectForm.controls['ManPower'].value==4)&&this.ProjectForm.controls['SelectProgram'].value==""){
    this._toasterService.toastrConfig.preventDuplicates = true;
    this._toasterService.error("Selected business partner did not work on any program", "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    return;
  }

  let obj={
    ProjectId:Number(this.ProjectForm.controls['ProjectId'].value),
    CompanyId:this.companyId,
    Acp_PartnerId:this.acpPartnerId,
    ProjectNo:this.ProjectForm.controls['ProjectNo'].value,
    ClientId:this.ProjectForm.controls['Client'].value,
    ClientSiteId:this.ProjectForm.controls['ClientSite'].value,
    ManPowerCertificateType:Number(this.ProjectForm.controls['ManPower'].value),
    PartnerId:(this.ProjectForm.controls['BusinessPartner'].value !="" || this.ProjectForm.controls['BusinessPartner'].value !=0) ? Number(this.ProjectForm.controls['BusinessPartner'].value) : 0,
    ProgramId:(this.ProjectForm.controls['SelectProgram'].value !=null || this.ProjectForm.controls['SelectProgram'].value[0] !=undefined) ? Number(this.ProjectForm.controls['SelectProgram'].value[0]) :0,
    InstallationType:Number(this.ProjectForm.controls['installationType'].value),
    UserId:this.userId,
    AssessorInstaller:this.ProjectForm.controls['Assessor_Installer'].value,
    StatusId:this.ProjectForm.controls['StatusId'].value

  }

 this.loader=true;
  this.projectService.AddProject(obj).subscribe((response: any) => {
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
       this.closeDialog('close');
      return;

    }
  });

}


GetProjectDetailsById(element:any){
this.loader = true;
this.projectService.getProjectDetails(element.projectId,element.companyId,element.acpPartnerId).subscribe((response: any) => {
  if (response.statusCode==200){

    this.ProjectForm.get('ProjectId')?.patchValue(response.responseData[0].projectId);
    this.ProjectForm.get('ProjectNo')?.patchValue(response.responseData[0].projectNo);
    this.ProjectForm.get('Client')?.patchValue(response.responseData[0].clientId);
    if(response.responseData[0].clientId>0){
      this.getClientSide(this.companyId,this.acpPartnerId,response.responseData[0].clientId)
      this.ProjectForm.get('ClientSite')?.patchValue(response.responseData[0].siteId);
    }
  
    if(response.responseData[0].manPowerCertificateType>0){
      let mpid={
        id:response.responseData[0].manPowerCertificateType
      }
      this.ChangeManower(mpid)
    }

    this.ProjectForm.get('ManPower')?.patchValue(response.responseData[0].manPowerCertificateType.toString());
    if(response.responseData[0].manPowerCertificateType==2 || response.responseData[0].manPowerCertificateType==4){
    let bpDetails={
      value:response.responseData[0].partnerId
    }
      this.onBpSelection(bpDetails)
      this.ProjectForm.get('BusinessPartner')?.patchValue(response.responseData[0].partnerId); 
      this.ProjectForm.get('SelectProgram')?.patchValue(response.responseData[0].programId);
      
    }

    this.ProjectForm.get('Assessor_Installer')?.patchValue(response.responseData[0].projectAssessorInstaller);
    this.ProjectForm.get('installationType')?.patchValue(response.responseData[0].installationType.toString());
    
    this.ProjectForm.get('BusinessCategory')?.patchValue(response.responseData[0].clientId); 
  
    this.ProjectForm.get('StatusId')?.patchValue(response.responseData[0].statusId.toString());

    this.loader = false;
  }
  else{
    this.loader = false;
    this.ProjectForm.get('ProjectNo')?.patchValue('');
    this.ProjectForm.get('Client')?.patchValue('');
    this.ProjectForm.get('ClientSite')?.patchValue('');
    this.ProjectForm.get('ManPower')?.patchValue('');
    this.ProjectForm.get('BusinessPartner')?.patchValue(''); 
    this.ProjectForm.get('installationType')?.patchValue('');
    this.ProjectForm.get('Assessor_Installer')?.patchValue('');
    this.ProjectForm.get('BusinessCategory')?.patchValue(''); 
    this.ProjectForm.get('SelectProgram')?.patchValue('');
    this.ProjectForm.get('StatusId')?.patchValue('');
  }
   
})

}






}
