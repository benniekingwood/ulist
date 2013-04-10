/*
 * uList models - ember.js
 *
 * Model can use 'number', 'string', 'boolean', and 'date'
 */


// uList - User
// Map uLink user
ULIST.User = Ember.Object.extend({
	_id: null,
	user_name: ''
});

// uList - Listing Model
 ULIST.Listing = Ember.Object.extend({
 	primaryKey: null,
 	_id: null,
 	user_id: null,
 	user_name: '',
 	school_id: null,
 	title: '',
 	short_description: '',
 	long_description: '',
 	category: '',
 	category_id: null,
 	listing_type: '',
 	reply_to: '',
 	email: '', // this may be the same thing as reply to 
 	location: [], // ["latitude":"48 N","logitude":"53 S"]
 	keywords: [], // [{"word":"some_keyword"},{},...]
 	images: [],	// [{"title":"some_title", "url":"some_url"},{},...]
 	price: [],	// [{"dollars":"45","cents":"50"}] = $45.50
 	created: null,
 	expires: null,
 	address: [],	// [{"address":"4th st. s","city":"ARLINGTON","state":"VA","zip":"23453"},{},...]
 	meta: '',
 	flags: [],	// [{"type":"ill"}]

 	// this is just to show the power of ember and what we can do
 	combinedTitle: function() {
 		return this.get('title') + ' - ' + this.get('short_description');
 	}.property('title','short_description'),

 	// assuming we are going to sort the listings by
 	// the expiration date of the listing
 	// The next expiring listing should be the first item
 	// shown in view
 	sortValue: function() {
 		return this.get('expires');
 	}.property('expires')
 });


// Listing Photo model 
 ULIST.Image = Ember.Object.extend({
 	primaryKey: '_id',
 	_id: null,
 	title: '',
 	url: ''
 });

// Listing Location model
 ULIST.Location = Ember.Object.extend({
 	latitude: null,
 	longitude: null
 });

// Listing Keyword model
 ULIST.Keyword = Ember.Object.extend({
 	word: ''
 });

// Listing Price model
 ULIST.Price = Ember.Object.extend({
 	dollarVal: null,
 	centVal: null
 });

// Listing Address model 
 ULIST.Address = Ember.Object.extend({
 	address: '',
 	city: '',
 	state: '',
 	zip: ''
 });

// Listing Flag model 
 ULIST.Flag = Ember.Object.extend({
 	type: ''
 });
 