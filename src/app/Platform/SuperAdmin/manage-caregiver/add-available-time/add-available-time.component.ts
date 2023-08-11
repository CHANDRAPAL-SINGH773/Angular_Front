import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddCaregiverService } from '../../../Services/addCaregiverService/add-caregiver.service'
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from 'src/app/Shared/data-sharing.service';
import { UploadImageServiceService } from 'src/app/Shared/uploadImage/upload-image-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from 'src/app/Platform/Model/DialogModel';

@Component({ 
  encapsulation: ViewEncapsulation.None,
  selector: 'app-add-available-time',
  templateUrl: './add-available-time.component.html',
  styleUrls: ['./add-available-time.component.css'],
  providers: []
})

export class AddAvailableTimeComponent implements OnInit {
  submitted!: boolean;
  title:any;
  id:any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogModel,
    private _getAllMasterService: GetAllMasterService,
    private router: Router,
    private fb: FormBuilder,
    private _addcaregiverService: AddCaregiverService,
    private _toasterService: ToastrService,
    private _dataSharingService: DataSharingService,
    private route: ActivatedRoute,
    private _UploadImageService : UploadImageServiceService,
    private serviceCodeDailog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.title=''
    this.id = this.dialogData.Id;
    if (this.id != 0) {
      //this.getCareGiverData(this.id);
    }  
  }

}
