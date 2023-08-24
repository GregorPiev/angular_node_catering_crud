import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES: any = {
  required: 'Should not be empty',
  email: 'Email is not valid',
  minlength: 'Field is too short',
  notMatch: 'Password and Confirm does not match'
};

@Component({
  selector: 'input-validations',
  templateUrl: './input-validations.component.html',
  styleUrls: ['./input-validations.component.css']
})
export class InputValidationsComponent implements OnInit, OnChanges {

  @Input() control!: AbstractControl;
  @Input() showErrorWhen: boolean = true;
  errorMessages: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });

    this.control.valueChanges.subscribe(()=>{
      this.checkValidation();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
      this.checkValidation();
  }

  checkValidation(): void{
    const errors = this.control.errors;
    if(!errors) {
      this.errorMessages = [];
      return;
    }

    const errorKeys = Object.keys(errors);
    this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);
  }

}
