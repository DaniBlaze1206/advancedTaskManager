const express = require('express');
const router = express.Rpouter();
const projectController = require('../controllers/projectController');


router.post('/create', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/members', projectController.addMember);
router.delete('/:id/memebers/:userId', projectController.removeMember);
router.patch('/:id/transfer', projectController.transferOwnership);



module.exports = router;