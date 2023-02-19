const express = require('express')
const router = express.Router()


const {getAlltexts,getFolderTexts,getOneText,createText,deleteText} = require('../controller/textController')


router.get('/getAllLinks',getAlltexts)

router.get('/:folderId',getFolderTexts)

router.get('/:linkid', getOneText)

router.post('/createLink',createText)

router.delete('/:delid',deleteText)

module.exports = router