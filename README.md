# [Connect +](http://connectplus.mybluemix.net) #
## Thought Process ##
*Think in Indian scenario there are so many events(gatherings) in your relatives and often you find your self in awkward situation where we don't know anyone around us OR we don`t know who should we connect with.We tried to solve this problem by analyzing people around your present location. *
## What you have to do! ##
*-Give access to your present location.
-Give us your username(twitter)
-We will generate first your personality using IBM's personality insight API
-Then we will use twitter to find user nearby your location and perform personality insight in all of them
-Then we match you and show results!
 isn't that interesting?*
## Future Extensions ##
*
-Add Tone Analyzer API of IBM,So that we may find out how will certain human will absorb our particular message.
-Use Direct Message Feature of twitter to message that guy.
-Use Synonym api of IBM to find synonym words to greet the user.
-Use Alchemy API to extract certain keywords from profile and draw and interest plot to show how much 
your interest match with opponents.
-Obviously improving UI is always an option.*
## Technology Stack ##
*NodeJS
ExpressJS
Twitter API
IBM watson PI API*
## How to run ##
*1. Clone this in your local machine


2.Download Nodejs command prompt for your OS


3.open nodejs command prompt and change directory in that to this projects directory


4.type npm install #it will install all dependencies


5.type node server.js


6.Go to loacalhost:3000 to see it in action


**### Dont forget to include your own credentials to use twitter and IBM apis ###***