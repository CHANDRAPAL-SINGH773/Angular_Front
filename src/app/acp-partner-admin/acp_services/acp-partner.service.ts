import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { ListSearchModel } from 'src/app/lib/Models/CommonListModel';


import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcpPartnerService {
  API = environment.ICC_API
  private localStorage: LocalStorageService
  constructor(private httpClient: HttpClient) { }
  

     //this is Add staff service method--
     AddStaffService(dataObj:any): Observable<any>{
      return this.httpClient.post(`${this.API}Staff/AddUpdateStaff`,dataObj).pipe(
        catchError(this.handleError('Add Update staff Service', []))
      )
    }

    //get department service--
    DepartmentList():Observable<any>{
      return  this.httpClient.get<any>(this.API+"Master/getDepartmentType").pipe(catchError(this.handleError('get department list',[])))
    }
    //get department service--
    ProgramMasterList():Observable<any>{
        return  this.httpClient.get<any>(this.API+"Master/getStaffProgram").pipe(catchError(this.handleError('get department list',[])))
     }

    //get user role  service--
    UserRoleList():Observable<any>{
      return  this.httpClient.get<any>(this.API+"Master/getStaffRoles").pipe(catchError(this.handleError('get role list',[])))
    }

    //service is used for delete staff--
    DeleteStaff(dataObj:any): Observable<any>{
      return this.httpClient.post(`${this.API}Staff/DeleteStaff`,dataObj).pipe(
        catchError(this.handleError('Delete staff Service', []))
      )
    }

    GetStaffList(dataObj:any):Observable<any>{
      let query ='?';
      if(dataObj.Search != ''){
      query += 'Search='+ dataObj.Search +'&';
      }
      query+= 'PageNumber='+dataObj.PageNumber + '&PageSize='+ dataObj.PageSize + '&UserId=' +dataObj.userId + '&AcpPartnerId=' + dataObj.acpPartnerID+
      '&CompanyId='+ dataObj.companyID + '&StaffId='+ dataObj.Id;
      return this.httpClient.get(`${this.API + 'Staff/GetStaffById' + query}`).pipe(map((data: any) => data || []),
      catchError(this.handleError('searchStaffs Service'))
     );
    }

    GetPartnerStaffList(dataObj:any):Observable<any>{
      let query ='?';
      if(dataObj.Search != ''){
      query += 'Search='+ dataObj.Search +'&';
      }
      query+= 'PageNumber='+dataObj.PageNumber + '&PageSize='+ dataObj.PageSize + '&UserId=' +dataObj.userId + '&AcpPartnerId=' + dataObj.acpPartnerID+
      '&CompanyId='+ dataObj.companyID + '&StaffId='+ dataObj.Id;
      return this.httpClient.get(`${this.API + 'Staff/GetStaffById' + query}`).pipe(map((data: any) => data || []),
      catchError(this.handleError('searchStaffs Service'))
     );
    }

    
    GetbyStaffId(dataObj:any,staffId:number,userId:number):Observable<any>{
      let query ='?';
      if(dataObj.Search != ''){
      query += 'Search='+ dataObj.Search +'&';
      }
      query+= 'PageNumber='+dataObj.PageNumber + '&PageSize='+ dataObj.PageSize + '&UserId=' +userId + '&AcpPartnerId=' + dataObj.acpPartnerID+
      '&CompanyId='+ dataObj.companyID + '&StaffId='+ staffId;
      return this.httpClient.get(`${this.API + 'Staff/GetStaffById' + query}`).pipe(map((data: any) => data || []),
      catchError(this.handleError('searchStaffs Service'))
     );
    }
    searchAcpPartner(dataObj: ListSearchModel): Observable<any> {
      let vcompanyID = Number(localStorage.getItem('companyID'));
      var modal={pageNumber: dataObj.PageNumber ,
      pageSize: dataObj.PageSize,
      search: dataObj.Search,
      sortColumn: "string",
      sortOrder: "string",
      companyID: vcompanyID}
      return this.httpClient.post(`${this.API}AcpPartner/GetAcpPartnerList`, modal).pipe(
        catchError(this.handleError('saveAcpPartner Service', []))
      )
    }

   //this is error handler method--
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    return of(result as T);
   };
    } 
}
