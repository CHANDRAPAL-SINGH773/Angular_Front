import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageCaregiverShiftService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add caregiver  shift Service method--
  SaveAgencyShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}CaregiverShift/save/caregiverShift`,dataObj).pipe(
      catchError(this.handleError('Add caregiver shift Service', []))
    )
  }
  
   //this is Add caregiver  shift Service method--
   UpdateAgencyShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}CaregiverShift/save/caregiverShift`,dataObj).pipe(
      catchError(this.handleError('Update Caregiver  shift Service', []))
    )
  }

//Method for get caregiver shift  list--
GetCaregiverShiftListService(dataObj:any):Observable<any> {
  return this.http.post(`${this.ApiUrl}CaregiverShift/get/caregivershiftlist`,dataObj).pipe(
    catchError(this.handleError('Get All Users Shift list', []))
  )
}
// GetCaregiverShiftListService(status:any,userId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
//       return this.http.get<any>(this.ApiUrl+"CaregiverShift/get/caregivershiftlist?status="+status+"&userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
//       }

//Method for accept/reject Shift
AcceptRejectShiftService(dataObj:any): Observable<any>{
        return this.http.post(`${this.ApiUrl}CaregiverShift/appliedShiftAction`,dataObj).pipe(
          catchError(this.handleError('Shift Action details Service', []))
        )
  }

  //Method for accept/reject Shift
CompleteCancelShiftService(dataObj:any): Observable<any>{
  return this.http.post(`${this.ApiUrl}CaregiverShift/complete/cancel/ShiftAction`,dataObj).pipe(
    catchError(this.handleError('Shift Action details Service', []))
  )
}

//Method for get caregiver accepted shift list--
GetCaregiverAcceptedShiftListService(status:any,userId:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
  return this.http.get<any>(this.ApiUrl+"CaregiverShift/get/caregiverAcceptedshiftlist?status="+status+"&userId="+userId+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"").pipe(catchError(this.handleError('Get All Users list')))
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
    return this.http.post(`${this.ApiUrl}ReferralShift/get/dropdownlist?userId=`+UserId,body).pipe(
      catchError(this.handleError(' Delete shift template', []))
    )
  }



//Method is used for get referral shift data--
GetCaregiverAgencyShiftData(id:number){
  return this.http.get<any>(this.ApiUrl+"CaregiverShift/getCaregiverShiftData?Id="+id+"").pipe(
   catchError(this.handleError('Get Particular Caregiver shift Data', []))
 )
}

  //Methods for delete referral shift -- 
  DeletedReferralShift(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}ReferralShift/deletereferralShift?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete Caregiver shift ', []))
   )
 }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
