const List = require("../models/List");
const Project = require("../models/project");
const Task = require("../models/Task");

const {
  validateCreateList,
  validateProjectIdParam,
  validateUpdateList,
  validateProjectAndListIdParam
} = require("../validators/listValidator");


const createList = async (req, res) => {
  const paramValidationResult = validateProjectIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const bodyValidationResult = validateCreateList(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId } = req.params;
  const { name } = req.body;

  try {
    const project = await Project.findById(projectId).select("owner members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterId = req.user._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const hasAccess =
      isOwner || project.members.some((member) => member.toString() === requesterId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const count = await List.countDocuments({ project: projectId });

    const newList = await List.create({
      name,
      project: projectId,
      position: count,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "List created successfully",
      list: newList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const getAllLists = async (req, res) => {
  const paramValidationResult = validateProjectIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).select("owner members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterId = req.user._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const hasAccess =
      isOwner || project.members.some((member) => member.toString() === requesterId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const lists = await List.find({ project: projectId })
      .sort({ position: 1 })
      .populate({
        path: "tasks",
        options: { sort: { position: 1 } },
      });

    return res.status(200).json({
      message: "Lists fetched successfully",
      lists,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateList = async (req, res) => {
  const paramValidationResult = validateProjectAndListIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const bodyValidationResult = validateUpdateList(req.body);
  if (bodyValidationResult !== true) {
    return res.status(400).json({ errors: bodyValidationResult });
  }

  const { projectId, listId } = req.params;
  const { name, position: newPosition } = req.body;

  try {
    const project = await Project.findById(projectId).select("owner members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterId = req.user._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const hasAccess =
      isOwner || project.members.some((member) => member.toString() === requesterId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const list = await List.findOne({ _id: listId, project: projectId });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const oldPosition = list.position;

    if (newPosition !== undefined && newPosition !== oldPosition) {
      const listsCount = await List.countDocuments({ project: projectId });

      if (newPosition < 0 || newPosition >= listsCount) {
        return res.status(400).json({
          message: `Position must be between 0 and ${listsCount - 1}`,
        });
      }

      if (newPosition > oldPosition) {
        await List.updateMany(
          {
            project: projectId,
            position: { $gt: oldPosition, $lte: newPosition },
          },
          { $inc: { position: -1 } }
        );
      } else {
        await List.updateMany(
          {
            project: projectId,
            position: { $gte: newPosition, $lt: oldPosition },
          },
          { $inc: { position: 1 } }
        );
      }

      list.position = newPosition;
    }

    if (name !== undefined) {
      list.name = name;
    }

    await list.save();

    return res.status(200).json({
      message: "List updated successfully",
      list,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const deleteList = async (req, res) => {
  const paramValidationResult = validateProjectAndListIdParam(req.params);
  if (paramValidationResult !== true) {
    return res.status(400).json({ errors: paramValidationResult });
  }

  const { projectId, listId } = req.params;

  try {
    const project = await Project.findById(projectId).select("owner members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const requesterId = req.user._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const hasAccess =
      isOwner || project.members.some((member) => member.toString() === requesterId);

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const list = await List.findOne({ _id: listId, project: projectId });
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const deletedPosition = list.position;

    await list.deleteOne();

    await Task.deleteMany({ project: projectId, list: listId });

    await List.updateMany(
      {
        project: projectId,
        position: { $gt: deletedPosition },
      },
      { $inc: { position: -1 } }
    );

    return res.status(200).json({
      message: "List deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createList,
  getAllLists,
  updateList,
  deleteList,
};
