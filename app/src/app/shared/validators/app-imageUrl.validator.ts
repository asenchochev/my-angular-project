import { ValidatorFn } from '@angular/forms';

export function appImageUrlValidator(): ValidatorFn {
  const regExp = /^(http:\/\/|https:\/\/)/;

  return (control) => {
    const url = control.value;
    if (!url) return null; // Handle empty input
    return regExp.test(url) ? null : { appImageUrlValidator: true };
  };
}
