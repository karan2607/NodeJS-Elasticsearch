module.exports = (app) => {
    const notes =  require('../controllers/node.controller')
    app.get('/home',notes.home)
    app.get('/notes', notes.findall)
    app.get('/notes/:id', notes.findone)
    app.get('/notes/productId/:PId', notes.findPId)
    app.delete('/notes/delete/:id', notes.delete)
    app.delete('/notes/delete/productid/:PId', notes.deletePId)
    app.post('/create', notes.create)
    app.post('/update/:id', notes.update)
    app.post('/update/productid/:PId', notes.updatePId)
} 