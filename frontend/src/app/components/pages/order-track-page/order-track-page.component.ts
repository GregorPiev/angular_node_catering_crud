import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent implements OnInit {

  order!: Order;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if(!params.orderId) return;

    this.orderService.trackOrderById(params.orderId)
    .subscribe(order => {this.order = order});
  }

}
