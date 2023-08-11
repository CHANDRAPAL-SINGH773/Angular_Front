import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-program-activities',
  templateUrl: './program-activities.component.html',
  styleUrls: ['./program-activities.component.scss']
})
export class ProgramActivitiesComponent implements OnInit {
  loader= false;
  companyId:any
  acpPartnerId:any
  userId:any
  programActivitylist:any
  copyprogramActivitylist:any
  selectedIndex:any;
  constructor(private _toasterService: ToastrService,private Acp_Partner:AcpPartnerService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.companyId=Number(localStorage.getItem('companyID'));
    this.acpPartnerId=Number(localStorage.getItem('acpPartnerID'));
    this.userId=Number(localStorage.getItem('user_id'));
    this.getProgramActivities();

  }
  getProgramActivities(){
    this.loader=true;
    if(this.companyId>0 && this.acpPartnerId>0)
    {
    this.Acp_Partner.GetProgramActivities(this.companyId,this.acpPartnerId).subscribe((res: any) => {
      if(res.statusCode==200){
        this.loader=false
        this.programActivitylist=res.responseData;
        this.copyprogramActivitylist=JSON.parse(JSON.stringify(res.responseData))
        if(res.responseData){
        let saveId=res.responseData.programs.filter((x:any)=>x.isChecked==true)
        if(saveId.length>0){
          if(saveId[0].programName=='HEER'){
            this.selectedIndex=0
          }
          if(saveId[0].programName=='IHEAB'){
            this.selectedIndex=1
          }
          if(saveId[0].programName=='PDRS'){
            this.selectedIndex=2
          }

        }
        else{
          this.programActivitylist.programs = this.programActivitylist.programs.map((obj:any) => {
            if (obj.programName =='HEER') {
              return { ...obj, isChecked: true };
            }
            return obj;
          });
          this.selectedIndex=0
        }

        }
        return;
      }
      else{
        this.loader=false
        this.programActivitylist=[];
        return;
      }
    })
  }
  else{
    this.loader=false
  }
  }
  catChange(e:any){
    this.programActivitylist.categories = this.programActivitylist.categories.map((obj:any) => ({ ...obj, isChecked: false }));
    this.programActivitylist.categories = this.programActivitylist.categories.map((obj:any) => {
      if (obj.categoryId === e.categoryId) {
        return { ...obj, isChecked: true };
      }
      return obj;
    });
  }
  typeChange(t:any){
    this.programActivitylist.programsType= this.programActivitylist.programsType.map((obj:any) => ({ ...obj, isChecked: false }));
    this.programActivitylist.programsType = this.programActivitylist.programsType.map((obj:any) => {
      if (obj.typeId === t.typeId) {
        return { ...obj, isChecked: true };
      }
      return obj;
    });
  }
  actChange(a:any){
    this.programActivitylist.activitiesModel.forEach((element:any) => {
      if(element.activityId==a.activityId)
      {
        element.isChecked=!element.isChecked;
      }
    });
  }

proChange(p:any){
if(p==0){

  const selectedProgramIds1 = this.programActivitylist.programs.filter((obj:any) => obj.programName === "HEER")
 
  const defaultSelect = this.copyprogramActivitylist.programs
  .filter((obj:any) => obj.programId == selectedProgramIds1[0].programId && obj.isChecked==true)
  .map((obj:any) => obj.programId);
  if(defaultSelect>0){

    this.programActivitylist= JSON.parse(JSON.stringify(this.copyprogramActivitylist));
    return;
  }


  this.programActivitylist.programs= this.programActivitylist.programs.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.categories= this.programActivitylist.categories.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.programsType= this.programActivitylist.programsType.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.activitiesModel= this.programActivitylist.activitiesModel.map((obj:any) => ({ ...obj, isChecked: false }));

  const selectedProgramIds=selectedProgramIds1[0].programId;


  this.programActivitylist.programs = this.programActivitylist.programs.map((obj:any) => {
    if (obj.programId == selectedProgramIds) {
      return { ...obj, isChecked: true };
    }
    return obj;
  });

  this.programActivitylist.categories.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.programsType.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.activitiesModel.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });
  
}

