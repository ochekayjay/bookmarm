const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const linkingid = mongoose.Types.ObjectId

const {getAllLinks,getFolderLinks,getOneLink,createLink,deleteLink,querySearchLink} = require('../controller/linkController')


router.get('/getAllLinks',getAllLinks)

router.get('/search', querySearchLink)

router.get('/folder/:folderId',getFolderLinks)

router.get('/single/:linkid', getOneLink)

router.post('/createLink',createLink)

router.delete('/:delid',deleteLink)


module.exports = router