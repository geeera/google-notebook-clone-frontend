import {Component, inject} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
interface MatSnackBarData {
  message: string;
  icon: string
}

@Component({
  selector: 'nb-snackbar',
  imports: [
    MatIcon
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  standalone: true
})
export class SnackbarComponent {
  public data: MatSnackBarData = inject(MAT_SNACK_BAR_DATA);
}
