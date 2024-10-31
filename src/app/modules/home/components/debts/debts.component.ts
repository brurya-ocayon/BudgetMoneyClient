import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { Debt } from 'src/app/types/debt';
import { IdName } from 'src/app/types/id-name';
import { GResult, Result } from 'src/app/types/result';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css']
})
export class DebtsComponent implements OnInit {
  urgencyies: IdName[] = new Array<IdName>();
  debts: Debt[] = new Array<Debt>();
  root: string = environment.rootUrl + 'Debts';
  addMode: boolean = false;
  newDebt: Debt = new Debt();
  constructor(private http: HttpClient, private alert: AlertService) { }

  ngOnInit(): void {
    this.getDebts();
    this.getUrgencyies();
  }

  getDebts() {
    this.http.get(this.root + '/GetDebts').subscribe((res: GResult<Debt[]>) => {
      this.debts = res.value;
    });
  }

  changeMode() {
    this.addMode = !this.addMode;
    this.newDebt = new Debt();
  }

  getUrgencyies() {
    this.http.get(this.root + '/GetUrgencyies').subscribe((res: GResult<IdName[]>) => {
      this.urgencyies = res.value;
    })
  }

  addDebt() {
    this.http.post(this.root + '/AddDebt', this.newDebt).subscribe((res: Result) => {
      this.alert.success("החוב נוסף בהצלחה!")
      this.newDebt = new Debt();
      this.addMode = false;
      this.getDebts();
    });
  }

  deleteDebt(id: number) {
    this.alert.remove("האם אתה בטוח שאתה רוצה למחוק?").then((Result) => {
      if (Result.isConfirmed == true) {
        this.http.delete(this.root + '/DeleteDebt/' + id).subscribe((res: Result) => {
          if(res.success)
          {
            this.alert.success("החוב נמחק בהצלחה!");
          }
          else
          {
            this.alert.info("לא קיים חוב כזה, כנראה כבר נמחק")
          }
          this.getDebts();
        });
      }
    });
  }
  
  editDebt(debt:Debt)
  {
    debt.inEdit=true;
  }

  save(debt:Debt)
  {
    debt.inEdit=false;
    this.http.put(this.root + '/UpdateDebt', debt).subscribe((res:Result)=>{
      if(res.success)
      {
        this.alert.success("החוב עודכן בהצלחה!")
      }
      else
      {
        this.alert.error("העדכון נכשל!")
      }
      this.getDebts();
    });
  }

  cancel(debt:Debt)
  {
    debt.inEdit=false;
    this.getDebts();
  }

}
