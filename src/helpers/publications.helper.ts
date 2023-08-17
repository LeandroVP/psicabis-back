import { Module, ModuleContent } from './../models/publication.model';
export class PublicationsHelper {
  static moduleArrayBuilder(modules: Omit<Module, 'content'>[], contents: ModuleContent[]): Module[] {
    let formattedArray = [];
    modules.forEach(mod => {
      formattedArray.push({ ...mod, content: contents.filter(content => content.moduleId === mod.id) })
    })
    return formattedArray
  }

  static queryResponseArrayFormatter(array) {
    let formattedArray = [];
    for (let index = 0; index < array.length; index++) {
      formattedArray.push({ ...array[index] });
    }
    return formattedArray
  }
}