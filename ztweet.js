var OAuth = require('oauth').OAuth;
var util = require('util');
var sys = require('sys');
var querystring = require('querystring');
var config = require('./myconfig').config;

//oauth credentials should be stored in myconfig.js________________
var access_token = config.access_token;
var access_token_secret = config.access_token_secret;
var oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    config.consumer_key,
    config.consumer_secret,
    "1.0A",
    null,
    "HMAC-SHA1"
  );

//utilities________________________________________________________
var packURL = function(base, params){
  var packedurl = base+"?"+querystring.stringify(params);
  return packedurl;
};

//io callback wrappers________________________________________________

//checks for errors before calling cb-- all cbs should be derived from this
var errorCheckingCallback = function(cb){
  return function(error, data){
    if(error){
      console.log("Error: ");
      console.log(error); 
    } else {
      cb(error, data);
    }
  };
};

//expects dataparser returns an array/object from io data
//performs dataop on each 
var parseIterateCallback = function(dataparser, dataop){
  return errorCheckingCallback(function(error, data) {
    var array = dataparser(data);
    for( var i in array ){
      dataop(array[i]);
    }
  });
};

//tweet parsers_____________________________________________________
var reverseTweetParser = function(data){
  return JSON.parse(data).reverse();
};

var searchReverseTweetParser = function(data){
  return JSON.parse(data).statuses.reverse();
};

//tweet operations_________________________________________________
var displayTweet = function(tweet){
  var tweet_display = tweet.user.screen_name + " tweets " + 
                      tweet.text + "\n" + 
                      "on " + tweet.created_at + ", id: "+ tweet.id +"\n";
  console.log(tweet_display);
};

var colors = {
  Clear       : "\33[0;0m",
  Black       : "\33[0;30m",
  Blue        : "\33[0;34m",
  Green       : "\33[0;32m",
  Cyan        : "\33[0;36m",
  Red         : "\33[0;31m",
  Purple      : "\33[0;35m",
  Brown       : "\33[0;33m",
  Gray        : "\33[0;37m",
  DarkGray    : "\33[1;30m",
  LightBlue   : "\33[1;34m",
  LightGreen  : "\33[1;32m",
  LightCyan   : "\33[1;36m",
  LightRed    : "\33[1;31m",
  LightPurple : "\33[1;35m",
  Yellow      : "\33[1;33m",
  White       : "\33[1;37m"
}

var displayColorTweet = function(tweet){

  var tweet_header = colors.Green +"@"+ tweet.user.screen_name + colors.DarkGray;
  while(tweet_header.length < 35)
    tweet_header = tweet_header+"_";
  tweet_header = tweet_header+colors.Cyan + tweet.created_at + colors.DarkGray;
  while(tweet_header.length < 100)
    tweet_header = tweet_header+"_";
  tweet_header = tweet_header + tweet.id;

  var tweet_display = colors.White  + tweet.text + colors.Clear+"\n"; 


  console.log(tweet_header);
  console.log(tweet_display);

};

//twitter api calls________________________________________________

//suitable for any endpoint that returns data that canbe parsed into an array
//dataparser takes responses 'data' as a parameter and returns an array
//dataop is an operation to be performed on all elements of that array in order
var twiget = function(endpoint, opts, dataparser, dataop){
  var url = "https://api.twitter.com/1.1/"+endpoint;
  if(opts) {
    url = packURL(url, opts);
  }
  console.log("twiget url : "+url);
  oa.get(url, access_token, access_token_secret,
          parseIterateCallback(dataparser, dataop));
};

//op interface instances___________________________________________
//each of these methods conforms to the op interface:
//function parameters:
// 1. array of non-op words (operation params)

//-u SCREEN_NAME COUNT
var getUserTimeline = function(params){
  var user  = params[0] || config.twitter_screenname;
  var count = params[1] || 10;
  twiget("statuses/user_timeline.json",
    { "screen_name": user, "count": count },
    reverseTweetParser,
    displayColorTweet);
};

//-c COUNT
var getMyTimeline = function(params) {
  count = params[0] || 10;
  getUserTimeline([config.twitter_screenname, count]);
};

//-h 
var getHomeFeed = function(params){
  twiget("statuses/home_timeline.json", 
    null, 
    reverseTweetParser, 
    displayColorTweet);
};

//-s STRING
var getSearchResults = function(params){
  var searchterms = params.join(' ');
  console.log("get search results, "+searchterms);
  twiget("search/tweets.json",
    {"q":searchterms},
    searchReverseTweetParser,
    displayColorTweet);

};

//-m STRING
var postTweet = function(params){
  var message = params.join(' ');
  var url = packURL("https://api.twitter.com/1.1/statuses/update.json",
                    { "status": message });
  console.log(url);

  oa.post(url,access_token, access_token_secret, null, null, 
    errorCheckingCallback(function(data){
          console.log("Status sucessfully set to "+message);
          console.log(data);
    }));

};

//-d SCREEN_NAME STRING
var sendDirectMessage = function(params){
  var recipient = params.shift();
  var message = params.join(' ');
  var body = querystring.stringify(
                    {"text": message,
                    "screen_name": recipient
                     });

  var url = packURL("https//api.twitter.com/1.1/direct_messages/new.json",
                    {"screen_name": recipient,
                     "text": message });

  console.log(body);

  //var url = "https//api.twitter.com/1.1/direct_messages/new.json";

  oa.post(url,access_token, access_token_secret, body, null,
    errorCheckingCallback(function(data){
      console.log("sent "+message+" to "+recipient);
      console.log(data)
    }));
};


//--help
var showHelp = function(operations){
  console.log("ztweet [<flag> [param]...]...");
  console.log("invoking with no flag produces this message");
  console.log("flags:");
  for(var o in operations){
    console.log("\t"+o+" "+operations[o].params);
    console.log("\t\t"+operations[o].desc);
  }
};

//command line interface
var parseOps = function(argv, operations){

  var getOpParams = function(argv){
    var params = [];
    while(argv[0] && operations[argv[0]] === undefined){
      params.push(argv.shift());
    }
    return params;
  };

  //default operation is to fetch home feed
  if(argv.length <= 2 ||
     argv[2] == '--help'){
      //operations['-h'].op(getOpParams(argv));
      showHelp(operations);
  } else {

    while(argv.length > 0){
      var o = argv.shift();
      if(operations[o] !== undefined){
        operations[o].op(getOpParams(argv));
      }
    }

  }
};

//begin program
(function main(){
  //initialize operations
  var operations = {
    "-c": { 
      "op"     : getMyTimeline,
      "params" : "NUM",
      "desc"   : "displays your NUM recent tweets"
    },
    "-h": {
      "op"     : getHomeFeed,
      "params" : "",
      "desc"   : "List your home feed (recent tweets you follow)."
    },
    "-m": {
      "op"     : postTweet,
      "params" : "STRING",
      "desc"   : "posts STRING as status update. (STRING ends at end of line or next op flag)"
    },
    "-s": {
      "op"     : getSearchResults,
      "params" : "STRING",
      "desc"   : "takes string in quotes; uses string as search terms"
    }, 
    "-u": {
      "op"     : getUserTimeline,
      "params" : "SCREEN_NAME NUM",
      "desc"   : "displays NUM recent tweets from user using SCREEN_NAME"
    },
    "-d": {
      "op"     : sendDirectMessage,
      "params" : "SCREEN_NAME STRING",
      "desc"   : "sends STRING as a direct message to SCREEN_NAME"
    },
    "--help": {
      "op"     : showHelp,
      "params" : "",
      "desc"   : "displays this help message"
    }
  };

  parseOps(process.argv, operations);
})();





