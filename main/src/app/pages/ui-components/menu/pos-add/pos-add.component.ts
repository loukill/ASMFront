import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PosService } from 'src/app/pages/dashboard/services/PosService';
import { POSWithDetails } from 'src/app/pages/dashboard/models/PosWithDetails';
import { Service } from '../models/Service';
import { Prestataire } from '../models/Prestataire';
import { PrestataireService } from '../../calendar/services/prestataireService';

@Component({
  selector: 'app-pos-add',
  templateUrl: './pos-add.component.html',
  styleUrls: ['./pos-add.component.css']
})
export class PosAddComponent implements OnInit {
  pos: POSWithDetails = {
    posId: 0,
    posName: '',
    posLocation: '',
    imageUrl: '',
    adminId: '',
    services: [],
    clients: [],
    prestataires: []
  };

  services: Service[] = [];
  prestataires: Prestataire[] = []; // Prestataires fetched from the backend
  selectedPrestataires: Prestataire[] = []; // Store selected prestataires
  selectedFile: File | null = null; // Store selected image file

  constructor(
    private posService: PosService,
    private prestataireService: PrestataireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const adminId = localStorage.getItem('userId'); // Retrieve the admin ID from local storage
  if (adminId) {
    this.loadPrestataires(adminId); // Fetch prestataires with admin ID
  } else {
    console.error('Admin ID not found.');
  }
  }

  // Fetch prestataires from the backend
  loadPrestataires(adminId: string): void {
    this.prestataireService.getPrestataires(adminId).subscribe(
      (data: Prestataire[]) => {
        this.prestataires = data;
      },
      (error) => {
        console.error('Error fetching prestataires:', error);
      }
    );
  }

  // Add a new service to the list
  addService(): void {
    this.services.push({ id: 0, name: '', prix: 0, posId: 0 });
  }

  // Remove a service from the list
  removeService(index: number): void {
    this.services.splice(index, 1);
  }

  // Handle file selection for image upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Submit the form and create the new POS
  onSubmit(): void {
    this.pos.services = this.services;
    this.pos.prestataires = this.selectedPrestataires;

    if (this.selectedFile) {
      this.uploadImage(this.selectedFile).then((imageUrl) => {
        this.pos.imageUrl = imageUrl;
        this.createPOS();
      });
    } else {
      this.createPOS();
    }
  }

  // Simulated image upload
  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fakeUrl = 'http://localhost:5000/uploads/' + file.name;
        resolve(fakeUrl);
      }, 2000);
    });
  }

  // Create the POS
  createPOS(): void {
    this.posService.createPOS(this.pos).subscribe(
      (createdPos) => {
        console.log('POS created successfully:', createdPos);
        this.router.navigate(['/pos-list']); // Redirect to POS list
      },
      (error) => {
        console.error('Error creating POS:', error);
      }
    );
  }
}
