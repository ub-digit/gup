/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'frontend',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    i18n: {
      defaultLocale: 'sv'
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      defaultLocale: 'sv'
    }
  };

  ENV.APP.publicationURL = '/publication';
  ENV.APP.serviceURL = '/v1';
  ENV.APP.authenticationBaseURL = '/session';
  ENV.APP.fileURL = '/file';

  // File in public/ directory
  ENV.APP.licenceURL = '/license_Dnr-A_85_592_10.pdf';
  ENV.APP.licenceCode = 'A 85 592 10';

  if (environment === 'development') {
    let develBaseURL = 'http://localhost:' + process.env.GUP_SERVICE_PORT;
    ENV.APP.publicationURL = develBaseURL + ENV.APP.publicationURL;
    ENV.APP.serviceURL = develBaseURL + ENV.APP.serviceURL;
    ENV.APP.authenticationBaseURL = develBaseURL + ENV.APP.authenticationBaseURL;
    ENV.APP.fileURL = develBaseURL + ENV.APP.fileURL;

    ENV.APP.licenceURL = develBaseURL + ENV.APP.licenceURL;
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy = {
     'default-src': "'none'",
     'script-src': "'self' my-own-hostname",
     'font-src': "'self' fonts.gstatic.com",
     'img-src': "'self'",
     'style-src': "'self' fonts.googleapis.com",
     'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
     'report-uri': "/"
    };
  }

  return ENV;
};
