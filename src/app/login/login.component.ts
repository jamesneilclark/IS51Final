import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { Subject } from 'rxjs';
 import { LocalStorageService } from '../localStorageService';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: IUser = { username: '', password: '' };
  currentUser: IUser = null;
  localStorageService: LocalStorageService<IUser>;
  constructor(
    private router: Router,
    private toastService: ToastService
  ) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage(null);
  }
  login(user: IUser) {
    console.log('from login user: ', user);
    const defaultUser: IUser = { username: 'james', password: 'james123' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {

       this.localStorageService.saveItemsToLocalStorage(user);

        this.router.navigate(['cart']);
      } else {
        this.toastService.showToast('danger', 5000, 'Login Failed! Check username and password...');
      }
    } else {
      this.toastService.showToast('danger', 5000, 'Login Failed! Specify username and password...');
    }

  }
}
