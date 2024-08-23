import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
        <img
          src="./assets/images/logos/ASM1.png"
          class=" align-middle m-2"
          alt="logo"
          style="height: auto; width: 200px;"
        />
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
