import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { SignUpService} from '../../Services/SignUpService/sign-up.service';
import { Category} from '../../Models/Model'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonSuccessMessages } from 'src/app/Utilities/common/CommonSuccessMessage';
import { CommonErrorMessages} from '../../../../Utilities/common/CommonErrorMessage';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/lib/Models/Common/common.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
 public CategorySection:boolean = true;
 public SignUpDetailSection:boolean = false;
 public selectedCategory:any;
 allCategoryList:Category[] =[];
 public PasswordMisMatch:boolean = false;
 public CategorySelectionFlag = false;
 public showPassword: boolean = false;
 public showConfirmPassword: boolean = false;
 SignUpForm!: FormGroup;
 loaderflag:boolean = false;
 countries:any=[];
 states:any=[];
 selectedCountry:number=0
 selectedState:number=0;
  constructor(private _signUpService:SignUpService,
     private router: Router,
     private _toasterService: ToastrService,
     private cookieService: CookieService,private coommonService:CommonService) { }

  ngOnInit(): void {
 this.getAllCountry();
  }

   checkIsValidPassword(dataObj:NgForm){
      if(dataObj.value.Password != dataObj.value.ConfirmPassword){
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.error(CommonErrorMessages.PasswordMismatch, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
        return;
        } 
    }

  //SignUp method(Registed new user)--
  SignUp(dataObj:NgForm){
    this.loaderflag = true;
    if(dataObj.valid && dataObj.value.Password === dataObj.value.ConfirmPassword){
      this.PasswordMisMatch = false;  
       const params ={ 
        CompanyName: dataObj.value.CompanyName,
        ABN_ACN:dataObj.value.ABN_ACN !="" ? dataObj.value.ABN_ACN :null,
        WebURL: dataObj.value.weburl !="" ? dataObj.value.weburl:null,
        MobileNumber:dataObj.value.Phone !="" ? dataObj.value.Phone:null,
        EmailID:dataObj.value.Email,
        UserName:dataObj.value.UserName,
        Password:dataObj.value.Password,
        Address1:dataObj.value.addressline1 !="" ? dataObj.value.addressline1:null,
        Address2:dataObj.value.addressline2 != "" ? dataObj.value.addressline2:null,
        CountryID:dataObj.value.country !="" ? dataObj.value.country:null,
        StateID:dataObj.value.state !=""? dataObj.value.state:null,
        City:dataObj.value.city !="" ? dataObj.value.city:null,
        PostalCode:dataObj.value.postcode !="" ? dataObj.value.postcode:null

                 }
      this._signUpService.SignUpService(params).subscribe((response:any)=>{
      if(response.statusCode =='200')
      {
        if(response.message!="")
        {
          this.loaderflag = false;
          this._toasterService.toastrConfig.preventDuplicates = true;
          this._toasterService.success(response.message, "", {
            timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
          });
          this.router.navigate(['/auth'])
          return;
        }
        else{
  
        this.loaderflag = false;
        this.router.navigate(['/auth'])     
        }
       }
       else{
        this.loaderflag = false;
        this._toasterService.toastrConfig.preventDuplicates = true;
        this._toasterService.error(response.message, "", {
          timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
        });
       }
    })
  }
  else{
    this.loaderflag = false;
    this._toasterService.toastrConfig.preventDuplicates = true;
    this._toasterService.error(CommonErrorMessages.FillMendatoryFields, "", {
      timeOut: 3000, positionClass: 'toast-top-right', closeButton: true
    });
    return;
   }
  }
  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(){
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  goToLogin(){
    this.router.navigate(['/auth'])
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
    this.selectedCountry=Country.value;
    if(Country.value>0){
      this.getStateByCountryId(Country.value);
    }
  }
  getStateByCountryId(CountryId:number){
    this.coommonService.getStates(CountryId).subscribe((res: any) => {
      if(res.data.statusCode==200){
        this.states=res.data.responseData
        console.log("states",this.states);
      }
      else{
        this.states=[];
      }
    })
  }
  OnStateChange(state:any){
  this.selectedState=state.value;
  }

}
