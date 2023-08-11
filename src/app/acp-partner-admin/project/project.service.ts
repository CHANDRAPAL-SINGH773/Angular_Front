import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  API = environment.ICC_API
  private localStorage: LocalStorageService
  constructor(private httpClient: HttpClient) { }


  AddProject(dataObj:any): Observable<any>{
    return this.httpClient.post(`${this.API}Project/AddProject`,dataObj).pipe(
      catchError(this.handleError('Add Project Service', []))
    )
  }
  getProject(obj: any): Observable<any> {
    return this.httpClient
      .get(`${this.API}Project/GetProjectList?CompanyID=${obj.companyID}&AcpPartnerID=${obj.acpPartnerID} &clientId=${obj.clientId} &Search=${obj.search}&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Project Service'))
      );
  }
  deleteProject(ProjectId: number,CompanyId:number,AcpPartnerId:number,UserId:number): Observable<any> {
    return this.httpClient.delete(`${this.API}Project/DeleteProject?ProjectId=${ProjectId}&CompanyId=${CompanyId} &AcpPartnerId=${AcpPartnerId} &UserId=${UserId}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Delete Project Service'))
      );
  }

  changeProjectStatus(data:any): Observable<any> {
    return this.httpClient.patch(`${this.API + "Project/ChangeProjectStatus"}`,data)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Delete Project Service'))
      );
  }

  getProjectDetails(ProjectId: number,CompanyId:number,AcpPartnerId:number): Observable<any> {
    return this.httpClient.get(`${this.API}Project/GetProjectDetailByid?ProjectId=${ProjectId}&CompanyID=${CompanyId} &AcpPartnerID=${AcpPartnerId}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Project Service'))
      );
  }
  getProjectDetailsByid(ProjectId: number,CompanyId:number,AcpPartnerId:number): Observable<any> {
    return this.httpClient.get(`${this.API}Project/GetProjectByid?ProjectId=${ProjectId}&CompanyID=${CompanyId} &AcpPartnerID=${AcpPartnerId}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Project By ID Service'))
      );
  }
  getProjectStaffDetails(ProjectId: number,CompanyId:number,AcpPartnerId:number): Observable<any> {
    return this.httpClient.get(`${this.API}Project/GetStaffByProjectId?ProjectId=${ProjectId}&CompanyID=${CompanyId} &AcpPartnerID=${AcpPartnerId}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Project By ID Service'))
      );
  }

  deleteProjectStaff(AssessorInstalleId: number,StaffId:number,CompanyId:number,AcpPartnerId:number,UserId:number): Observable<any> {
    return this.httpClient.
    delete(`${this.API}Project/DeleteProjectStaff?AssessorInstalleId=${AssessorInstalleId}&StaffId=${StaffId} &CompanyId=${CompanyId} &AcpPartnerId=${AcpPartnerId} &UserId=${UserId} `)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Delete Project Staff Service'))
      );
  }


    //this is error handler method--
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
      return of(result as T);
     };
      } 
}