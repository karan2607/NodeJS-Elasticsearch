
var Note = require('../models/note.model')
const { request } = require('express')
const nodeRoutes = require('../routes/node.routes')
const ind = require('../../index')



exports.home = function(req,res){
    console.log('inside /home working ')
    res.send('home started')
}

exports.findall = function(req,res){
    console.log('inside /notes working ')
    ind.client.search({
        index : "mydoc",
        type : "mytype",
    }, function(err, resp, status){
        if(err){
            console.log('err : ', err)
        }else{
            console.log('Searched')
            data = resp.hits.hits
            var dict = []
            for (i=0;i<data.length;i++){
                console.log(data[i]["_source"])
                dict.push(data[i]["_source"])
            }
            res.status(200).send(dict)
        }
    })
    // Note.find().then((notes)=> {
    //     res.send(notes)
    // }).catch((err) => {
    //     res.send('error')
    // })
}

exports.findone = function(req,res){
    console.log('inside /notes/id working ')
    ind.client.get({
        index : "mydoc",
        type : "mytype",
        id : req.params.id
    }, function(err, resp, status){
        if(err){
            console.log('err : ', err)
        }else{
            console.log('Searched')
            res.status(200).send(resp._source)
        }
    })

    // Note.findById(req.params.id).then((notes)=> {
    //     res.send(notes)
    // }).catch((err) => {
    //     res.send('error')
    // })
}

exports.findPId = async function(req,res){
    try{
        console.log('inside /notes/Pd working ')
        let data =  await Note.find({'PId':Number(req.params.PId)})
        res.send(data)
        /*.then((notes)=> {
            res.send(notes)
        }).catch((err) => {
            res.send('error')
        })*/
    }
    catch(err){
        console.log('inside catch : ',err)
        res.send(err)
    }    
}


exports.delete = function(req,res){
    console.log('inside /notes/delete id working ')
    ind.client.deleteByQuery({
        index : "mydoc",
        type : "mytype",
        body: {
            query: {
                match: { _id : req.params.id }
            }
         }
    },function(err, resp, status){
        if(err){
            console.log('err : ', err)
        }else{
            console.log('Deleted')
            res.status(200).send('Done')
        }
    })
    // Note.findByIdAndDelete(req.params.id).then(()=> {
    //     res.send('done')
    // }).catch((err) => {
    //     res.send('error')
    // })
}

exports.deletePId = function(req,res){
    console.log('inside /notes/deletePId working ')
    Note.deleteOne({'PId':Number(req.params.PId)}).then(()=> {
        res.send('done')
    }).catch((err) => {
        res.send('error')
    })
}

exports.create = function(req,res){
    console.log('inside /create working ',req.body)
    ind.client.index({
        index : 'mydoc',
        type : 'mytype',
        id : req.body.PId,
        body : req.body
    }, function(err, resp, status){
        if(err){
            console.log('error in create : ', err)
            return err
        }else{
            console.log('Created')
            res.status(200).send({
                message : 'Successfully inserted in elasticsearch'
            })
        }
    } )
    // const note = new Note({
    //     PId: req.body.PId,
    //     PTitle: req.body.PTitle,
    //     PName: req.body.PName
    // })
    // console.log('note :',note)
    // note.save()
    // .then((data)=>{
    //     res.send(data)
    // }).catch((err)=>{
    //     res.send('error')

    // })
}


exports.update = function(req,res){
    console.log('inside /update working ',req.body)
    ind.client.updateByQuery({
        index : 'mydoc',
        type : 'mytype',
        body : {
            script: {
                source: "ctx._source = params.val",
                lang : "painless",
                params : {
                    val:
                    {
                        PId : req.body.PId,
                        type : req.body.type,
                        name : req.body.name
                    }
                }
              },
              query: {
                match: {
                  _id : req.params.id
                }
              }
        }
    }, function(err, resp, status){
        if(err){
            console.log('error in update : ', err)
            return err
        }else{
            console.log('Updated')
            res.status(200).send({
                message : 'Successfully Updated in elasticsearch'
            })
        }
    } )
    // Note.findByIdAndUpdate(req.params.id, {
    //     PId: req.body.PId,
    //     PTitle: req.body.PTitle,
    //     PName: req.body.PName
    // }).then(()=> {
    //     res.send('done')
    // }).catch((err) => {
    //     res.send('error')
    // })
    
}

exports.updatePId = function(req,res){
    console.log('inside /update/productid working ',req.body)
    Note.updateOne({'PId':Number(req.params.PId)}, {
        PId: req.body.PId,
        PTitle: req.body.PTitle,
        PName: req.body.PName
    }).then(()=> {
        res.send('done')
    }).catch((err) => {
        res.send('error')
    })
    
}