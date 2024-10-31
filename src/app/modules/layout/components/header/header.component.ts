import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/account/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthService, private route: Router) { }
  @Input() refreash;
  isAthenticate: boolean = this.auth.isAuthenticated();
  name: string;
  id: number;
  public isNotActive: boolean = this.auth.isNotActive();
  isSimpleUser: boolean = this.auth.isSimpleUser();
  ngOnInit(): void {
    if (this.auth.getUserName() != null) {
      this.name = this.auth.getUserName();
    }
    if (this.auth.getUserId() != null) {
      this.id = Number(this.auth.getUserId());
    }
  }
  logOut() {
    this.auth.logout();
    this.isNotActive = false;
    this.route.navigate(['/account/login']);
    this.isAthenticate=false;
    
  }
}
