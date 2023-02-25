import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {


  baseURL: string = 'https://tii-usa.com/tii-server-6/api/';

  constructor(private http: HttpClient) { }

  getAllTypes() {
    return this.http.get(`${this.baseURL}getAllTypes.php`);
  }

  addType(type) {
    return this.http.get(`${this.baseURL}addType.php?type=${type}`);
  }

  deleteType(id) {  
    return this.http.get(`${this.baseURL}deleteType.php?id=${id}`);
  }

  getUserTypes(userId) {  
    return this.http.get(`${this.baseURL}getUserTypes.php?id=${userId}`);
  }

}
