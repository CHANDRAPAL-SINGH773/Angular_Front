import { Injectable } from "@angular/core";
import { StringHelper } from "../../Utilities/contract/string-helper";
import { StorageTypes } from "./storage-type.enum";
import { StorageValueHelper } from "./storage-value-helper.model";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private readonly key = 'access_token';
  private readonly userType = 'user_type';
  private readonly companyID = 'companyID';
  private readonly acpPartnerID = 'acpPartnerID';
  private readonly userId = 'user_id';
  private readonly userName = 'user_name';
  private readonly acpPartnerName='acpPartnerName'
  private readonly companyName='companyName'
  private readonly firstname='firstname';
  private readonly middlename='middlename';
  private readonly lastname='lastname';
  private readonly appointmentId = 'appointment_id';
  private readonly clientID = 'clientID';
  private readonly staffID = 'staffID';
  private readonly loginuserId = 'nameid';
  private readonly loginuserstffId = 'loginStffid';

//  private facilityList: facility[] = [];
  private selectedFacility : any;
  private selectedFacilityAddress : any;
  private dropdownFlag :boolean;
  private selectedFacilityImage :any;

  //Commit below line
  put(key: string, value: StorageTypes): void {
    StringHelper.throwIsAvailableError(key, "key");
    const stringValue = StorageValueHelper.create(value);
    window.localStorage.setItem(key, stringValue);
  }
//end

  setAccessToken = (accessToken: string): void => {
    localStorage.setItem(this.key, accessToken);
  };

  setUserType = (userType: any): void => {
    localStorage.setItem(this.userType, userType);
  };
  setloginStaffId = (loginuserstffId: any): void => {
    localStorage.setItem(this.loginuserstffId, loginuserstffId);
  };

  setCompanyID = (companyID: any): void => {
    localStorage.setItem(this.companyID, companyID);
  };
  
  setUserId = (userId: any): void => {
    localStorage.setItem(this.userId, userId);
  };


  setAppointmentId = (appointmentId: any): void => {
    localStorage.setItem(this.appointmentId, appointmentId);
  };
  setClientId = (clientID: any): void => {
    localStorage.setItem(this.clientID, clientID);
  };
  setStaffID = (staffID: any): void => {
    localStorage.setItem(this.staffID, staffID);
  };
  setAcpPartnerID = (acpPartnerID: any): void => {
    if(acpPartnerID != null && acpPartnerID != ''){
      localStorage.setItem(this.acpPartnerID, acpPartnerID);
    }
  };
  // setFacilityList = (list: any): void => {
  //   this.facilityList = list;
  // };
// setselectedfacility = (facility:any):void =>{
//   this.selectedFacility = facility
// }
setselectedfacilityAddress = (facilityAdd:any):void =>{
  this.selectedFacilityAddress = facilityAdd
}
//set selected Image--
setselectedFacilityImage =(FacilityImage:any):void =>{
  this.selectedFacilityImage = FacilityImage
}
setFacilityDropdownview = (falg:boolean):void =>{
  this.dropdownFlag = falg;
}



getFacilityDropdownview =():any =>{
return this.dropdownFlag;
}
  getSelectedfacility =():any =>{
    return this.selectedFacility;
  }

  getSelectedfacilityAddress =():any =>{
    return this.selectedFacilityAddress;
  }
  getSelectedFacilityImage=():any=>{
    return this.selectedFacilityImage
  }

  // getFacilityList = () : any => {
  //   return this.facilityList;
  // };
  

  getAccessToken = (): string | null => {
    return localStorage.getItem(this.key);
  };

  getUserType = (): any | null => {
    return localStorage.getItem(this.userType);
  };
  getloginStaffId = (): any | null => {
    return localStorage.getItem(this.loginuserstffId);
  };

  getCompanyID = (): any | null => {
    return localStorage.getItem(this.companyID);
  };

  getUserId = (): any | null => {
    return localStorage.getItem(this.userId);
  };
  
   getAppointmentId = (): any | null => {
    return localStorage.getItem(this.appointmentId);
  };
  getClientId = (): any | null => {
    return localStorage.getItem(this.clientID);
  };
  getStaffID = (): any | null => {
    return localStorage.getItem(this.staffID);
  };
   getAcpPartnerID = (): any | null => {
    return localStorage.getItem(this.acpPartnerID);
  };
  getloginUserId = (): any | null => {
    return localStorage.getItem(this.loginuserId);
  };



