import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../../services';
@Component({
  selector: 'ryec-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  constructor(private cS: CommonService) { }

  ngOnInit() {
    this.cS.scrollTop();
  }

}
