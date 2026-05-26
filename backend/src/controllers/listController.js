const List = require("../models/List");
const Task = require("../models/Task");

const {
  validateCreateList,
  validateProjectIdParam,
  validateDeleteList,
} = require("../validators/listValidator");

const createList = async (req, res) => {

  const paramErrors = validateProjectIdParam(req.params);
  if (paramErrors.length > 0)
    return res.status(400).json({ errors: paramErrors });


  const bodyErrors = validateCreateList(req.body);
  if (bodyErrors.length > 0)
    return res.status(400).json({ errors: bodyErrors });

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
      }
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

module.exports = { createList };
