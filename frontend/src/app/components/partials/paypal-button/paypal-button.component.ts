import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/shared/models/Order';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

//window.paypal
declare let paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit {

  @Input() order!: Order;
  @ViewChild('paypal', {static: true}) paypalElement!: ElementRef;


  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastrService: ToastrService,
    private cartService: CartService
    ) { }

  ngOnInit(): void {

    const self = this;
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "ILS",
                value: self.order.totalPrice,
              },
            },
          ],
        });
      },

      onApprove: async (data: any, actions: any) => {
        const payment = await actions.order.capture();
        this.order.paymentId = payment.id;
        self.orderService.pay(this.order).subscribe(
          {
            next: (orderId) => {
              this.cartService.clearCart();
              this.router.navigateByUrl('/track/' + orderId);
              this.toastrService.success(
                'Payment Saved Successfully',
                'Success'
              );
            },
            error: (error) => {
              this.toastrService.error('Payment Save Failed', 'Error');
            }
          }
        );
      },

      onError: (err: any) => {
        this.toastrService.error('Payment Failed', 'Error');
        console.log(err);
      },
    })
    .render(this.paypalElement.nativeElement);
  }

}
