/**
 * Created by JimBarrows on 10/13/16.
 */
'use strict';
var Agenda         = require("agenda");
var PineconeModels = require("@reallybigtree/pinecone-models");
var BlogPost       = PineconeModels.BlogPost;
var Campaign       = PineconeModels.Campaign;
var moment         = require("moment");
var mongoose       = require("mongoose");

console.log("Loading agenda");
var mongoConnectionString = "mongodb://mongo/agenda";

console.log("config: " + mongoConnectionString);

mongoose.connect(mongoConnectionString);

var agenda = new Agenda({db: {address: mongoConnectionString}});



agenda.define('enque wordpress', enqueBlogPosts);

agenda.on('ready', function () {
	console.log("Starting agenda!");
	agenda.every('1 minutes', 'enque wordpress');
	agenda.start();
});