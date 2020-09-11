const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../helpers/auth')

// Instanciando el Schema
const Note = require('../models/Note')

router.get('/notes/add',isAuthenticated, (req,res)=>{
    //console.log(req.user);
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, async (req,res)=>{
    const {title, description} = req.body;
    let errors = [];
    if(!title){
        errors.push({text:'Please write a title'});
    }
    if(!description){
        errors.push({text:'Please write a description'});
    }
    if(errors.length > 0){
        res.render('notes/new-note',{
          errors,
          title,
          description  
        });
    }else{
        const newNote = new Note({title, description});
        //console.log(req.user._id);
        newNote.user = req.user._id;
        await newNote.save();
        req.flash('success_msg','Note Added Successfully');
        res.redirect('/notes');
    }
})

router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user:req.user._id}).sort({date:'desc'})
    .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
                return {
                    _id: documento._id,
                    title: documento.title,
                    description: documento.description
                }
            })
        }
        res.render('notes/all-notes', {
            notes: contexto.notes,
         }) 
    })

})


router.get('/notes/edit/:id', isAuthenticated, async (req,res) => {
    const note = await Note.findById(req.params.id)
    .then(documento=>{
        const contexto = {
            note:{
                _id: documento._id,
                title: documento.title,
                description: documento.description,
                user: documento.user
            }
        }
        
        if(contexto.note.user != req.user._id){
            req.flash('error_msg','Not Authorized');
            return res.redirect('/notes');
        }
        
        res.render('notes/edit-note', {note: contexto.note});
    })

})

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res)=>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated, async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Note Deleted Successfully');
    res.redirect('/notes');
})

module.exports = router;