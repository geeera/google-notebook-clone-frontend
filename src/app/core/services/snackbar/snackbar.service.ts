import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '../../../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _snackbar = inject(MatSnackBar);

  constructor() { }

  openSuccessSnack(message: string): void {
    this._snackbar.openFromComponent(SnackbarComponent, {
      panelClass: 'success',
      data: { message, icon: 'sentiment_very_satisfied' },
      duration: 2500
    })
  }

  openErrorSnack(message: string): void {
    this._snackbar.openFromComponent(SnackbarComponent, {
      panelClass: 'error',
      data: { message, icon: 'sentiment_very_dissatisfied' },
      duration: 2500,
    })
  }
}
