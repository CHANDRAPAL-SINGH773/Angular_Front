import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageReferralShiftService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add Referral shift Service method--
   SaveReferralShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}ReferralShift/save/referralShift`,dataObj).pipe(
      catchError(this.handleError('Add Referral shift Service', []))
    )
  }
  
  
   //this is Add Referral shift Service method--
   UpdateReferralShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}ReferralShift/save/referralShift`,dataObj).pipe(
      catchError(this.handleError('Add Referral shift Service', []))
    )
  }

  //this is Update  Referral shift Service method--
  UpdateUserShiftService(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}ReferralShift/update/ReferralShift`,dataObj).pipe(
      catchError(this.handleError('Update Referral shift Service', []))
    )
  }

  //Methods for get All Dropdown list-- 
  // GetUserShiftDropDownListService():Observable<any> {
  //   return this.http.get(`${this.ApiUrl}UserShift/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
  //   }

//Method for get all state list--
    GetReferralShiftListService(userId:any, status:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
      return this.http.get<any>(this.ApiUrl+"ReferralShift/get/referralshiftlist?status="+status+"&userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
      }

  //Methods for get particular user data-- 
  GetUserShiftData(id:number){
    return this.http.get<any>(this.ApiUrl+"UserShift/getUserShiftData?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', []))
   )
 }

 //Method is used for get all shift template list --
 GetTemplateShiftList(userid:any,search:any,pageNumber:any,pageSize:any):Observable<any>{
  return this.http.get<any>(this.ApiUrl+"ReferralShift/get/getShiftTemplateList?UserId="+userid+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
 }

 //Method is for delete shift template --
 DeleteShiftTemplate(id:number){
  const Id = id;
  const body = JSON.stringify(Id);
  return this.http.post(`${this.ApiUrl}ReferralShift/deleteShiftTemplate?Id=`+Id,body).pipe(
   catchError(this.handleError(' Delete shift template', []))
 )
 }

 //Method for change  shift template status--
  ChangeShiftTemplateStatus(dataObj:any): Observable<any>{
  return this.http.post(`${this.ApiUrl}ReferralShift/chnageShifttemplateStatus`,dataObj).pipe(
    catchError(this.handleError('Change  Shift Template', []))
    )
  }

  //Method is used for save shift template--
  SaveShiftTemplateService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}ReferralShift/save/shifttemplate`,dataObj).pipe(
    catchError(this.handleError('Save shift template service', []))
    )
  }

    //Method is used for save shift template--
    UpdateShiftTemplateService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}ReferralShift/Update/shifttemplate`,dataObj).pipe(
      catchError(this.handleError('Update shift template service', []))
      )
    }

  //Methods for get All Dropdown list-- 
  GetShiftTemplateDropDownListService(UserId:Number):Observable<any> {
    const body = JSON.stringify(UserId);
   return this.http.post(`${this.ApiUrl}ReferralShift/get/dropdownlist?UserId=`+UserId,body).pipe(
    catchError(this.handleError(' get dropdown List template', []))
  )

  }

    //Methods for get particular template shift data-- 
    GetShiftTemplateData(id:number){
     const Id = id;
     const body = JSON.stringify(Id);
     return this.http.post(`${this.ApiUrl}ReferralShift/getShiftTemplateData?Id=`+Id,body).pipe(
      catchError(this.handleError(' get shift template data ', []))
    )
   }

//Method is used for get referral shift data--
GetReferralShiftData(id:number){
  return this.http.get<any>(this.ApiUrl+"ReferralShift/getReferralShiftData?Id="+id+"").pipe(
   catchError(this.handleError('Get Particular referral shift Data', []))
 )
}

  //Methods for delete referral shift -- 
  DeletedReferralShift(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}ReferralShift/deletereferralShift?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete Referral shift ', []))
   )
 }

 GetPatientList(patientName:any){
  const PatientName = patientName;
  const body = JSON.stringify(patientName);
  return this.http.post(`${this.ApiUrl}ReferralShift/getPatientList?PatientName=`+PatientName,body).pipe(
   catchError(this.handleError('Get Patient List', []))
 )
 }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
