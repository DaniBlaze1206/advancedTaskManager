const express = require('express');
const taskRoutes = require('./taskRoutes');
const router = express.Router({ mergeParams: true });


const {
	createList,
	getAllLists,
	updateList,
	deleteList

} = require('../controllers/listController');


router.post("/", createList);
router.get("/", getAllLists);
router.patch('/:listId', updateList);
router.delete("/:listId", deleteList);
router.use("/:listId/tasks", taskRoutes);



module.exports = router;