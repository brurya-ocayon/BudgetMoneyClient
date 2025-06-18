import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { LoginUser } from 'src/app/types/login';
import { AuthService } from '../../services/auth.service';
import { Console } from 'console';
import { HttpClient } from '@angular/common/http';
import { Debt } from 'src/app/types/debt';
import { environment } from 'src/environments/environment';
import { GResult } from 'src/app/types/result';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  loginUser: LoginUser = new LoginUser();
  debts: Debt[] = new Array<Debt>();
  root: string = environment.rootUrl + 'Debts';
  constructor(private http: HttpClient, private alert: AlertService, private route: Router, private authService: AuthService ) { }

  ngOnInit(): void {
    if (this.authService.isNotActive()) {
      this.alert.error("משתמש לא פעיל");
    }
  }
 
  signIn() {
    this.authService.signIn(this.loginUser).then((res: boolean) => {
      if (res) {
        console.log("1")
        // קריאה לשרת כדי לבדוק את כמות החובות
        this.getDebtsAndShowAlert().then(() => {
          // ניווט לאחר הצגת ההודעה
          this.route.navigate(['/home/move']);
        });
      }
    });
  }
  
  // פונקציה שמבצעת את הקריאה לשרת ומציגה את ההודעה
  getDebtsAndShowAlert(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(this.root + '/GetDebts').subscribe((res: GResult<Debt[]>) => {
        this.debts = res.value;
  
        const debtCount = this.debts.length;
  
      if (debtCount > 0) {
        // הצגת הודעה באמצעות אנימציה
      
        const notification = document.getElementById('debtNotification');
        if (notification) {
          notification.innerText = `יש לך ${debtCount} חובות לתשלום.`;
          notification.classList.add('show'); // מוסיף את המחלקה כדי להציג את האנימציה
          // הסרת המחלקה אחרי כמה שניות כדי להסתיר את ההתראה
          setTimeout(() => {
            notification.classList.remove('show');
            resolve(); // מסמן שהפונקציה הסתיימה
          }, 2000); // מחכה 5 שניות לפני הסתרת ההתראה
        } else {
          resolve(); // מסמן שהפונקציה הסתיימה גם אם לא נמצא האלמנט
        }
      } else {
        resolve(); // אין חובות, ממשיכים
      }
    });
    });
  }
  
}
 // signIn() {
  //   this.authService.signIn(this.loginUser).then((res: boolean) => {
  //     if (res) {
  //       this.route.navigate(['/home/move']);
  //     }
  //     else if (this.authService.isNotActive()) {
  //       window.location.reload();

  //     }
  //   });
  // }
