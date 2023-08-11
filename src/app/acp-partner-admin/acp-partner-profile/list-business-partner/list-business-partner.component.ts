import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { CommonDropdownModel } from 'src/app/lib/Models/Common/CommonParameter';
import { AddBusinessPartnerComponent } from '../add-business-partner/add-business-partner.component';
import { CompletedRequestComponent } from './completed-request/completed-request.component';
import { OutgoingRequestComponent } from './outgoing-request/outgoing-request.component';
import { IncomingRequestComponent } from './incoming-request/incoming-request.component';

@Component({
  selector: 'app-list-business-partner',
  templateUrl: './list-business-partner.component.html',
  styleUrls: ['./list-business-partner.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ListBusinessPartnerComponent implements OnInit {
  loaderflag:boolean;
  selectedIndex=0;
  companyNameInput=''
  companyEmailInput=''
  @ViewChild(CompletedRequestComponent, { static: false }) cr: CompletedRequestComponent;
  @ViewChild(OutgoingRequestComponent, { static: false }) or: OutgoingRequestComponent;
  @ViewChild(IncomingRequestComponent, { static: false }) ir: IncomingRequestComponent;


    constructor(
    public commonService: CommonService,
    private fb: FormBuilder,
    private localstorage: LocalStorageService ,
    private _toasterService: ToastrService,
    private dialogModal: MatDialog,
  ) { }

  ngOnInit(): void {
    
  }

  newBusinessPartner(){
        let documentModal;
        documentModal = this.dialogModal.open(AddBusinessPartnerComponent, {panelClass: ['custom_dialog', 'newBusinessPartner'], data: {} },)
        documentModal.afterClosed().subscribe((result: string) => {
          if (result == 'save' || result == 'close'){
            //this.getAllDocumentList();
          }
        });
  }

  onTabChange(index:any){
    this.selectedIndex=index.index
      }
  
      CompleteRequestSearch(){
        if(this.selectedIndex==0){
          this.cr.searchMethod(this.companyNameInput,this.companyEmailInput);
        }
        if(this.selectedIndex==1){
          this.or.searchMethodforOut(this.companyNameInput,this.companyEmailInput);
        }
        if(this.selectedIndex==2){
          this.ir.searchMethodforIn(this.companyNameInput,this.companyEmailInput);
        }
        
      }
      CompleteRequestClear(){
        if(this.selectedIndex==0){
          this.companyNameInput='';
          this.companyEmailInput='';
          this.cr.searchMethod(this.companyNameInput,this.companyEmailInput);
        }
        if(this.selectedIndex==1){       

        this.companyNameInput='';
        this.companyEmailInput='';
        this.or.searchMethodforOut(this.companyNameInput,this.companyEmailInput);

        }
        if(this.selectedIndex==2){
          this.companyNameInput='';
          this.companyEmailInput='';
          this.ir.searchMethodforIn(this.companyNameInput,this.companyEmailInput);
        }

      }
}

