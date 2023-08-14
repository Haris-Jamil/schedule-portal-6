import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseURL: string = 'https://tii-usa.com/tii-server-6/api/';
  dailyBidsUrl: string = 'https://tii-usa.com/dailybids6/services/';
  chartApi: string = 'https://tii-usa.com/bidscheduler/getChartData.php';
  chartApiWins: string = 'https://tii-usa.com/bidscheduler/getChartDataWins.php';
  dataChange = new Subject<any>();

  constructor(private http: HttpClient) { }

  getChartData(data, wins = false) {
    return this.http.post(`${ wins ? this.chartApiWins : this.chartApi}`, data);
  }

  fetchProjects(date: string, month: string, year: string){
    return this.http.get(`${this.baseURL}getProjects.php?date=${date}&month=${month}&year=${year}`);
  }

  getDataChangeEmitter(){
    return this.dataChange.asObservable();
  }

  emitDataChange(){
    this.dataChange.next();
  }

  toggleStatus(id: number, status: string){
    return this.http.get(`${this.baseURL}toggleStatus.php?id=${id}&status=${status}`);      
  }

  addNewProject(data: FormData){
    return this.http.post(`${this.baseURL}addProject.php`, data);
  }

  deleteProject(id: number){
    return this.http.get(`${this.baseURL}deleteProject.php?id=${id}`);
  }

  copyProject(id: number){
    return this.http.get(`${this.baseURL}copyProject.php?id=${id}`);
  }

  editProject(editObj: any){
    return this.http.post(`${this.baseURL}editProject.php`, editObj );    
  }

  fetchTotalProjects(data: any){
    return this.http.post(`${this.dailyBidsUrl}getTotalProject.php`, data);
  }   

  updateFile(data: any){
    return this.http.post(`${this.baseURL}updateFile.php`, data);
  }
}
