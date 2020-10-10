import { HttpClient } from '@angular/common/http';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  private svg;
  private margin = 50;
  private width = 400;
  private height = 400;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  public data;

  public dataSource = {
      datasets: [
          {
              data: [],
              backgroundColor: []
          }
      ],
      labels: []
  };

  public createSVG(): void {
    this.svg = d3.select("figure#myDoughnutChart")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
  }

  public createColors(): void {
    console.log(this.data);
    this.colors = d3.scaleOrdinal()
    .domain(this.data.map(d => d.budget.toString(), console.log(this.data.budget)))
    .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

  public drawChart(): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.budget));

    // Building the chart
    this.svg
    .selectAll('pieces')
    .data(pie(this.data))
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius)
    )
    .attr('fill', (d, i) => (this.colors(i)))
    .attr("stroke", "#121926")
    .style("stroke-width", "0.5px");

    // Adding labels
    const labelLocation = d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius);

    this.svg
    .selectAll('pieces')
    .data(pie(this.data))
    .enter()
    .append('text')
    .text(d => d.data.title)
    .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .style("fill", "black");
  }

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    if (this.dataService.myBudget == undefined || this.dataService.myBudget.length == 0) {
      this.dataService.getData().subscribe((res: any) => {
        console.log(res);
        this.dataService.myBudget = res.myBudget;
        for (let i = 0; i < res.myBudget.length; i++){
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
          this.dataSource.datasets[0].backgroundColor[i] = res.myBudget[i].backgroundColor;
        }
        this.createChart();

        // Using the same data for the d3js chart
        this.data = res.myBudget;

        // Creating the d3js chart
        this.createSVG();
        this.createColors();
        this.drawChart();
      });
    }
    else{
        for (let i = 0; i < this.dataService.myBudget.length; i++){
          this.dataSource.datasets[0].data[i] = this.dataService.myBudget[i].budget;
          this.dataSource.labels[i] = this.dataService.myBudget[i].title;
          this.dataSource.datasets[0].backgroundColor[i] = this.dataService.myBudget[i].backgroundColor;
        }
        this.createChart();

        // Using the same data for the d3js chart
        this.data = this.dataService.myBudget;

        // Creating the d3js chart
        this.createSVG();
        this.createColors();
        this.drawChart();
      }
  }

  createChart() {
    const ctx = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

}
