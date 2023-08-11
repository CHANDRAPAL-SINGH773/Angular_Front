import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {  catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageStaffService {

  ApiUrl = environment.ICC_API ; //Access localhost API path from environment.ts file;
  constructor(private http: HttpClient) { }

  GetStaffListService(userid:any, status:any,search:any,pageNumber:any,pageSize:any):Observable<any> {
    return this.http.get<any>(this.ApiUrl+"StaffManagement/get/getStaffList?UserId="+userid+"&status="+status+"&search="+search+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"")
    .pipe(catchError(this.handleError('Get All Users list')))
  }

  //Methods for change staff status-- 
  ChangeStaffStatus(dataObj:any): Observable<any>{
    return this.http.post(`${this.ApiUrl}StaffManagement/changeStaffStatus`,dataObj).pipe(
      catchError(this.handleError('Change staff details Service', []))
    )
  }
    //Methods for  block and unblock staff-- 
    BlockUnblockStaff(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}StaffManagement/blockUnblockStaff`,dataObj).pipe(
        catchError(this.handleError('Block Unblock staff details Service', []))
      )
    }

  //Methods for delete staff -- 
  DeletedStaff(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}StaffManagement/deleteStaff?Id=`+Id,body).pipe(
     catchError(this.handleError(' delete staff ', []))
   )
 }

    //this is Add staff service method--
    AddStaffService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}StaffManagement/addupdateStaff`,dataObj).pipe(
        catchError(this.handleError('Add staff Service', []))
      )
    }

    //this is update staff service method--
    UpdateStaffService(dataObj:any): Observable<any>{
      return this.http.post(`${this.ApiUrl}StaffManagement/addupdateStaff`,dataObj).pipe(
        catchError(this.handleError('Add staff Service', []))
      )
    }
  //Methods for get particular Staff data-- 
  GetStaffData(id:number){
    const Id = id;
    const body = JSON.stringify(Id);
   return this.http.post(`${this.ApiUrl}StaffManagement/getStaffData?Id=`+Id,body).pipe(
     catchError(this.handleError('Get Particular staff Data', []))
   )
 }

   //Methods for get All Dropdown list-- 
   GetStaffDropDownListService():Observable<any> {
    return this.http.get(`${this.ApiUrl}StaffManagement/get/dropdownlist`).pipe(catchError(this.handleError('Get All DropDown')))
    }
      //this is error handler method--
      private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        return of(result as T);
       };
        }
}
