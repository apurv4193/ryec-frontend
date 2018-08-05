import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {

	transform(value: any, args: string[]): any {
		console.log(args);
		console.log(value);
		const keys = [];
		for (const key in value) {
			keys.push({ key: key, value: value[key] });
		}
		return keys;
	}
}
