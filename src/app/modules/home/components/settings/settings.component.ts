import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GResult } from 'src/app/types/result';
import { Area } from 'src/app/types/area';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  root: string = environment.rootUrl + 'Area';
  //areas: Area[] = new Array<Area>();
  
  ngOnInit(): void {
   
  }
  
}
