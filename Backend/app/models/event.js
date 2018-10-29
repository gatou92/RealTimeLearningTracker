// Author: Maria Gatou //

var mongoose 			= require('mongoose');
var Schema 				= mongoose.Schema;

//Mongoose schema creation//
var EventSchema 		= new Schema({
	week: 			String,
	id: 			String,
	course: 		String,
	time: 			Date,
	index: 			String,
	vert: 			String,
	vidID: 			String,
	quID: 			String,
	vidDuration: 	Number,
	timeSite: 		Number,
	timeInterval:   Number,
	thread:         Date,
	resCom:         Date,
 	openWidget:     Number,
 	closeWidget:    Number,
 	showYou:        Date,
 	hideYou:        Date,
 	showAvGrad:     Date,
 	hideAvGrad:     Date,
 	showBeGrad:     Date,
 	hideBeGrad:     Date,

});

module.exports = mongoose.model('Event', EventSchema);