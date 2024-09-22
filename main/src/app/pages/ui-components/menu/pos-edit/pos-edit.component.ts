import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PosService } from 'src/app/pages/dashboard/services/PosService';
import { POSWithDetails } from 'src/app/pages/dashboard/models/PosWithDetails';
import { Service } from 'src/app/pages/ui-components/menu/models/Service';
import { Prestataire } from 'src/app/pages/ui-components/menu/models/Prestataire';

@Component({
  selector: 'app-pos-edit',
  templateUrl: './pos-edit.component.html',
  styleUrls: ['./pos-edit.component.css']
})
export class PosEditComponent implements OnInit {
  pos: POSWithDetails | null = null;
  posId: number | null = null;
  selectedFile: File | null = null; // Fichier sélectionné pour l'upload

  constructor(
    private posService: PosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.posId = +params.get('id')!;
      if (this.posId) {
        this.loadPOS(this.posId);
      }
    });
  }

  loadPOS(id: number): void {
    this.posService.getPOSById(id).subscribe(
      (data: POSWithDetails) => {
        this.pos = data;
      },
      error => {
        console.error('Error fetching POS details:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.posId && this.pos) {
      // Si un fichier est sélectionné, gérer l'upload
      if (this.selectedFile) {
        this.uploadImage(this.selectedFile).then((imageUrl) => {
          this.pos!.imageUrl = imageUrl; // Mise à jour de l'URL de l'image après upload
          this.updatePOS(); // Mise à jour du POS
        }).catch((error) => {
          console.error('Error uploading image:', error);
        });
      } else {
        this.updatePOS(); // Si aucune image n'est sélectionnée, mise à jour directe du POS
      }
    }
  }

  updatePOS(): void {
    if (this.posId && this.pos) {
      // Crée un objet avec toutes les propriétés requises
      const updatedPos: POSWithDetails = {
        posId: this.posId,
        posName: this.pos.posName || '',
        posLocation: this.pos.posLocation || '',
        imageUrl: this.pos.imageUrl || '',
        adminId: this.pos.adminId,
        admin: this.pos.admin,
        services: this.pos.services || [],
        clients: this.pos.clients || [],
        prestataires: this.pos.prestataires || []
      };

      this.posService.updatePOS(this.posId, updatedPos).subscribe(
        () => {
          console.log('POS updated successfully');
          this.router.navigate(['/ui-components/pos', this.posId]);
        },
        error => {
          console.error('Error updating POS:', error);
        }
      );
    }
  }

  // Gestion de la sélection de fichier
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Fonction simulée pour uploader l'image (à implémenter côté backend)
  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Logique d'upload du fichier, par exemple via posService.uploadImage(file)
      // Simule la résolution avec une URL
      setTimeout(() => {
        const fakeUrl = 'http://localhost:5000/uploads/' + file.name;
        resolve(fakeUrl);
      }, 2000);
    });
  }

  onCancel(): void {
    if (this.posId) {
      this.router.navigate(['/ui-components/pos', this.posId]);
    }
  }
}
