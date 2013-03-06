ztweet
==========

zinkem's command line twitter client

To get started you'll need oauth for node.js

    npm install oauth

If you don't have one set up already, you'll want to visit https://dev.twitter.com and create a new application.
Oauth tokens can be acquired there.

Copy config.js to myconfig.js, and copy your oauth tokens into myconfig.js 
    
    cp config.js myconfig.js
    edit myconfig.js



Usage:

    node ztweet.js [flag [params]...]...
  
getting tweets from a user:

    node ztweet.js -u [username] [num tweets to show]
    
    node ztweet.js -u zinkemdotcom 10

getting your own tweets:

    node ztweet.js -c [num tweets to show]
    
    node ztweet.js -c 10
    
getting tweets from those you follow:

    node ztweet.js -h
    
post a status update:

    node ztweet.js -m [message]
    
    node ztweet.js -m a status update without quotes
    node ztweet.js -m "This is a status update!"
  
searching:

    node ztweet.js -s [search terms]
    
    node ztweet.js -s queen
    node ztweet.js -s "spinal tap"

commands can be strung together
    
    //note, the order you input the commands may not be the order they execute
    node ztweet.js -s "mild salsa" -m "looking for a spicy salsa recommendation!"
    
print help message:
 
    node ztweet.js


