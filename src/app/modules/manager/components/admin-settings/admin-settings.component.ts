import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { IdName } from 'src/app/types/id-name';
import { Lists } from 'src/app/types/lists';
import { GResult } from 'src/app/types/result';
import { TableCode } from 'src/app/types/table-code';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  userTypeCode: TableCode = TableCode.userTypes;
  citiesCode: TableCode = TableCode.cities;
  urgencyDebtCode: TableCode = TableCode.urgencyDebt;
  areaCode: TableCode = TableCode.areas;
  lists: Lists = new Lists();
  root: string = environment.rootUrl + 'List';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.root + '/GetAllLists').subscribe((res: GResult<Lists>) => {
      this.lists = res.value;
    });
  }

}
