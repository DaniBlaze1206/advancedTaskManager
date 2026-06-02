const Validator = require("fastest-validator");
const v = new Validator();

const objectIdRule = {
  type: "string",
  pattern: /^[0-9a-fA-F]{24}$/,
};

const createTaskSchema = {
  listId: objectIdRule,
  title: {
    type: "string",
    min: 1,
    max: 200,
    trim: true,
    empty: false,
  },
  description: {
    type: "string",
    optional: true,
    max: 5000,
    trim: true,
  },
  position: {
    type: "number",
    integer: true,
    min: 0,
    optional: true,
  },
};

const updateTaskSchema = {
  taskId: { type: "string", pattern: /^[0-9a-fA-F]{24}$/ },

  title: {
    type: "string",
    optional: true,
    min: 1,
    max: 200,
    trim: true,
    empty: false,
  },
  description: { type: "string", optional: true, max: 5000, trim: true },

  listId: { type: "string", optional: true, pattern: /^[0-9a-fA-F]{24}$/ },
  position: { type: "number", optional: true, integer: true },

  $$strict: true,
  $$custom: (data, errors) => {
    const hasUpdateField =
      data.title !== undefined ||
      data.description !== undefined ||
      data.listId !== undefined ||
      data.position !== undefined;

    if (!hasUpdateField) {
      errors.push({
        type: "objectMinProps",
        field: "body",
        message: "At least one field must be provided",
      });
    }

    if (data.listId !== undefined && data.position !== undefined) {
      errors.push({
        type: "forbidden",
        field: "position",
        message:
          "Do not send position when moving a task to another list; it will be appended automatically",
      });
    }

    return data;
  },
};

const deleteTaskSchema = {
  taskId: objectIdRule,
};

const validateCreateTaskBody = v.compile(createTaskSchema);
const validateUpdateTaskBody = v.compile(updateTaskSchema);
const validateDeleteTaskBody = v.compile(deleteTaskSchema);

module.exports = {
  validateCreateTaskBody,
  validateUpdateTaskBody,
  validateDeleteTaskBody,
};
