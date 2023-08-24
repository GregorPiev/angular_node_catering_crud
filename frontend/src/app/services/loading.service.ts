import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  showLoading():void{
    this.isLoadingSubject.next(true);
  }

  hideLoading(): void{
    this.isLoadingSubject.next(false);
  }

  get isLoading() {
    return this.isLoadingSubject.asObservable();
  }
}
