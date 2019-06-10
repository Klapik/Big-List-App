import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @ViewChild('modal', { static: false }) modal: ModalDirective;

  constructor() { }

  public show() {
    this.modal.show();
  }

  public hide() {
    this.modal.hide();
    document.body.className = document.body.className.replace('modal-open', '');
  }
}
