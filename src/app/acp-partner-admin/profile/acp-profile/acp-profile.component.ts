import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileSize } from 'src/app/Shared/Enums/file-size.enum';
import { CustomValidators } from 'src/app/Shared/custom.validator';
import { CommonService } from 'src/app/lib/Models/Common/common.service';
import { AcpPartnerService } from 'src/app/lib/services/AcpPartner/acp-partner.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acp-profile',
  templateUrl: './acp-profile.component.html',
  styleUrls: ['./acp-profile.component.scss',]
})
export class AcpProfileComponent implements OnInit {
loader=false;
noImg='assets/images/noimage.png'
acpProfileImage: string = 'assets/images/profile-icon.svg';
ImageStatus: string;
attachment: File;


//ProfileForm!: FormGroup;
selectedIndex=0;
countries:any=[];
states:any=[];
dataURL: any;
imagePreview: any;
acp_partnerDetails:any
file:any
  constructor(private router: Router,private coommonService:CommonService,private Acp_Partner:AcpPartnerService,
    private _toasterService: ToastrService,private fb:FormBuilder,private cdr: ChangeDetectorRef
    ,private formBuilder: FormBuilder,public commonService: CommonService,) { }


    ProfileForm = this.formBuilder.group({
      acpPartnerId: new FormControl(''),
     acpPartnerName: ['',[Validators.required, CustomValidators.noWhitespaceValidator]],
     companyName: ['',[Validators.required, CustomValidators.noWhitespaceValidator]],
     acpPartnerTypeId: new FormControl('', [Validators.required]),
      FirstName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
      LastName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
      Email: ['', [Validators.email , CustomValidators.noWhitespaceValidator]],
      PhoneNo: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
     // UserName: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
     // Password: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
      Address1: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
      Address2: ['', [CustomValidators.noWhitespaceValidator]],
      CountryID: new FormControl('', [Validators.required]),
      StateID: new FormControl('', [Validators.required]),
     // City: new FormControl('', [Validators.required]),
     City: ['', [Validators.required , CustomValidators.noWhitespaceValidator]],
      PostalCode: ['',[Validators.required,CustomValidators.noWhitespaceValidator]],
      ProfieImgUrl: new FormControl(''),
      acpPartnerUserID:[0,Validators.required],
      companyId:[0,Validators.required],
      Username: ['', Validators.required],
    //  ProfieImgUrl:['']
    });



