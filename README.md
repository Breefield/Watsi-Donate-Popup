Watsi Donate Popup
===========
The Watsi Donate Popup is meant to be included on any website so that users can donate funds to Watsi patients when they are in the process of transacting money.

## Example!

The popup so far:
http://codepen.io/anon/pen/Fyvtd

![Watsi Donate Popup](http://f.cl.ly/items/2D023a2S2u3h3C3U2L0G/Screen%20Shot%202013-11-11%20at%205.16.38%20PM.png)

### Problems?

1. The Watsi Donate Popup effectively just takes you to a profile's page, in a new window. Popups can be blocked, so this may not work.
2. The donation amount isn't going to be set on Watsi's page.
3. Watsi doesn't have an API (yet) which allows us to say xyz vendor's user donated $x, and then bill said vendor.

#### Ideas

1. When taking users to the Watsi patient's page, automatically prefill the donation amount
  * Will need Watsi's help to add GET parameter.
2. Billing method
  * Watsi creates an api which we use in the popup; when users specify a donation amount, it is tallied and billed by Watsi to that api user.
    * Problems (anyone can create fake donations on an API user's behalf and their bill will grow and grow, BAD!)
    * Even if requests are compared against a whitelist of domains, anyone can run Javascript on someone else's website and grow their Watsi Donation bill.
3. Integrate with Balanced/Stripe/Other, and allow developers to link their accounts with Watsi, then pass a Watsi donation with any transaction!
  * Hard, requires cooperation from card processors as well as Watsi.
  * Best.
4. Build the Watsi Checkout experience into the Watsi Donate Popup
  * Paypal - takes you away from the page, this is very secure.
  * Stripe - (stripe.js) would not cut it, there is potential for malicious javascript to sniff a card being entered. Because Watsi would be injecting their Stripe.js key on many pages.
    * iFrame?

  * People would be asked to enter their credit card details twice, once for Watsi and another time for the vendor's product/service. This stinks.

The overall problem is that Watsi can't just "receive" money through an API, the idea is to seamlessly specify what amount should be added to a charge which is about to be made on a vendor's website. This money is taken by the vendor, they _should_ give it to Watsi, but once they have it how can we ensure it gets to them?

The best way to do this is to work with Stripe/Balanced to give the money to Watsi. Stripe is an obvious option because Watsi & Stripe are both YC. Balanced is an "Open Company" though, and it may be able to move the issue up their github fairly quicky, a Crowdtilt integration would be cool.

[Humble Bundle](https://www.humblebundle.com/) is a great example, but they take money then pay out charities. An awesome one-step process for customers, but harder to scale (for a plugin like this).