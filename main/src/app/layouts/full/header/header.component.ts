import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/authentication/services/authService';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  constructor(public dialog: MatDialog, private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  onProfileClick() {
    const userId = this.authService.getCurrentUserId();
    this.dialog.open(UserProfileComponent, {
      width: '400px',
      data: { userId: userId }
    });
  }
}
