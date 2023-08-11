import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@microsoft/signalr"
import {DataEditor} from '../data-editor.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public data: any[];
  public broadCastData: any[];
  private hubConnection: signalR.HubConnection
  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(
    private http: HttpClient
    ){ }


   GetCareCoordinatorDashboardService (AgencyId:any,OfficeId:any){
    return this.http.get<any>(this.ApiUrl+"Dashboard/get/carecoordinator/dashboard?AgencyId="+AgencyId+"&OfficeId="+OfficeId+"").pipe(
    catchError(this.handleError('Get Particular User Data', []))
    )
   }

   GetAgencyDashboardService(officeId:any,UserId:any){
    return this.http.get<any>(this.ApiUrl+"Dashboard/get/agency/dashboard?officeId="+officeId+"&UserId="+UserId+"").pipe(
    catchError(this.handleError('Get Particular User Data', []))
    )
   }

   GetReferralDashboardService(userId:any){
    return this.http.get<any>(this.ApiUrl+"Dashboard/get/referral/dashboard?UserId="+userId+"").pipe(
    catchError(this.handleError('Get Particular User Data', []))
    )
   }

   GetCaregiverDashboardService(AgencyId:any,UserId:any){
    return this.http.get<any>(this.ApiUrl+"Dashboard/get/caregiver/dashboard?AgencyId="+AgencyId+"&UserId="+UserId+"").pipe(
    catchError(this.handleError('Get Particular User Data', []))
    )
   }

   GetPatientDashboardService(userId:any){
    return this.http.get<any>(this.ApiUrl+"Dashboard/get/patient/dashboard?UserId="+userId+"").pipe(
    catchError(this.handleError('Get Particular User Data', []))
    )
   }
 
   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };}

}
