import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ENV from '../config/environment';

var CustomAuthenticator = Base.extend({
  restore: function(properties) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  Ember.$.ajax({
				type: 'GET',
				url: ENV.APP.authenticationBaseURL+'/'+properties.token
		  }).then(function() {
				resolve(properties);
		  }, function() {
				reject();
		  });
		});
  },
  authenticate: function(credentials) {
    Ember.$('body').addClass("loading");
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  Ember.$.ajax({
				type: 'POST',
				url: ENV.APP.authenticationBaseURL,
				data: JSON.stringify({
			    username: credentials.identification,
			    password: credentials.password
				}),
				contentType: 'application/json'
		  }).then(function(response) {
				var token = response.access_token;
				Ember.run(function() {
			    resolve({
						authenticated: true,
						token: token,
						username: response.user.username,
						userid: response.user.id,
            can_delete_published : Ember.$.inArray('delete_published', response.user.role.rights) !== -1,
            can_bibreview : Ember.$.inArray('bibreview', response.user.role.rights) !== -1
			    });
				});
		  }, function(xhr, status, error) {
				Ember.run(function() {
			    reject(xhr.responseJSON.error);
				});
		  });
		});
	},
  invalidate: function() {
		return new Ember.RSVP.Promise(function(resolve) {
		  resolve();
		});
  }

});

export var initialize = function(container) {
  container.register('authenticator:custom', CustomAuthenticator);
	
};

export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: initialize
};
