const Validator = require("fastest-validator");
const v = new Validator();

const createListSchema = {
  name: {
    type: "string",
    min: 3,
    max: 100,
    trim: true,
    empty: false,
  },
};

const projectIdParamSchema = {
  projectId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
    empty: false,
  },
};

const updateListSchema = {
  $$root: {
    type: "object",
    custom: (value, errors) => {
      if (value.name === undefined && value.position === undefined) {
        errors.push({
          type: "atLeastOneField",
          message: "At least one field (name or position) must be provided.",
        });
      }
      return value;
    },
  },

  listId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
  },

  name: {
    type: "string",
    min: 3,
    max: 100,
    trim: true,
    optional: true,
    empty: false,
  },

  position: {
    type: "number",
    integer: true,
    min: 0,
    optional: true,
  },

  $$strict: true,
};

const deleteListSchema = {
  listId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
    empty: false,
  },
  $$strict: true,
};


module.exports = {
  validateCreateList: v.compile(createListSchema),
  validateProjectIdParam: v.compile(projectIdParamSchema),
  validateUpdateList: v.compile(updateListSchema),
  validateDeleteList: v.compile(deleteListSchema)
};
