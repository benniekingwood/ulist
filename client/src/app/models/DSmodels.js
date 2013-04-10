/*
 * uList models - ember.js
 *
 * Model can use 'number', 'string', 'boolean', and 'date'
 */

/* TEST CASE BOOK */
/*
ULIST.Book = Ember.Object.extend({
	title: '',
	author: '',
	genre: ''
});
*/

// uList - Listing Model
 ULIST.Listing = DS.Model.extend({
 	primaryKey: '_id',
 	_id: DS.attr('number'),
 	user_id: DS.attr('number'),
 	user_name: DS.attr('string'),
 	school_id: DS.attr('number'),
 	title: DS.attr('string'),
 	short_description: DS.attr('string'),
 	long_description: DS.attr('string'),
 	category: DS.attr('string'),
 	category_id: DS.attr('number'),
 	listing_type: DS.attr('string'),
 	reply_to: DS.attr('string'),
 	email: DS.attr('string'), // this may be the same thing as reply to 
 	location: DS.belongsTo('ULIST.Location'),
 	keywords: DS.hasMany('ULIST.Keyword'), // list of keywords ',' delineated? 
 	images: DS.hasMany('ULIST.Image'),
 	price: DS.belongsTo('ULIST.Price'),
 	created: DS.attr('date'),
 	expires: DS.attr('date'),
 	address: DS.belongsTo('ULIST.Address'),
 	meta: DS.attr('string'),
 	flags: DS.hasMany('ULIST.Flag'),

 	// this is just to show the power of ember and what we can do
 	combinedTitle: function() {
 		return this.get('title') + ' - ' + this.get('short_description');
 	}.property('title','short_description')
 }).reopenClass({url: '/test-data/listings.json'});


// Listing Photo model 
 ULIST.Image = DS.Model.extend({
 	primaryKey: '_id',
 	_id: DS.attr('number'),
 	title: DS.attr('string'),
 	url: DS.attr('string')
 });

// Listing Location model
 ULIST.Location = DS.Model.extend({
 	latitude: DS.attr('number'),
 	longitude: DS.attr('number')
 });

// Listing Keyword model
 ULIST.Keyword = DS.Model.extend({
 	word: DS.attr('string')
 });

// Listing Price model
 ULIST.Price = DS.Model.extend({
 	dollarVal: DS.attr('number'),
 	centVal: DS.attr('number')
 });

// Listing Address model 
 ULIST.Address = DS.Model.extend({
 	city: DS.attr('string'),
 	state: DS.attr('string'),
 	address: DS.attr('string'),
 	zip: DS.attr('string')
 });

// Listing Flag model 
 ULIST.Flag = DS.Model.extend({
 	type: DS.attr('string')
 });
 