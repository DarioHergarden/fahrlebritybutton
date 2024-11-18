import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button3',
  templateUrl: './button3.component.html',
  styleUrls: ['./button3.component.css'],
  standalone: true // Diese Zeile hinzugefügt, um die Komponente als standalone zu markieren
})
export class Button3Component implements OnInit {
  @Output() repeat = new EventEmitter<void>(); // Event-Emitter hinzufügen

  ngOnInit() {
    const player = document.querySelector('.js-audio') as HTMLElement;
    const audio = player.querySelector('audio') as HTMLAudioElement;
    this.initAudioPlayer(player);

    // Simuliere den Klick auf den Play/Pause-Button, um das Audio automatisch zu starten
    const playPauseBtn = player.querySelector('.play-pause') as HTMLElement;
    if (playPauseBtn) {
      playPauseBtn.click(); // Simuliert den Klick, um das Audio abzuspielen
    }
  }

  initAudioPlayer(player: HTMLElement) {
    const audio = player.querySelector('audio') as HTMLAudioElement;
    const playPauseBtn = player.querySelector('.play-pause') as HTMLElement;
    const playPauseIcon = playPauseBtn.querySelector('#playPauseIcon') as HTMLElement;
    const seekbar = player.querySelector('#seekbar') as SVGPathElement;
    const sliderHandle = player.querySelector('#sliderHandle') as SVGCircleElement;
    const totalLength = seekbar.getTotalLength();
    let isDragging = false;

    // Initialize the progress ring
    seekbar.setAttribute('stroke-dasharray', totalLength.toString());
    seekbar.setAttribute('stroke-dashoffset', totalLength.toString());

    // Play/pause button click handler
    playPauseBtn.addEventListener('click', () => {
      if (playPauseIcon.classList.contains('fa-redo')) {
        this.repeat.emit(); // Emit the repeat event to load Button2
      } else {
        if (audio.paused) {
          playPauseIcon.classList.replace('fa-play', 'fa-pause');
          document.querySelectorAll('audio').forEach(el => (el as HTMLAudioElement).pause());
          document.querySelectorAll('.js-audio').forEach(el => el.classList.remove('playing'));
          audio.play();
          player.classList.add('playing');
        } else {
          audio.pause();
          player.classList.remove('playing');
          playPauseIcon.classList.replace('fa-pause', 'fa-play');
        }
      }
    });

    // Update progress ring and slider handle as audio plays
    audio.addEventListener('timeupdate', () => {
      if (!isDragging) {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const ratio = currentTime / duration;

        // Update seekbar
        const offset = totalLength - ratio * totalLength;
        seekbar.setAttribute('stroke-dashoffset', offset.toString());

        // Move slider handle position around the circle
        updateSliderHandlePosition(ratio);
      }
    });

    // Event handlers for dragging the slider handle
    sliderHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch support
    sliderHandle.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);

    function startDrag(event: MouseEvent | TouchEvent) {
      isDragging = true;
      event.preventDefault();
    }

    function drag(event: MouseEvent | TouchEvent) {
      if (!isDragging) return;

      const rect = seekbar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const normalizedAngle = (angle >= -Math.PI / 2 ? angle : angle + 2 * Math.PI) + Math.PI / 2;

      const ratio = normalizedAngle / (2 * Math.PI);
      const newTime = ratio * audio.duration;
      audio.currentTime = newTime;

      // Update slider handle position
      updateSliderHandlePosition(ratio);

      // Update seekbar offset
      const offset = totalLength - ratio * totalLength;
      seekbar.setAttribute('stroke-dashoffset', offset.toString());
    }

    function endDrag() {
      if (isDragging) {
        isDragging = false;
        audio.play(); // Optional: Resume audio playback after dragging
      }
    }

    function updateSliderHandlePosition(ratio: number) {
      const angle = ratio * 360 - 90; // Start at the top of the circle
      const radians = (angle * Math.PI) / 180;

      const cx = 60 + 50 * Math.cos(radians); // 60 is the SVG center, 50 is the radius
      const cy = 60 + 50 * Math.sin(radians);

      sliderHandle.setAttribute('cx', cx.toString());
      sliderHandle.setAttribute('cy', cy.toString());
    }

    // Reset icon and progress ring when audio ends
    audio.addEventListener('ended', () => {
      player.classList.remove('playing');
      playPauseIcon.classList.replace('fa-pause', 'fa-redo');
      seekbar.setAttribute('stroke-dashoffset', totalLength.toString());
      updateSliderHandlePosition(0); // Reset slider handle to the starting position
    });
  }
}
