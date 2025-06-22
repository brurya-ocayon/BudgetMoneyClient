import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/account/services/auth.service';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { UserService } from 'src/app/modules/infra/services/user.service';
import { Doc } from 'src/app/types/doc';
import { IdName, IdNameDB } from 'src/app/types/id-name';
import { LenderParams } from 'src/app/types/lender-params';
import { GResult, Result } from 'src/app/types/result';
import { TableCode } from 'src/app/types/table-code';
import { User } from 'src/app/types/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  docList: Doc[] = new Array<Doc>();
  users: User[];
  userToDelete: User=new User();;
  propToSort: string = "";
  showAllUsers: boolean = false;
  root: string = environment.rootUrl;
  okRemove: boolean = false;
  changeLender: boolean = false;
  changeOption: number = 1;
  lenderParams: LenderParams =new LenderParams();;
  lenders: IdName[] = new Array<IdName>();
  constructor(private http: HttpClient, private alert: AlertService, private route: Router,private authService: AuthService,private userService: UserService,) { }

  ngOnInit(): void {
    this.getUsers();
    this.getLenders();
  }

  getUsers() {
    this.http.get(this.root + 'Users/GetUsers').subscribe((res: GResult<User[]>) => {
      this.users = res.value;
    });
  }

  addOrUpdateUser(id: number) {
    this.route.navigate(['account/register', id]);
  }

  deleteUser(user: User) {
    let typeRemove;
    let msg;
    if (this.users.find(x => x.id == user.id).userType.id == 2) {
      typeRemove = this.alert.removeLender;
      msg = "מלווה";
    }
    else {
      typeRemove = this.alert.remove;
      msg = "משתמש";
    }
    typeRemove(msg).then((result) => {
      if (result.isConfirmed) {
        if (msg == "מלווה") {
          this.okRemove = true;
          this.userToDelete = user;
         // this.newLender=new User();

          // this.lenderToDelete.id = id;
        }
        else {
          this.finalDelete(user)

        }
      }
    });
  }
  
  okChangeLender() {
    if (this.changeOption == 1) {
      this.finalDelete(this.userToDelete);
    }
    else {
      if (this.changeOption == 2) {
        this.lenderParams.oldLender = this.userToDelete.id;
        this.lenderParams.userType = 3;
        this.changeUserTypeOrLenderAndDelete(this.lenderParams);
      } 
      else{ 
      
      if (this.changeOption == 3) {
        this.changeLender = true;
        this.lenderParams.oldLender = this.userToDelete.id;
       // this.lenderParams.newLender = this.newLender.id;
        this.lenderParams.userType = 6;
        this.changeUserTypeOrLenderAndDelete(this.lenderParams);
      }
    }
    }

   
 
  }
  finalDelete(user: User) {
    this.http.delete(this.root + 'Users/DeleteUser/' + user.id).subscribe((res: Result) => {
      if (res.success) {
        this.alert.success("המשתמש הפך למצב לא פעיל!");
        this.getUsers();
      }
      else {
        this.alert.error("ארעה שגיאה במהלך המחיקה...");
      }
    }
    )
    this.clear();
  }
  clear()
  {
    this.okRemove = false;
    this.userToDelete = new User();
  }
  changeUserTypeOrLenderAndDelete(lenderParams: LenderParams) {
    this.http.put(this.root + "Users/ChangeUserTypeOrLenderAndDelete", lenderParams).subscribe((res: Result) => {
      if (res.success) {

        this.alert.success("המשתמש נמחק , הפרטים עודכנו בהצלחה!!");
        this.route.navigate(['/manager/users']);
        this.getUsers();
      }
    });
    this.clear();
  }
  getLenders() {
    let item =new IdNameDB();
    item.tableCode=TableCode.users;
    item.type=2;
    this.http.post(this.root + "List/GetList" , item).subscribe((res: GResult<IdName[]>) => {
      this.lenders = res.value;
    });
  }

  // document(id: number): void {
  //   this.userService.setUserId(id); // שמירת ה-ID בשירות
  //   this.route.navigate(['home/document', id]); // ניווט ללא ה-ID ב-URL
  // }
  document(id: number): void {
    this.userService.setUserId(id); // שמירת ה-ID בשירות
    this.route.navigate(['home/document']); // ניווט ללא ID בכתובת ה-URL
  }
  
 
  }

  
  
  
 