import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../../services';
@Component({
  selector: 'ryec-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private cS: CommonService) { }

  ngOnInit() {
    this.cS.scrollTop();
  }

}
