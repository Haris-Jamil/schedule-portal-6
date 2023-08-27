import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../service/project.service';
declare const Chart;

@Component({
  selector: 'app-interactive-charts',
  templateUrl: './interactive-charts.component.html',
  styleUrls: ['./interactive-charts.component.css']
})
export class InteractiveChartsComponent implements OnInit {

  chart: any;
  chart2: any;
  operator: string;
  year: string;  
  chartCount = 0;
  lineColors = ['rgb(41, 128, 185)',
                'rgb(39, 174, 96)',
                'rgb(241, 196, 15)',
                'rgb(231, 76, 60)',
                'rgb(230, 126, 34)',
                'rgb(142, 68, 173)',
                'rgb(44, 62, 80)',
                'rgb(1, 163, 164)',
                'rgb(225, 177, 44)',
                'rgb(179, 55, 113)'];
                      
    bgColors = ['rgb(41, 128, 185, 0.2)',
                'rgb(39, 174, 96, 0.2)',
                'rgb(241, 196, 15, 0.2)',
                'rgb(231, 76, 60, 0.2)',
                'rgb(230, 126, 34, 0.2)',
                'rgb(142, 68, 173, 0.2)',
                'rgb(44, 62, 80, 0.2)',
                'rgb(1, 163, 164, 0.2)',
                'rgb(225, 177, 44, 0.2)',
                'rgb(179, 55, 113, 0.2)'];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    const ctx1 = document.getElementById('myChart');
    const ctx2 = document.getElementById('myChart2');
    this.chart = this.getChartInstance(ctx1, 'No. of projects submitted', 60);
    this.chart2 = this.getChartInstance(ctx2, 'No. of wins', 6)
  }

  getChartInstance(ctx, label, max) {
    return new Chart(ctx, {
      type: 'line',
      data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: []
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      suggestedMax: max,
                  },
                  scaleLabel: {
                      display: true,
                      labelString: label
                  }
              }]
          }
      }
    });
  }

  loadData() {

    const formData = new FormData();
    formData.append('operator', this.operator);
    formData.append('year', this.year);
    formData.append('type', '6');

    this.projectService.getChartData(formData).subscribe((resp: any[]) => {

      resp = this.formatResponse(resp);

      const dataset = {
        'label': this.operator + '-' + this.year,
        'data': resp,
        'borderColor': this.lineColors[this.chartCount],
        'backgroundColor': this.bgColors[this.chartCount]
      }
      this.chart.data.datasets.push(dataset);
      this.chart.update();      
    });

    this.projectService.getChartData(formData, true).subscribe((resp: any[]) => {

      resp = this.formatResponse(resp);

      const dataset = {
        'label': this.operator + '-' + this.year,
        'data': resp,
        'borderColor': this.lineColors[this.chartCount],
        'backgroundColor': this.bgColors[this.chartCount]
      }
      this.chart2.data.datasets.push(dataset);
      this.chart2.update();      
    });
    this.chartCount++;
  }

  formatResponse(data): any[] {
    let startMonth;
      if (data.length > 0) {
          startMonth = data[0].month;
      }
      for (let i=startMonth-1; i>0; i--) {
        data.unshift(0);
      }
      return data.map( (d) => {
          if (typeof d === 'object') return d.count;
          return d;
      });
  }

  generateChart() {
    this.loadData();
  }

  clearChart() {
    this.chartCount = 0;
    this.chart.data.datasets = [];
    this.chart2.data.datasets = [];    
    this.chart.update();
    this.chart2.update();
  }

}
