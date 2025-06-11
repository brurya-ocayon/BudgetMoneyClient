import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { Doc } from 'src/app/types/doc';
import { Presence } from 'src/app/types/presence';
import { GResult,Result } from 'src/app/types/result';
import { environment } from 'src/environments/environment';
import { IdName } from 'src/app/types/id-name';
import { User } from 'src/app/types/user';
import { UserService } from 'src/app/modules/infra/services/user.service';
import { AuthService } from 'src/app/modules/account/services/auth.service';


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  constructor(private http: HttpClient ,private alert:AlertService,private userService: UserService ,private authService: AuthService ) { 
    this.alert=alert
  }
  isManager: boolean = false; // משתנה לבדיקה אם המשתמש מנהל

  root: string = environment.rootUrl;
  docList: Doc[] = new Array<Doc>();
  users: User[];


  startDoc:string;
  
  userId: number | null = null; // משתנה לאחסון ה-ID
  // ngOnInit(): void {
  //   this.isManager = this.authService.isManager(); 
  //   this.userService.currentUserId.subscribe(id => {
  //     if (id !== null) {
  //       this.userId = id;
  //       this.getDocuments(id);
  //       console.log('User ID:', this.userId);
  //     } else {

  //       this.getDocuments(); // שליפת המסמכים של המנהל
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.isManager = this.authService.isManager();
    
    this.userService.currentUserId.subscribe(id => {
      if (id !== null) {
        // אם זה מנהל שנכנס ללקוח
        this.userId = id;
        console.log("משתמש מנהל רואה לקוח, userId =", this.userId);
      } else {
        // אם זה משתמש רגיל, נשלוף את ה-ID מהטוקן
        this.userId = this.authService.getUserId();
        console.log("משתמש רגיל, userId =", this.userId);
      }
      
      // נוודא שלא שולחים undefined בטעות
      if (this.userId !== null && this.userId !== undefined) {
        this.getDocuments(this.userId);
      }
    });
  }
  

  //26/1
  getDocuments(userId?: number) {
    const url = this.root + "Document/GetDocuments" + (userId ? `?userId=${userId}` : '');
    this.http.get<GResult<Doc[]>>(url).subscribe(res => {
        this.docList = res.value;
        this.docList.forEach(doc => {
            doc.src = this.root + doc.src;
        });
    });
}

// addDocument(formData: FormData) {
//     this.http.post<Result>(this.root + 'Document/AddDocument', formData).subscribe(res => {
//         if (res.success) {
//             this.alert.success('המסמך נוסף בהצלחה');
//             this.getDocuments();
//         } else {
//             this.alert.error('התרחשה שגיאה בהוספת המסמך');
//         }
//     });
// }


  // getDocuments(userId?:number){
  //   let url= this.root + "Document/GetDocuments";
  //   if(userId){
  //     url += `?userId=${userId}`
  //   }
  //   this.http.get(url).subscribe((res: GResult<Doc[]>) => {
  //     this.docList = res.value;
  //     this.docList.forEach(element => {
  //       element.src = this.root + element.src;
  //     });
  //   });
  // }
  
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
          this.getDocuments(this.userId);
        });
      }
    });
 
  }
 
  editDocument(d: Doc){
    
    // if()
      d.inEdit = true;
    }
     addDocument(obj:FormData){
      this.getDocuments()
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
        this.getDocuments(this.userId)  
       })
    }
    cancel(d: Doc){
       d.inEdit=false;
       this.getDocuments(this.userId);
      
    }
  }


