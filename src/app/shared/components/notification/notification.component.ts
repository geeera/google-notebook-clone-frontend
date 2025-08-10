import {Component, EventEmitter, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'nb-notification',
  imports: [
    MatIcon,
    MatButtonModule
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
