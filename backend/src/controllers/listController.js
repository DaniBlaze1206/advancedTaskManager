const List = require("../models/List");
const Project = require("../models/project");
const Task = require("../models/Task");

const {
  validateCreateList,
  validateProjectIdParam,
  validateDeleteList,
  validateUpdateList,
} = require("../validators/listValidator");

const createList = async (req, res) => {
  const paramValidation = validateProjectIdParam(req.params);
  if (paramValidation.length > 0){
    return res.status(400).json({ errors: paramValidation });
  }
    
  const bodyvalidation = validateCreateList(req.body);
  if (bodyvalidation.length > 0){
    return res.status(400).json({ errors: bodyvalidation });
  }
    
  const { projectId } = req.params;
  const { name } = req.body;
  const { id: userId } = req.user;

  try {
    const count = await List.countDocuments({ project: projectId });

    const newList = await List.create({
      name,
      project: projectId,
      position: count,
      createdBy: userId,
    });

    return res.status(201).json(newList);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteList = async (req, res) => {
  const paramValidation = validateProjectIdParam(req.params);
  if (paramValidation !== true) {
    return res.status(400).json({
      message: "Invalid projectId",
      errors: paramValidation,
    });
  }

  const bodyValidation = validateDeleteList(req.body);
  if (bodyValidation !== true) {
    return res.status(400).json({
      message: "Invalid listId",
      errors: bodyValidation,
    });
  }

  const { projectId } = req.params;
  const { listId } = req.body;

  try {
    const list = await List.findOne({ _id: listId, project: projectId });

    if (!list) {
      return res.status(404).json({
        message: "List not found in this project",
      });
    }

    const deletedPosition = list.position;

    await Task.deleteMany({ list: listId });

    await List.deleteOne({ _id: listId });

    await List.updateMany(
      {
        project: projectId,
        position: { $gt: deletedPosition },
      },
      {
        $inc: { position: -1 },
      },
    );

    return res.status(200).json({
      message: "List and its tasks deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting list",
      error: error.message,
    });
  }
};

const getAllLists = async (req, res) => {
  const { projectId } = req.params;

  const paramValidation = validateProjectIdParam(req.params);
  if (paramValidation.length > 0) {
    return res.status(400).json({ errors: paramValidation });
  }

  try {
    const lists = await List.find({ project: projectId })
      .sort({ position: 1 })
      .populate({
        path: "tasks",
        options: { sort: { position: 1 } },
      });

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = { createList, deleteList, getAllLitst };
