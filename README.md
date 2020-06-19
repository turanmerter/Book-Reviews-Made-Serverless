# Book Reviews Made Serverless

a simple book reviews application using AWS Lambda and Serverless framework.

## Functionality of the application

This application will allow creating/removing/updating/fetching books and their reviews. Each book can optionally have an cover image.
Every book and review can be seen by all users; however, **removing and updating can only be done by the original creator**.

### Books

The application stores Books, and each Book contains the following fields:

* `bookId` (string) - a unique id for a book
* `createdBy` (string) - a unique id for the creator
* `createdAt` (string) - date and time when a book was created
* `name` (string) - name of a book
* `author` (string) - name of the author
* `summary` (string) - summary of the book
* `modifiable` (boolean) - true if the requesting user is the creator (which means they can remove or update this book), false otherwise
* `score` (number) (optional) - average of the scores gathered from the reviews of this book
* `coverUrl` (string) (optional) - a URL pointing to the book cover if it is provided by the user

### Reviews

The application also stores Reviews, and each Review contains the following fields:

* `reviewId` (string) - a unique id for a review
* `bookId` (string) - id of the book which this review is made for
* `createdBy` (string) - a unique id for the creator
* `createdAt` (string) - date and time when a book was created
* `comment` (string) - the comment made by the user
* `score` (number) - the score for the book given by the user
* `modifiable` (boolean) - true if the requesting user is the creator (which means they can remove or update this book), false otherwise

## Testing of the application

In order to test the application, Postman can be used with `Book Reviews Made Serverless.postman_collection.json` prepared collection. It includes collection wide authorization feature; however, it requires up-to-date Postman in order to create an access token.