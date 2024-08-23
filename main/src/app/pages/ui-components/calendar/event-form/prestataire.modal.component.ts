import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Prestataire } from '../models/prestataireDto';

@Component({
  selector: 'app-prestataire-modal',
  templateUrl: './prestataire-modal.component.html',
  styleUrls: ['./prestataire-modal.component.css']
})
export class PrestataireModalComponent {
  @Input() prestataires: Prestataire[] = [];
  @Output() prestataireSelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  selectPrestataire(id: string) {
    this.prestataireSelected.emit(id);
  }

  closeModal() {
    this.close.emit();
  }
}
