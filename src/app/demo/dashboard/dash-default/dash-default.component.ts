
import { Societe } from 'src/app/demo/dashboard/interface/Societe.interface';
import * as ApexCharts from "apexcharts";
import { Dashboard } from "src/app/demo/dashboard/interface/dashboard.interface";
import { Client } from "../interface/Client.interface";
import { BehaviorSubject } from 'rxjs';

import { InformationsService } from "./../../../services/informations.service";
import { DashboardService } from "../../../services/servicesBD_Dashboard/dashboard.service";

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Logigram } from "../chart/logigram";

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStates,
  ApexGrid,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries
} from "ng-apexcharts";
import * as moment from 'moment';
import { exists, truncate } from 'fs';
import { ActivatedRoute } from '@angular/router';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00D9E9",
  "#FF66C3"
];

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  subtitle: ApexTitleSubtitle;
  colors: string[];
  states: ApexStates;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: any; //ApexTooltip;

};

declare global {
  interface Window {
    Apex: any;
  }
}

window.Apex = {
  chart: {
    toolbar: {
      show: false
    }
  },
  tooltip: {
    shared: false
  },
  legend: {
    show: false
  }
};

@Component({
  selector: "app-dash-default",
  templateUrl: "./dash-default.component.html",
  styleUrls: ["./dash-default.component.scss"],
})

