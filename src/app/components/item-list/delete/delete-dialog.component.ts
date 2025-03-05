import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
  @Input() itemId!: string | null; 
  @Output() confirm = new EventEmitter<string | null>(); 
  @Output() cancel = new EventEmitter<void>(); 

  onConfirm() {
    this.confirm.emit(this.itemId);
  }

  onCancel() {
    this.cancel.emit();
  }
}
