import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { InfraModule } from '../infra/infra.module';
import { IndexComponent } from './components/index/index.component';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, ForgotPassComponent, IndexComponent, RegisterComponent],
  imports: [
    CommonModule,
    InfraModule,    
    RouterModule.forChild([
      { path: '', component: IndexComponent ,children:[
        { path: 'register', component: RegisterComponent },
        { path: 'register/:id', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: 'forgot', component: ForgotPassComponent },
      ]},
     
     

    ])
  ]
})
export class AccountModule { }
