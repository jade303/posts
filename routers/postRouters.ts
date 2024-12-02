import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { getPosts } from "../fake-db";
import { getPost } from "../fake-db";
import { addPost } from "../fake-db";
import { editPost } from "../fake-db";
import { deletePost } from "../fake-db";
import { addComment } from "../fake-db";

router.get("/", async (req, res) => {
  const posts = await getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user }); //basically the homepage...
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
    if (req.user) {  
  const us = await req.user;
    const np = addPost(req.body.title, req.body.link,
      us.id, req.body.description, req.body.subgroup);
    res.redirect("/posts/show/"+np.id);
    }
  });

router.get("/show/:postid", async (req, res) => { //if postid doesn't exist, the app will crash
  try { const post = await getPost(parseInt(req.params.postid));
    const user = await req.user;
    res.render("individualPost", { post, user });
  } catch {
    res.redirect("/"); //so redirect to home instead
  } 
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  try { const post = await getPost(parseInt(req.params.postid));
    const user = await req.user;
    res.render("editPost", { post, user });
  } catch {
    res.redirect("/"); 
  }
  
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  if (req.user) {  
    const changes = {title:req.body.title, link:req.body.link,
      description:req.body.description, subgroup:req.body.subgroup};
    editPost(parseInt(req.params.postid), changes);
    res.redirect("/posts/show/"+req.params.postid);
  }
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  try { const post = await getPost(parseInt(req.params.postid));
    const user = await req.user;
    res.render("delete", { post, user });
  } catch {
    res.redirect("/"); 
  }
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  if (req.user) {  
    deletePost(parseInt(req.params.postid));
    res.redirect("/subs/show/"+req.body.subgroup);
  }
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    try { const user = await req.user;
      addComment(parseInt(req.params.postid), user!.id, req.body.comment);
    } catch {
      res.redirect("/"); 
    } finally {
      res.redirect("/posts/show/"+req.params.postid);
    }
  }
);

// router.post("/posts/vote/:postid/", ensureAuthenticated, async (req, res) =>{

// });

export default router;
