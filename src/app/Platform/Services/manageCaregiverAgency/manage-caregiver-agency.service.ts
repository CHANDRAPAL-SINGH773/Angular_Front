import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageCaregiverAgencyService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add caregiver agency shift Service method--
   SaveAgencyShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}CaregiverAgencyShift/save/caregiverAgencyShift`,dataObj).pipe(
      catchError(this.handleError('Add Agency shift Service', []))
    )
  }
  
   //this is Add caregiver agency shift Service method--
   UpdateAgencyShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}CaregiverAgencyShift/save/caregiverAgencyShift`,dataObj).pipe(
      catchError(this.handleError('Update Caregiver agency shift Service', []))
    )
  }


//Method for get all state list--
GetCaregiverAgencyShiftListService(dataObj:any):Observable<any> {
  return this.http.post(`${this.ApiUrl}CaregiverAgencyShift/get/caregiverAgencyshiftlist`,dataObj).pipe(
    catchError(this.handleError('Get All Users Shift list', []))
  )
 }

  // GetCaregiverAgencyShiftListService(status:any, userId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
      // return this.http.get<any>(this.ApiUrl+"CaregiverAgencyShift/get/caregiverAgencyshiftlist?status="+status+"&userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
  // }

  // Methods for get particular user data-- 
  GetUserShiftData(id:number){
    return this.http.get<any>(this.ApiUrl+"UserShift/getUserShiftData?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', []))
   )
 }

 //Method is for delete shift template --
 DeleteShiftTemplate(id:number){
  const Id = id;
  const body = JSON.stringify(Id);
  return this.http.post(`${this.ApiUrl}ReferralShift/deleteShiftTemplate?Id=`+Id,body).pipe(
   catchError(this.handleError(' Delete shift template', []))
 )
 }
 
  //Methods for get All Dropdown list-- 
  GetShiftTemplateDropDownListService(userId:any):Observable<any> {
    const UserId = userId;
    const body = JSON.stringify(UserId);
    return this.http.post(`${this.ApiUrl}ReferralShift/get/dropdownlist?UserId=`+UserId,body).pipe(
      catchError(this.handleError(' Delete shift template', []))
    )
  }



//Method is used for get referral shift data--
GetCaregiverAgencyShiftData(id:number){
  return this.http.get<any>(this.ApiUrl+"CaregiverAgencyShift/getCaregiverAgencyShiftData?Id="+id+"").pipe(
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

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
