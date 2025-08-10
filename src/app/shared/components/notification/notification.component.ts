import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'nb-notification',
  imports: [
    MatIcon,
    MatMiniFabButton,
    MatIconButton
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Output() close: EventEmitter<void> = new EventEmitter();

  handleClose() {
    this.close.emit();
  }
}
