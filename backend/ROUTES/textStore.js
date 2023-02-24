const express = require('express')
const router = express.Router()


const {getAlltexts,getFolderTexts,getOneText,createText,deleteText} = require('../controller/textController')


router.get('/getAllTexts',getAlltexts)

router.get('/:folderId',getFolderTexts)

router.get('/:textid', getOneText)

router.post('/createText',createText)

router.delete('/:delid',deleteText)

module.exports = router