import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/account/services/auth.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  constructor(private auth: AuthService) { }
  public isManager = this.auth.getPermissionType()==1;
  public isLendersManager = this.auth.getPermissionType()==5;
  public isLender = this.auth.getPermissionType()==2;
  ngOnInit(): void {
  }
 


}
