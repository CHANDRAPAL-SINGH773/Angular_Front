import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonErrorMessages } from 'src/app/Utilities/common/CommonErrorMessage';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss']
})
export class AddClientsComponent implements OnInit {
  ClientForm!: FormGroup;
  submitted: boolean;
  clientId: number=0;
  mode:boolean=false;
  Search: any;
  loader=false;
  dataSource: any;
  totalCount: any;
  states: any;
  Mode: string;
  countries: any[] = [];
  FormHeading:string="Add Client"
  ButtonHeading:string="Add"
  @ViewChild('addClientListModal') public childModal:any;
  statesTemp: any;

  constructor(private dialogModalRef: MatDialogRef<AddClientsComponent>,
    private fb:FormBuilder,
    private commonService:CommonService,
    private localstorage:LocalStorageService, private _toasterService:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modelService:NgbModal) { }

  ngOnInit(): void {
    debugger
    this.initializeClientForm();
    if(this.data.item){
      if(this.data.mode=='view'){
        this.FormHeading="View Client"
        this.mode=this.data.mode=='view'
        this.updateClientForm()
        this.ClientForm.disable();
      }
      else{
        this.FormHeading="Edit Client"
        this.ButtonHeading="Edit"
        this.updateClientForm()
      }
    }
    this.GetCountryMaster();

  }
  updateClientForm() {
    this.getStateByCountryId(this.data.item.countryID)
    this.ClientForm.patchValue({
      ClientId:this.data.item.clientID,
     FirstName:this.data.item.firstName,
     LastName:this.data.item.lastName,
     Email:this.data.item.email,
     PhoneNo:this.data.item.mobileNumber,
     Type:this.data.item.type,
     ABN_ACN:this.data.item.abN_ACN,
     Address1:this.data.item.address1,
     Address2:this.data.item.address2,
     CountryID:this.data.item.countryID,
     StateID:this.data.item.stateID,
     City:this.data.item.city,
     PostalCode:this.data.item.postalCode
    })
  }
  
  
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  public nextPage(event: any) {
    const limit = event.pageSize;
    const skip = event.pageIndex + 1;
    this.Search.PageSize = limit;
    this.Search.PageNumber = skip;

  }

  initializeClientForm() {
    this.ClientForm=this.fb.group({
    ClientId:[this.clientId],
     FirstName:['',Validators.required],
     LastName:['',Validators.required],
     Email:['',Validators.required],
     PhoneNo:['',Validators.required],
     Type:['',Validators.required],
     ABN_ACN:['',Validators.required],
     Address1:['',Validators.required],
     Address2:['',Validators.required],
     CountryID:['',Validators.required],
     StateID:['',Validators.required],
     City:['',Validators.required],
     PostalCode:['',Validators.required]
    })
   }

   OnSubmitClick() {
    this.submitted=true;
    this.ClientForm.markAllAsTouched()
    if(this.ClientForm.invalid)
      return
    let obj = {
      clientID: this.ClientForm.value.ClientId,
      clientSiteID: 0,
      companyID: this.localstorage.getCompanyID(),
      acpPartnerID: this.localstorage.getAcpPartnerID(),
      countryID: this.ClientForm.value.CountryID,
      stateID: this.ClientForm.value.StateID,
      firstName: this.ClientForm.value.FirstName,
      lastName: this.ClientForm.value.LastName,
      mobileNumber: this.ClientForm.value.PhoneNo,
      email: this.ClientForm.value.Email,
      type: this.ClientForm.value.Type,
      address1: this.ClientForm.value.Address1,
      address2: this.ClientForm.value.Address2,
      abN_ACN: this.ClientForm.value.ABN_ACN,
      city: this.ClientForm.value.City,
      postalCode: this.ClientForm.value.PostalCode,
      createdBy: this.localstorage.getUserId(),
    };
    this.commonService.addClient(obj).subscribe((res:any) => {
      if(res.message=='Success'){
        // this.childModal.nativeElement.click();
        this.dialogModalRef.close('save')
        Swal.fire('Details added succesfully!', 'success')
          //  this._toasterService.success(CommonSuccessMessages.UpdateRecord, "", {
          //     timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          //   });
          // this.getClient();
      }else{
        Swal.fire('Warning!', 'warning')
            // this._toasterService.error(CommonErrorMessages.ErrorOccured, "", {
            //   timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
            // });
      }
    });
  }
  OnCountryChange(Country: any) {
    if (Country.value > 0) {
      this.getStateByCountryId(Country.value);
    }
  }
  

  getStateByCountryId(CountryId: number) {
    this.commonService.getStates(CountryId).subscribe((res: any) => {
      if (res.data.statusCode == 200) {
        this.states = res.data?.responseData;
        if(this.data.item.countryID)
        {
          this.statesTemp=this.states.filter((x: { stateID: any; })=>x.stateID==this.data.item.countryID)
          this.ClientForm.patchValue({
            StateID:this.statesTemp[0].stateName,
          }) 
        }
      } else {
        this.states = [];
      }
    });
  }
  
  // edit(data:any){
  //   debugger;
  //   this.Mode='Edit'
  //   this.clientId=data.clientID
  //   if(data.countryID>0){
  //     this.getStateByCountryId(data.countryID)
  //   }
  //   this.ClientForm.patchValue({
  //   FirstName:data.firstName,
  //   LastName:data.lastName,
  //   Email:data.email,
  //   PhoneNo:data.mobileNumber,
  //   Type:data.type,
  //   ABN_ACN:data.abN_ACN,
  //   // CompanyName:data.CompanyName,
  //   Address1:data.address1,
  //   Address2:data.address2,
  //   CountryID:data.countryID,
  //   StateID:data.stateID,
  //   City:data.city,
  //   PostalCode:data.postalCode
  //   })
  // }
    
  GetCountryMaster() {
    this.commonService.getCountries().subscribe((country: any) => {
      if (country.data != null) {
        this.countries = country.data.responseData;
        console.log(this.countries);
      }
    });
  }
}


  
