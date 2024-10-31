import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/modules/infra/services/alert.service';
import { GResult, Result } from 'src/app/types/result';
import { User } from 'src/app/types/user';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { IdName, IdNameDB } from 'src/app/types/id-name';
import { TableCode } from 'src/app/types/table-code';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  root: string = environment.rootUrl;
  user: User = new User();
  title: string;
  id: number;
  isManager: boolean = this.auth.isManager();
  isPermission: boolean = this.auth.isPermission();
  isLender: boolean = this.auth.isLender();
  isLendersManager: boolean = this.auth.isLendersManager();
  userTypes: IdName[] = new Array<IdName>();
  lenders: IdName[] = new Array<IdName>();
  managers: IdName[] = new Array<IdName>();
  currentUser: User = this.auth.getUserFromStorage();
  constructor(private http: HttpClient, private activeRoute: ActivatedRoute, private alert: AlertService, private route: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.init();
    if (this.isPermission) {
      this.getUserTypes();
      this.getLenders();
      this.getManagers();
    }
  }
  init() {

    this.activeRoute.params.subscribe(myParams => {
      this.id = myParams["id"];
      if (this.id > 0) {
        this.title = "עריכת משתמש";
        this.getUser();

      }
      else {

        this.title = " רישום משתמש חדש";
        this.user = new User();

        if (this.isLender) {
          this.user.userType.id = 6;
          this.user.lender.id = this.currentUser.id;
        }
        else if (this.isLendersManager) {
          this.user.userType.id = 2;
          this.user.manager.id = this.currentUser.id;

        }
        else if (this.isManager) {
          this.user.userType.id = 0;
        }
        else {
          this.user.userType.id = 3;
        }


      }
    })

  }
  getUser() {
    this.http.get(this.root + "Users/GetUser/" + this.id).subscribe((res: GResult<User>) => {
      if (res.success) {
        this.user = res.value;
      }
      else {
        this.alert.error("ארעה שגיאה במהלך טעינת המשתמש...");
      }
    });
  }

  addUser() {
   // debugger
    this.user.isActive = true;
    
    this.http.post(this.root + 'Users/AddUser', this.user).subscribe((res: Result) => {
      if (res.success) {
        if (this.isPermission) {
          this.alert.success("המשתמש נוסף בהצלחה");
          this.route.navigate(['/manager/users']);
        }
       else if(this.isLender)
        {
          this.alert.success("המשתמש נוסף בהצלחה");
          this.route.navigate(['/home/move'])
        }
        else {
          this.alert.success("נרשמת בהצלחה! הנך מועבר לדף הכניסה למערכת...");
          this.route.navigate(['/account/login']);
        }
      }
      else {
        this.alert.error("קיים משתמש עם כזה דואר אלקטרוני, יש להכניס כתובת אחרת");
      }
    });
  }

  updateUser() {
    this.http.put(this.root + 'Users/UpdateUser', this.user).subscribe((res: Result) => {
      if (res.success) {
        if (this.isPermission||this.isLender) {
          if (this.user.userType.id != this.currentUser.userType.id) {

            this.alert.success("המשתמש עודכן בהצלחה");
             this.route.navigate(['/manager/users']);
          } 
          else{
            this.alert.success("הפרטים עודכנו בהצלחה!");
            this.route.navigate(['/home/move']);
          }
         
        }
        else {
          this.alert.success("הפרטים עודכנו בהצלחה!");
          this.route.navigate(['/home/move']);
        }

        // else {
        //   this.alert.error("קיים משתמש עם כזה דואר אלקטרוני, יש להכניס כתובת אחרת");
        // }
      }
    });
  }

  save() {

    if (this.user.id > 0) {
      this.updateUser();
    }
    else {
      this.addUser();
    }
  }

  cancel() {
    if (this.isPermission||this.isLender) {
      this.route.navigate(['/manager/users']);
    }
    else {
      this.init();
    }
  }
  getUserTypes() {
    this.http.get(this.root + "Users/GetUserTypes").subscribe((res: GResult<IdName[]>) => {
      this.userTypes = res.value;
    });
  }
  getLenders() {
    let item =new IdNameDB();
    item.tableCode=TableCode.users;
    item.type=2;
    this.http.post(this.root + "List/GetList" , item).subscribe((res: GResult<IdName[]>) => {
      this.lenders = res.value;
    });
  }
  getManagers() {
    let item =new IdNameDB();
    item.tableCode=TableCode.users;
    item.type=5;
    this.http.post(this.root + "List/GetList" , item).subscribe((res: GResult<IdName[]>) => {
      this.managers = res.value;
    });
  }
  changeUserType(userType) {
    this.user.userType.name = this.userTypes.find(x => x.id == userType).name;
    if (userType != 6) {
      this.user.lender = new IdName();
      this.user.lender.id=0;
    } 
    if (userType != 2) {
      this.user.manager = new IdName();
      this.user.manager.id=0;
    }
  }
  changeLender(lender) {
    this.user.lender.name = this.lenders.find(x => x.id == lender).name;

  }
  changeManager(manager){
   this.user.manager.name = this.managers.find(x => x.id == manager).name; 
  }

}