  ngOnInit(): void {
    // this.ProfileForm = this.fb.group({
    //   Username: ['', Validators.required],
    //   FirstName: [''],
    //   LastName: [''],
    //   Email: ['', Validators.required],
    //   Phone: [''],
    //   addressline1: [''],
    //   addressline2: [''],
    //   country: [''],
    //   state: [''],
    //   city: [''],
    //   postcode: [''],
    //   userId:[0,Validators.required],
    //   acpParterId:[0,Validators.required],
    //   companyId:[0,Validators.required],
    //   ProfieImgUrl:['']

    // });
    this.ProfileForm.controls['Username'].disable();
    this.getAllCountry();
    this.getAcpPartnerById()
  }
  

  
  Save()
  {
    debugger
const formData = new FormData();
formData.append('file', this.file);
    if(this.ProfileForm.valid){
    debugger
    this.loader = true;
      this.Acp_Partner.UpdateAcpPartner(this.ProfileForm.value).subscribe((res: any) => {
        if(res.statusCode==200){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 2200,
      
          });
          this.getAcpPartnerById();
          return;
        }
        else{
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
      this._toasterService.error("Please fill all required fields", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
  }

  getAllCountry(){

    this.coommonService.getCountries().subscribe((res: any) => {
      if(res.data.responseData){
        this.countries=res.data.responseData
      }
      else{
        this.countries=[];
      }
    })
  }
  OnCountryChange(Country:any){
    if(Country.value>0){
      this.getStateByCountryId(Country.value);
    }
  }
  getStateByCountryId(CountryId:number){
    this.coommonService.getStates(CountryId).subscribe((res: any) => {
      if(res.data.statusCode==200){
        this.states=res.data.responseData
      }
      else{
        this.states=[];
      }
    })
  }
  getAcpPartnerById(){
    this.loader=true
    let obj={
      CompanyID:Number(localStorage.getItem('companyID')),
      AcpPartnerID:Number(localStorage.getItem('acpPartnerID')),
      UserId:Number(localStorage.getItem('user_id')),
    }
if(obj.AcpPartnerID)
{
  debugger
  this.Acp_Partner.getAcpPartnerById(obj.AcpPartnerID).subscribe((res: any) => {
    if(res.statusCode==200){
      console.log("All user Data",res)
      debugger;
      this.loader=false
     this.acp_partnerDetails=res.responseData[0];
      this.getStateByCountryId(res.responseData[0].countryID)
      this.ProfileForm.patchValue({
        Username:res.responseData[0].userName,
        FirstName:res.responseData[0].firstName,
        LastName:res.responseData[0].lastName,
        Email:res.responseData[0].email,
        PhoneNo:res.responseData[0].mobileno,
        Address1:res.responseData[0].address1,
        Address2:res.responseData[0].address2,
        CountryID:res.responseData[0].countryID,
        StateID:res.responseData[0].stateID,
        City:res.responseData[0].city,
        PostalCode:res.responseData[0].postalCode,
        acpPartnerUserID:res.responseData[0].acpPartnerUserID,
        acpPartnerId:res.responseData[0].acpPartnerID,
        companyId:res.responseData[0].companyID,
        ProfieImgUrl:res.responseData[0].profieImgUrl,
        acpPartnerName:res.responseData[0].acpPartnerName,
        companyName:res.responseData[0].companyName,
        acpPartnerTypeId:res.responseData[0].acpPartnerTypeId,
      });
      //this.imagePreview=res.responseData[0].acpPartnerUrl;
      this.acpProfileImage = environment.imageUrl + res.responseData[0].profieImgUrl;
    }
    else{
      this._toasterService.toastrConfig.preventDuplicates = true;
      this._toasterService.error("No User Found", "", {
        timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
      });
      return;
    }
  })
}
else{
  this._toasterService.toastrConfig.preventDuplicates = true;
  this._toasterService.error("No User Found", "", {
    timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
  });
  this.loader=false
  return;
}


  }

  handleImageChange(e:any) {
this.file=e.target.files[0];
      var input = e.target;
      //The file size in MB adn max limit is 2.5 MB.
      //in bytes 2097152 = 2MB, 2621440 = 2.5 MB.
      let maxSize = 2621440; 
      // console.log(e.target.files[0].size);
      // if(e.target.files[0].size > maxSize){
      //   this.notifierService.notify("error","Please Select the image size less than 2.5 MB.");
      //   return false;
      // }
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(input.files[0]);

  }
  onTabChange(index:any){
this.selectedIndex=index.index
  }

  // Method for browse file attachment---
  onAttachment(file: any): any {
    debugger
    const extension = file.srcElement.files[0].name.substring(
      file.srcElement.files[0].name.lastIndexOf('.') + 1
    );
    if (this.checkSupportedFileFormats(extension)) {
      this.attachment = file.srcElement.files[0];
      if (this.attachment.size > FileSize.DefaultFileSize) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'File size is greater then defined size!',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        debugger
        const formData = new FormData();
        this.attachment = file;
        if (file.target.files[0]) {
          formData.append('Image', file.target.files[0]);
          formData.append('ProfileLink', 'AcpPartnerProfileImg');
          debugger
          this.commonService
            .UploadProfileService(formData)
            .subscribe((profilePath: any) => {
              debugger
              this.acpProfileImage = this.createImgPath(profilePath.responseData);
              debugger
              this.ProfileForm.controls['ProfieImgUrl'].setValue(profilePath.responseData);
            });
        }
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Allow only JPG, PNG, GIF!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  checkSupportedFileFormats(type: string): boolean {
    const supportedFileFormats: string[] = ['png', 'jpeg', 'jpg', 'gif'];
    if (supportedFileFormats.includes(type.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }
  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };


}
