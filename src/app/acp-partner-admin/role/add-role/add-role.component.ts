import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import Swal from 'sweetalert2';
import { AddBusinessPartnerComponent } from '../../acp-partner-profile/add-business-partner/add-business-partner.component';
import { AcpPartnerService } from '../../acp_services/acp-partner.service';
import { RoleServicesService } from '../role-services.service';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  FormHeading = "Add New Role"
  RoleID:any;
  currentDateTime: Date;
  loader = false;
  RoleForm: FormGroup;
  companyId: any
  acpPartnerId: any
  userId: any
  submitted!: boolean;
  activities: any
  dataURL: any;

  constructor(private dialogModalRef: MatDialogRef<AddBusinessPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private localstorage: LocalStorageService,
    public commonService: CommonService, private _toasterService: ToastrService,
    private roleService: RoleServicesService,
    private Acp_Partner: AcpPartnerService) { }

  ngOnInit(): void {
    this.companyId = Number(this.localstorage.getCompanyID());
    this.acpPartnerId = Number(this.localstorage.getAcpPartnerID());
    this.userId = Number(this.localstorage.getUserId());
    this.CreateFormGroup();

    this.RoleForm.patchValue(this.data);
    this.RoleID = this.data.roleID
    console.warn("ye ri id",this.RoleID);
    
    // this.GetRole();
  }
  CreateFormGroup() {
    this.RoleForm = this.fb.group({
      isActive: new FormControl(true),
      isDeleted: new FormControl(false),
      createdBy: new FormControl(4),
      createdOn: new FormControl(new Date()),
      modifiedBy: new FormControl(0),
      modifiedOn: new FormControl("2023-08-07T07:30:52.364Z"),
      deletedOn: new FormControl("2023-08-07T07:30:52.364Z"),
      deletedBy: new FormControl(0),
      roleID: new FormControl(0),
      companyID: new FormControl(5),
      acpPartnerID: new FormControl(4),
      roleName: new FormControl(""),
      isRequired: new FormControl(false),
      trainingCount: new FormControl(0),
    })
  }


  onSubmit(data:any) {

    if (this.RoleForm.invalid) {
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("Please fill required fields", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }


    this.loader = true;
    const formData = new FormData();

    let obj = {
      isActive: true,
      isDeleted: false,
      createdBy: this.userId,
      createdOn: new Date(),
      modifiedBy: 0,
      modifiedOn: new Date(),
      deletedOn: new Date(),
      roleID: 0,
      companyID: this.companyId,
      acpPartnerID: this.acpPartnerId,
      roleName: this.RoleForm.controls['roleName'],
      isRequired: this.RoleForm.controls['isRequired'],
      trainingCount: this.RoleForm.controls['trainingCount']
    }

    this.RoleForm.patchValue(obj)
    this.loader = true;

    if(this.RoleID > 0)
    {

      this.roleService.EditRole(data).subscribe((response: any) => {
        
        if (response.statusCode == 200) {
          this.loader = false;
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
        else {
          this.loader = false;
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
    else
    {

      this.roleService.AddRole(data).subscribe((response: any) => {
        // alert(this.RoleID)
        if (response.statusCode == 200) {
          this.loader = false;
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
        else {
          this.loader = false;
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
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  options = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];
  
}
