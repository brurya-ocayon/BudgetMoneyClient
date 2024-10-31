import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/account/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsManagerGuard implements CanActivate {
  constructor(private route:Router, private authService:AuthService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.getPermissionType()==1||this.authService.getPermissionType()==5||this.authService.getPermissionType()==2){
        return true;
      }
     
      else{
        this.route.navigate(['account/login']);
        return false;
      }
   
  }
}
