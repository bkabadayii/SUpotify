### Guide for Sending Requests to the Server

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