export class DashDefaultComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @Input() series: any | ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() xaxis: ApexXAxis;
  @Input() colors: string[];
  @Input() states: ApexStates;
  @Input() title: ApexTitleSubtitle;
  @Input() tooltip: ApexTooltip;
  @Input() yaxis: ApexYAxis | ApexYAxis[];


  public logigram: any;
  public dashboard: Dashboard;
  public client: Client;
  public tabChiffreAffaireClient = [];
  //public isLoadingMois = false;
  public isLoadingDlm = false;
  public isLoadingHead = false
  //public isLoadingAns = false;
  public isLoadingTopClient = false;
  public isLoadingDynamicChart = false;
  public societe: Societe;
  public dlmClient = [];
  public dlmMoy: number
  public value: number
  public dataChart = []



  constructor(
    private informationsService: InformationsService,
    private DashboardService: DashboardService,
    public informationGenerale: InformationsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.logigram = Logigram.logigram;
    this.dashboard = {} as Dashboard;
    this.client = {} as Client;
    this.societe = {} as Societe;


  }


  // getChiffreAffaireParMois(): void {
  //   var societe = this.informationsService.idSocieteCurrent;
  //   this.dashboard.societe = societe;
  //   var dateStart = new Date(this.informationGenerale.idDateAujourdCurrent)
  //   var dateEnd = new Date(this.informationGenerale.idDateFinCurrent)

  //   this.dashboard.dateStart = dateStart//new Date("2019-01-17");
  //   this.dashboard.dateEnd = dateEnd//new Date("2022-12-18");

  //   try {
  //     this.DashboardService.getChiffreAffaireParMois(this.dashboard).subscribe(
  //       (data) => {
  //         this.isLoadingMois = true;
  //         //console.log(data);
  //         var chiffreAffaireFromServer = [];
  //         var dateFromServer = [];

  //         for (let i = 0; i < data.chiffreAffaireParMois.length; i++) {
  //           chiffreAffaireFromServer.push(
  //             Math.trunc(Math.round(data.chiffreAffaireParMois[i].chiffreAffaireParMois))
  //           );

  //         }

  //         //console.log("chiffreAffaireFromServer = ", chiffreAffaireFromServer);

  //         for (let i = 0; i < data.chiffreAffaireParMois.length; i++) {
  //           dateFromServer.push(data.chiffreAffaireParMois[i]._id);
  //         }

  //         //console.log("dateFromServer = ", dateFromServer);

  //         const el = document.querySelector("#chartBarCaParMois");
  //         //console.log(el);

  //         var chartBarCaParMois = new ApexCharts(el, {
  //           chart: {
  //             type: "bar",
  //             id: "chartBarCaParMois",
  //             toolbar: {
  //               show: false,
  //             },
  //           },
  //           title: {
  //             text: "Chiffre Affaire Mensuel",
  //             align: "center",
  //             style: {
  //               fontSize: "25px",
  //               fontWeight: "bold",
  //               fontFamily: "Georgia",
  //               color: "#387C44",
  //             },
  //           },
  //           plotOptions: {
  //             bar: {
  //               horizontal: false,
  //               columnWidth: "50%",
  //               dataLabels: {
  //                 position: "center",
  //                 maxItems: 100,
  //                 hideOverflowingLabels: true,
  //                 orientation: "vertical",
  //               },
  //             },
  //           },
  //           series: [
  //             {
  //               name: "chiffre Affaire",
  //               data: chiffreAffaireFromServer,
  //             },
  //           ],
  //           xaxis: {
  //             type: "datetime",
  //             categories: dateFromServer,
  //             labels: {
  //               show: true,
  //               rotate: -45,
  //               rotateAlways: false,
  //               hideOverlappingLabels: false,
  //               showDuplicates: false,
  //               trim: false,
  //               minHeight: undefined,
  //               maxHeight: 120,
  //               style: {
  //                 fontSize: "8px",
  //                 fontFamily: "Helvetica, Arial, sans-serif",
  //                 fontWeight: 400,
  //                 cssClass: "apexcharts-xaxis-label",
  //               },
  //               offsetX: 0,
  //               offsetY: 0,
  //               format: undefined,
  //               formatter: undefined,
  //               datetimeUTC: true,
  //               datetimeFormatter: {
  //                 month: "MM 'yy",
  //               },
  //             },
  //           },
  //         });

  //         this.isLoadingMois = false;
  //         chartBarCaParMois.render();

  //       },
  //       (err) => {
  //         console.log(err);

  //       }
  //     )
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  // getChiffreAffaireParAns(): void {
  //   var societe = this.informationsService.idSocieteCurrent;
  //   this.dashboard.societe = societe;
  //   var dateStart = new Date(this.informationGenerale.idDateAujourdCurrent)
  //   var dateEnd = new Date(this.informationGenerale.idDateFinCurrent)

  //   this.dashboard.dateStart = dateStart//new Date("2019-01-17");
  //   this.dashboard.dateEnd = dateEnd//new Date("2022-12-18");

  //   this.DashboardService.getChiffreAffaireParAns(this.dashboard).subscribe(
  //     (data) => {
  //       this.isLoadingAns = true;
  //       //console.log(data);
  //       var chiffreAffaireFromServer = [];
  //       var dateFromServer = [];
  //       var tab = [];

  //       data.chiffreAffaire.forEach((element) => {
  //         tab.push(element);
  //       });
  //       tab.sort(function compare(a, b) {
  //         if (a._id < b._id) {
  //           return -1;
  //         }
  //         if (a._id > b._id) {
  //           return 1;
  //         }
  //         return 0;
  //       });

  //       //console.log("this is tab", tab);

  //       for (let i = 0; i < tab.length; i++) {
  //         chiffreAffaireFromServer.push(
  //           Math.trunc(Math.round(tab[i].chiffreAffaireParAns))
  //         );
  //       }
  //       for (let i = 0; i < tab.length; i++) {
  //         dateFromServer.push(tab[i]._id);
  //       }

  //       const el = document.querySelector("#chartBarCaParAns");
  //       var chartBarCaParAns = new ApexCharts(el, {
  //         chart: {
  //           type: "bar",
  //           id: "chartBarCaParAns",
  //           toolbar: {
  //             show: false,
  //           },
  //         },
  //         title: {
  //           text: "Chiffre Affaire Annuel",
  //           align: "center",
  //           style: {
  //             fontSize: "25px",
  //             fontWeight: "bold",
  //             fontFamily: "Georgia",
  //             color: "#387C44",
  //           },
  //         },
  //         plotOptions: {
  //           bar: {
  //             horizontal: false,
  //             columnWidth: "50%",
  //             dataLabels: {
  //               position: "center",
  //               maxItems: 100,
  //               hideOverflowingLabels: true,
  //               orientation: "vertical",
  //             },
  //           },
  //         },
  //         series: [
  //           {
  //             name: "chiffre Affaire",
  //             data: chiffreAffaireFromServer,
  //           },
  //         ],
  //         xaxis: {
  //           type: "category",
  //           categories: dateFromServer,
  //         },
  //       });
  //       chartBarCaParAns.render();

  //       this.isLoadingAns = false;
  //     },
  //     (err) => {
  //       console.log(err);

  //     }
  //   )
  // }


  getTopClient(): void {
    this.client.societe = this.informationsService.idSocieteCurrent;
    //console.log(this.client);
    var tab = [];
    this.DashboardService.getTopClient(this.client).subscribe(
      (response) => {
        //console.log(response);
        this.isLoadingTopClient = true;
        response.transactionsClient.map((e) => {
          //console.log(e);
          tab.push(e);
        });

        tab.sort(function compare(a, b) {
          if (a.chiffreAffaire > b.chiffreAffaire) {
            return -1;
          }
          if (a.chiffreAffaire < b.chiffreAffaire) {
            return 1;
          }
          return 0;
        });
        for (let index = 0; index < 10; index++) {
          tab[index].chiffreAffaire = numStr(Math.trunc(tab[index].chiffreAffaire));
          this.tabChiffreAffaireClient.push(tab[index]);
        }

        this.isLoadingTopClient = false;

      },
      (error) => {
        console.log(error);
      }
    );


  }

  fournisseursDlm = 0

  getDlmClient(): void {
    var societe = this.informationsService.idSocieteCurrent;
    this.societe.id = societe;
    //console.log(this.societe);
    this.isLoadingDlm = true

    var tab = []
    this.DashboardService.getDLMsClients(this.societe).subscribe(
      (response) => {

        this.isLoadingDlm = false
        var response2:any = response

        this.fournisseursDlm = response2.fournisseursDlm

        console.log("response === ", response)

        //console.log(response);
        response.listGlobal.forEach(element => {
          //console.log(element);
          tab.push(element)
        });
        var dlmtab = []
        for (let index = 0; index < tab.length; index++) {
          //tab[index].dlm = Math.round(tab[index].dlm * 100)/100;
          dlmtab.push(tab[index].dlm)
          //this.dlmClient.push(tab[index])
        }

        //console.log(this.dlmClient);
        //console.log(dlmtab);

        let x = numAverage(dlmtab)
        this.dlmMoy = Math.round(x * 100) / 100
        //console.log(this.dlmMoy);

      }, (err) => {
        console.log(err);

      }
    )


  }


  ngOnInit() {
    // this.getChiffreAffaireParAns();
    // this.getChiffreAffaireParMois();
    this.getTopClient();
    this.getDlmClient()
    this.loadedChartChiffreAffaire()
  }




  updateQuarterChart(sourceChart, e?: any, destChartIDToUpdate?: any) {
    //console.log(sourceChart);
    // console.log(destChartIDToUpdate);
    // console.log(e);

    var series = [];
    var seriesIndex = 0;
    var colors = [];
    if (sourceChart.w.globals.selectedDataPoints[0]) {
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        //console.log(selectedIndex);

        var yearSeries = sourceChart.w.config.series[seriesIndex];
        //console.log(yearSeries);

        series.push({
          name: yearSeries.data[selectedIndex].x,
          data: this.makeQuartersSeries(yearSeries.data[selectedIndex].quarters)
        });

        //console.log(yearSeries.data[selectedIndex].color);

        colors.push(yearSeries.data[selectedIndex].color);
      }


      if (series.length === 0)
        series = [
          {
            data: []
          }
        ];
        //console.log(series);

      var month = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

      //       console.log(colors);
      // console.log(yearSeries);

      return window.ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
        xaxis: { categories: month },
        series: series,
        colors: colors,
        fill: {
          colors: colors
        }
      });
    }


  }



  makeDataTest(years: any, mois: any): any {
    var tab = []
    var series = []
    var arrayData = [];
    //console.log(years);

    years.forEach(elementYears => {
      elementYears.sort(function compare(a, b) {
        if (a._id < b._id) {
          return -1;
        }
        if (a._id > b._id) {
          return 1;
        }
        return 0;
      })

      for (let index = 0; index < elementYears.length; index++) {

        var yearGlobal = new Date(elementYears[index]._id).getFullYear()
        var quarters = []
        //console.log(yearGlobal);
        var testVars = []
        mois.forEach(element => {
          //console.log(element);
          for (let j = 0; j < element.length; j++) {
            //console.log(element[index]);

            const elt = element[j]._id;
            ///console.log(elt);
            let year = new Date(elt).getFullYear()
            //console.log(year);
            if (yearGlobal === year) {
              let month = new Date(element[j]._id).getMonth() + 1
              // console.log(month);

              quarters.push({
                x: month,
                y: Math.trunc(element[j].chiffreAffaire)
              })
            }
          }

          arrayData.push({
            quarters: quarters
          })

          series.push({
            x: elementYears[index]._id,
            y: Math.trunc(elementYears[index].chiffreAffaire),
            color: colors[index],
            quarters: arrayData[index].quarters
          })
        });
      }
    });
    //console.log(series);
    return series
  }

  isNaN2(num){
      return isNaN(num)
   }

  loadedChartChiffreAffaire() {
    var societe = this.informationsService.idSocieteCurrent;
    this.societe.id = societe;

    var years = []
    var mois = []
    this.DashboardService.getChiffreAffaire(this.societe).subscribe(

      (res) => {
        //console.log(res);
        this.isLoadingDynamicChart = true
        years.push(res.ans)
        mois.push(res.mois)
        var chartYearOptions = {
          series: [
            {
              name: "year",
              data: this.makeDataTest(years, mois)
            }
          ],
          chart: {
            id: "barYear",
            height: 400,
            width: "100%",
            type: "bar",
            events: {
              dataPointSelection: (e, chart, opts) => {
                //console.log(e);
                // console.log(chart);
                //console.log(opts);

                var quarterChartEl = document.querySelector("#chart-quarter");
                var yearChartEl = document.querySelector("#chart-year");
                // console.log(quarterChartEl);
                // console.log(yearChartEl);

                if (opts.selectedDataPoints[0].length === 1) {
                  if (quarterChartEl.classList.contains("active")) {
                    this.updateQuarterChart(chart, e, "barQuarter");
                  } else {
                    yearChartEl.classList.add("chart-quarter-activated");
                    quarterChartEl.classList.add("active");
                    this.updateQuarterChart(chart, e, "barQuarter");
                  }
                } else {
                  this.updateQuarterChart(chart, e, "barQuarter");
                }

                if (opts.selectedDataPoints[0].length === 0) {
                  yearChartEl.classList.remove("chart-quarter-activated");
                  quarterChartEl.classList.remove("active");
                }
              },
              updated: (chart) => {
                this.updateQuarterChart(chart, "barQuarter");
              }
            }
          },
          plotOptions: {
            bar: {
              distributed: true,
              horizontal: false,
              barHeight: "75%",
              dataLabels: {
                position: "center",
                maxItems: 100,
                orientation: "vertical",
              },
            }
          },

          colors: colors,

          states: {
            normal: {
              filter: {
                type: "desaturate"
              }
            },
            active: {
              allowMultipleDataPointsSelection: true,
              filter: {
                type: "darken",
                value: 1
              }
            }
          },
          tooltip: {
            x: {
              show: true
            },
            y: {

              title: {
                formatter: function (val, opts) {
                  // console.log(opts);
                  // console.log(val[opts.dataPointIndex]);
                  return opts.w.globals.labels[opts.dataPointIndex];
                }
              }
            }
          },
          title: {
            text: "Chiffre Affaire Annuel",
            offsetX: 15
          },

          yaxis: {
            show: false,
            labels: {
              show: false
            }
          }
        };

        var chartQuarterOptions = {
          series: [{
            name: "quarter",
            data: []
          }],
          noData: {
            text: "No data text",
            align: "center",
            verticalAlign: "middle",
          },
          chart: {
            id: "barQuarter",
            height: 400,
            width: "100%",
            type: "bar",
            stacked: false,

          },
          plotOptions: {
            bar: {
              columnWidth: "50%",
              horizontal: false,
              dataLabels: {
                position: "center",
                maxItems: 100,
                hideOverflowingLabels: true,
                orientation: "vertical",
              },
            }
          },
          legend: {
            show: false
          },
          grid: {
            yaxis: {
              lines: {
                show: false
              }
            },
            xaxis: {
              lines: {
                show: true
              }
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          title: {
            text: "Chiffre Affaire Mensuel",
            offsetX: 10
          },
          tooltip: {
            x: {
              formatter: function (val, opts) {
                //console.log(val);

                return opts.w.globals.seriesNames[opts.seriesIndex];
              }
            },
            y: {
              title: {
                formatter: function (val, opts) {
                  return opts.w.globals.labels[opts.dataPointIndex];
                }
              }
            }

          },

        };
        const chartYearId = document.querySelector("#chart-year");
        const chartQuarterId = document.querySelector("#chart-quarter");

        this.chartYears = new ApexCharts(chartYearId, chartYearOptions)
        this.chartQuarter = new ApexCharts(chartQuarterId, chartQuarterOptions)
        this.chartYears.render()
        this.chartQuarter.render()

        this.isLoadingDynamicChart = false

      },
      (err) => {
        console.log(err);
      }
    )
  }

  chartYears
  chartQuarter
  ngOnDestroy() {
    this.chartYears.destroy()
    this.chartQuarter.destroy()
  }

  makeDataMois(mois: any[]) {
  }
  makeQuartersSeries(data) {


    //console.log(data);
    var rslt = data
    var series = []

    for (let index = 0; index < rslt.length; index++) {
      series.push(rslt[index])
    }
    //console.log(series);
    series.sort(function compare(a, b) {
      if (a.x < b.x) {
        return -1;
      }
      if (a.x > b.x) {
        return 1;
      }
      return 0;
    })
    //console.log(series);
    var test = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let index = 0; index < series.length; index++) {
      let val = series[index].x
      test[val - 1] = series[index].y
    }

    //console.log(test);

    return test

  }
}


function numStr(a: any, b?: any) {
  a = '' + a;
  b = b || ' ';
  var c = '',
    d = 0;
  while (a.match(/^0[0-9]/)) {
    a = a.substr(1);
  }
  for (var i = a.length - 1; i >= 0; i--) {
    c = (d != 0 && d % 3 == 0) ? a[i] + b + c : a[i] + c;
    d++;
  }
  return c;
}

function numAverage(a: any) {
  var b = a.length,
    c = 0, i;
  for (i = 0; i < b; i++) {
    c += Number(a[i]);
  }
  return c / b;
}




