import { FormControl } from '@angular/forms';

export class SeatFormValidators {
  static fullNameValidator(control: FormControl): { [key: string]: any } | null {
    const name = control.value?.trim();
    if (!name) {
      return null;
    }
    const nameParts = name.split(/\s+/).map(part => part.trim()).filter(part => part);
    if (nameParts.length < 2) {
      return { invalidFullName: true };
    }
    const validParts = nameParts.every(part =>
      part.length >= 2 && /^[\p{L}'-]+$/u.test(part)
    );
    return validParts && name.length >= 5 && name.length <= 100
      ? null
      : { invalidFullName: true };
  }

  static luggageValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const weight = Number(value);
    if (isNaN(weight)) {
      return { invalidLuggage: true };
    }
    if (weight < 0 || weight > 25) {
      return { invalidLuggage: true };
    }
    return null;
  }
}