import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from "../../../core/storage/localstorage.service";
import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexXAxis,ApexTitleSubtitle,ApexDataLabels,
        ApexPlotOptions,ApexTooltip,ApexStroke,ApexLegend,ApexFill,ApexStates,ApexResponsive,} from "ng-apexcharts";
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ManageUserService } from '../../Services/manageUserService/manage-user.service';
import { DefaultNumber } from 'src/app/Shared/Enums/Default.enums';
import { DashboardService } from '../../Services/dashboardService/dashboard.service';
import { DropdownList } from '../../Model/DropDownModel';
import { ManageStaffService } from '../../Services/staffManagementService/manage-staff.service';
import { ResponseStatus } from '../../Model/ResponseStatusModel';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
  states: ApexStates;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-caregiver-agency-dashboard',
  templateUrl: './caregiver-agency-dashboard.component.html',
  styleUrls: ['./caregiver-agency-dashboard.component.css']
})
export class CaregiverAgencyDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public ReferralChartOptions: Partial<ChartOptions>;
  agencyDashBoardForm!: FormGroup;
  isSubscribed : any;
  userName : any;
  id:any;
  userId:any;
  OfficeList:DropdownList[] =[];  
  loaderflag :boolean = false;  
  dataSource:any[];
  tab1Data :any[];
  tab2Data :any[];
  tab3Data :any[];
  tab4Data :any[];
  tab5Data :any[];
  tab6Data :any[];
  tab7Data :any[];
  tab8Data :any[];

  totalCaregiverSchedule:number=0;
  totalAgency:number=0;
  totalCaregiver:number=0;
  totalReferral:number=0;

  totalReferralShift:number=0;
  totalVisitCancelled:number=0;
  totalOpenReferral:number=0;
  totalonHold:number=0;
  totalReferralInvite:number =0;
  totalReferralVisitCancel:number =0;
  totalReferralAccepted:number =0;
  totalReferral_VisitCancel:number =0;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _manageUserService : ManageUserService,
    private localStorage: LocalStorageService,
    public dashboardService : DashboardService,
    private _staffService : ManageStaffService,
    private fb: FormBuilder) {

    // review chart
    this.ReferralChartOptions = {
      series: [
        {
          name: "",
          data: [20, 35, 15, 45, 20, 35, 15, 28, 10],
          color: "#FB896B",
        }
      ],
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: false
        },
      },
      legend: {
        position: 'top',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      fill: {
        colors: undefined,
        opacity: 0.3,
      },
      xaxis: {
        categories: ["Oct 2021", "Nov 2021", "Dec 2021", "Jan 2022", "Feb 2022", "Mar 2022", "Apr 2022", "May 2022", "Jun 2022"]
      },
      // tooltip: {
      //   x: {
      //     format: "dd/MM/yy HH:mm"
      //   }
      // },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            "<div class='arrow_box'>" +
            "<span class='rating-count'>" + series[seriesIndex][dataPointIndex] + "</span> <br/>" + "<div class='star'>" +
            "<img src='../../../../assets/images/star.svg'>" +
            "<img src='../../../../assets/images/star.svg'>" +
            "<img src='../../../../assets/images/star.svg'>" +
            "<img src='../../../../assets/images/star.svg'>" +
            "<img src='../../../../assets/images/gray-star.svg'>" +
            "</div>" +
            "</div>"
          );
        }
      },

      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
    };

    // do'nt send again chart
    this.chartOptions = {
      series: [
        {
          name: "",
          data: [10, 20, 40, 60, 110, 62, 30, 10],
          color: "#D3E9FF",
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        }
      },
      title: {
        text: ""
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 5,
          dataLabels: {
            position: "top",
          }
        }
      },

      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 1,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'darken',
            value: 1,
          }
        },
      },

      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          fontSize: "10px",
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
      },
      // tooltip: {
      //   y: {
      //     formatter: function (val) {
      //       return "$ " + val + "";
      //     }
      //   }
      // }
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="arrow_box">' +
            "<span>" +
            series[seriesIndex][dataPointIndex] +
            "</span>" +
            "</div>"
          );
        }
      },
      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: {
              height: 250,
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.userName = this.authService.fullUserName;
    this.userId = this.authService.userID;
    this.id = parseInt(this.route.snapshot.params['id']);
    this.isSubscribed= this.authService.isSubscribed;
    if(this.isSubscribed==null && this.id==0){
      this.router.navigate(["/Dashboard/payment"]);
    }
    else if(this.id!=0){
        this._manageUserService.GetUserData(this.id,'checkSubscription').subscribe((response:any) => {
          if(response.data != "") {
            this.localStorage.put(environment.AUTHENTICATION_KEY, response.data);
            this.router.navigate(["/login"]);
          }
        })
    }
    this.CreateFormGroup();
    this.GetStaffDropDownList();
    this.getDashboardData();   
  }

  CreateFormGroup(): void {
    this.agencyDashBoardForm = this.fb.group({    
      OfficeId: new FormControl(""),
    })
  }

  GetStaffDropDownList(){
    this.loaderflag=true;
    this._staffService.GetStaffDropDownListService().subscribe((response:ResponseStatus<DropdownList[]>)=>{
      if(response.data !=null){
        this.loaderflag=false;
        this.OfficeList = response.data;
        this.OfficeList = this.OfficeList.filter(p=>p.FlagId == DefaultNumber.Eight)
        // this.OfficeList.unshift({ FlagId: DefaultNumber.Eight, Label: "Please Select", Id: "" });
      }
      else{
        this.loaderflag=false;
      }   
    })
    
   }

  getDashboardData() {
    this.loaderflag = true;
    let AgencyId=1;
    let OfficeId =1;
    this.dashboardService.GetAgencyDashboardService(OfficeId,this.userId).subscribe((response: any) => {
     if(response.data !=null){
     //debugger
     this.dataSource = response.data;
     //------------------Tab1
     this.tab1Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.One)
     this.totalCaregiverSchedule = this.tab1Data[0].Column1;
     this.totalVisitCancelled = this.tab1Data[0].Column2;
     this.totalOpenReferral = this.tab1Data[0].Column3;
     this.totalonHold = this.tab1Data[0].Column4;
     this.totalReferralInvite = this.tab1Data[0].Column5;
     this.totalReferralVisitCancel = this.tab1Data[0].Column6;
     this.totalReferralAccepted = this.tab1Data[0].Column7;
     this.totalReferral_VisitCancel = this.tab1Data[0].Column8;

     //------------------Tab2
     this.tab2Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Two);

     //------------------Tab3
      this.tab3Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Three)

     //------------------Tab4
      this.tab4Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Four)

     //------------------Tab5
      this.tab5Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Five)

     //------------------Tab6
      this.tab6Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Six)

      //------------------Tab7
      this.tab7Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Seven)
      
      //------------------Tab8
      this.tab8Data = this.dataSource.filter(p=>p.FlagId == DefaultNumber.Eight)
     
     this.loaderflag = false;
    }
    else{
        this.loaderflag = false;
    }
   })
 }


}
