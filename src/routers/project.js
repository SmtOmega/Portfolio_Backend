const express = require("express");
const Projects = require("../models/projects");
const auth = require("../middleware/auth");
const upload = require("../util/multer");
const cloudinary = require("../util/cloudinary");
const router = new express.Router();
const fs = require("fs/promises");
const checkPermissions = require("../util/checkPermission");

router.post("/", auth, async (req, res) => {
  const { imageUrl, title, description } = req.body;
  const project = new Projects({ ...req.body, projectOwner: req.user._id });

  try {
    if (!imageUrl || !title || !description) {
      throw new Error("Please provide all values");
    }
    await project.save();
    res.status(201).json({ project });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Projects.find({}).sort({ date: -1 });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.post("/uploadFile", upload.single("file"), auth, async (req, res) => {
  try {
    const name = req.file.originalname;
    const result = await cloudinary.uploader.upload(req.file.path);

    await fs.unlink(req.file.path);

    res.status(200).json({ image_url: result.secure_url, image_name: name });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});


router.delete('/:id', auth, async(req, res) =>{

    const {id: projectId} = req.params
    try {
        const project = await Projects.findOne({_id: projectId})
        if(!project){
            throw new Error(`There is no project found with the id: ${projectId}`)
        }
        checkPermissions(req.user, project.projectOwner)
        await project.remove()
        res.status(200).json({msg: 'Success! project removed'})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
})

router.patch("/:id", auth, async (req, res) => {
  const { id: projectId } = req.params;
  const { imageUrl, appUrl, title, description, githubUrl } = req.body;

  const updates = Object.keys(req.body);

  try {
    if (!imageUrl || !title || !description) {
      throw new Error("Please provide all values");
    }
    const project = await Projects.findOne({ _id: projectId });
    if (!project) {
      throw new Error(`No project found with project Id : ${projectId}`);
    }
    checkPermissions(req.user, project.projectOwner);

    updates.forEach((update) => (project[update] = req.body[update]));
    await project.save();
    res.status(200).json({ project });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = router;
