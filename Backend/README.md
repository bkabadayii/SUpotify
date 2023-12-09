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

### 2) Content: /api/content
#### 1. /addNewAlbum
* __Definition:__ Adds an album to the database.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "spotifyID": "7e7t0MCrNDcJZsPwUKjmOc"
  }
  ```
#### 2. /addNewArtist
* __Definition:__ Adds an artist to the database.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "spotifyID": "1298318923",
    "albumCount":  5
  }
  ```
#### 3. /getTrack/:trackID
* __Definition:__ Returns track information by its id.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
* __Params:__
  ```json
  {
    "trackID": "656e633d60712a3abffe2667"
  } 
  ```
#### 4. /getAlbum/:albumID
* __Definition:__ Returns album information by its id.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
* __Params:__
  ```json
  {
    "albumID": "656e633c60712a3abffe2662"
  } 
  ```
#### 5. /getArtist/:artistID
* __Definition:__ Returns artist information by its id.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
* __Params:__
  ```json
  {
    "artistID": "656e633c60712a3abffe2660"
  } 
  ```
### 3) Followed Users: /api/followedUsers
#### 1. /createFollowedUsersForUser
* __Definition:__ Initializes the FollowedUser for a user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
#### 2. /addToUserFollowedUsers
* __Definition:__ Adds a user to followed users list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "followedUsername": "testUser2"
  }
  ```
  #### 3. /removeFromUserFollowedUsers
* __Definition:__ Removes a user from followed users list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "followedUsername": "testUser2"
  }
  ```
  #### 4. /getAllFollowedUsersForUser
* __Definition:__ Returns the followed users list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
  #### 5. /recommendationBlockUser
* __Definition:__ Blocks a user for getting recommendation from current user .
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "blockedUsername": "testUser2"
  }
  ```
    #### 5. /recommendationUnblockUser
* __Definition:__ Unblocks a user if blocked, for getting recommendation from current user .
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "blockedUsername": "testUser2"
  }
  ```
### 4) Liked Content: /api/likedContent
#### 1. /createLikedContent
* __Definition:__ Initializes the likedContent for a user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
#### 2. /getLikedContent/:contentType
* __Definition:__ Returns likedContent for a user by its content type.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
* __Params:__
  ```json
  {
    "contentType": "TRACK" //It can be "TRACK","ALBUM" or "ARTIST".
  } 
  ```
#### 3. /likeContent
* __Definition:__  Adds a content to the chosen content type list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "contentID": "656e634960712a3abffe26a3",
    "contentType": "TRACK" 
  }  
  ```
#### 4. /removeFromLikedContent
* __Definition:__  Removes a content from the chosen content type list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "contentID": "656e634960712a3abffe26a3",
    "contentType": "TRACK" 
  }  
  ```
#### 5. /likeCustomTrack
* __Definition:__  Adds a custom track to the likedTracks list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "trackName": "Custom Track 2",
    "albumName": "Custom Album 2",
    "artists": ["batubatu"] 
  }  
  ``` 
#### 6. /addManyToLikedTracks
* __Definition:__  Adds multiple tracks to the likedTracks list.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "trackList": [
      {"trackName": "RANDEVU", "albumName": "ROMANTİK'", "artistName": "Motive"},
      {"trackName": "Les", "albumName": "Camp'", "artistName": "Childish Gambino"}
    ]  
  }  
  ```
#### 7. /likeTrackBySpotifyID
* __Definition:__  Adds a track to the likedTracks list by its Spotify ID.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "spotifyID": "34tz0eDhGuFErIuW3q4mPX",
    "albumSpotifyID": "5MS3MvWHJ3lOZPLiMxzOU6"
  }  
  ```
#### 8. /likeAlbumBySpotifyID
* __Definition:__  Adds an album to the likedAlbums list by its Spotify ID.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "spotifyID": "0MV1yCXcNNQBfwApqAVkH0"
  }  
  ```
#### 9. /likeArtistBySpotifyID
* __Definition:__  Adds an artist to the likedArtists list by its Spotify ID.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "spotifyID": "51DevdOxIJin6DB1FXJpD1"
  }  
  ```                 
### 5) Playlist: /api/playlists
#### 1. /createUserToPlaylists
* __Definition:__ Initializes playlists for user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
#### 2. /getUserPlaylists
* __Definition:__ Returns all of the playlists of user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
#### 3. /getPlaylist/:playlistID
* __Definition:__ Returns a speseific playlist of user by id.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body
* __Params:__
  ```json
  {
    "playlistID": "6569f7fac3e7bb36e2397604" 
  } 
  ```
#### 4. /createPlaylist
* __Definition:__  Creates a playlist and adds it to users playlists.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "playlistName": "Playlist 1"
  }  
  ```
