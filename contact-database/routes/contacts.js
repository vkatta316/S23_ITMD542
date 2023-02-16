var express = require('express');
var router = express.Router();
const crypto = require('crypto');
//const contactsRepo = require('../src/contactsRepository');
const contactsRepo = require('../src/contactsFileRepository');
const {body, validationResult} = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = contactsRepo.findAll();
  console.log(data);
  res.render('contacts', { heading: 'List Of All Contacts', title: 'Contacts Database', contacts:data });
});

/* GET Contact page. */
router.get('/add', function(req, res, next) {
  console.log(crypto.randomUUID()); 
  res.render('contacts_add', { heading: 'Create a New Contact' , lastEdited: new Date() });
});


/* POST Contact page. */
router.post('/add', 
  body('firstName').trim().notEmpty().withMessage('First Name cannot be empty') ,
  body('lastName').trim().notEmpty().withMessage('Last Name cannot be empty') ,
function(req, res, next) {
  const result = validationResult(req)
  if(!result.isEmpty()){
    res.render('contacts_add' , {heading : 'Create a New Contact' , msg : result.array()});
  }else{
    // Add data base
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.email.trim();
    let notes = req.body.notes.trim();
    let id = crypto.randomUUID();
    let date = new Date().toLocaleString();
    
    var contactInfo = {
        id, firstName, lastName, email, notes, date
    };

    console.log(contactInfo + ' ' +firstName + ' ' +lastName +' ' + email + ' ' + notes); 
    contactsRepo.create({contactData: contactInfo})
    res.redirect("/contacts");
  }
  
});

/* GET Single Contact. */
router.get('/:uuid', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  console.log('AAAAAAA' + JSON.stringify(contact));
  if(contact){
    res.render('contact', { title: 'View Contact Details', contact: contact});
  }else{
    res.redirect('/contacts')
  }
 
});

/* Delete Contact. */
router.get('/:uuid/delete', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  res.render('contacts_delete', { heading: 'Delete a New Contact', contact: contact });
});

/* Confirm Delete Contact. */
router.post('/:uuid/delete', function(req, res, next) {
  contactsRepo.deleteById(req.params.uuid);
  res.redirect('/contacts');
});

/* Edit Contact page. */
router.get('/:uuid/edit', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  console.log('Edit Contact page' + contact);
  res.render('contacts_Edit', { heading: 'Edit a Contact' , contact: contact });
});

/* POST Edit Contact page. */
router.post('/:uuid/edit',
  body('firstName').trim().notEmpty().withMessage('First Name cannot be empty') ,
  body('lastName').trim().notEmpty().withMessage('Last Name cannot be empty') ,
function(req, res, next) {
  const result = validationResult(req)
  if(!result.isEmpty()){
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit' , {heading : 'Edit a Contact' , msg : result.array() , contact: contact});

  }else{
    // Edit data base
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.email.trim();
    let notes = req.body.notes.trim();
    let id = crypto.randomUUID();
    let date = new Date().toLocaleString();
    
    var contactInfo = {
        id, firstName, lastName, email, notes, date
    };
    const updatedContact = {id: req.params.uuid , contactData: contactInfo};
    console.log("updatedContact " + updatedContact);
    console.log(contactInfo + ' ' +firstName + ' ' +lastName +' ' + email + ' ' + notes); 
    contactsRepo.update(updatedContact)
    res.redirect(`/contacts/${req.params.uuid}`);
  }
  
});
module.exports = router;
