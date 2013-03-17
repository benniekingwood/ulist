ulist
=====

-ulist is uLink's college classifieds application.

-----------------------------
uList v1.0 Technology Stack
-----------------------------

Server Side
-------------
Database: MySql(Users,Schools, basically Legacy Models)
  	  MongoHQ
		  ObjectRocket? 

		  Post Collections will be organized by school, and will be 
		  created if they do not exist on demand.
		  Example post collection format: ulist_post_[schoo_id] i.e. ulist_post_1

Server Code: Node.js, Express Framework

// http://docs.objectrocket.com/nodejs
// http://support.mongohq.com/languages/nodejs.html

Email Module:
Capcha Module:

Partner SDKs: Paypal 
// node plugin: TBD

Client Side
-------------
Web - Ember.JS?
Mobile - iOS

----------------------------------
uList v1.0 Functional Requirements
----------------------------------

ULink Users
-need to be able to view all school's posts
-have to be authenticated and a user of the school to post to the school
-when a user submits a post, they need to do some sort of new age security
-all the user's posts will show up in their account, in which they can edit them  

Employers
-need to be able to post jobs to the school
-this "employer" type posts can have more information
  -last as long as 30 days? 
	-payment model for the jobs? TODO: reference other classifieds like Uloop, craiglist
-this post will be a one time post in which an email will get sent to them where they can 
	always go back to the ulink site and edit their post

Listing
-need to be created by the user and they will have
	-pictures (2)
	-any information from the user
	-meta data (i.e. bolding)
	-will last 7 days
Headlined Listing
-will be just like a regular post, but will show up in the headlined section
	-can be for 3 or 7 days 
-once a post is initially created, it goes into active right away
-need to be able to be "Flagged? or some other more intuitive langauage" by any public user of the application

Payments
-for all "add-ons", the user must pay via a technology

Map View - Google Maps
-Will have all the categories available, and when clicked, all the posts with 
locations will show up (for the clicked category)
-A marker will have basic information like a thumbnail pic (if available), and
the title


Searching
-should be by category, and search against tag

Categories
TBD - see craigslist



