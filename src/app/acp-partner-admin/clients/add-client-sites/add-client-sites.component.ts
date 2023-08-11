import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-client-sites',
  templateUrl: './add-client-sites.component.html',
  styleUrls: ['./add-client-sites.component.scss']
})
export class AddClientSitesComponent implements OnInit {
  ClientSiteForm: FormGroup;
  submitted: boolean;
  clientSiteID: any;
  loader=false;
  countryListTemp: any;
  statesTemp: any;
  mode:boolean=false;
  Mode: string='Add';
  countryList: any;
  states: any;
  clientListTemp: any;
  clientList: any;
  FormHeading:string="Add Client Site"
  ButtonHeading:string="Add"

  constructor(private dialogModalRef: MatDialogRef<AddClientSitesComponent>,
    private fb:FormBuilder,
    private commonService:CommonService,
    private localstorage:LocalStorageService, private _toasterService:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modelService:NgbModal) { }

  ngOnInit(): void {
    this.initializeClientSiteForm()
    this.getClientList();
    this.getCountries()
  }
  updateClientSiteForm() {
    this.clientSiteID=this.data.item.cSiteId
    this.ClientSiteForm.patchValue({
     ClientName:this.data.item.clientId,
        Type:this.data.item.type,
        Address1:this.data.item.address1,
        Address2:this.data.item.address2,
        // CountryID:this.countryListTemp[0].countryName,
        City:this.data.item.city,
        PostalCode:this.data.item.postalCode,
        ContactName:this.data.item.contactName,
        ContactPhone:this.data.item.contactPhoneNumber
    })
  }
  initializeClientSiteForm() {
    this.ClientSiteForm=this.fb.group({
     ClientName:['',Validators.required],
     Type:['',Validators.required],
     Address1:['',Validators.required],
     Address2:['',Validators.required],
     CountryID:['',Validators.required],
     StateID:['',Validators.required],
     City:['',Validators.required],
     PostalCode:['',Validators.required],
     ContactName:['',Validators.required],
     ContactPhone:['',Validators.required]
    })
   }

   closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

   OnSubmitClick(){
    this.submitted=true;
    this.ClientSiteForm.markAllAsTouched()
    if(this.ClientSiteForm.invalid)
      return
    let obj = {
      clientSiteID: this.clientSiteID,
      clientID:this.ClientSiteForm.value.ClientName,
      companyID: this.localstorage.getCompanyID(),
      countryID: this.countryListTemp[0].countryID,
      acpPartnerID: this.localstorage.getAcpPartnerID(),
      stateID: this.statesTemp[0].stateID,
      address1:this.ClientSiteForm.value.Address1,
      address2:this.ClientSiteForm.value.Address2,
      cityName: this.ClientSiteForm.value.City,
      postalCode: this.ClientSiteForm.value.PostalCode,
      type: this.ClientSiteForm.value.Type,
      contactName: this.ClientSiteForm.value.ContactName,
      contactPhoneNumber: this.ClientSiteForm.value.ContactPhone,
      };
      this.commonService.addClientSite(obj).subscribe((res:any) => {
            if(res.statusCode=='200'){
              this.dialogModalRef.close('save')
              Swal.fire('Details added succesfully!', 'success')
              // this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
              //       timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
              //     });
                  this.ClientSiteForm.reset()
                  this.modelService.dismissAll()
                  //this.getClientSite();
            }else{
              Swal.fire('Warning!', 'warning')
                  // this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
                  //   timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
                  // });
            }
    });
}

  // edit(data:any){
  //   debugger
  //   this.Mode='Edit'
  //   this.clientSiteID=data.cSiteId
  //   this.countryListTemp=this.countryList.filter((x: { countryID: any; })=>x.countryID==data.country)
  //   this.getStateByCountryId(data.country,data.stateId)
  //   this.ClientSiteForm.patchValue({
  //       ClientName:data.clientId,
  //       Type:data.type,
  //       Address1:data.address1,
  //       Address2:data.address2,
  //       CountryID:this.countryListTemp[0].countryName,
  //       City:data.city,
  //       PostalCode:data.postalCode,
  //       ContactName:data.contactName,
  //       ContactPhone:data.contactPhoneNumber
  //   })
  // }

  getStateByCountryId(CountryId:number,stateId?:any){
    this.commonService.getStates(CountryId).subscribe((res: any) => {
      debugger
      if(res.data.statusCode==200){
        this.states=res.data.responseData
        if(this.Mode=='Add') {
          this.statesTemp=this.states.filter((x: { stateID: any; })=>x.stateID==this.clientListTemp[0].stateID)
          this.ClientSiteForm.patchValue({
            StateID:this.statesTemp[0].stateName,
            CountryID:this.countryListTemp[0].countryName
          })
        }
        else{
            this.statesTemp=this.states.filter((x: { stateID: any; })=>x.stateID==stateId)
              this.ClientSiteForm.patchValue({
              StateID:this.statesTemp[0].stateName,
           })
        }
        }
    })
  }

  setStateCountry(event :any){
    this.clientListTemp=this.clientList.filter((x: { clientID: any; })=>x.clientID==event);
    this.countryListTemp=this.countryList.filter((x: { countryID: any; })=>x.countryID==this.clientListTemp[0].countryID)
    this.getStateByCountryId(this.clientListTemp[0].countryID)
  }

  onAddSite(){
    this.ClientSiteForm.reset();
    this.Mode='Add'
  }
  // ResetList(){
  //   this.search = '';
  //   // document.getElementById('search').value='';
  //   this.clientId=null
  //   this.getClientSite();
  // }
  getCountries(){
    this.commonService.getCountries().subscribe((response:any)=>{
      this.countryList= response.data.responseData;
      if(this.Mode=='Edit'){
        this.countryListTemp=this.countryList.filter((x: { countryID: any; })=>x.countryID==this.data.item.country)
        this.ClientSiteForm.patchValue({
          CountryID:this.countryListTemp[0].countryName
        })
        this.getStateByCountryId(this.data.item.country,this.data.item.stateId)
      }
  })}

  getClientList() {
    debugger
    this.loader=true;
      let obj = {
        companyID: this.localstorage.getCompanyID(),
        acpPartnerID: this.localstorage.getAcpPartnerID(),
        search: '',
        pageNumber: 1,
        pageSize: 100000,
      };
      this.commonService.getClient(obj).subscribe((res) => {
        if(res){
          this.loader=false;
        this.clientList = res.responseData.items;
        if(this.data.item){
          if(this.data.mode=='view'){
            this.FormHeading="View Client site"
            this.mode=this.data.mode=='view'
            this.updateClientSiteForm()
            this.ClientSiteForm.disable();
          }
          else{
            this.Mode='Edit'
            this.FormHeading="Edit Client Site"
            this.ButtonHeading="Edit"
            this.updateClientSiteForm()
          }
        }
      }else{
        this.loader=false
      }
        // this.dataSource=this.clientList
        // this.totalCount=res.data.responseData.totalCount;
      });
    }
  
}
