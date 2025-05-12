import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { ProjectService } from "../service/project.service";
import { LoginService } from "../service/login.service";
import { RejectionService } from "../service/rejection.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit, OnChanges {
  visitor: string = "visitor";
  admin: string = "admin";
  showFilter: boolean;
  buttonState: string;
  date: string = "";
  month: string = "";
  year: string = "";
  originalData: any[] = [];
  filteredData: any[] = [];
  currentSelectedDate: number = 0;
  projectCount: any;
  show: boolean;
  rejectionMode: boolean = false;
  user: string;
  awardData: any[] = [];
  @Input() refreshSignal: number;

  errorCount: number = 0;
  doneCount: number = 0;
  issueCount: number = 0;

  isDataLoading: boolean = false;

  submissionTarget: number = null;
  submissionCount: number = null;

  months = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' }
  ]

  currentYear: string = '';
  allUsers: any[] = [];

  @Output() dataLoaded: EventEmitter<any[]> = new EventEmitter();

  constructor(
    private projectService: ProjectService,
    private loginService: LoginService,
    private rejectionService: RejectionService,
    private cd: ChangeDetectorRef
  ) {
    this.showFilter = false;
    this.buttonState = "down";
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.refreshSignal.currentValue ||
      changes.refreshSignal.currentValue == 0
    ) {
      this.getRejectionCounts();
    }
  }

  ngOnInit() {
    if (window["rejectionMode"]) {
      this.rejectionMode = true;
      this.getRejectionCounts();
    }

    this.show = !this.loginService.isVisitor();

    if(!this.show) {
      this.user = this.loginService.getLoggedInUser();
    }
    
    this.loginService.getUsers().subscribe((data: any[]) => {
      this.allUsers = data
      console.log(data);
    })

    if (this.rejectionMode) {
      this.rejectionService.getDataChangeEmitter().subscribe(() => {
        this.fetchRejections();
      });
    } else {
      this.projectService.getDataChangeEmitter().subscribe(() => {
        this.fetchProjects();
      });
    }

    if (this.user) {
      this.loadPerformanceData(this.user);
    }
  }
  
  userSelected(event) {
    this.user = event.target.value;
    this.loadPerformanceData(this.user);
  }

  loadPerformanceData(user) {
    const date = new Date();    
    this.projectService.getSubmissionTarget(user, date.getMonth() + 1, date.getFullYear()).subscribe((data: any[]) => {
      if (data && data.length == 1 && data[0].count && data[0].target) {
        this.submissionTarget = parseInt(data[0].target);
        this.submissionCount = parseInt(data[0].count);
        this.cd.detectChanges();
      } else {
        this.submissionTarget = null;
        this.submissionCount = null
      }
    })
    
    this.currentYear = String(new Date().getFullYear())

    this.projectService.getAwardCounts(user, this.currentYear).subscribe((data: any[]) => {
      this.awardData = data;
      this.cd.detectChanges();
    })
  }

  getMonthName(id: number) {
    return this.months.find( month => month.id == id ).name;
  }

  

  getRejectionCounts() {
    this.rejectionService.getCounts().subscribe((resp: any[]) => {
      console.log("resp", resp);
      resp.forEach((d) => {
        if (d.status == "error") {
          this.errorCount = d.count;
        } else if (d.status == "verified") {
          this.issueCount = d.count;
        } else if (d.status == "done") {
          this.doneCount = d.count;
        }
      });
      this.cd.detectChanges();
    });
  }

  fetchRejections(): void {
    if (this.year === "" || this.year === null) {
      this.year = new Date().getFullYear().toString();
    }
    if (this.month === "" || this.month === null) {
      //this.month = ((new Date()).getMonth() + 1).toString();
    }
    if (this.date != "" || this.month != "" || this.year != "") {
      this.isDataLoading = true;
      this.rejectionService
        .fetchRejections(this.date, this.month, this.year)
        .subscribe(
          (data: any[]) => {
            this.isDataLoading = false;
            this.originalData = data;
          },
          (error) => {
            console.error(error);
          }
        );
    }
    this.getRejectionCounts();
  }

  fetchProjects(): void {
    if (this.year === "" || this.year === null) {
      this.year = new Date().getFullYear().toString();
    }
    if (this.month === "" || this.month === null) {
      // this.month = ((new Date()).getMonth() + 1).toString();
    }
    if (this.date != "" || this.month != "" || this.year != "") {
      this.isDataLoading = true;
      this.projectService
        .fetchProjects(this.date, this.month, this.year)
        .subscribe(
          (data: any[]) => {
            data = this.projectService.sortProjectsByTime(data);
            this.isDataLoading = false;
            this.originalData = data;
            this.fetchTotalProjects();
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  fetchTotalProjects(): void {
    let code = (<any>document.querySelector('input[placeholder="Operator"]'))
      .value;
    code = code ? code : "";
    this.date = this.date ? this.date : "";
    let dataObj = new FormData();
    dataObj.append("code", code);
    dataObj.append("year", this.year);
    dataObj.append("month", this.month);
    dataObj.append("date", this.date);
    this.projectService.fetchTotalProjects(dataObj).subscribe(
      (totalProjects) => {
        const operators = Object.keys(totalProjects);
        let projects: any[];
        for (let operator in operators) {
          const code = operators[operator];
          projects = this.originalData.filter((r) => r.code === code);
          totalProjects[code + "Found"] = projects.length;
        }
        this.projectCount = totalProjects;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchDataByDay(day?: number) {
    var date = new Date();
    if (typeof day === "undefined") {
      date.setDate(date.getDate() + this.currentSelectedDate);
      this.currentSelectedDate++;
    } else {
      date.setDate(date.getDate() + day);
      this.currentSelectedDate = day + 1;
    }
    this.date = date.getDate().toString();
    this.month = (date.getMonth() + 1).toString();
    this.year = date.getFullYear().toString();
    this.fetchProjects();
  }

  fetchRejectionByDay(day?: number) {
    var date = new Date();
    if (typeof day === "undefined") {
      date.setDate(date.getDate() + this.currentSelectedDate);
      this.currentSelectedDate--;
    } else {
      date.setDate(date.getDate() + day);
      this.currentSelectedDate = day - 1;
    }
    this.date = date.getDate().toString();
    this.month = (date.getMonth() + 1).toString();
    this.year = date.getFullYear().toString();
    this.fetchRejections();
  }

  loadFilteredData(filteredResult: any[]): void {
    this.filteredData = filteredResult;
    this.dataLoaded.emit(this.filteredData);
  }

  toggleFilter(): void {
    if (this.showFilter) {
      this.showFilter = false;
      this.buttonState = "down";
    } else {
      this.showFilter = true;
      this.buttonState = "up";
    }
  }

  logout() {
    this.loginService.logout();
  }
  
}
