const Validator = require("fastest-validator");

const v = new Validator();

const createProjectSchema = {
  name: {
    type: "string",
    min: 3,
    max: 100,
    trim: true,
    empty: false,
  },
  description: {
    type: "string",
    max: 500,
    optional: true,
    trim: true,
  },
  members: {
    type: "array",
    optional: true,
    items: {
      type: "string",
      min: 3,
      max: 30,
      trim: true,
      lowercase: true,
    },
  },
};

const updateProjectSchema = {
  name: {
    type: "string",
    min: 3,
    max: 100,
    trim: true,
    optional: true,
  },
  description: {
    type: "string",
    max: 500,
    trim: true,
    optional: true,
  },
};

const addMemberSchema = {
  username: {
    type: "string",
    min: 3,
    max: 30,
    trim: true,
    lowercase: true,
    empty: false,
  },
};

const transferOwnershipSchema = {
  newOwnerId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
    empty: false,
  },
};

const removeMemberSchema = {
  projectId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
    empty: false,
  },
  userId: {
    type: "string",
    pattern: /^[0-9a-fA-F]{24}$/,
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


const validateCreateProject = v.compile(createProjectSchema);
const validateUpdateProject = v.compile(updateProjectSchema);
const validateAddMember = v.compile(addMemberSchema);
const validateTransferOwnership = v.compile(transferOwnershipSchema);
const validateRemoveMember = v.compile(removeMemberSchema);
const validateProjectId = v.compile(projectIdParamSchema);

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember,
  validateTransferOwnership,
  validateRemoveMember,
  validateProjectId,
};
