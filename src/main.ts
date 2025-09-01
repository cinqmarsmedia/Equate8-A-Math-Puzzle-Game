import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

if((/Android/i).test(navigator.userAgent)){
  document.body.style.marginTop = '20px';
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
