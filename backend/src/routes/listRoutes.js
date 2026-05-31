const express = require('express');
const router = express.Router({ mergeParams: true });


const {
	createList,
	getAllLists,
	updateList,
	deleteList

} = require('../controllers/listController');

const authMiddleware = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, createList);
router.get("/", authMiddleware, getAllLists);
router.patch('/:listId', authMiddleware, updateList);
router.delete("/:listId", authMiddleware, deleteList);
router.use("/:listId/tasks", taskRoutes);



module.exports = router;