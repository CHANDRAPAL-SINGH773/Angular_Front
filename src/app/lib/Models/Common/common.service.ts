import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService } from 'src/app/core/storage/localstorage.service';
import { environment } from 'src/environments/environment';
import { ListSearchModel } from '../CommonListModel';

import { data } from 'jquery';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  ApiUrl = environment.ICC_API; //Access localhost API path from environment.ts file;
  sortDir = 1; //1= 'ASE' -1= DSC

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}
  onSortClick(columnName: string, listObj: any[]) {
    if (this.sortDir == 1) this.sortDir = -1;
    else this.sortDir = 1;

    this.sortArr(columnName, listObj);
    return listObj;
  }

  sortArr(colName: any, listObj: any[]) {
    listObj.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();

      return a.localeCompare(b) * this.sortDir;
    });
  }

  formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  GetCommonDropdowns(dataObj: any): Observable<any> {
    //FlagId 1: Facility
    //FlagId 2: FacilityType
    //FlagId 3: UserType

    let query = '?';
    if (dataObj.Search != '') {
      query += 'Search=' + dataObj.Search + '&';
    }
    query +=
      'PageNumber=' +
      dataObj.PageNumber +
      '&PageSize=' +
      dataObj.PageSize +
      '&Id=' +
      dataObj.Id +
      '&OrganizationID=' +
      dataObj.OrganizationID +
      '&FacilityID=' +
      dataObj.FacilityID;

    return this.http
      .get(`${this.ApiUrl + 'CommonAPI/GetCommonDropdowns' + query}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('GetCommonDropdowns Common Service'))
      );
  }

  getRole(pageIndex: number, pageSize: number) {
    return this.http
      .get<any>(
        `${
          this.ApiUrl + 'CommonAPI/GetCommonDropdowns'
        }?PageNumber=${pageIndex}&PageSize=${pageSize}`,
        {}
      )
      .pipe(
        map((role) => {
          return role;
        })
      );
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.ApiUrl + 'Master/getCountries'}`).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Get Country List Service'))
    );
  }

  getCompanyType(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/getCompanyType`).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Get Company Type Service'))
    );
  }

  getProduct(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Master/GetProductdetails?ProductCode=${obj.productCode}&ProductName=${obj.productName}&Search=${obj.search}&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Product Service'))
      );
  }

  getCategories(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Master/GetCategorydetails?CompanyID=${obj.companyID}&Search=${obj.search}&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Categories  Service'))
      );
  }

  getBuisnessPartner(obj: any): Observable<any> {
    return this.http
      .post(`${this.ApiUrl}AcpPartner/GetAcpPartnerList`, obj)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get  Business Partner Service'))
      );
  }

  addBuisnessPartner(obj: any): Observable<any> {
    return this.http
      .post(`${this.ApiUrl}BusinessPartner/AddupdateBuisnessPartner`, obj)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Add BusinessPartner Service'))
      );
  }
  addClient(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/AddUpdateClient`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Add Client Service'))
    );
  }

  getClient(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Client/GetClientdetails?CompanyId=${
          obj.companyID
        }&AcpPartnerID=${obj.acpPartnerID}&Search=${
          obj.search ? obj.search : ''
        }&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Client Service'))
      );
  }

  deleteClient(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/DeleteClient`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Delete Client Service'))
    );
  }

  statusClient(obj: any): Observable<any> {
    return this.http.patch(`${this.ApiUrl}Client/ChangeClientStatus`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Status Client Service'))
    );
  }

  addClientSite(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/AddUpdateClientSites`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Add ClientSite Service'))
    );
  }
