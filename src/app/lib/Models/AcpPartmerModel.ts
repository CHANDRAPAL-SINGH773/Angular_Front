export class AcpPartmerModel {
    AcpPartnerId:number ;
    AcpPartnerName :string;
    CompanyId:number ;
    AcpPartnerTypeId :number;
    FirstName:string ;
    LastName:string ;
    Email:string ;
    PhoneNo :string;
    UserName:string ;
    Password:string ;
    DateOfReg:Date ;
    Address1:string ;
    Address2:string ;
    CountryID:number ;
    StateID :number;
    City :string;
    PostalCode:string ;
    UserId:number 
}

export class Metadata {
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    defaultPageSize: number;
    totalPages: number;
    pageSizeOptions:number[]=[];
  }
  export class FilterModel {
    pageNumber: number = 1;
    pageSize: number = 5;
    sortColumn: string = "";
    sortOrder: string = "";
    searchText: string = "";
  }