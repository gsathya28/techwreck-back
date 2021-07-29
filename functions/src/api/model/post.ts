import {Request, Response, NextFunction} from "express";
import {Model} from "./model";

export class Post implements Model {
  readonly id?: string;
  author: string;
  title: string;

  constructor(author: string, title: string, id?: string) {
    this.author = author;
    this.title = title;
    this.id = id;
  }

  static parse(req: Request, res: Response, next: NextFunction) {
    let title = req.body.title;
    let author = req.body.author;
    let post = new Post(author, title);
    res.locals.model = post;
    next();
  }

  static readID(req: Request, res: Response, next: NextFunction) {
    let id = req.params.id;
    res.locals.id = id;
    next();
  }

  static proto(): Post {
    return new Post("author", "title");
  }

  getTypeName(): string {
    return this.constructor.name;
  }


}