if(p==1){
  const selectedProgramIds1 = this.programActivitylist.programs.filter((obj:any) => obj.programName === "IHEAB")

  const defaultSelect = this.copyprogramActivitylist.programs
  .filter((obj:any) => obj.programId == selectedProgramIds1[0].programId && obj.isChecked==true)
  .map((obj:any) => obj.programId);
  if(defaultSelect>0){
    this.programActivitylist= JSON.parse(JSON.stringify(this.copyprogramActivitylist));
    return;
  }

  this.programActivitylist.programs= this.programActivitylist.programs.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.categories= this.programActivitylist.categories.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.programsType= this.programActivitylist.programsType.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.activitiesModel= this.programActivitylist.activitiesModel.map((obj:any) => ({ ...obj, isChecked: false }));


  const selectedProgramIds=selectedProgramIds1[0].programId;
  this.programActivitylist.programs = this.programActivitylist.programs.map((obj:any) => {
    if (obj.programId == selectedProgramIds) {
      return { ...obj, isChecked: true };
    }
    return obj;
  });

  
  this.programActivitylist.categories.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.programsType.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.activitiesModel.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });
  
}
if(p==2){
  const selectedProgramIds1 = this.programActivitylist.programs
  .filter((obj:any) => obj.programName === "PDRS")
  .map((obj:any) => obj.programId);

  
  const defaultSelect = this.copyprogramActivitylist.programs
  .filter((obj:any) => obj.programId == selectedProgramIds1[0] && obj.isChecked==true)
  .map((obj:any) => obj.programId);
  if(defaultSelect>0){
    this.programActivitylist= JSON.parse(JSON.stringify(this.copyprogramActivitylist));
    return;
  }

  this.programActivitylist.programs= this.programActivitylist.programs.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.categories= this.programActivitylist.categories.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.programsType= this.programActivitylist.programsType.map((obj:any) => ({ ...obj, isChecked: false }));
  this.programActivitylist.activitiesModel= this.programActivitylist.activitiesModel.map((obj:any) => ({ ...obj, isChecked: false }));

  const selectedProgramIds=selectedProgramIds1[0];
  this.programActivitylist.programs = this.programActivitylist.programs.map((obj:any) => {
    if (obj.programId == selectedProgramIds) {
      return { ...obj, isChecked: true };
    }
    return obj;
  });

  
  this.programActivitylist.categories.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.programsType.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

  this.programActivitylist.activitiesModel.forEach((obj:any) => {
    obj.programId = selectedProgramIds;
  });

}

  }

  save(){
    this.loader=true;
    let selectedprogram=this.programActivitylist.programs.filter((x:any)=>x.isChecked==true)
    let selectedcat=this.programActivitylist.categories.filter((x:any)=>x.isChecked==true)
    let selectedtype=this.programActivitylist.programsType.filter((x:any)=>x.isChecked==true)
    let selectedAct=this.programActivitylist.activitiesModel.filter((x:any)=>x.isChecked==true)
    if(selectedprogram.length<=0){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please Select Program", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loader=false;
      return;
    }
    if(selectedcat.length<=0){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please Select Category", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loader=false;
      return;
    }
    if(selectedtype.length<=0){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please Select Type", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loader=false;
      return;
    }
    if(selectedAct.length<=0){
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please Select Activities", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      this.loader=false;
      return;
    }

    if(selectedcat.length>0 && selectedtype.length>0 && selectedprogram.length>0 && selectedAct.length>0)
    {
      this.Acp_Partner.SaveUpdateProgramActivities(this.programActivitylist).subscribe((res: any) => {
      if(res.statusCode==200){
        this.loader=false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
        this.getProgramActivities();
        return;
      }
      else{
        this.loader=false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: res.message,
          showConfirmButton: false,
          timer: 2200,
    
        });
        return;
      }
    })
  }
  else{
    this._toasterService.toastrConfig.preventDuplicates = true;
    this._toasterService.error("Please Select Required Field", "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    this.loader=false;
    return;
  }








  }

  }