//delete below
  get<T>(key: string, defaultValue: T): T {
    StringHelper.throwIsAvailableError(key, "key");
    const value = window.localStorage.getItem(key);
    const realValue = StringHelper.isAvailable(value as string) ? StorageValueHelper.get(value as string) : defaultValue;
    return realValue as any;
  }

  delete(key: string = ""): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    window.localStorage.clear();
  }


  isTokenExpired = (): boolean => {
    const user = this.getLoggedInUser();

    if (!user) 
      return true;

    const expiry = +user.exp || 0;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return currentTime >= expiry;
  };
  getLoggedInUser = (): any | null => {
    const token = this.getToken();

    if (!token) 
      return null;

    const user = JSON.parse(atob(token)) || null;
    return user;
  };
  private getToken = (): string | null => {
    const accessToken = this.getAccessToken();

    if (!accessToken) 
      return null;

    const token = accessToken.split('.')[1] || null;

    return token || null;
  };


  private isAvailableKey(key: string): boolean {
    const value = window.localStorage.getItem(key);
    return StringHelper.isAvailable(value as string);
  }

  private throwIsAvailableKeyError(key: string): void {
    if (!this.isAvailableKey(key)) {
      throw new Error(`Key '${key}' not found.`);
    }
  }
//end


setUsername = (username: any): void => {
  localStorage.setItem(this.userName, username);
};
getUserName = (): any | null => {
  return localStorage.getItem(this.userName);
};

setAcpPartnerName = (acpPartnerName: any): void => {
  localStorage.setItem(this.acpPartnerName, acpPartnerName);
};
getAcpPartnerName = (): any | null => {
  return localStorage.getItem(this.acpPartnerName);
};
setCompanyName = (companyName: any): void => {
  localStorage.setItem(this.companyName, companyName);
};
getCompanyName = (): any | null => {
  return localStorage.getItem(this.companyName);
};

setFirstName = (FirstName: any): void => {
  localStorage.setItem(this.firstname, FirstName);
};
getFirstName = (): any | null => {
  return localStorage.getItem(this.firstname);
};
setMiddleName = (MiddleName: any): void => {
  localStorage.setItem(this.middlename, MiddleName);
};
getMiddleName = (): any | null => {
  return localStorage.getItem(this.middlename);
};
setLastName = (LastName: any): void => {
  localStorage.setItem(this.lastname, LastName);
};
getLastName = (): any | null => {
  return localStorage.getItem(this.lastname);
};
// decryptUsingAES256( keyvalue:any) {
//   let _key = CryptoJS.enc.Utf8.parse(environment.HashKey);
//   let _iv = CryptoJS.enc.Utf8.parse(environment.HashKey);

//    let decKey = CryptoJS.AES.decrypt(
//     keyvalue, _key, {
//       keySize: 16,
//       iv: _iv,
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7
//     }).toString(CryptoJS.enc.Utf8);
//     return Number(decKey)
// }

// encryption(keyValue: any) {
//   let _key = CryptoJS.enc.Utf8.parse(environment.HashKey);
//   let _iv = CryptoJS.enc.Utf8.parse(environment.HashKey);
//   let encrypted = CryptoJS.AES.encrypt(JSON.stringify(keyValue), _key, {
//     keySize: 16,
//     iv: _iv,
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   let EncKey = encrypted.toString();
//   return EncKey
// }
}
