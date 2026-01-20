import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './user/login/login';
import { Register } from './user/register/register';
import { MyAccount } from './user/my-account/my-account';
import { JokeList } from './jokes/joke-list/joke-list';
import { JokeDetail } from './jokes/joke-detail/joke-detail';
import { CreateJoke } from './jokes/create-joke/create-joke';
import { EditJoke } from './jokes/edit-joke/edit-joke';
import { ImportJokes } from './admin/import-jokes/import-jokes';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/jokes/list', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'my-account', component: MyAccount, canActivate: [authGuard] },
  { path: 'jokes/list', component: JokeList },
  { path: 'jokes/detail/:id', component: JokeDetail },
  { path: 'jokes/create', component: CreateJoke, canActivate: [authGuard] },
  { path: 'jokes/edit/:id', component: EditJoke, canActivate: [authGuard] },
  { path: 'admin/import', component: ImportJokes, canActivate: [adminGuard] },
  { path: '**', redirectTo: '/jokes/list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
