import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home.component";
import {HomeResolver} from "./home.resolver";

const routes: Routes = [
  {
    path: 'home', component: HomeComponent, data: {title: '发现'}, resolve: {homeData: HomeResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
