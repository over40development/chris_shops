import { Component } from '@angular/core';

import { StorePage } from '../store/store';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StorePage;

  constructor() {

  }
}
