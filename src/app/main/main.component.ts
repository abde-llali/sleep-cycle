import { SleepService } from './../services/sleep.service';
import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  averageSleep: any
  lastSleep: any
  sleepData: any
  
  constructor(public sleepService: SleepService) { 

  }
  public barChartColors: Color[] = [
    { backgroundColor: '#5be494' },
  ]

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData(){
    this.sleepService.getdata().subscribe(
      res=>{
        console.log(res)
        let timestampList = []
        let sleepDuration = []
        let dateList = []
        this.sleepData= res
        this.sleepData.forEach(item => {
           let datastr = String(item.data).split("'sleep_duration': ",)
           let data = datastr[1].replace("}","")
           console.log(parseInt(data))
          sleepDuration.push(parseInt(data))
          let timestamp = new Date(item.timestamp)
          timestampList.push(timestamp)
          let timeList = timestamp.toString().split(" ")
          let timeStr = timeList[2] + " " + timeList[1] + " " + timeList[3]
          dateList.push(timeStr)
         
         

        });
        let maxDate = new Date(Math.max.apply(null,timestampList))
        console.log("maxDate",maxDate)
        
        this.barChartLabels=dateList.slice(0, 15);
        this.barChartData[0].data=sleepDuration

        this.sleepData.forEach(obj => {
          //console.log("kk",maxDate.getTime())
          let curobj = new Date(obj.timestamp)
          
          if(maxDate.getTime() == curobj.getTime()){
            console.log(curobj)
            let datastr = String(obj.data).split("'sleep_duration': ",)
           let data = String( datastr[1]).replace("}","")
            this.lastSleep= parseInt(data)
            console.log(this.lastSleep)
          }

        });

        let sleepDurationSum = 0
        sleepDuration.forEach(element => {
          sleepDurationSum+= parseInt(element)
        });

        this.averageSleep=Math.round(sleepDurationSum/sleepDuration.length)

      },
      error=>{console.log("Error: ",error)}
    )
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      
      xAxes: [
       {
           display: true,
           ticks: {
            autoSkip: true,
            maxTicksLimit: 15
        }
       }
     ],
   }
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: 'Sleep Duration'},
    
  ];


}
