ulist
=====

-ulist is uLink's college classifieds application.

-----------------------------
uList v1.0 Technology Stack
-----------------------------

Server Side
-------------
Database: 

MySql: Categories
NoSQL: Posting
<br />	-MongoHQ or ObjectRocket

Post MongoDB Collections will be organized by school, and will be 
created if they do not exist on demand.
Example post collection format: ulist_post_[school_id] i.e. ulist_post_1

Server Code: Node.js, Express Framework

// http://docs.objectrocket.com/nodejs
// http://support.mongohq.com/languages/nodejs.html

Email Node Module: TBD
<br />
Capcha Module: TBD
<br />
Partner SDKs: Paypal 
// node plugin: TBD

Client Side
-------------
Web - Ember.JS?
Mobile - iOS

----------------------------------
uList v1.0 Functional Requirements
----------------------------------

ULink Users<br />
-need to be able to view all school's posts<br />
-have to be authenticated and a user of the school to post to the school<br />
-when a user submits a post, they need to do some sort of new age security<br />
-all the user's posts will show up in their account, in which they can edit them  <br />
<br />
Employers<br />
-need to be able to post jobs to the school<br />
-this "employer" type posts can have more information<br />
  -last as long as 30 days? <br />
	-payment model for the jobs? TODO: reference other classifieds like Uloop, craiglist<br />
-this post will be a one time post in which an email will get sent to them where they can 
	always go back to the ulink site and edit their post<br />

Listing<br />
-need to be created by the user and they will have:<br />
	-pictures (3)<br />
	-any information from the user<br />
	-meta data (i.e. bolding)<br />
	-will last 7 days<br />
	<br />
	
Headlined Listing<br />
-will be just like a regular post, but will show up in the headlined section (see Living Social "Escapes" for design) <br />
-can be for 1 or 3 days <br />
-once a post is initially created, it goes into active right away<br />
-need to be able to be "Flagged? or some other more intuitive langauage" by any public user of the application<br />
-If posting has no picture, we should have a default image (but it should not be very strong) so that the posts' information
is clearly visible

Strong Listing<br />
-will be with the regular listings, but visually will have the following features:
	- taller height size (compared to regular posts)
	- Bolded Title
	- Image in post row (if available)

Payments<br />
-for all "add-ons", the user must pay via a technology (Paypal)<br />

Pricing System <br />
-We should have a pricing table that has costs for headlining and strong listing per school.  
-Algorithms should determine weekly prices: <br />
	-based on number of headlines and strongs vs. number of postings we get per (week at first) 
	-prices should also have the ability overriden so that we can force a price and keep it that way (a flag on the table)

Map View - Google Maps<br />
-Will have all the categories available, and when clicked, all the posts with 
locations will show up (for the clicked category)<br />
-A marker will have basic information like a thumbnail pic (if available), and
the title<br />

<br />
Searching<br />
-should be by category, and search against tag<br />

Categories
TBD - see craigslist



