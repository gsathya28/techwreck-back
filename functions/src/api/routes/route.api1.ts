/* load all the libs */
import express from "express";
import {Controller} from "../controllers/Controller";
import {Post} from "../model/post";

export const router = express.Router();

const postRoute = "/posts";
const id = "/:id";

// index endpoint
router.get("/", function(req, res, next) {
  res.json({msg: "ok - now what?"});
});

/* Post endpoints */
const postController = new Controller<Post>(Post.proto());
router.post(postRoute, Post.parse, postController.create);
router.get(postRoute + id, Post.readID, postController.read);
router.put(postRoute + id, Post.readID, Post.parse, postController.update);
router.delete(postRoute + id, Post.readID, postController.delete);

