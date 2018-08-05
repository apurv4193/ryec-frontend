import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HomeService } from './../../../../../../../services';

@Component({
    selector: 'ryec-rating-and-review',
    templateUrl: './rating-and-review.component.html',
    styleUrls: ['./rating-and-review.component.css']
})
export class RatingAndReviewComponent implements OnInit {

    ratingForm: FormGroup;
    currentRate = 0;
    constructor(private fB: FormBuilder) {
        this.ratingForm = this.fB.group({
            review: [null, Validators.compose([Validators.required])],
        });

    }

    ngOnInit() {
    }

    submitDetail() {
        if (this.ratingForm.valid) {
            const postJson = {
                user_id: '',
                business_id: '',
                rating: this.currentRate,
                comment: this.ratingForm.value.review
            };
            console.log(postJson);
        } else {
            this.ratingForm.markAsTouched();
        }
    }

}
