import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nointernet',
  templateUrl: './nointernet.page.html',
  styleUrls: ['./nointernet.page.scss'],
  standalone: false,
})
export class NointernetPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  retryConnection() {
    window.location.reload(); // or a custom network check and retry logic
  }

}
