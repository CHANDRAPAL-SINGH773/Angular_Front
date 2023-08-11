export class CommonErrorMessages {
    public  static getStatus() {
            return [{name:'Initial',id:1},
              {name:'Nomination',id:2},
              {name:'Quote',id:3},
              {name:'Pre Install',id:4},
              {name:'Post Install',id:5},
              {name:'Internal Review',id:6},
              {name:'Sent To ACP',id:7},
              {name:'ACP Issue',id:8},
            ]
      }

      public  static installationType() {
        return [{name:'New Building',id:1},
          {name:'Old Building',id:2},
          {name:'Replacement Installation',id:3},
          {name:'New Installation',id:4},
        ]
        
  }

  public  static Manpower() {
    return [{name:'Own Menpower',id:1},
      {name:"Partner's Manpower",id:2},
      {name:'Certificate only',id:3},
      {name:"Certificate and menpower",id:4}
    ]}
      public static readonly ProcessingError =
      "Some error occurred while processing your request, Please try again later.";
      public static readonly InvalidUsername = "Invalid username or password.";
      public static readonly RoleAccountLocked =
      "Role permission has been locked. Please contact your administrator";
      public static readonly SelectRole ="Please select role";
      public static readonly NoRecordFound ="No record found.";
      public static readonly ErrorOccured ="Error occured";
      public static readonly TransactionFailed ="Payment failed!";
      public static readonly DiscountNotAvailable ="Discount code not available!";
      public static readonly InvalidTime ="Invalid time to access this application.";
      public static readonly IPNotAuthorized =
      "This application has not been authorized to this IP: ";
      public static readonly BadRequest = "Bad request";
      public static readonly UserNameNotFound = "Username does not exist.";
      public static readonly UserNameEmpty = "Please enter the user name.";
      public static readonly PlanAlreadyExist = "Plan name already exist!";
      public static readonly UserNamePasswordEmpty =
      "Please enter the username or password.";
      public static readonly UserNameNotActive =
      "The specified username is inactive.";
      public static readonly RestrictedIp = "Restriced IP is not allowed to login.";
      public static readonly LinkNotFound =
      "This link could not be found in the database. Please request a new one.";
      public static readonly LinkExpired =
      "This link has been expired. Please request a new one.";
      public static readonly SamePassword =
      "Password should not be the same as last 3 passwords.";
      public static readonly PasswordMismatch = "Password does not match.";
      public static readonly AcceptTermsConditon = "Please accept Terms and Conditions";
      public static readonly IncorrectOldPassword =
      "Please enter correct old password.";
      public static readonly UserNameExists =
      "User name already exists, please enter new user name.";
      public static readonly FillMendatoryFields= "Please fill all mendatory fields."
      public static readonly InvalidEmail = "Please Enter Valid Email Address"
      public static readonly NotAuthorizedAccessVerificationManager ="You are not authorized access"
      public static readonly EnterNumericValue ="Enter numeric value";
      public static readonly EnterUniqueTitle ="Template title should be unique";
      public static readonly SessionExpired = "Your session has been expired.";
      public static readonly SelectStartDate = "Startdate is required field.";
      public static readonly AgencyorCaregiver = "You can choose either agency or caregiver";
      public static readonly AssignCaregiver = "Select Caregiver to assign the Shift";
      //public static readonly FileSize = "Please upload file of size upto 5MB only.";
      public static readonly invalidFormat = "Invalid image format";
      public static readonly fileSize = "File size should be less then 1MB";
      public static readonly fileSize5 = "File size should be less then 5MB";
      public static readonly PatientAlready = "Patient already exist in database";
      public static readonly DocumentExpired = "Document already expired";
      public static readonly DocumentNotSupported = "Upload only Docs, PDF and Images";
      public static readonly ShiftReason= "Please enter reason to cancel or reject the Shift"
      public static readonly CompleteComments = "Please enter comments to complete the Shift"
      public static readonly ShiftRating = "Please select rating for the Shift"
    
  }






  