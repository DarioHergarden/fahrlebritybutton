import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; // Importiere NgIf direkt
import { Button1Component } from './button1/button1.component';
import { Button2Component } from './button2/button2.component';
import { Button3Component } from './button3/button3.component'; // Importiere Button3

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="main-background">
      <ng-container *ngIf="showButton1; else showButton2">
        <app-button1 (repeat)="loadButton2()"></app-button1>
      </ng-container>
      <ng-template #showButton2>
        <ng-container *ngIf="showButton3; else showButton2Content">
          <app-button3 (repeat)="loadButton2()"></app-button3> <!-- Handhabe das repeat-Event -->
        </ng-container>
        <ng-template #showButton2Content>
          <app-button2 
            (audioEnded)="loadButton3()" 
            (courseInfoClicked)="loadButton1()">
          </app-button2> <!-- Button2 zeigt Button3 beim Event -->
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .main-background {
      padding: 20px;
      text-align: center;
    }
  `],
  imports: [NgIf, Button1Component, Button2Component, Button3Component] // Füge Button3 zu den Imports hinzu
})
export class AppComponent {
  showButton1 = true;
  showButton3 = false;

  loadButton2() {
    this.showButton1 = false; // Umschalten, um Button2Component anzuzeigen
    this.showButton3 = false; // Button3 zurücksetzen
  }

  loadButton3() {
    this.showButton3 = true; // Umschalten, um Button3Component anzuzeigen
  }

  loadButton1() {
    this.showButton1 = true; // Zurückschalten, um Button1Component anzuzeigen
    this.showButton3 = false; // Zurückschalten, um Button3 nicht mehr anzuzeigen
  }
}



