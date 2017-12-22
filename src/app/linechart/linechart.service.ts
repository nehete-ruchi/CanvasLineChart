import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { TimeInterval, Linechart } from './linechart';

const API_URL = "http://localhost/PetrolinkWebAPI/api/linechart";


@Injectable()
export class LinechartService {

  constructor(private http: HttpClient) { }

  public getInitialData(timeInterval: TimeInterval)
  {
    return this.http.post<Array<Linechart>>(API_URL + '/initialData', timeInterval);
  }

}
