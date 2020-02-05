import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {IndexComponent} from './components/index/index.component';
import {NavbarComponent} from './components/navbar/navbar.component';

export const componentsArray = [
    LoginComponent,
    IndexComponent,
    NavbarComponent
]

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'login',component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
