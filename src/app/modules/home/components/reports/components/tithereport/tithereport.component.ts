import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { GResult } from 'src/app/types/result';
import { environment } from 'src/environments/environment';
import { Tithe } from 'src/app/types/tithe';


@Component({
  selector: 'app-tithereport',
  templateUrl: './tithereport.component.html',
  styleUrls: ['./tithereport.component.css']
})
export class TithereportComponent implements OnInit {
  tithes: Tithe[] = new Array<Tithe>();
  root: string = environment.rootUrl + 'Repots';
 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getTithes();
  }

  getTithes() {
    this.http.get(this.root + '/GetTithes').subscribe((res: GResult<Tithe[]>) => {
      this.tithes = res.value;

    });
  }

}

  