// CompanyID=0&AcpPartnerID=0&Search=gjg&PageNumber=0&PageSize=0
  getClientSite(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Client/GetClientSitedetails?CompanyID=${
          obj.companyID
        }&AcpPartnerID=${obj.acpPartnerID}&ClientID=${obj.clientID?obj.clientID:''}&Search=${
          obj.search ? obj.search : ''
        }&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get ClientSite Service'))
      );
  }

  deleteClientSite(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/DeleteClientSite`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Delete ClientSite Service'))
    );
  }

  addContactClient(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/AddUpdateClientContact`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Add ContactClient Service'))
    );
  }

  GetClientContactAddress(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Client/GetClientContactAddress?CompanyID=${
          obj.companyID
        }&AcpPartnerID=${obj.acpPartnerID}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get ContactClient Service'))
      );
  }

  deleteContactClient(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/DeleteClientContact`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Delete ContactClient Service'))
    );
  }
  GetClientContactList(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Client/GetClientContactList`, obj).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Get ContactClient List Service'))
    );
  }

  getDepartments(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}Department/get/getDepartments?DepartmentID=${obj.departmentID}&CompanyID=${obj.companyID}&DepartmentName=${obj.departmentName}&Search=${obj.search}&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Departments  Service'))
      );
  }
  getBusiness(obj: any): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}BusinessPartner/GetBuisnessPartner?CompanyID=${obj.companyID}&Search=${obj.search}&PageNumber=${obj.pageNumber}&PageSize=${obj.pageSize}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Business  Service'))
      );
  }

  getStates(CountryId:any) : Observable<any>
  {
    return this.http.get(`${this.ApiUrl + "Master/getStateByCountryId?CountryId=" + CountryId}`)
    .pipe(map((data: any) => data||[]),
    catchError(this.handleError('Get State List Service')))
  }

  getProgram(): Observable<any> {
    return this.http.get(`${this.ApiUrl + 'Program/GetProgramDetails'}`).pipe(
      map((data: any) => data || []),
      catchError(this.handleError('Get Program List Service'))
    );
  }

  getCities(StateId: any): Observable<any> {
    return this.http
      .get(`${this.ApiUrl + 'Master/GetCityMaster?StateId=' + StateId}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get City List Service'))
      );
  }

  GetCompanyDetailByID(obj: any): Observable<any> {
    return this.http
      .get(`${this.ApiUrl}Company/GetCompanyDetailByID?CompanyId=${obj}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Company Profile  Service'))
      );
  }

  // Service is used for upload profile logo  and docs--
  UploadProfileService(dataObj:any): Observable<any>{
    debugger
    return this.http.post(`${this.ApiUrl}Master/UploadLogo`,dataObj).pipe(
      catchError(this.handleError('Update Agency details Service', []))
    )
  } 

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  GetNotification(FacilityId: Number, OrganizationId: Number): Observable<any> {
    return this.http
      .get(
        `${this.ApiUrl}CommonAPI/GetNotification?OrganizationId=${OrganizationId}&FacilityID=${FacilityId}`
      )
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Notification List Service'))
      );
  }

  GetUnassignedStaffs(id: number): Observable<any> {
    return this.http
      .get(`${this.ApiUrl + 'CommonAPI/getUnassignedStaff/' + id}`)
      .pipe(
        map((data: any) => data || {}),
        catchError(this.handleError('Get Unassigned staffs'))
      );
  }
  getAllTaskLogHistory(
    dataObj: ListSearchModel,
    taskStatusID: number
  ): Observable<any> {
    let OrganizationId = this.localStorage.getCompanyID();
    let facilityid = this.localStorage.getAcpPartnerID();
    let query = '?';
    if (dataObj.Search != '') {
      query += 'Search=' + dataObj.Search + '&';
    }
    const modal = {
      pageNumber: dataObj.PageNumber,
      pageSize: dataObj.PageSize,
      search: dataObj.Search,
      sortColumn: '',
      sortOrder: '',
      organizationId: OrganizationId,
      facilityId: facilityid,
      taskStatusID: taskStatusID,
    };
    return this.http
      .post(`${this.ApiUrl}CommonAPI/GetAllTaskHistory`, modal)
      .pipe(catchError(this.handleError('Get All Task History Service', [])));
  }
  GetAllNotification(
    dataObj: ListSearchModel,
    query: any,
    status: boolean
  ): Observable<any> {
    if (dataObj.Search != '') {
      query += '&search=' + dataObj.Search + '&';
    }
    query +=
      '&PageNumber=' +
      dataObj.PageNumber +
      '&PageSize=' +
      dataObj.PageSize +
      '&Id=' +
      dataObj.Id +
      '&Status=' +
      status;

    return this.http
      .get(`${this.ApiUrl + 'CommonAPI/GetNotification' + query}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('Get Notification Service'))
      );
  }
  GetAllEquipmentDetails(
    dataObj: ListSearchModel,
    query: any,
    status: boolean
  ): Observable<any> {
    if (dataObj.Search != '') {
      query += '&search=' + dataObj.Search + '&';
    }
    query +=
      '&PageNumber=' + dataObj.PageNumber + '&PageSize=' + dataObj.PageSize;

    // return this.http.get(`${this.ApiUrl + "Equipment/GetAssignedEquipmentList" + query}`)
    //   .pipe(map((data: any) => data||[]),
    //     catchError(this.handleError('Get Notification Service')))
    return this.http
      .get(`${this.ApiUrl + 'Equipment/GetAssignedEquipmentList' + query}`)
      .pipe(
        map((data: any) => data || []),
        catchError(this.handleError('searchEquipment Service'))
      );
  }

  saveNewCity(dataObj: any): Observable<any> {
    return this.http
      .post(`${this.ApiUrl}CommonAPI/AddCityOnMaster`, dataObj)
      .pipe(catchError(this.handleError('Save city master Service', [])));
  }
}
