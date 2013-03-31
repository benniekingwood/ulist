/*
 * uList - Views
 *
 */

 // The listingsView will handle all events
 // related to the listingsController
 // These actions include:
 //		- click
 //		- slide?
 //		- touch
 ULIST.ListingsView = Ember.View.extend({
 	/* add view actions here: click, keyUp, keyDown, remove/editSelected, selectedListing, etc.. */
 	classNameBindings: ['isSelected'],

 	click: function() {
 		var content = this.get('content');
 		ULIST.selectedListingController.set('content', content);
 	},

 	touchEnd: function() {
 		this.click();
 	},

 	isSelected: function() {
 		var selectedListing = App.selectedListingController.get('content'),
 			content = this.get('content');

 		if (content == selectedListing)
 			return true;

 		return false;
 	}.property('App.selectedListingController.content')
 });

 // The ListingDetailsView will handle all
 // events/actions for the listingDetailsController
 // (if there are any?)
 ULIST.ListingDetailsView = Ember.View.extend({

 });

 // Add listings view
 ULIST.AddListingView = Ember.View.extend({

 });

 // Edit listings view
 ULIST.EditListingView = Ember.View.extend({

 });


 