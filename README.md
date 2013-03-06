ztweet
==========

zinkem's command line twitter client

To get started you'll need oauth
    npm install oauth 
    cp config.js myconfig.js
    edit myconfig.js

myconfig.js must be populated with OAuth info acquired from twitter.

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
    
    node ztweet.js -m single_word
    node ztweet.js -m "This is a multi word status update"
  
  searching:
    node ztweet.js -s [search terms]
    
    node ztweet.js -s queen
    node ztweet.js -s "spinal tap"
    
  print help message:
    node ztweet.js


