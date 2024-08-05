import { Pipe, PipeTransform } from '@angular/core';
import { IApoderado } from '../model/IApoderado';

@Pipe({
  name: 'genderfilter'
})
export class GenderfilterPipe implements PipeTransform {

  transform(apoderados: IApoderado[], gender: string): IApoderado[] {
    return apoderados.filter(apoderado => apoderado.sex === gender);
  }

}
