import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {

	transform(date: any): any {
		return moment(new Date(date)).fromNow();
	}
}
