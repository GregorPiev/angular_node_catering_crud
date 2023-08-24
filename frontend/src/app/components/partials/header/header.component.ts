import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from '../../../services/user.service';
import { Observable, from, of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartQuantity = 0;
  user!: User;
  isAuthUser = false;

  constructor(
    cartService: CartService, private userService: UserService) {
    cartService.getCartObservable().subscribe(item => {
      this.cartQuantity = item.totalCount;
    })

    userService.userObservable.subscribe((user) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
    this.userService.userObservable.subscribe((user:User)=>{
          this.isAuthUser = user.token == undefined? false: true;
    });
  }

  logout(): void {
    this.userService.logout();
  }

}
