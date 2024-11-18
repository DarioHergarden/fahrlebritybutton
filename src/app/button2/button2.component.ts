import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button2',
  templateUrl: './button2.component.html',
  styleUrls: ['./button2.component.css'],
  standalone: true // Diese Zeile hinzugefügt, um die Komponente als standalone zu markieren
})
export class Button2Component implements OnInit {
  @Output() audioEnded = new EventEmitter<void>(); // Event-Emitter für Button3
  @Output() courseInfoClicked = new EventEmitter<void>(); // Neuer Event-Emitter für Button1

  ngOnInit() {
    const player = document.querySelector('.js-audio') as HTMLElement;
    const audio = player.querySelector('audio') as HTMLAudioElement;
    this.initAudioPlayer(player);

    // Versuche, das Audio automatisch abzuspielen
    audio.play().catch(err => {
      console.error('Autoplay konnte nicht ausgeführt werden:', err);
    });

    // Simuliere den Klick auf den Play/Pause-Button, um das Audio automatisch zu starten
    const playPauseBtn = player.querySelector('.play-pause') as HTMLElement;
    const playPauseIcon = playPauseBtn.querySelector('#playPauseIcon') as HTMLElement;
    if (playPauseBtn && playPauseIcon) {
      playPauseBtn.setAttribute('disabled', 'true'); // Deaktiviere den Button für 15 Sekunden

      // Verstecke das Icon während der ersten 15 Sekunden
      playPauseIcon.style.display = 'none';
    }

    // Starte die Seekbar-Animation für 15 Sekunden
    this.animateSeekbar(15000); // 15 Sekunden in Millisekunden

    // Nach 15 Sekunden den Button wieder aktivieren und das Icon ändern
    setTimeout(() => {
      playPauseBtn.removeAttribute('disabled'); // Button wieder aktivieren
      playPauseBtn.style.pointerEvents = 'auto'; // Ermöglicht die Zeigerinteraktion

      if (playPauseIcon) {
        playPauseIcon.style.display = 'inline'; // Zeige das Icon nach 15 Sekunden an
        playPauseIcon.classList.remove('fa-play', 'fa-pause');
        playPauseIcon.classList.add('fa-forward-step'); // Skip-Icon anzeigen
      }
    }, 15000);
  }

  initAudioPlayer(player: HTMLElement) {
    const audio = player.querySelector('audio') as HTMLAudioElement;
    const playPauseBtn = player.querySelector('.play-pause') as HTMLElement;
    const playPauseIcon = playPauseBtn.querySelector('#playPauseIcon') as HTMLElement;
    const seekbar = player.querySelector('#seekbar') as SVGPathElement;
    const sliderHandle = player.querySelector('#sliderHandle') as SVGCircleElement;
    const totalLength = seekbar.getTotalLength();

    // Initialize the progress ring
    seekbar.setAttribute('stroke-dasharray', totalLength.toString());
    seekbar.setAttribute('stroke-dashoffset', totalLength.toString());

    // Skip button click handler (nach 15 Sekunden aktiv)
    playPauseBtn.addEventListener('click', () => {
      if (playPauseBtn.hasAttribute('disabled')) {
        return; // Ignoriere Klicks, wenn der Button deaktiviert ist
      }

      console.log('Skip-Button wurde geklickt');
      this.audioEnded.emit(); // Event auslösen, um Button3 zu laden
    });

    // Trigger the event when the audio ends
    audio.addEventListener('ended', () => {
      player.classList.remove('playing');
      playPauseIcon.classList.replace('fa-pause', 'fa-redo');
      seekbar.setAttribute('stroke-dashoffset', totalLength.toString());
      this.audioEnded.emit(); // Event auslösen, wenn das Audio endet
    });
  }

  // Methode zum Öffnen des Links und Laden von Button1
  openCourseInfo() {
    window.open('https://fahrlingo.com/understand-the-examiner', '_blank');
    this.courseInfoClicked.emit(); // Button1 laden
  }

  animateSeekbar(duration: number) {
    const seekbar = document.querySelector('#seekbar') as SVGPathElement;
    const totalLength = seekbar.getTotalLength();
    let startTime: number | null = null;

    function animate(time: number) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1); // Begrenze den Fortschritt auf 1 (100%)

      // Setze den `stroke-dashoffset` basierend auf dem Fortschritt
      const offset = totalLength * (1 - progress);
      seekbar.setAttribute('stroke-dashoffset', offset.toString());

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }
}



