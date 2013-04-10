/*
 * uList Controllers file - Ember.js
 *
 */

/* This will keep track of listing items displayed on webpage/app */
 ULIST.listingsController = Ember.ArrayController.extend({
 	content: [],
 	selected: null,

 	//init: function() {
 		//$.get('people.json', function(data) {
		//  ULIST.listController.set('content', data);
		//});

 	//	this.set('listing', ULIST.store.findAll(ULIST.Listing));
 	//},

 	/* We will use this to test the loading of our listings */
 	loadListings: function() {
 		var self = this;
 		$.getJSON('test_data/listings.json', function(data) {
 			data.forEach(function(item){
 				//alert('creating listing object!');
 				self.pushObject(ULIST.Listing.create(item));
 			});
 		});
 	},

 	findSelectedListingIndex: function() {
 		var content = this.get('content');

 		for (idx = 0; idx < content.get('length'); idx++) {
 			if (this.get('selected') == content.objectAt(idx))
 				return idx;
 		}

 		return 0;
 	},

 	// add listing to uList content
 	add: function(lisitng) {
 		var idx, length = this.get('length');
 		idx = this.insertListingAt(listing.get('sortValue'), 0, length);

 		// insert element in the array
 		this.insertAt(idx, listing);

 		// If the listing expiration date
	    // changes, we need to re-insert it at the correct
	    // location in the list.
	    listing.addObserver('sortValue', this, 'listingValueDidChange');
 	},

 	// remove a listing from uList content
 	remove: function(listing) {
 		this.removeObject(listing);
 		this.removeObserver('sortValue', this, 'listingValueDidChange');
 	},

 	// binary search that will make a determination
 	// on where to insert the new listing
 	insertListingAt: function() {

 	},

 	// observer will automatically call this method,
 	// and the listing will be re-inserted into the list
 	// of listings
 	listingValueDidChange: function(listing) {
 		this.remove(listing);
 		this.add(listing);
 	},

 	// don't really need this to initialize, however,
 	// this is to show that we can modify the binding of
 	// ember objects
 	createListingFromJSON: function(json) {

 	}
 });

ULIST.listingsController.loadListings();

ULIST.selectedListingController = Ember.Object.create({
	content: null
});










