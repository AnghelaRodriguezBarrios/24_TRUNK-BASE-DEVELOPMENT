import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.onscroll = () => {
      const nav = document.getElementById('navegacion');
      if (nav) {
        if (window.pageYOffset > 0) {
          nav.classList.add('navegacion-scroll');
        } else {
          nav.classList.remove('navegacion-scroll');
        }
      }
    };

    const carSld = document.getElementById("carrusel-slides") as HTMLElement;
    const carRight = document.querySelector(".btn-next") as HTMLElement;
    const carLeft = document.querySelector(".btn-prev") as HTMLElement;

    if (carRight && carLeft && carSld) {
      carRight.onclick = () => {
        carSld.scrollLeft += 220;
      };

      carLeft.onclick = () => {
        carSld.scrollLeft -= 220;
      };
    }

    const btnMasInformacion = document.querySelector('.sb-btn-informacion') as HTMLElement;

    if (btnMasInformacion) {
      btnMasInformacion.addEventListener('click', () => {
        const span = document.querySelector('.sb-contenido p span') as HTMLElement;
        if (span) {
          if (span.style.display === 'block') {
            span.style.display = 'none';
            btnMasInformacion.innerHTML = "Mas información";
          } else {
            span.style.display = 'block';
            btnMasInformacion.innerHTML = "Menos información";
          }
        }
      });
    }

    // Inicializar AOS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/aos@next/dist/aos.js';
    script.onload = () => {
      // @ts-ignore
      AOS.init();
    };
    document.body.appendChild(script);
  }
}