#### 5. /deletePlaylist
* __Definition:__  Removes a playlist from users playlists and deletes it.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "playlistID": "6569f7a3c3e7bb36e23975f2"
  }  
  ```
#### 6. /addTrackToPlaylist
* __Definition:__  Adds a track to a spesific playlist.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "playlistID": "6569f7fac3e7bb36e2397604",
    "trackID": "6553fc4ae60d8b20f001a8e2"
  }  
  ```
#### 6. /removeTrackFromPlaylist
* __Definition:__  Removes a track from a spesific playlist.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "playlistID": "6569f7fac3e7bb36e2397604",
    "trackID": "6553fc4ae60d8b20f001a8e2"
  }  
  ``` 
### 6) Rating: /api/ratings          
#### 1. /createUserToRatings
* __Definition:__ Initializes Ratings for user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body   
#### 2. /getUserToRatings
* __Definition:__ Returns ratings of user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body  
#### 3. /rateContent
* __Definition:__  Adds rating to a content, updates if rated before.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "ratingType": "ARTIST", //It can be "TRACK","ALBUM" or "ARTIST"
    "relatedID": "656e646260712a3abffe2d27",
    "rating": 8.9
  }  
  ``` 
#### 4. /deleteRating/:ratingType/:relatedID
* __Definition:__  Deletes a rating from a content.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body  
* __Params:__
  ```json
  {
    "ratingType": "TRACK", //It can be "TRACK","ALBUM" or "ARTIST"
    "relatedID": "6553fc9ee60d8b20f001aa2f",
  }  
  ``` 
#### 5. /getRatingInfo/:ratingType/:relatedID
* __Definition:__  Gets rating information for a content.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body  
* __Params:__
  ```json
  {
    "ratingType": "TRACK", //It can be "TRACK","ALBUM" or "ARTIST"
    "relatedID": "6553fc9ee60d8b20f001aa2f",
  }  
  ```  
* __Returns:__
  ```json
  {
    "selfRating": "Number",
    "averageRating": "Number",
    "numUsersRated": "Number",
    "numFriendsRated": "Number",
    "friendsAverageRating": "Number", //null if no friends rated
    "friendRatings": "[{username: String, rating: Number, ratedAt: Date}]"
  }  
  ```
### 7) Recommendation: /api/recommendation
#### 1. /recommendTrackFromFollowedUser/:trackNum
* __Definition:__ Gets recommendation from a followed user for current user.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__ No body  
* __Params:__
  ```json
  {
    "trackNum": 4, 
  }  
  ```
### 8) Spotify: /getFromSpotify
#### 1. /getTrackData
* __Definition:__ Gets track information from spotify.
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "songID": "2QtkKDe1mHoCGuKqpqFnXR", 
  }  
  ```  
### 9) Statistics: /api/statistics
#### 1. /getTopRatedTracks
* __Definition:__ Gets top rated tracks filtered by:
Rate date,
Track release date,
Genre,
Artist,
Number of items(5,20).
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "filters": {
        "rateDate": ["2023-1", "2024-1"],
        "releaseDate": ["2021-1", "2024-1"],
        "genres": [],
        "artists": []
    },
    "numItems": 2
  }  
  ``` 
#### 2. /getTopRatedAlbums
* __Definition:__ Gets top rated albums filtered by:
Rate date,
Album release date,
Genre,
Artist,
Number of items(5,20).
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "filters": {
        "rateDate": ["2023-1", "2024-1"],
        "releaseDate": ["2020-1", "2024-1"],
        "genres": [],
        "artists": []
    },
    "numItems": 2
  }  
  ```   
#### 3. /getTopRatedArtists
* __Definition:__ Gets top rated tracks filtered by:
Rate date,
Genre,
Number of items(5,20).
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "filters": {
        "rateDate": ["2023-1", "2024-1"],
        "genres": []
    },
    "numItems": 2
  }  
  ```  
#### 4. /getLikedContentStatistics
* __Definition:__ Gets liked content statistics filtered by:
Rate date,
Content release date,
Genre,
Artist,
Number of items(5,20).
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Body:__
  ```json
  {
    "filters": {
        "likeDate": ["2023-1", "2024-1"],
        "genres": []
    },
    "numItems": 2,
    "contentType": "ALBUM"  // It can be "TRACK","ARTIST" or "ALBUM"
  }  
  ``` 
#### 5. /getAllGenres/:contentType/:source
* __Definition:__ Gets all genres:
* __Headers:__
  ```json
  {
    "Authorization": "Bearer <user_token>"
  } 
  ```
* __Params:__
  ```json
  {
    "contentType":"TRACK", // It can be "TRACK","ARTIST" or "ALBUM"
    "source":"LIKES"
  }  
  ```              

  
