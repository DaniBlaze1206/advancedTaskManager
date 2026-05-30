const Validator = require("fastest-validator");
const v = new Validator();

const objectIdRule = {
  type: "string",
  pattern: /^[0-9a-fA-F]{24}$/,
};

const validateCreateTaskBody = v.compile({
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
});

const validateUpdateTaskBody = v.compile({
  taskId: objectIdRule,
  title: {
    type: "string",
    min: 1,
    max: 200,
    trim: true,
    empty: false,
    optional: true,
  },
  description: {
    type: "string",
    max: 5000,
    trim: true,
    optional: true,
  },
  listId: {
    ...objectIdRule,
    optional: true,
  },
  position: {
    type: "number",
    integer: true,
    min: 0,
    optional: true,
  },
});

const validateDeleteTaskBody = v.compile({
  taskId: objectIdRule,
});

module.exports = {
  validateCreateTaskBody,
  validateUpdateTaskBody,
  validateDeleteTaskBody,
};
