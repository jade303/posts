// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
import { getSubs } from "../fake-db";
import { getPosts } from "../fake-db";

const router = express.Router();

router.get("/list", async (req, res) => {
  const subgroups = await getSubs();
//  const test;
//  subs_posts.forEach((subg) => {
//    const posts = await getPosts(20,test);
//  });
  //const posts = await getPosts(20,subs_posts);
  res.render("subs", {subgroups});
});

router.get("/show/:subname", async (req, res) => {
  const posts = await getPosts(20, req.params.subname);
  res.render("sub", {posts});
});

export default router;
