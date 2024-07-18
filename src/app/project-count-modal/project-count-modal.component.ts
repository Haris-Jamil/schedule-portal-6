import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-project-count-modal',
  templateUrl: './project-count-modal.component.html',
  styleUrls: ['./project-count-modal.component.css']
})
export class ProjectCountModalComponent implements OnInit, OnChanges {

  @Input() data: any;
  operatorProjectDiff: any[] = [];
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;  
    if (this.data) {
      this.operatorProjectDiff = [];
      let allData: any = Object.keys(this.data);
      for(let d in allData){
        const code = allData[d];
        if(code.indexOf('Found') == -1 ){
          let diff = this.data[code+'Found'] - this.data[code];
          if(diff != 0){
            const obj = {
              'operator': code,
              'count':  (diff > 0 ? "+" : "" ) + (diff).toString()
            };
            this.operatorProjectDiff.push(obj);
          }       
        }
      }
    }  
    
  }

}
