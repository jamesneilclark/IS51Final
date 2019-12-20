import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { LocalStorageService } from '../localStorageService';
import { IUser } from '../login/login.component';
export interface Bike {
  id?: number;
  image?: string;
  description?: string;
  price?: number;
  quantity?: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  localStorageService: LocalStorageService<Bike>;
  currentUser: IUser;
  bikes: Array<Bike> = [];
  nameParams = '';

  constructor(
    // tslint:disable-next-line: deprecation
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.localStorageService = new LocalStorageService('bikes');
  }

  async ngOnInit() {
    this.bikes = await this.loadBikes();


  }
  async loadBikes() { // will load contacts either for the file or local storage from the user
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) { // if user made changed, load their changes from local storage
    } else {
      bikes = await this.loadBikesFromFile(); // else load contacts from file
    }
    this.bikes = bikes;
    return bikes;
  }
  async loadBikesFromFile() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }
  deleteBike(index: number) {
    this.bikes.splice(index, 1); // deletes on item based on index
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  addBikeOne() {
    const bike: Bike = {
      id: 1,
      image: '../../assets/bike1.jpeg',
      description: 'Bike Model 1',
      price: 5000,
      quantity: 1
    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  addBikeTwo() {
    const bike: Bike = {
      id: 2,
      image: '../../assets/bike2.jpeg',
      description: 'Bike Model 2',
      price: 4000,
      quantity: 1
    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  addBikeThree() {
    const bike: Bike = {
      id: 3,
      image: '../../assets/bike3.jpeg',
      description: 'Bike Model 3',
      price: 3000,
      quantity: 1
    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  saveBikes() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  calculate(name: string) {
    let error = false;
    const commaIndex = name.indexOf(', ');

    if (name === '' || name === null) {
      this.toastService.showToast('danger', 5000, 'Name must not be empty');
      error = true;
    } else if (commaIndex === -1) {
      this.toastService.showToast('danger', 5000, 'Name must have a comma and a space');
      error = true;
    }

    if (!error) {
      const firstName = name.slice(commaIndex + 1, name.length);
      const lastName = name.slice(0, commaIndex);
      const fullName = firstName + ' ' + lastName;
      let owed = 0;
    for (let i = 0; i < this.bikes.length; i++) { // loops through each item to add up the total owed
      owed += this.bikes[i].quantity * this.bikes[i].price;
    }
    this.router.navigate(['invoice']);
    return {
      fullName: fullName,
      subTotal: owed,
      taxAmount: owed * 0.08,
      total: owed + (owed * 0.08)
    };
    } else {
    }
  }

  finalize(params: string) {

    const data = this.calculate(params); // runs the calculate() function to get totals
    localStorage.setItem('calculatedData', JSON.stringify(data));
  }
}
