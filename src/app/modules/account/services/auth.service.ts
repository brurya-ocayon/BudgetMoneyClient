import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginUser } from 'src/app/types/login';
import { GResult } from 'src/app/types/result';
import { User } from 'src/app/types/user';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../infra/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private route: Router, private http: HttpClient, private alert: AlertService) { }
  root: string = environment.rootUrl;
  //isPermissions: boolean = this.getPermissionType() == 1 || this.getPermissionType() == 5;

  public isNotActive() {
    let user = this.getUserFromStorage();
    if (user == null) {
      return false;
    }
    if (user != null && user.isActive) {
      return false;
    }
    if (user != null && !user.isActive) {
      return true;
    }
  }

  getUserFromStorage() {
    let user: User;
    if (sessionStorage["user"] != null) {
      user = JSON.parse(sessionStorage.getItem("user"));
    }
    else if (localStorage["user"] != null) {
      user = JSON.parse(localStorage.getItem("user"));
    }
    if (user == null) {
      return null;
    }
    return user;
  }
  public isAuthenticated(): boolean {
    let user = this.getUserFromStorage();
    if (user != null) {
      const token = user.token.token;
      const helper = new JwtHelperService();
      return !helper.isTokenExpired(token);
    }
    return false;
  }

  public getTokenIfIsValid() {
    let user = this.getUserFromStorage();
    if (user != null) {
      const token = user.token.token;
      const helper = new JwtHelperService();
      return !helper.isTokenExpired(token) ? token : null;
    }
    else {
      return null;
    }
  }


  public getPermissionType() {
    if (this.getTokenIfIsValid() != null) {
      let user = this.getUserFromStorage();
      const permission = user.userType.id;
      return permission;
    }
    return null;
  }


  public isPermission() {
    let per = this.getPermissionType();
    if (per == 1 || per == 5) {
      return true;
    }
    return false;
  }
   public isManager() {
    let per = this.getPermissionType();
    if (per == 1) {
      return true;
    }
    return false;
  }
  public isLender(){
    let lender=this.getPermissionType();
    if(lender==2){
      return true;
    }
    return false;
  }
  public isLendersManager(){
    let LendersManager = this.getPermissionType();
    if(LendersManager==4){
      return true;
    }
    return false;
  }
  public isSimpleUser() {
    let simp = this.getPermissionType();
    if (simp == 3 || simp == 5 || simp == 6) {
      return true;
    }
    return false;
  }
  public useUnderEscort(){
    let useUnderEscort=this.getPermissionType();
    if(useUnderEscort=5){
      return true;
    }
     return false;    
  }
  public getUserId() {
    if (this.getTokenIfIsValid() != null) {
      let user = this.getUserFromStorage();
      if (user != null) {
        const id = user.id;
        return id;
      }

    }
    return null;
  }
  public getUserName() {
    if (this.getTokenIfIsValid() != null) {
      let user = this.getUserFromStorage();
      if (user != null) {
        const name = user.firstName + " " + user.lastName;
        return name;
      }
      return null;
    }
  }


  public logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

  }

  public async signIn(model: LoginUser) {
    this.logout();
    const res = await this.http.post<GResult<User>>(this.root + "Account/SignIn", model).toPromise();

    if (res.success == true) {
      if (model.remember) {
        localStorage.setItem('user', JSON.stringify(res.value));
      }
      else {
        sessionStorage.setItem('user', JSON.stringify(res.value));
      }
      return true;
    }
    else if (res.message == "Error 7777") {
      let user: User = new User();
      user.isActive = false;
      sessionStorage.setItem("user", JSON.stringify(user));
      this.alert.error("משתמש לא פעיל");
      return false;
    }
    else {
      this.alert.error("שם משתמש או סיסמה שגויים");
      return false;
    }

  }

}
