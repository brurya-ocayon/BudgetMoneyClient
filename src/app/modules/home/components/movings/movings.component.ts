import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { FileService, FileType } from 'src/app/modules/infra/services/file.service';
import { Filters } from 'src/app/types/filters';
import { Moving } from 'src/app/types/moving';
import { GResult, Result } from 'src/app/types/result';
import { Search } from 'src/app/types/search';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movings',
  templateUrl: './movings.component.html',
  styleUrls: ['./movings.component.css']
})
export class MovingsComponent implements OnInit {
  @Input() type: number;
  @Input() filters: Filters = new Filters();

  movings: Moving[] = new Array<Moving>();
  newMove: Moving = new Moving();
  root: string = environment.rootUrl;
  search: Search = new Search();
  title: string = "הכנסות והוצאות";
  showAllUsers: boolean = false;

  constructor(private http: HttpClient, private alert: AlertService ,private PDFfile : FileService) { }

  ngOnInit(): void {
    this.newMove.userArea.type = 1;
    this.search.type = 1;
    var date = new Date();
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let lastDay = new Date(year, month + 1, 0).getDate();
    this.search.from = new Date(year, month, 1, 16, 0, 0);
    this.search.to = new Date(year, month, lastDay, 16, 0, 0);

    this.getMovings();


  }
  getMovings() {
    this.search.type = this.type;
    this.http.post(this.root + "Movings/GetMovings", this.search).subscribe((res: GResult<Moving[]>) => {
      this.movings = res.value;
    });
  
  }

  editMove(m: Moving) {
    m.inEdit = true;
  }

  save(m: Moving) {
    this.http.put(this.root + 'Movings/UpdateMove', m).subscribe((res: Result) => {
      if (!res.success) {
        this.alert.confirm("קיימת תנועה באותו תאריך עם אותו סכום האם להוסיף שוב?").then((result) => {
          if (result.isConfirmed == true) {
            m.duplicate = true;
            return this.save(m);
          }
        });
      }
      else {
        this.alert.success("התנועה עודכנה בצלחה!");
        this.getMovings();
      }
    });
    m.inEdit = false;
  }

  cancel(item: Moving) {
    item.inEdit = false;
    this.getMovings();

  }
  isError(move: Moving) {
    if (move.date == null) {
      return true;
    }
    if (move.userArea == null) {
      return true;
    }
    if (move.payOption == null) {
      return true;
    }
    if (move.sum == null) {
      return true;
    }
    return false;
  }
  addMove() {
    this.http.post(this.root + 'Movings/AddMove', this.newMove).subscribe((res: Result) => {
      if (!res.success) {
        this.alert.confirm("קיימת תנועה באותו תאריך עם אותו סכום האם להוסיף שוב?").then((result) => {
          if (result.isConfirmed == true) {
            this.newMove.duplicate = true;
            return this.addMove();
          }
          else {
            this.newMove = new Moving();
            this.getMovings();
          }
        });

      }
      else {
        this.alert.success("התנועה נוספה בצלחה!");
        this.newMove = new Moving();
        this.getMovings();
      }


    });
  }

  deleteMove(id: number) {
    this.alert.remove("האם אתה בטוח רוצה למחוק את התנועה?").then((result) => {
      if (result.isConfirmed == true) {
        this.http.delete(this.root + 'Movings/DeleteMove/' + id).subscribe((res: Result) => {
          if (res.success) {
            this.alert.success("התנועה נמחקה בהצלחה!");
          }
          else {
            this.alert.error("ארעה שגיאה במהלך מחיקת התנועה...");
          }
          this.getMovings();
        });
      }
    });
  }
  clear() {
    this.search = new Search();
    this.search.type = 0;
    var date = new Date();
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let lastDay = new Date(year, month + 1, 0).getDate();
    this.search.from = new Date(year, month, 1, 16, 0, 0);
    this.search.to = new Date(year, month, lastDay, 16, 0, 0);
    this.getMovings();
    
  }
  downloadMovingsPDF() {
  const userId = 1; // יש להכניס את מזהה המשתמש הנוכחי
  this.http.get(this.root + 'pdf/DownloadMovingsPDF/' + userId, { responseType: 'blob' })

    .subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MovingsReport.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    });
}

  downloadPDF() {
      this.PDFfile.downlaodFile(
      this.http,
      this.root + "pdf" ,
      this.showAllUsers,
      FileType.pdf
    );
  }
  // downloadPDF() {
  //   const url = `${this.root}api/pdf?showAllUsers=${this.showAllUsers}`;
  //   this.http.post(url, {}, { responseType: 'blob' }).subscribe((blob) => {
  //     const a = document.createElement('a');
  //     const objectUrl = URL.createObjectURL(blob);
  //     a.href = objectUrl;
  //     a.download = 'movings.pdf';
  //     a.click();
  //     URL.revokeObjectURL(objectUrl);
  //   }, error => {
  //     this.alert.error("שגיאה בהורדת הקובץ");
  //   });
  // }
  
  
  
}

