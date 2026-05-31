const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");


router.post("/", createTask);


router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
