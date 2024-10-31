import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { RouterModule } from '@angular/router';
import { IsManagerGuard } from '../infra/services/is-manager.guard';
import { BoolConvertPipe } from './pipes/bool-convert.pipe';
import { UserTypePipe } from './pipes/user-type.pipe';
import { InfraModule } from '../infra/infra.module';
import { SortActiveUserPipe } from './pipes/sort-active-user.pipe';

import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { SortArrPipeManager } from './pipes/sort-arrMennager.pipe';
import { IsPermissionGuard } from '../infra/services/is-permission.guard';


@NgModule({
  declarations: [ UsersComponent, BoolConvertPipe, UserTypePipe, SortActiveUserPipe,SortArrPipeManager, AdminSettingsComponent],
  imports: [
    CommonModule,
    InfraModule.forRoot(),
    RouterModule.forChild([
      {path : 'users',component:UsersComponent,canActivate:[IsPermissionGuard]},
      {path : 'settings',component:AdminSettingsComponent,canActivate:[IsManagerGuard]},
    ])
  ]
})
export class ManagerModule { }
