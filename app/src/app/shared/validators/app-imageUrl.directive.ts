import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import { appImageUrlValidator } from "./app-imageUrl.validator";

@Directive({
  selector: "[appImageUrl]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AppImageDirective,
      multi: true,
    },
  ],
})
export class AppImageDirective implements Validator {
  validator: ValidatorFn = () => null;

  constructor() {
    this.validator = appImageUrlValidator();
  }

  validate(control: AbstractControl<any>): ValidationErrors | null {
    return this.validator(control);
  }
}