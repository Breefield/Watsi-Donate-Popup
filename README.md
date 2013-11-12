Watsi Donate Popup
===========
The Watsi Donate Popup is meant to be included on any website so that users can donate funds to Watsi patients when they are in the process of transacting money.

## How to Install?


### Problems?

Watsi doesn't have an API (yet) which allows us to say xyz vendor's user donated $x, and then bill said vendor.

The Watsi Donate Popup effectively just takes you to a profile's page, in a new window. Popups can be blocked, so this may not work.

#### Ideas

1. When taking users to the Watsi patient's page, automatically prefill the donation amount
  * Will need Watsi's help to add GET parameter.
2. Billing method
  * Watsi creates an api which we build into popup, when users specify a donation amount, it is tallied and billed by Watsi that api-key's owner.
    * Problems (anyone can create fake donations on an API user's behalf and their bill will grow and grow, BAD!)