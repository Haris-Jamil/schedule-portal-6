import { Component, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, Input, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../service/project.service';
import { LoginService } from '../service/login.service';
import { RejectionService } from '../service/rejection.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnChanges {

  visitor : string = "visitor";
  admin : string  = "admin"; 
  showFilter: boolean;
  buttonState: string;  
  date: string = '';
  month: string = '';
  year: string = '';
  originalData: any[] = [];
  filteredData: any[] = [];
  currentSelectedDate: number = 0;
  projectCount: any;
  show: boolean;
  rejectionMode: boolean = false;
  @Input() refreshSignal: number;

  errorCount: number = 0;
  doneCount: number = 0;
  issueCount: number = 0;

  isDataLoading: boolean = false;
  @Output() dataLoaded: EventEmitter<any[]> = new EventEmitter();
  
  constructor(private projectService: ProjectService, private loginService: LoginService, private rejectionService: RejectionService, private cd: ChangeDetectorRef) { 
    this.showFilter = false;  
    this.buttonState = 'down';    
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.refreshSignal.currentValue || changes.refreshSignal.currentValue == 0) {
      this.getRejectionCounts();
    }
  }

  ngOnInit() {
    if (window['rejectionMode']) {
      this.rejectionMode = true;
      this.getRejectionCounts();
    }

    this.show = !this.loginService.isVisitor();    

    if (this.rejectionMode) {
      this.rejectionService.getDataChangeEmitter()
        .subscribe( () => {
          this.fetchRejections();
        })
    } else {
      this.projectService.getDataChangeEmitter()
      .subscribe( () => {
        this.fetchProjects();
      })
    }
    
  }

  getRejectionCounts() {
    this.rejectionService.getCounts()
      .subscribe( (resp: any[]) => {
        console.log('resp', resp);
        resp.forEach(d => {
          if (d.status == 'error') {
            this.errorCount = d.count;
          } else if (d.status == 'verified') {
            this.issueCount = d.count;
          } else if (d.status == 'done') {
            this.doneCount = d.count;
          }
        });
        this.cd.detectChanges();
      });
  }

  fetchRejections(): void {
    if(this.year === "" || this.year === null){
      this.year = (new Date()).getFullYear().toString();
    }
    if(this.month === "" || this.month === null){
      //this.month = ((new Date()).getMonth() + 1).toString();
    }
    if(this.date != '' || this.month != '' || this.year != ''){
      this.isDataLoading = true;
      this.rejectionService.fetchRejections(this.date, this.month, this.year)
        .subscribe( (data: any[]) => {
          this.isDataLoading = false;
          this.originalData = data;  
        }, (error) => {
          console.error(error);
        });
    }
    this.getRejectionCounts();
  }
 
  fetchProjects(): void{
    if(this.year === "" || this.year === null){
      this.year = (new Date()).getFullYear().toString();
    }
    if(this.month === "" || this.month === null){
      this.month = ((new Date()).getMonth() + 1).toString();
    }
    if(this.date != '' || this.month != '' || this.year != ''){
      this.isDataLoading = true;
      this.projectService.fetchProjects(this.date, this.month, this.year)
        .subscribe( (data: any[]) => {
          this.isDataLoading = false;
          this.originalData = data;      
          this.fetchTotalProjects();
        }, (error) => {
          console.error(error);
        });
    }
  }

  fetchTotalProjects(): void{    
    let code = (<any>document.querySelector('input[placeholder="Operator"]')).value;
    code = code ? code : "";
    this.date = this.date ? this.date : "";
    let dataObj = new FormData();  
    dataObj.append('code', code);
    dataObj.append('year', this.year);
    dataObj.append('month', this.month);
    dataObj.append('date', this.date);
    this.projectService.fetchTotalProjects(dataObj)
      .subscribe( (totalProjects) => {        
        const operators = Object.keys(totalProjects);          
        let projects: any[];
        for(let operator in operators){
          const code = operators[operator]
          projects = this.originalData.filter( (r) => r.code === code );
          totalProjects[code+'Found'] = projects.length;              
        } 
        this.projectCount = totalProjects;
      }, (error) => {
        console.error(error);
      });
  }

  fetchDataByDay(day?: number){
    var date = new Date();    
    if( typeof day === "undefined"){
      date.setDate( date.getDate() + this.currentSelectedDate );
      this.currentSelectedDate++;
    } else {
      date.setDate( date.getDate() + day );
      this.currentSelectedDate = day + 1;
    }
    this.date = date.getDate().toString();
    this.month = (date.getMonth() + 1).toString();
    this.year = date.getFullYear().toString();
    this.fetchProjects();
  }

  fetchRejectionByDay(day?: number) {
    var date = new Date();    
    if( typeof day === "undefined"){
      date.setDate( date.getDate() + this.currentSelectedDate );
      this.currentSelectedDate--;
    } else {
      date.setDate( date.getDate() + day );
      this.currentSelectedDate = day - 1;
    }
    this.date = date.getDate().toString();
    this.month = (date.getMonth() + 1).toString();
    this.year = date.getFullYear().toString();
    this.fetchRejections();
  }
 

  loadFilteredData(filteredResult: any[]): void{
    this.filteredData = filteredResult;
    this.dataLoaded.emit(this.filteredData);
  }

  toggleFilter(): void {
    if(this.showFilter) {
      this.showFilter = false;
      this.buttonState = 'down';
    } else {
      this.showFilter = true;
      this.buttonState = 'up';
    }      
  }

  logout(){    
    this.loginService.logout();  
  }

}
