import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  imports: [MatProgressSpinner],
  selector: 'app-loading-spinner',
  styleUrl: './loading-spinner.component.scss',
  templateUrl: './loading-spinner.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
