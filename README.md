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
  
Flags and their operations:

-u : get most recent tweets from a user with screen_name

    node ztweet.js -u [screen_name] [num tweets to show]
    
    node ztweet.js -u zinkemdotcom 10

-c : get your most recent tweets 

    node ztweet.js -c [num tweets to show]
    
    node ztweet.js -c 10
    
-h : view your home timeline (tweets of those you follow)

    node ztweet.js -h
    
-m : post a status update ('tweet')

    node ztweet.js -m [message]
    
    node ztweet.js -m a status update without quotes
    
    //some characters cannot be used without using quotes
    node ztweet.js -m "Tweeting with style! ;)"
  
-s : search

    node ztweet.js -s [search terms]
    
    node ztweet.js -s queen
    node ztweet.js -s "spinal tap"

multiple operations can be invoked from a single command
    
    //note, the order you input the commands may not be the order they execute
    node ztweet.js -s "mild salsa" -m "looking for a spicy salsa recommendation!"
    
print help message:
 
    node ztweet.js


