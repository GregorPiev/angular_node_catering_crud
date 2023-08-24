import { LatLng } from "leaflet";
import { CartItem } from "./CartItem";

export class Order{
 id!:string;
 items!: CartItem[];
 totalPrice!: number;
 name!: string;
 addressLatLng?: LatLng;
 address!: string;
 paymentId!: string;
 createdAt!: string;
 status!:string;
}
