import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/types/filters';
import { GResult } from 'src/app/types/result';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http:HttpClient) { }
  root: string = environment.rootUrl;

  filters: Filters = new Filters();

  ngOnInit(): void {
    this.http.get(this.root + 'Movings/GetFilters').subscribe((res:GResult<Filters>) => {
      this.filters = res.value;
    });
   
   
  }
}
