yac
===

Yet another chat...

## Libraries

* Angular.js 1.3
* Firebase 1.0
* Bootstrap 3.1
* LoDash 2.4

## Working features

* Login / logout
* Store user in session
* Some Firebase security roles
* Show user avatar
* Stores messages
* Delete messages (own only)
* Message markdown
* Smiles in messages (http://fontello.com/)

### Todo

* Ui-router to prevent guest access
* Limit messages
* Group chats
* Edit messages (own only)
* Better icons
* User autocomplete in new message http://ngmodules.org/modules/ngAutocomplete
* Improve Firebase security roles

#### Ui-ideas

* append new text to previous message unless other user interrupt
* ?no delete/edit? except last message
* .new-message { position: fix }
* scroll down when your new message posted
* many rooms in the same view
* cli for navigation
  - /+new_room # => creates a new room
  - /=room_x     # => go to room_x
  - /-old_room   # => UNSUBSCRIBE from room_x (default will be subscribed)



## Run the server (from `app/`)

    python -m SimpleHTTPServer # => localhost:8000
    # or any other http server like middleman
