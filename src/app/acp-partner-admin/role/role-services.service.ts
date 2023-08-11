import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleServicesService {

  constructor(private httpClient: HttpClient) { }

  API = environment.ICC_API

  //Get All Roles
  GetRoleList(CompanyID: any, AcpPartnerID: any): Observable<any> {
    return this.httpClient.get(`${this.API}Role/GetRoledetails?CompanyID=${CompanyID}&AcpPartnerID=${AcpPartnerID}`).pipe(map((data: any) => data || []),
      catchError(this.handleError('Get Rolelist Service'))
    );
  }

  //Add new Role
  AddRole(dataObj:any): Observable<any>{
    return this.httpClient.post(`${this.API}Role/AddRole`,dataObj).pipe(
      catchError(this.handleError('Add Add role Service', []))
    )
  }

  //Edit Role
  EditRole(dataObj:any): Observable<any>{
    return this.httpClient.post(`${this.API}Role/UpdateRole`,dataObj).pipe(
      catchError(this.handleError('Update role Service', []))
    )
  }

  //Delete Excisting
  DeleteRole(dataObj:any): Observable<any>{
    return this.httpClient.post(`${this.API}Role/DeleteRole`,dataObj).pipe(
      catchError(this.handleError('Delete Role Service', []))
    )
  }


  //Search role
  SearchRole(CompanyID: any, AcpPartnerID: any, RoleName:any):Observable<any>{
    return this.httpClient.get(`${this.API}Role/SearchRoledetails?CompanyID=${CompanyID}&AcpPartnerID=${AcpPartnerID}&RoleName=${RoleName}`).pipe(
      catchError(this.handleError('Add Update role Service', []))
    )
  }

  //this is error handler method--
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
