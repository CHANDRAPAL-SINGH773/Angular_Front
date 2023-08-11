import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddAgencyService} from '../../Services/addAgencyService/add-agency.service';
import { DataSharingService} from '../../../Shared/data-sharing.service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { UploadImageServiceService} from 'src/app/Shared/uploadImage/upload-image-service.service'
import { environment } from 'src/environments/environment';
import { GetAllMasterService } from 'src/app/Platform/Services/Masters/get-all-master.service';

@Component({
  selector: 'app-agency-profile',
  templateUrl: './agency-profile.component.html',
  styleUrls: ['./agency-profile.component.css']
})
export class AgencyProfileComponent implements OnInit {
  addAgencyform!: FormGroup;
  fileUPloadForm!: FormGroup;
  attachment?: File;
  selectedFile?: File;
  userid: any;
  submitted!: boolean;
  fileName?: string;
  id: number =0;
  imageSrc?: any;
  Isdeleted:boolean = false;
  deletedId: number = 0;
  countryList:any;
  stateList:any;
  Addbuttonflag:boolean= true;
  UpdateButtonflag:boolean= false;


   public _imageUrl: string = '';
  constructor(
    private http: HttpClient,private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder,
    private _toasterService: ToastrService,
    private _AddAgencyService : AddAgencyService,
    private _dataSharingService:DataSharingService,
    private _UploadImageService : UploadImageServiceService,
    private _getAllMasterService :GetAllMasterService) { }

  ngOnInit(): void {
    this.GetCountry();
    this.GetState();
    this.CreateFormGroup();
    this.id   = parseInt(this.route.snapshot.params['id']);
    if(this.id != 0){
    this.userid=this.id;
    this.getAgencyData(this.id);
    }
  }

    //Method for get country master--
    GetCountry(){
      this._getAllMasterService.GetCountryMaster().subscribe((response:any)=>{
       this.countryList = response.data;
       this.countryList.unshift({ CountryName: "Please Select", Id: "" });
      })
    } 
       //Method for get State master--
    GetState(){
        this._getAllMasterService.GetStateMaster().subscribe((response:any)=>{
        this.stateList = response.data;
        this.stateList.unshift({ StateName: "Please Select", StateId: "" });
        })
    } 
 
  CreateFormGroup(): void {
    this.addAgencyform = this.fb.group({ 
      AgencyId:new FormControl(""), 
      BusinessName: new FormControl("", Validators.required),  
      AgencyEmail: new FormControl("", [Validators.required, Validators.email]),
      AgencyPhone: new FormControl("", Validators.required),
      AgencyBusinessAddress: new FormControl("", Validators.required),
      AgencyLogo:new FormControl(""),
      AgencyCity: new FormControl("",Validators.required),
      AgencyZIPCode: new FormControl("",Validators.required),
      AgencyState: new FormControl(undefined,[Validators.required]),
      AgencyCountry: new FormControl(undefined,[Validators.required,]),
      AgencyPersonFirstName: new FormControl("", Validators.required),
      AgencyPersonLastName: new FormControl("", Validators.required),  
      AgencyPersonEmail: new FormControl("", Validators.required), 
      AgencyPersonPhone: new FormControl("", Validators.required), 
      AgencyPersonAddress: new FormControl("", Validators.required),    
      UserType : 3,
      UserId:new FormControl(""),
    })
}

