import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appPassMatchValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PassMatchValidatorDirective, multi: true }]
})
export class PassMatchValidatorDirective implements Validator {
  @Input('appPassMatchValidator') passwordToMatch!: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    const confirmPassword = control.root.get(this.passwordToMatch)?.value;
    return password === confirmPassword ? null : { 'passMismatch': true };
  }
}
