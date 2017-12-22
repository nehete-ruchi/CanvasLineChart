import { Component, OnInit, ElementRef } from '@angular/core';
import { Linechart, TimeInterval } from './linechart';
import { ViewChild } from '@angular/core';
import {LinechartService} from './linechart.service'

import * as CanvasChart from '../../../scripts/canvasChart.js'

@Component({
  selector: 'linechart',
  templateUrl: './linechart.component.html'
})
export class LinechartComponent implements OnInit {

  // @ViewChild('linechartCanvas') canvasRef: ElementRef;

  public startDate: Date  =  new Date();
  public endDate: Date = new Date();
  public infoMessage: string ="";

  constructor(private linechartService: LinechartService) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.infoMessage = "";
  }

  public getInitialData()
  {    
    this.infoMessage = "";
    var linechartList : Linechart[];
    var timeInterval : TimeInterval = new TimeInterval();
    timeInterval.startDate = this.startDate;
    timeInterval.endDate = this.endDate;

    if(this.startDate && this.endDate)
    {
      this.linechartService.getInitialData(timeInterval)
      .subscribe(data => 
        {
          linechartList = data;
          console.log(linechartList);
          if(linechartList && linechartList.length > 0)
          {
          this.drawOnCanvas(linechartList);
          }
          else
          {
            this.infoMessage = "No data received for Start DateTime : " 
                                + this.startDate.toString()
                                + " and End DateTime  :  " 
                                + this.endDate.toString()
          }
        }
        ,
        err => {
          console.log("Error occured.")
        }
      );
    }
  }

  public startStreaming()
  {
    this.infoMessage = "Streaming is not implemented";    
  }

  public stopStreaming()
  {
    this.infoMessage = "Streaming is not implemented";    
  }

private drawOnCanvas(linechartList: Linechart[])
{
  /*let ctx: CanvasRenderingContext2D =
  this.canvasRef.nativeElement.getContext('2d');*/
  this.drawLineChart(linechartList);
}

private drawLineChart(linechartList)
{
  var dataDef = { labelFont: '19pt Arial', 
                  dataPointFont: '10pt Arial',
                  renderTypes: [CanvasChart.CanvasChart.renderType.lines, CanvasChart.CanvasChart.renderType.points],
                  dataPoints: linechartList
                };
  CanvasChart.CanvasChart.render('linechartCanvas', dataDef);
}

}