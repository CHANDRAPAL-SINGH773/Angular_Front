import { Injectable } from '@angular/core';
import { ListSearchModel } from '../../Models/CommonListModel';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcpPartnerService {
  private GetAcpPartnerDetailUrl="AcpPartner/GetAcpPartnerDetailById"
  ApiUrl = environment.ICC_API; //Access localhost API path from environment.ts file;
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) { }
  saveAcpPartner(dataObj: any): Observable<any> {
    debugger
    return this.http.post(`${this.ApiUrl}AcpPartner/AddAcpPartner`, dataObj).pipe(
      catchError(this.handleError('saveAcpPartner Service', []))
    )
  }

  UpdateAcpPartner(dataObj:any):Observable<any>{
debugger
// var AcpPartnerAddUpdateModel={AcpPartnerId: dataObj.acpPartnerId,
//   AcpPartnerName: dataObj.AcpPartnerName,
//   CompanyId: dataObj.CompanyID,
//   AcpPartnerTypeId: dataObj.AcpPartnerTypeId,
//   FirstName: dataObj.FirstName,
//   LastName: dataObj.LastName,
//   Email: dataObj.Email,
//   PhoneNo: dataObj.PhoneNo,
//   UserName: dataObj.UserName,
//   Address1: dataObj.Address1,
//   Address2: dataObj.Address2,
//   CountryID: dataObj.CountryID,
//   StateID: dataObj.StateID,
//   City: dataObj.City,
//   PostalCode: dataObj.PostalCode,
//   UserId: dataObj.UserId,
//   file: dataObj.file,
//   ProfieImgUrl: dataObj.ProfieImgUrl
// }

//     return this.http.post(`${this.ApiUrl}AcpPartner/UpdateAcpPartner`,AcpPartnerAddUpdateModel).pipe(
//       catchError(this.handleError('change AcpPartner status',[]))
//     )

    return this.http.post(`${this.ApiUrl}AcpPartner/UpdateAcpPartner`, dataObj).pipe(
      catchError(this.handleError('saveAcpPartner Service', []))
    )
  }
  searchAcpPartner(dataObj: ListSearchModel): Observable<any> {
    debugger
    let vcompanyID = this.localStorage.getCompanyID()
    var modal={pageNumber: dataObj.PageNumber ,
    pageSize: dataObj.PageSize,
    search: dataObj.Search,
    sortColumn: "string",
    sortOrder: "string",
    companyID: vcompanyID}
    return this.http.post(`${this.ApiUrl}AcpPartner/GetAcpPartnerList`, modal).pipe(
      catchError(this.handleError('saveAcpPartner Service', []))
    )
    // return this.http.get(`${this.ApiUrl + "AcpPartner/GetAcpPartnerList" + query}`)
    //   .pipe(map((data: any) => data || []),
    //     catchError(this.handleError('searchFacilities Service')))

  }


  getAcpPartnerById(data:any): Observable<any> {  
    let userId = this.localStorage.getUserId()
    let vcompanyID = this.localStorage.getCompanyID()
    let vAcpPartnerID=data;
      return this.http.get(`${this.ApiUrl + this.GetAcpPartnerDetailUrl + "?CompanyID=" + vcompanyID + "&AcpPartnerID="+ vAcpPartnerID + "&UserId=" + userId}`).pipe(
        catchError(this.handleError('GetAcpPartnerByID Service', [])))

   
  }

  deleteAcpPartner(AcpPartnerId: number): Observable<any> {
    debugger
    let vcompanyID = this.localStorage.getCompanyID()
    return this.http.post(`${this.ApiUrl}AcpPartner/DeleteAcpPartnerAsync`, { "CompanyID" : vcompanyID, "AcpPartnerID": AcpPartnerId })
      .pipe(catchError(this.handleError('Delete AcpPartner Service')))
  }
//service is used for veiw particular AcpPartner complete details-
  ViewAcpPartnerdetailsById(id:number): Observable<any> {    
    return this.http.get(`${this.ApiUrl + "AcpPartner/GetAcpPartnerViewDetails/" + id}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('view AcpPartner complete details')))
  }

  //service is used for get assigned AcpPartner staffs-
  GetAssignedAcpPartnerStaffs(id:number): Observable<any> {    
    return this.http.get(`${this.ApiUrl + "AcpPartner/GetAssignedAcpPartnerstaffList/" + id}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('get assigned AcpPartner staffs')))
  }

  //service is used for assign staffs in AcpPartners--
  AssignStaffInAcpPartner(dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}AcpPartner/AssignStaffInAcpPartner`,dataObj).pipe(
      catchError(this.handleError('assign staff in AcpPartner',[]))
    )
  }

  //service is used for un-assign staffs in AcpPartners--
  UnAssignAssignedStaff(dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}AcpPartner/UnAssignStaffInAcpPartner`,dataObj).pipe(
      catchError(this.handleError('un-assign staff in AcpPartner',[]))
    )

  }

  //service is used for assign staffs in AcpPartners--
  changesAcpPartnerStatus(dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}AcpPartner/ChangeAcpPartnerStatus`,dataObj).pipe(
      catchError(this.handleError('Update AcpPartner',[]))
    )
  }

 
 

  UploadDocs(companyID:number,AcpParterId:number,title:string,dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}Company/UploadCompanyDocument/${companyID}/${title}/${AcpParterId}`,dataObj).pipe(
      catchError(this.handleError('Upload AcpPartner and Company Docs',[]))
    )
  }

  GetDocs(CompanyId:number,AcpParterId:number):Observable<any>{
    return this.http.get(`${this.ApiUrl +"Company/GetCompanyDocs/" + "?CompanyId=" +CompanyId +"&AcpPartnerId=" +AcpParterId}`).pipe(
      catchError(this.handleError('Get AcpPartner and Company Docs',[]))
    )
  }
  GetProgramActivities(CompanyId:number,AcpParterId:number):Observable<any>{
    return this.http.get(`${this.ApiUrl +"ProgramActivities/GetProgramActivity/" + "?CompanyId=" +CompanyId +"&AcpPartnerId=" +AcpParterId}`).pipe(
      catchError(this.handleError('Get Program Activity list',[]))
    )
  }

  SaveUpdateProgramActivities(dataObj:any):Observable<any>{
    return this.http.post(`${this.ApiUrl}ProgramActivities/AddUpdateProgramActivity`,dataObj).pipe(
      catchError(this.handleError('change AcpPartner status',[]))
    )
  }

  DeleteDoc(CompanyId:number,DocId:number):Observable<any>{
    return this.http.delete(`${this.ApiUrl +"Company/DeleteDocById/" + "?DocId=" +DocId +"&CompanyId=" +CompanyId}`).pipe(
      catchError(this.handleError('Get AcpPartner and Company Docs',[]))
    )
  }

  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = this.getFileNameFromUrl(fileUrl);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getFileNameFromUrl(url: string): string {
    const lastSlashIndex = url.lastIndexOf('/');
    return url.substring(lastSlashIndex + 1);
  }
  GetStaffList(dataObj:any):Observable<any>{
    let query ='?';
    if(dataObj.Search != ''){
    query += 'Search='+ dataObj.Search +'&';
    }
    query+= 'PageNumber='+dataObj.PageNumber + '&PageSize='+ dataObj.PageSize + '&AcpPartnerId=' + dataObj.acpPartnerID+
    '&CompanyId='+ dataObj.companyID;
    return this.http.get(`${this.ApiUrl + 'Staff/GetStaffById' + query}`).pipe(map((data: any) => data || []),
    catchError(this.handleError('searchStaffs Service'))
   );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }



}
