import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RejectionService {
  baseURL: string = "https://tii-usa.com/tii-server-6/api/";
  dataChange = new Subject<any>();

  constructor(private http: HttpClient) {}

  fetchRejections(date: string, month: string, year: string) {
    return this.http.get(
      `${this.baseURL}getRejections.php?date=${date}&month=${month}&year=${year}`
    );
  }

  getDataChangeEmitter() {
    return this.dataChange.asObservable();
  }

  emitDataChange() {
    this.dataChange.next();
  }

  changeStatus(id: number, status: string) {
    return this.http.get(
      `${this.baseURL}toggleRejectionStatus.php?id=${id}&status=${status}`
    );
  }

  addNewRejection(data: FormData) {
    return this.http.post(`${this.baseURL}addRejction.php`, data);
  }

  deleteRejection(id: number) {
    return this.http.get(`${this.baseURL}deleteRejection.php?id=${id}`);
  }

  editRejection(editObj: any) {
    return this.http.post(`${this.baseURL}editRejection.php`, editObj);
  }

  getCounts() {
    return this.http.get(`${this.baseURL}getCounts.php`);
  }

  deleteRejectionFile(id) {
    return this.http.get(`${this.baseURL}addRejectionFile.php?id=${id}`);
  }
}
