import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerServiceService {
  API = environment.ICC_API
  constructor(private httpClient: HttpClient) { }
  private getApprovedBPList = "BusinessPartner/GetApprovedBuisnessPartner";
  private getIncomingBPList = "BusinessPartner/GetIncomingBuisnessPartner";
  private getOutgoingBPList = "BusinessPartner/GetPendingBuisnessPartner";
  private deleteBPbyId = "BusinessPartner/DeleteBuisnessPartner";
  private changeBPStatus = "BusinessPartner/ChangeBuisnessPartnerStatus";
  private BPDetails = "BusinessPartner/GetBuisnessPartnerDetailById";

  GetApproveBusinessPartnerList(ComapyId:number,AcpPartnerId:number,PageNumber:number,PageSize:number,companyName:string,companyEmail:string): Observable<any> {    
    return this.httpClient.get(`${this.API +this.getApprovedBPList +"?CompanyID="+ComapyId  +"&AcpPartnerID="+AcpPartnerId+ "&PageNumber="+PageNumber+ "&PageSize="+PageSize + "&companyName="+companyName + "&companyEmail="+companyEmail}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('get Approved BP List Service')))
  }
  GetIncomingBusinessPartnerList(ComapyId:number,AcpPartnerId:number,PageNumber:number,PageSize:number,companyName:string,companyEmail:string): Observable<any> {    
    return this.httpClient.get(`${this.API +this.getIncomingBPList +"?CompanyID="+ComapyId  +"&AcpPartnerID="+AcpPartnerId+ "&PageNumber="+PageNumber+ "&PageSize="+PageSize + "&companyName="+companyName + "&companyEmail="+companyEmail}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('get Incoming BP List Service')))
  }
  GetOutgoingBusinessPartnerList(ComapyId:number,AcpPartnerId:number,PageNumber:number,PageSize:number,companyName:string,companyEmail:string): Observable<any> {    
    return this.httpClient.get(`${this.API +this.getOutgoingBPList +"?CompanyID="+ComapyId  +"&AcpPartnerID="+AcpPartnerId+ "&PageNumber="+PageNumber+ "&PageSize="+PageSize + "&companyName="+companyName + "&companyEmail="+companyEmail}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('get Outgoing BP List Service')))
  }
  DeleteBusinessPartner(businessPartnerId:number,userId:number): Observable<any> {    
    return this.httpClient.delete(`${this.API +this.deleteBPbyId +"?BusinessPartnerId="+businessPartnerId  +"&UserId="+userId}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('Delete BP By Id Service')))
  }

  ChangeBusinessPartnerStatus(dataObj:any): Observable<any> {  
    return this.httpClient.patch(`${this.API +this.changeBPStatus}`,dataObj)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('Change BP Status Service')))
  }


  GetBusinessPartnerDetail(BusinessPartnerId:number): Observable<any> {    
    return this.httpClient.get(`${this.API +this.BPDetails +"?BusinessPartnerId="+BusinessPartnerId}`)
      .pipe(map((data: any) => data || {}),
        catchError(this.handleError('get BP Details Service')))
  }

    private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    return of(result as T);
   };
    } 
}
