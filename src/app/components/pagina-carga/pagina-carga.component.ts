import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-carga',
  templateUrl: './pagina-carga.component.html',
  styleUrls: ['./pagina-carga.component.css']
})
export class PaginaCargaComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    document.addEventListener('DOMContentLoaded', () => {
      const bars = document.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
      const content = document.querySelector('.content-container') as HTMLElement | null;
      const progressBar = document.querySelector('.progress-bar') as HTMLElement | null;
      const progress = document.querySelector('.progress') as HTMLElement | null;

      if (bars && content && progressBar && progress) {
        // Open the curtain
        bars.forEach(bar => {
          setTimeout(() => {
            bar.style.transform = 'translateY(100vh)';  // Move bars down
          }, 500); // Delay slightly for visual effect
        });

        // Show content and start the progress bar after the curtain is fully open
        setTimeout(() => {
          content.style.opacity = '1';
          progress.style.width = '100%';
        }, 1500);

        // Wait for the progress to complete, then close the curtain
        setTimeout(() => {
          content.style.opacity = '0';  // Optionally hide the content first
          progressBar.style.opacity = '0'; // Also hide the progress bar

          bars.forEach(bar => {
            bar.style.transform = 'translateY(-100vh)';  // Move bars up
          });

          setTimeout(() => {
            this.router.navigate(['/landing-page']);
          }, 3000);
        }, 7000); // Timing for the progress bar completion
      }
    });
  }
}
