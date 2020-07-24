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

  let baseURL = null;
  let hostName = null;

  if (environment === 'development') {
    hostName = 'localhost';
    baseURL = 'http://' + hostName + ':' + process.env.GUP_SERVICE_PORT;
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

  }
  else if (environment === 'lab') {
    hostName = 'api.gup-lab.ub.gu.se';
    baseURL = 'http://' + hostName;
  }

  if (baseURL) {
    ENV.APP.publicationURL = baseURL + ENV.APP.publicationURL;
    ENV.APP.serviceURL = baseURL + ENV.APP.serviceURL;
    ENV.APP.authenticationBaseURL = baseURL + ENV.APP.authenticationBaseURL;
    ENV.APP.fileURL = baseURL + ENV.APP.fileURL;
    ENV.APP.licenceURL = baseURL + ENV.APP.licenceURL;
  }

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'font-src': "'self' fonts.gstatic.com",
    'img-src': "'self'",
    'style-src': "'self' fonts.googleapis.com",
    'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
    'report-uri': "/"
  };

  if (hostName) {
    ENV.contentSecurityPolicy['script-src'] = "'self' " + hostName;
  }

  return ENV;
};
