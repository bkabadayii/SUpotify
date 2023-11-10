## 1) Guide for Sending Requests to the Server

1. Choose an endpoint to send the request to.
2. Set necessary variables for that endpoint in request body.
3. Set authorization header.
   * 3.1. Put "authorization" for the key of the header.
   * 3.2. Put "Bearer <your_token>" for the value of the header.
   * 3.3. You can find your token from either browser cookies, or it is also present as a return value when you login to the app.

-   You can find examples on how to achieve this kind of a request structure in POSTMAN.

#### Tokens for Users

-   **Warning**: These tokens expire after some time. Please send a login request to get an up-to-date token.

-   **testUser**: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDE3YTNjZDg3YzQ4YzY0OWFjNGYzYSIsImlhdCI6MTY5OTU1MTY2NywiZXhwIjoxNjk5ODEwODY3fQ.Nf7Pt1H8fREeHX7rXy9HdFGbewi_cqVuGXJYbjn7-WI"

-   **testUser2**: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGE1YWI4OTY3YzBiNDhiOWM0OTEwMCIsImlhdCI6MTY5OTU1MTc3MiwiZXhwIjoxNjk5ODEwOTcyfQ.4Ft-T9JORHL-fhUiqQJCcALBfkATi3oNSFcbIHUTDj0"

## 2) All API Endpoints

### 1) Authorization: /auth
#### 1. /login
* __Definition:__ Can be used to login and get user token.
* __Headers:__ No headers
* __Body:__
  ```json
  {
    "email": "testUser@supotify.com",
    "password": "123123"
  } 
  ```
#### 2. /signup
* __Definition:__ Can be used to signup.
* __Headers:__ No headers
* __Body:__
  ```json
  {
    "email": "testUser2@supotify.com",
    "username": "testUser2",
    "password": "123123"
  }
  ```
#### 3. /logout
* __Definition:__ Can be used to logout and delete the token from browser cookies.
* __Headers:__ No headers
* __Body:__
  ```json
  {
    "username": "testUser"
  }
  ```

### 2) Liked Songs: /api/likedSongs
#### 1. /createLikedSongsForUser
* __Definition:__ Initializes liked songs array for a user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
  
#### 2. /addToUserLikedSongs
* __Definition:__ Adds a song to a user's liked songs array if it does not already exist.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "songID": "1298318923"
  }
  ```
#### 3. /addManyToUserLikedSongs
* __Definition:__ Adds all songs in a given list to a user's liked songs array.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "songIDList": [
        "1928319823",
        "1824718223",
        "1972319723",
        "9272721465"
    ]
  }
  ```
#### 4. /removeFromUserLikedSongs
* __Definition:__ Removes a song from a user's liked songs array if it exists.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "songID": "1298318923"
  }
  ```
#### 5. /getLikedSongsForUser
* __Definition:__ Returns all songs in a user's liked songs array.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
  
