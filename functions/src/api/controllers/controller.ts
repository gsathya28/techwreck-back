import {Request, Response} from "express";
import {Model} from "../model/model";
import {fireAdmin} from "../util/fireadmin";

export class Controller<Type extends Model> {

  proto: Type;
  type: string;
  collection: FirebaseFirestore.CollectionReference;

  constructor(proto: Type) {
    this.proto = proto;
    this.type = proto.getTypeName().toLowerCase();
    let collectionPath = this.type + 's';
    this.collection = fireAdmin.firestore().collection(collectionPath);
  }

  create = async (req: Request, res: Response) => {
    // Firebase transaction - your object should be located in res.locals.model
    // Check type using our prototype saved in our controller
    let object: Type;
    // TODO: This has to be a stronger check
    if (typeof res.locals.model === typeof this.proto)
      object = res.locals.model;
    else {
      let message: string = "Types are not matching - parse error"
      console.log(message);
      return res.status(500).send(message);
    }

    // Connect to Firebase
    const writeResult = await this.collection.add(JSON.parse(JSON.stringify(object)));
    return res.status(201).json({id: writeResult.id});
  };

  read = async (req: Request, res: Response) => {
    let id: string;
    if (typeof res.locals.id === 'string')
      id = res.locals.id;
    else
      return res.status(500).send("Read ID Error");
    
    const readResult = await this.collection.doc(id).get();
    if (readResult.exists)
      return res.status(200).json(readResult.data());
    else 
      return res.status(404).json({message: "Not Found", id: id});
  };

  update = async (req: Request, res: Response) => {
    
    let id: string;
    if (typeof res.locals.id === 'string')
      id = res.locals.id;
    else 
      return res.status(500).send("Read ID Error");
    
    let object: Type;
    if (typeof res.locals.model === typeof this.proto)
      object = res.locals.model;
    else {
      let message: string = "Types are not matching - parse error"
      console.log(message);
      return res.status(500).send(message);
    }

    const updateResult = await this.collection.doc(id).set(JSON.parse(JSON.stringify(object)))
    return res.status(200).json(updateResult.writeTime);
  };

  delete = async (req: Request, res: Response) => {
    let id: string;
    if (typeof res.locals.id === 'string')
      id = res.locals.id;
    else 
      return res.status(500).send("Read ID Error");
    
    const deleteResult = await this.collection.doc(id).delete();
    return res.status(200).json(deleteResult.writeTime);
  };

}



