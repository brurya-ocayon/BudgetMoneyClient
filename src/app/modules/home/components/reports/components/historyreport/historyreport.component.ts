import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { GResult } from 'src/app/types/result';
import { environment } from 'src/environments/environment';
import { History } from 'src/app/types/history';


@Component({
  selector: 'app-historyreport',
  templateUrl: './historyreport.component.html',
  styleUrls: ['./historyreport.component.css']
})
export class HistoryreportComponent implements OnInit {
 
  histories: History[] = new Array<History>();
  root: string = environment.rootUrl + 'Repots';
 
  
 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
   
    this.getHistory();
  }


  getHistory() {
    this.http.get(this.root + '/GetHistory').subscribe((res: GResult<History[]>) => {
      this.histories = res.value;

    });
  }
}
