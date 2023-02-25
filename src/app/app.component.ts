import { Component, ChangeDetectorRef, OnInit, HostListener } from '@angular/core';
import { LoginService } from './service/login.service';
import { isDefined } from '@angular/compiler/src/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'tii-portal-revamp';
  data: any[] = [];
  dataRequest: boolean;
  isLogedIn: boolean;
  wasActive: boolean;
  idleWatchInterval: any;
  isAdmin: boolean;
  refreshSignal: number;

  constructor(private changeDetector: ChangeDetectorRef, private loginService: LoginService){
    const queryString = window.location.search;
    if(queryString.indexOf('rejection=true') > -1){
      window['rejectionMode'] = true;
    }
  }

  ngOnInit(): void {
    
    this.isLogedIn = this.loginService.isLogin();

    this.loginService.getLoginChangeEmitter()
      .subscribe( () => {
        this.init();
        this.isLogedIn = this.loginService.isLogin();   
      })
    this.init();
    this.startIdleWatcher();
  }  

  init(): void {
    this.isAdmin = !this.loginService.isVisitor();
  }

  startIdleWatcher(): void {
    this.idleWatchInterval = setInterval( () => {
      if (isDefined(this.wasActive) && this.isLogedIn && !this.isAdmin) {
        if (!this.wasActive) {          
          this.loginService.logout();
        } else {
          this.wasActive = false;
        }
      }      
    }, 60000);    
  }

  updateCount(number): void {
    this.refreshSignal = number;
  }

  dataReceived(projectData: any[]): void {    
    this.data = projectData;        
    this.changeDetector.detectChanges();
  }

  @HostListener('window:mousemove') refreshUserState() {
    this.wasActive = true;
  }

}
