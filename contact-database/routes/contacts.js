var express = require('express');
var router = express.Router();
const crypto = require('crypto');
//const contactsRepo = require('../src/contactsRepository');
const contactsRepo = require('../src/contactsFileRepository');

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = contactsRepo.findAll();
  console.log(data);
  res.render('contacts', { heading: 'List Of All Contacts', title: 'Contacts Database', contacts:data });
});

/* GET Contact page. */
router.get('/add', function(req, res, next) {
  console.log(crypto.randomUUID()); 
  res.render('contacts_add', { heading: 'Create a New Contact' , contact_id:crypto.randomUUID() });
});


/* POST Contact page. */
router.post('/add', function(req, res, next) {
  if(req.body.firstName.trim() === '' || req.body.lastName.trim() === ''){
    res.render('contacts_add' , {heading : 'Create a New Contact' , msg : 'Contact First Name and Last Name are Required Fields'});

  }else{
    // Add data base
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.email.trim();
    let notes = req.body.notes.trim();
    
    var contactInfo = {
      firstName, lastName, email, notes,
    };

    console.log(contactInfo + ' ' +firstName + ' ' +lastName +' ' + email + ' ' + notes); 
    contactsRepo.create({text: contactInfo})
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
router.post('/:uuid/edit', function(req, res, next) {
  if(req.body.firstName.trim() === '' || req.body.lastName.trim() === ''){
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit' , {heading : 'Edit a Contact' , msg : 'Contact First Name and Last Name are Required Fields' , contact: contact});

  }else{
    // Add data base
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let email = req.body.email.trim();
    let notes = req.body.notes.trim();
    
    var contactInfo = {
      firstName, lastName, email, notes,
    };
    const updatedContact = {id: req.params.uuid , text: contactInfo};
    console.log("updatedContact " + updatedContact);
    console.log(contactInfo + ' ' +firstName + ' ' +lastName +' ' + email + ' ' + notes); 
    contactsRepo.update(updatedContact)
    res.redirect(`/contacts/${req.params.uuid}`);
  }
  
});
module.exports = router;
