import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { IdName } from 'src/app/types/id-name';
import { GResult, Result } from 'src/app/types/result';
import { Area } from 'src/app/types/area';
import { environment } from 'src/environments/environment';
import { SortArrIsActivePipe } from '../../pipes/sort-arr-is-exist.pipe';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  root: string = environment.rootUrl + 'Area';
  areas: Area[];
  areasGlobal: IdName[];
  @Input() type: number;
  title: string;
  newArea: Area = new Area();
  addMode: boolean = false;
  anouther: boolean = true;
  indexOn: boolean = false;
  descriptionForSelect: IdName = new IdName();
  constructor(private http: HttpClient, private alert: AlertService) { }

  ngOnInit(): void {
    this.getAreaList();
    this.getAreas();
    if (this.type == 1) {
      this.title = "תחומי הכנסות";
    }
    else {
      this.title = "תחומי הוצאות";
    }
  }

  getAreas() {
    this.http.get(this.root + '/GetAreas/' + this.type).subscribe((res: GResult<Area[]>) => {//(type) זמני - עד שנסדר בשרת - צריך לשלוח לשרת סוג 
      this.areas = res.value;
    });
  }

  getAreaList() {
    this.http.get(this.root + '/GetAreaList/' + this.type).subscribe((res: GResult<IdName[]>) => {
      this.areasGlobal = res.value;
    });
  }

  addArea() {
    this.newArea.type = this.type;
    this.newArea.isActive = true;
    this.newArea.indexOn = this.indexOn;

    this.http.post(this.root + '/AddArea', this.newArea).subscribe((res: Result) => {
      if (res.success) {
        this.alert.success("תחום נוסף בהצלחה!")
        this.addMode = false;

      }
      else {
        this.alert.error("קיים כזה תחום במערכת...")
      }
      this.getAreas();
    });
  }

  changeMode() {
    this.addMode = !this.addMode;
    this.newArea = new Area();
    this.descriptionForSelect = new IdName();
  }

  save(sub: Area) {
    sub.type = this.type;
    sub.inEdit = false;
    sub.indexOn = this.indexOn;
    this.http.put(this.root + '/UpdateArea', sub).subscribe((res: Result) => {
      if (res.success) {
        this.alert.success("תחום עודכן בהצלחה!")
        sub.inEdit = false;
      }
      else {
        this.alert.error("קיים כזה תחום במערכת...")
        sub.inEdit = true
      }
      this.getAreas();
    });
  }

  checkIfIsAnother(event, i: Area) {
    if (event == 0) {
      i.description = "";
      // console.log(i);
    }
  }

  editArea(sub: Area) {
    this.areas.forEach(item => {
      if (item.id == sub.id) {
        item.inEdit = true;
      }
      else {
        item.inEdit = false;
      }
    });
  }

  deleteArea(id: number) {
    this.alert.remove("האם אתה בטוח שאתה רוצה למחוק?").then((result) => {
      if (result.isConfirmed == true) {
        this.http.delete(this.root + '/DeleteArea/' + id).subscribe((res: Result) => {
          if (res.success) {
            this.alert.success("תחום נמחק בהצלחה!");
          }
          else {
            this.alert.info("התחום מקושר לתנועה ולכן התנועה הפכה למצב לא פעיל");
          }
          this.getAreas();
        });
      }
    });
  }

  cancel(item: Area) {
    item.inEdit = false;
    this.getAreas();
  }
}
