import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageUserShiftService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add user shift service method--
   SaveUserShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}UserShift/save/shift`,dataObj).pipe(
      catchError(this.handleError('Add User Service', []))
    )
  }
  
  //this is Update user shift service method--
  UpdateUserShiftService(dataObj:any): Observable<any>{
    return this.http.put(`${this.ApiUrl}UserShift/update/shift`,dataObj).pipe(
      catchError(this.handleError('Update User Shift Service', []))
    )
  }

  //Methods for get All Dropdown list-- 
  GetUserShiftDropDownListService(userId:any):Observable<any> {
    return this.http.get<any>(this.ApiUrl+"UserShift/get/dropdownlist?userId="+userId+"").pipe(
      catchError(this.handleError('Get Particular User Data', [])))
   // return this.http.get(`${this.ApiUrl}UserShift/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
  }

//Method for get all state list--
    GetUserShiftListService(dataObj:any):Observable<any> {
      return this.http.post(`${this.ApiUrl}UserShift/get/usershiftlist`,dataObj).pipe(
        catchError(this.handleError('Get All Users Shift list', []))
      )
  }

  //Methods for get particular user data-- 
  GetUserShiftData(id:number){
    return this.http.get<any>(this.ApiUrl+"UserShift/getUserShiftData?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', [])))
 }

 AppliedShiftActionService(dataObj:any): Observable<any>{
  return this.http.post(`${this.ApiUrl}UserShift/appliedShiftAction`,dataObj).pipe(
    catchError(this.handleError('Shift Action details Service', []))
  )
}

//------------Invite Shift Popup------------------------//

 //Methods to get Subscription Plan dropdownList-- 
 GetInviteDropdownListService():Observable<any> {
  return this.http.get(`${this.ApiUrl}UserShift/get/invitedropdownlist`).pipe(catchError(this.handleError('Get All Dropdowns')))
  }

  //this is Add user shift service method--
  SendUserShiftInviteService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}UserShift/send/invite`,dataObj).pipe(
      catchError(this.handleError('Add User Service', []))
    )
  }

  //-----------------------Assign Shift to caregiver---------------//
  //Methods for get age3ncy caregivers-- 
  GetAssignDropdownListService(agencyId:number){
    return this.http.get<any>(this.ApiUrl+"CaregiverAgencyShift/get/assigneddropdownlist?agencyId="+agencyId+"").pipe(
     catchError(this.handleError('Get Particular User Data', [])))
 }

   //this is Add user shift service method--
   AssigncaregivertoShiftService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}CaregiverAgencyShift/assign/caregiver`,dataObj).pipe(
      catchError(this.handleError('Add User Service', []))
    )
  }



   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
