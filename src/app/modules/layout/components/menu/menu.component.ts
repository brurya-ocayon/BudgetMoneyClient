import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/account/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  constructor(private auth: AuthService) { }
 public isManager = this.auth.getPermissionType()==1;
  ngOnInit(): void {
  }

}
