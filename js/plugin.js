// Extend JS arrays so we can nicely get randoms
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// TODO: Do not use jsonp.jit.su
$.ajax('http://watsi-api-proxy.herokuapp.com/?url=https://watsi.org/fund-treatments.json', {
  dataType: 'jsonp', // We have JSON, but cross domain :(
  success: function(patients) {
    renderProfile(patients.profiles.randomElement());

    $('#watsi').addClass('loaded');
  }
});

// TODO: No jQuery! If we can do this without it then it'll be easier
// to install on any webpage (quicker, etc), it's a crutch for prototyping.
function renderProfile(profile) {
  $('#patient-title').text("Fund " + profile.name + "'s Treatment");
  $('#patient-photo').attr('src', profile.profile_url  );
  $('#patient-summary').text(profile. promo_description);
  $('#more-link').attr('href', profile.url);
}