  get formControls() { return this.addAgencyform.controls; }
//method for Add new Agency --
  saveAgency(): any {
  const model ={
                AgencyId:0,
                BusinessName: this.addAgencyform.controls['BusinessName'].value,
                AgencyEmail:this.addAgencyform.controls['AgencyEmail'].value,
                AgencyPhone: this.addAgencyform.controls['AgencyPhone'].value,
                AgencyBusinessAddress: this.addAgencyform.controls['AgencyBusinessAddress'].value,
                AgencyLogo: this.addAgencyform.controls['AgencyLogo'].value,
                AgencyCountry: Number(this.addAgencyform.controls['AgencyCountry'].value),
                AgencyState: Number(this.addAgencyform.controls['AgencyState'].value),
                AgencyCity: this.addAgencyform.controls['AgencyCity'].value,
                AgencyZIPCode: this.addAgencyform.controls['AgencyZIPCode'].value,
                AgencyPersonFirstName: this.addAgencyform.controls['AgencyPersonFirstName'].value,
                AgencyPersonLastName: this.addAgencyform.controls['AgencyPersonLastName'].value,
                AgencyPersonEmail: this.addAgencyform.controls['AgencyPersonEmail'].value,
                AgencyPersonPhone: this.addAgencyform.controls['AgencyPersonPhone'].value,
                AgencyPersonAddress: this.addAgencyform.controls['AgencyPersonAddress'].value,
                UserType: 3,
                UserId:this.userid
}
   this.submitted = true; 
   if (this.addAgencyform.invalid) {
    this.submitted = true;
    this._toasterService.info(CommonSuccessMessages.fillallMendatoryfields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
    return ;
  }
  if (this.addAgencyform.valid) {
    this._AddAgencyService.SaveAgencyProfileService(model).subscribe((response:any)=>{
      if(response.statusCode == 200){
        this._toasterService.success(CommonSuccessMessages.AgencyAdded, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        this.router.navigate(["/Dashboard/CaregiverAgencyDashboard/"+response.data+""]);
      }
    })
  }
    }

     //method for get Agency Details --
  getAgencyData(id : number):void {
  let data:any ; 
  this._AddAgencyService.GetAgencyProfileData(id).subscribe((response:any) => {
  if(response.data != "") {
           this.Addbuttonflag= false;
           this.UpdateButtonflag= true; 
           this.addAgencyform.controls['BusinessName'].setValue(response.data[0].AgencyName);        
           this.addAgencyform.controls['AgencyEmail'].setValue(response.data[0].AgencyEmail);
           this.imageSrc = response.data[0].Logo;
           this.addAgencyform.controls['AgencyPhone'].setValue(response.data[0].AgencyPhone);
           this.addAgencyform.controls['AgencyBusinessAddress'].setValue(response.data[0].AgencyBusinessAdress);
           this.addAgencyform.controls['AgencyLogo'].setValue(response.data[0].Logo);
           this.addAgencyform.controls['AgencyCountry'].setValue(response.data[0].AgencyCountry);
           this.addAgencyform.controls['AgencyState'].setValue(response.data[0].AgencyState);
           this.addAgencyform.controls['AgencyCity'].setValue(response.data[0].AgencyCity);
           this.addAgencyform.controls['AgencyZIPCode'].setValue(response.data[0].AgencyZipcode);
           this.addAgencyform.controls['AgencyId'].setValue(response.data[0].AgencyId);
           this.addAgencyform.controls['AgencyPersonFirstName'].setValue(response.data[0].PersonFirstname);
           this.addAgencyform.controls['AgencyPersonLastName'].setValue(response.data[0].PersonLastname);
           this.addAgencyform.controls['AgencyPersonPhone'].setValue(response.data[0].PersonPhone);
           this.addAgencyform.controls['AgencyPersonEmail'].setValue(response.data[0].PersonEmail);
           this.addAgencyform.controls['AgencyPersonAddress'].setValue(response.data[0].PersonAddress);
          }
        })
      }
      
      // Method For Update Agency Details --
      UpdateAgency(): any{      
        const model ={                   
                BusinessName: this.addAgencyform.controls['BusinessName'].value,               
                AgencyEmail:this.addAgencyform.controls['AgencyEmail'].value,
                AgencyPhone: this.addAgencyform.controls['AgencyPhone'].value,
                AgencyBusinessAddress: this.addAgencyform.controls['AgencyBusinessAddress'].value,
                AgencyLogo: this.addAgencyform.controls['AgencyLogo'].value,
                AgencyCountry: Number(this.addAgencyform.controls['AgencyCountry'].value),
                AgencyState: Number(this.addAgencyform.controls['AgencyState'].value),
                AgencyCity: this.addAgencyform.controls['AgencyCity'].value,
                AgencyZIPCode: this.addAgencyform.controls['AgencyZIPCode'].value,
                AgencyPersonFirstName: this.addAgencyform.controls['AgencyPersonFirstName'].value,
                AgencyPersonLastName: this.addAgencyform.controls['AgencyPersonLastName'].value,
                AgencyPersonEmail: this.addAgencyform.controls['AgencyPersonEmail'].value,
                AgencyPersonPhone: this.addAgencyform.controls['AgencyPersonPhone'].value,
                AgencyPersonAddress: this.addAgencyform.controls['AgencyPersonAddress'].value,
                UserType: 3,
                AgencyId: this.addAgencyform.controls['AgencyId'].value,
                UserId: this.userid,
          }
          this.submitted = true; 
          if (this.addAgencyform.invalid) {
          this.submitted = true;
          return ;
        }
        if (this.addAgencyform.valid) {
          this._AddAgencyService.UpdateAgencyProfileService(model).subscribe((response:any)=>{
          if(response.statusCode == 200){
            this._toasterService.success(CommonSuccessMessages.AgencyUpdated, "", {
              timeOut: 3000, positionClass: 'toast-top-right', closeButton: true   
            });           
            this.router.navigate(["/Dashboard/CaregiverAgencyDashboard/0"]);
          }
          })
        }
      }

      // Method for browse file attachment---
      onAttachment(file?: any): any {
        const formData = new FormData();
        this.attachment = file;
        console.log(file.target.files[0])
        if (file.target.files[0] ) {
          formData.append('Image', file.target.files[0]);
          formData.append('ProfileLink', 'AgencyProfiles');
          
          this._UploadImageService.UploadProfileService(formData).subscribe((profilePath:any) => {
            this.imageSrc=   this.createImgPath(profilePath.data.value);
            this.addAgencyform.controls['AgencyLogo'].setValue(this.imageSrc);
          })
        }
      }
      createImgPath = (serverPath: string) => {
        var path = `${environment.imageUrl}/${serverPath}`;
        return path;
      };

      resetFileUploader() { 
        this.imageSrc='';
      }
}

