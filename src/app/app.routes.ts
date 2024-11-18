import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { Button1Component } from './button1/button1.component';
import { Button2Component } from './button2/button2.component';
import { Button3Component } from './button3/button3.component';

export const routes: Routes = [
  { path: '', component: AppComponent }, // Standardroute
  { path: 'button1', component: Button1Component }, // Route für die Button1-Komponente
  { path: 'button2', component: Button2Component }, // Route für die Button2-Komponente
  { path: 'button3', component: Button3Component } // Route für die Button3-Komponente

];
