import { NextFunction, Request, Response } from 'express'
import { Model } from './model'

export class Post implements Model {
  readonly id?: string
  author: string
  title: string

  constructor (author: string, title: string, id?: string) {
    this.author = author
    this.title = title
    this.id = id
  }

  static parse (req: Request, res: Response, next: NextFunction): void {
    const title = req.body.title
    const author = req.body.author
    res.locals.model = new Post(author, title)
    next()
  }

  static readID (req: Request, res: Response, next: NextFunction): void {
    res.locals.id = req.params.id
    next()
  }

  static proto (): Post {
    return new Post('author', 'title')
  }

  getTypeName (): string {
    return this.constructor.name
  }
}
