# f-server

Server for a very lite socail media application

# env-variables

DATABASE_USERNAME=%%
DATABASE_PASSWORD=%%
DATABASE_HOST=%%
DATABASE_PORT=%%
DATABASE_DB=%% 'friends' in my case
PORT=%%
NODE_ENV=%% production or development
JWT_SECRET=%%
JWT_EXPIRES_IN=%%

# Resources

user
request
friend

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# user-endpoints

..........................................................................................................................................................
/api/v1/user/

method -get \* no authentication required
It will return you all the users. You can pass page and count in query string to do pagination but if not provided, by default,first 10 result will be shown.

method -post \* no authentication required
create a user by sending email,firstname,lastname,password and avatar in JSON object. As of not, only "male" and "female" avatars has been done. Password will be encrypted. Email has to be unique. No email verification is implemented.

........................................................................................................................................................
/api/v1/user/:id \* no authentication required
methods- get,put,delete
It will respectively retrieve a user, modify the user (data should be sent in the body as json object) and delete the user

...............................................................................................................................................................................
/api/v1/user/login/

method -post
required data = {email, password}. It will return in JWT token in token key which nneds to be stored by client an then pass it in Bearer toekn to make protected api calls.

............................................................................................................................................................................
/api/v1/user/me
methods- get,put
It will respectively retrieve athe logged in user, modify the user (data should be sent in the body as json object)

........................................................................................................................................................................
/api/v1/user/me:id
method - get
It will retrieve the user of teh given id param

.......................................................................................................................................................................
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# request-endpoints => to access, user must log in

..................................................................................................................................................................
/api/v1/request/
method -get
It will return all the requests ent to the logged in user. Pagination has been applied

...................................................................................................................................................................
/api/v1/request/:id
method -post,delete,put
post will sent a request by the logged in user to the id user. No body data required
delete will cancel the request by the logged in user which hs has received from id user
put will acccept the request which has been sent to the logged in user by id user. No body data required

......................................................................................................................................................................
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# friends-endpoint => to access, user must log in

....................................................................................................................................................................
/api/v1/friend/
method -get
it will return all the friends of the logged in user. pagination has been applied

....................................................................................................................................................................
/api/v1/friend/:id
method -delete
it will unfriend the id user by the logged in user. (they both will not be friends)

....................................................................................................................................................................
/api/v1/friend/:id/friends
method -get
It will return the list of all the friends of id's user if id's user is a friend of logged in user. Bascially it will return the "List of friends of a friend whoose id is given in param". In the return, the looged in user will also be one of the elements. If required, can be removed. Pagination has beend applied.

..................................................................................................................................................................
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Pagination,

each 'page' will have 'count' number of result elements. For example, if you want to see results from 6-10 together, you can pass 'page=2&&count=5' inn query string.
If page an count is not provided by the user, by default, page=1&&count=10 will be sued which will return first 10 result elements.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# order

all the lists are prepared with the order of their element's id in db in ascending order

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# packages

express, cors, helmet, bcrypt, dotenv, mysql, hpp, jsonwebtoken, nodemon(installed as dependency and not as dev depenedency), morgon (dev-dependency)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# database

mysql

Schema has been given in ./database

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# testing

I have tested its functionality with postman. Both the collection and environment is available at ./postman
apis inside login folder need the authetication first.

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
