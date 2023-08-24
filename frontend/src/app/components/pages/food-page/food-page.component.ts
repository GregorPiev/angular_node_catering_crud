import { Component, OnInit } from '@angular/core';
import { Food } from 'src/app/shared/models/Food';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {

  food!: Food;

  constructor(private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private router: Router
    ) {
      this.activatedRoute.params.subscribe(param => {
        if (param.id) this.foodService.getFoodById(param.id)
        .subscribe((serverFood) => {this.food = serverFood;} );
      });
  }

  ngOnInit(): void {}

  addToCart(): void{
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl("/cart-page");
  }

}
