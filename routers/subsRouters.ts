// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
import { getSubs } from "../fake-db";
import { getPosts } from "../fake-db";

const router = express.Router();

router.get("/list", async (req, res) => {
  const subgroups = await getSubs();
  res.render("subs", {subgroups});
});

router.get("/show/:subname", async (req, res) => {
  const posts = await getPosts(20, req.params.subname);
  const user = await req.user;
  res.render("sub", { posts, user });
});

export default router;
