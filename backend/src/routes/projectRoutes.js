const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const listRoutes = require("./listRoutes");


router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);

router.get("/:projectId", projectController.getProjectById);
router.patch("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

router.post("/:projectId/members", projectController.addMember);
router.delete("/:projectId/members/:userId", projectController.removeMember);

router.patch("/:projectId/transfer", projectController.transferOwnership);


router.use("/:projectId/lists", listRoutes);

module.exports = router;
