import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { Doc } from 'src/app/types/doc';
import { Presence } from 'src/app/types/presence';
import { GResult,Result } from 'src/app/types/result';
import { environment } from 'src/environments/environment';
import { IdName } from 'src/app/types/id-name';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  constructor(private http: HttpClient ,private alert:AlertService) { 
    this.alert=alert
  }
  root: string = environment.rootUrl;
  docList: Doc[] = new Array<Doc>();
  startDoc:string;
  

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(){
    this.http.get(this.root + "Document/GetDocuments").subscribe((res: GResult<Doc[]>) => {
      this.docList = res.value;
      this.docList.forEach(element => {
        element.src = this.root + element.src;
      });
    });
  }
  deleteDocument(id:number){
    this.alert.remove("האם אתה בטוח שאתה רוצה למחוק?").then((result) => {
      if (result.isConfirmed == true) {
        this.http.delete(this.root + 'Document/DeleteDocument/' + id).subscribe((res: Result) => {
          if (res.success) {
            this.alert.success("תחום נמחק בהצלחה!");
          }
          // else {
          //   this.alert.info("התחום מקושר לתנועה ולכן התנועה הפכה למצב לא פעיל");
          // }
          this.getDocuments();
        });
      }
    });
  }
  addDocument(obj:FormData){
    this.getDocuments()
  }
  editDocument(d: Doc){
      d.inEdit = true;
    }
    save(d: Doc){
       d.inEdit=false;
       const idName: IdName = { id: d.id, name: d.description,inEdit:d.inEdit };
       this.http.put(this.root+'Document/UpdateDocument', idName).subscribe((res:Result)=>{
         if(res.success){
          this.alert.success(" עודכן בהצלחה !");
         }
         else{
          this.alert.error(" ארעה שגיאה במהלך העדכון");
         }
        this.getDocuments()  
       })
    }
    cancel(d: Doc){
       d.inEdit=false;
       this.getDocuments();
      
    }
  }


