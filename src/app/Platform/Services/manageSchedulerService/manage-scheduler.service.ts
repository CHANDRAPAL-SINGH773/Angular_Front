import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ManageSchedulerService {
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }


   //this is Add user shift service method--
   SaveSchedulerService(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}AdminScheduler/save/scheduler`,dataObj).pipe(
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
  GetUserShiftDropDownListService():Observable<any> {
    return this.http.get(`${this.ApiUrl}UserShift/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
    }

 //Method for get all state list--
 GetSchedulerDataService():Observable<any> {
  const search='';
  return this.http.get<any>(this.ApiUrl+"Scheduler/get/admin/schedulerdata?Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
  }   

//Method for get all state list--
    GetSchedulerInfoListService():Observable<any> {
      const date = moment(new Date()).format("MM/DD/YYYY");
      const search='';
      return this.http.get<any>(this.ApiUrl+"Scheduler/get/admin/shiftinfolist?CurrentDate="+date+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
      }

  //Methods for get particular user data-- 
  GetUserShiftData(id:number){
    return this.http.get<any>(this.ApiUrl+"UserShift/getUserShiftData?Id="+id+"").pipe(
     catchError(this.handleError('Get Particular User Data', []))
   )
 }

 //-----------------------Caregiver Scheduler----------------------//

  //Method for get all state list--
  GetCaregiverSchedulerDataService(UserId:any):Observable<any> {
    const search='';
    return this.http.get<any>(this.ApiUrl+"Scheduler/get/caregiver/schedulerdata?UserId="+UserId+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
    }   
  
  //Method for get all state list--
  GetCaregiverSchedulerInfoListService(UserId:any):Observable<any> {
        const date = moment(new Date()).format("MM/DD/YYYY");
        const search='';
        return this.http.get<any>(this.ApiUrl+"Scheduler/get/caregiver/shiftinfolist?UserId="+UserId+"&CurrentDate="+date+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
        }

   //-----------------------Caregiver Scheduler----------------------//

  //Method for get all state list--
  GetAgencySchedulerDataService(UserId:any):Observable<any> {
    const search='';
    return this.http.get<any>(this.ApiUrl+"Scheduler/get/agency/schedulerdata?UserId="+UserId+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
    }   
  
  //Method for get all state list--
  GetAgencySchedulerInfoListService(UserId:any):Observable<any> {
        const date = moment(new Date()).format("MM/DD/YYYY");
        const search='';
        return this.http.get<any>(this.ApiUrl+"Scheduler/get/agency/shiftinfolist?UserId="+UserId+"&CurrentDate="+date+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
        }

    //-----------------------Caregiver Scheduler----------------------//

  //Method for get all state list--
  GetReferralSchedulerDataService(ReferralId:any):Observable<any> {
    const search='';
    return this.http.get<any>(this.ApiUrl+"Scheduler/get/referral/schedulerdata?ReferralId="+ReferralId+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
    }   
  
  //Method for get all state list--
  GetReferralSchedulerInfoListService(ReferralId:any):Observable<any> {
        const date = moment(new Date()).format("MM/DD/YYYY");
        const search='';
        return this.http.get<any>(this.ApiUrl+"Scheduler/get/referral/shiftinfolist?ReferralId="+ReferralId+"&CurrentDate="+date+"&Search="+search+"&PageNumber=1&PageSize=100").pipe(catchError(this.handleError('Get Info list')))
        }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
}
}
