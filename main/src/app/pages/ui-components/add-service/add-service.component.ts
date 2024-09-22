import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from './service/service.service';
import { PosService } from '../../dashboard/services/PosService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnInit {
  serviceForm: FormGroup;

  posList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private posService: PosService,
    private router: Router
  ) {
    // Initialize the form in the constructor
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      description: [''],
      prix: ['', [Validators.required, Validators.min(0)]],
      posId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const adminId = localStorage.getItem('userId');

    if (adminId) {
      this.posService.getPOSByAdminId(adminId).subscribe(
        (data) => this.posList = data,
        (error) => console.error('Error fetching POS list:', error)
      );
    } else {
      console.error('Admin ID not found in localStorage.');
    }
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.serviceService.createService(this.serviceForm.value).subscribe(
        (response) => {
          console.log('Service added successfully:', response);
        },
        (error) => {
          console.error('Error adding service:', error);
        }
      );
    }
  }
}
