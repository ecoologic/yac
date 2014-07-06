yac [(by erikcoologic)](https://github.com/ecoologic)
===

Yet another chat...

## Libraries

* Angular.js 1.3
* Firebase 1.0
* Bootstrap 3.1
* LoDash 2.4

## Open-source Contribution

Please feel free to send a pull request, fork or get in touch.

## Run the server (from `app/`)

    python -m SimpleHTTPServer # => localhost:8000
    # or any other http server like middleman

## Working features

* Login / logout
* Store user in session
* Some Firebase security roles
* Show user avatar
* Store messages
* Delete messages (own only)
* Message markdown
* Smiles in messages (http://fontello.com/)

### Todo

* Group chats
* User autocomplete in new message http://ngmodules.org/modules/ngAutocomplete
* Smiles autocomplete in new message
* .new-message { position: fix }
* footer with credits and help
* Better icons
* Limit fetched messages
* Improve Firebase security roles
* Bower
* Linemanjs

#### Ui-ideas

* append new text to previous message unless other user interrupt
* no delete/edit except last message
* many rooms in the same view
* cli for room navigation
  - `/+new_room # => creates a new room`
  - `/=room_x   # => go to room_x`
  - `/-old_room # => UNSUBSCRIBE from room_x (default will be subscribed)`
