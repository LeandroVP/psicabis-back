export interface Publication extends PublicationCore {
  authorId: string;
  lastEditorId: string;
  created: Date;
  updated: Date;
}

export interface PublicationCore {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  img: string;
  modules: Module[];

}

export interface Module {
  id: string;
  publicationId: string;
  type: string;
  position: number;
  content: ModuleContent[];
}

export interface ModuleContent {
  id: string;
  moduleId: string;
  position: number;
  value: string; //Consider 'any' instead.
}

export enum ModuleType {
  PARAGRAPHS = 'PARAGRAPHS', IMGS = 'IMGS', TITLE = 'TITLE', SUBTITLE = 'SUBTITLE', LIST = 'LIST', LINKS = 'LINKS'
}