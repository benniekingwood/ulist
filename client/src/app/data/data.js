/*
 * uList data - ember.js
 *
 */


 ULIST.adapter = DS.Adapter.create({

 	findAll: function(store, type) {
 		var url = type.url;

 		//$.getJSON(url, function(data) {
 		//	store.loadMany(type, data)
 		//});

 		$.getJSON('/test-data/listings.json', function(data){
 			store.loadMany(type, data);
 		});
 	}
 });

 ULIST.store = DS.Store.create({
 	revision: 12,
 	adapter: ULIST.adapter
 });


 
