const express = require('express')
const {
    getAllComments,
    addComment,
    deleteComment,
    editComment,
    addReview,
    deleteReview,
    editReview
} = require('../controllers/commentsController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//protect api routes, routes after this requires auth
router.use(requireAuth)

//GET all courses
router.post('/', getAllComments)
router.post('/addComment', addComment)
router.post('/deleteComment', deleteComment)
router.post('/editComment', editComment)
router.post('/addReview', addReview)
router.post('/deleteReview', deleteReview)
router.post('/editReview', editReview)
module.exports = router