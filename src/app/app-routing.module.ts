import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { BoardComponent } from './board-component/board.component';

const routes: Routes = [
  { path: 'mainpage', component: MainComponent },
  { path: 'iframepage', component: BoardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
