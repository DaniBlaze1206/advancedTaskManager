const Validator = require("fastest-validator");
const v = new Validator();

const objectIdPattern = /^[0-9a-fA-F]{24}$/;


const createListSchema = {
  name: {
    type: "string",
    min: 3,
    max: 100,
    trim: true,
    empty: false,
  },
  $$strict: true,
};


const projectIdParamSchema = {
  projectId: {
    type: "string",
    pattern: objectIdPattern,
    empty: false,
  },
  $$strict: true,
};


const projectAndListIdParamSchema = {
  projectId: {
    type: "string",
    pattern: objectIdPattern,
    empty: false,
  },
  listId: {
    type: "string",
    pattern: objectIdPattern,
    empty: false,
  },
  $$strict: true,
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

module.exports = {
  validateCreateList: v.compile(createListSchema),

  validateProjectIdParam: v.compile(projectIdParamSchema),

  validateProjectAndListIdParam: v.compile(projectAndListIdParamSchema),

  validateUpdateList: v.compile(updateListSchema),
};
