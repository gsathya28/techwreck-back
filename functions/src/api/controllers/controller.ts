import { Request, Response } from 'express'
import { Model } from '../model/model'
import { fireAdmin } from '../util/fireadmin'

// eslint-disable-next-line require-jsdoc
export class Controller<Type extends Model> {
  proto: Type
  type: string
  collection: FirebaseFirestore.CollectionReference

  /**
   * Constructor for the class
   * Uses a prototype of the model type to get info
   * @param {Type} proto
   */
  constructor (proto: Type) {
    this.proto = proto
    this.type = proto.getTypeName().toLowerCase()
    const collectionPath = this.type + 's'
    this.collection = fireAdmin.firestore().collection(collectionPath)
  }

  /**
   * Create method mapped to POST requests in router.
   * Object to write is stored in res.locals.model
   * @param {Request} req
   * @param {Response} res
   */
  create = async (req: Request, res: Response): Promise<void> => {
    let object: Type
    // TODO: This has to be a stronger check
    if (typeof res.locals.model === typeof this.proto) {
      object = res.locals.model
    } else {
      const message = 'Types are not matching - parse error'
      console.log(message)
      res.status(500).send(message)
      return
    }

    // Connect to Firebase
    const writeable = JSON.parse(JSON.stringify(object))
    const writeResult = await this.collection.add(writeable)
    res.status(201).json({ id: writeResult.id })
  }

  read = async (req: Request, res: Response): Promise<void> => {
    let id: string
    if (typeof res.locals.id === 'string') {
      id = res.locals.id
    } else {
      res.status(500).send('Read ID Error')
      return
    }

    const readResult = await this.collection.doc(id).get()
    if (readResult.exists) {
      res.status(200).json(readResult.data())
    } else {
      res.status(404).json({ message: 'Not Found', id: id })
    }
  }

  update = async (req: Request, res: Response): Promise<void> => {
    let id: string
    if (typeof res.locals.id === 'string') {
      id = res.locals.id
    } else {
      res.status(500).send('Read ID Error')
      return
    }

    let object: Type
    if (typeof res.locals.model === typeof this.proto) {
      object = res.locals.model
    } else {
      const message = 'Types are not matching - parse error'
      console.log(message)
      res.status(500).send(message)
      return
    }

    const writeable = JSON.parse(JSON.stringify(object))
    const updateResult = await this.collection.doc(id).set(writeable)
    res.status(200).json(updateResult.writeTime)
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    let id: string
    if (typeof res.locals.id === 'string') {
      id = res.locals.id
    } else {
      res.status(500).send('Read ID Error')
      return
    }

    const deleteResult = await this.collection.doc(id).delete()
    res.status(200).json(deleteResult.writeTime)
  }
}
