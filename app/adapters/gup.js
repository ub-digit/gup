import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Object.extend({
  i18n: Ember.inject.service(),
  endpoints: {
    person: {path: 'people', plural:'people'},
    department: {path: 'departments'},
    publication: {path: 'publications'},
    publish: {path: 'publications/publish', singular: 'publication'},
    publication_type: {path: 'publication_types'},
    draft: { path: 'publications', plural: 'publications'},
    import_data: {path: 'fetch_import_data', plural: 'publication'},
    data_source: {path: 'data_sources'},
    category: { path: 'categories', plural: 'categories' },
    review: { path: 'publications/review', singular: 'publication'},
    bibl_review: { path: 'publications/bibl_review', singular: 'publication'},
    set_bibl_review_start_time: {path: 'publications/set_bibl_review_start_time', singular: 'publication'},
    language: {path: 'languages'},
    publication_identifier_code: {path: 'publication_identifier_codes'},
    journal: {path: 'journals'},
    feedback_email: {path: 'publications/feedback_email', singular: 'publication'},
		userdata: {path: 'userdata'},
		serie: {path: 'series'},
		project: {path: 'projects'}
  },

  getLocale: function() {
    return this.get('i18n.locale');
  },


  sessionHeaders: function() {
    var session = this.container.lookup('simple-auth-session:main');
    var headers = {};
    if(session && session.get('isAuthenticated')) {
      headers["Authorization"] = "Token " + session.get('token');
    }
    return headers;
  },
  findOne: function(name, id, params) {
    var that = this;
    return this.fetch(this.urlOne(name, id, params))
    .then(function(data) {
      return that.extractOne(name, data);
    }, this.extractErrors);
  },
  findMany: function(name, params) {
    var that = this;
    return this.fetch(this.urlMany(name, params))
    .then(function(data) {
      return that.extractMany(name, data);
    }, this.extractErrors);
  },
  fetch: function(url) {
    var that = this;
    return Ember.$.ajax({
      url: url,
      method: 'get',
      crossDomain: true,
      type: 'json',
      headers: that.sessionHeaders()
    });
  },
  send: function(url, method, data) {
    var that = this;
    return Ember.$.ajax({
      url: url,
      method: method,
      crossDomain: true,
      type: 'json',
      data: JSON.stringify(data),
      headers: that.sessionHeaders(),
      contentType: 'application/json'
    });
  },
  sendDelete: function(url) {
    var that = this;
    return Ember.$.ajax({
      url: url,
      method: 'delete',
      crossDomain: true,
      type: 'json',
      headers: that.sessionHeaders()
    });
  },
  endpoint: function(name) {
    if(this.endpoints[name]) {
      return this.endpoints[name];
    } else {
      console.log("ERROR! Missing endpoint for", name);
      return undefined;
    }
  },
  plural: function(name) {
    if(this.endpoint(name) && this.endpoint(name).plural) {
      return this.endpoint(name).plural;
    } else {
      return name+'s';
    }
  },
  singular: function(name) {
    if(this.endpoint(name) && this.endpoint(name).singular) {
      return this.endpoint(name).singular;
    } else {
      return name;
    }
  },
  urlOne: function(name, id, params) {
    var url = ENV.APP.serviceURL + '/' + this.endpoint(name).path + '/' + id + '?locale=' + this.getLocale();
    if(params) {
      url += '&' + Ember.$.param(params);
    }
    return url;
  },
  urlMany: function(name, params) {
    var url = ENV.APP.serviceURL + '/' + this.endpoint(name).path + '?locale=' + this.getLocale();
    if(params) {
      url += '&' + Ember.$.param(params);
    }
    return url;
  },
  extractOne: function(name, data) {
    var singularName = this.singular(name);
    if(data.meta) {
      data[singularName].meta = data.meta;
    }
    data[singularName].error = this.extractErrors(data);
    return data[singularName];
  },
  extractMany: function(name, data) {
    var pluralName = this.plural(name);
    var list = data[pluralName];
    if(data.meta) {
      list.meta = data.meta;
    }
    list.error = this.extractErrors(data);
    return list;
  },
  extractErrors: function(reason_or_data) {
    if(reason_or_data.responseJSON) {
      return {
        error: reason_or_data.responseJSON.error,
        status: reason_or_data.status
      };
    } else {
      return reason_or_data.error;
    }
    return undefined;
  },
  destroy: function(name, id) {
    return this.sendDelete(this.urlOne(name, id));
  },
  approve: function(name, id) {
    return this.send(this.urlOne(name, id),'get','');
  },
  saveUpdate: function(name, id, data) {
    var newName = this.singular(name);
    var that = this;
    var dataObject = {};
    dataObject[newName] = data;
    return this.send(this.urlOne(name, id), 'put', dataObject)
    .then(function(data) {
      return that.extractOne(name, data);
    }, this.extractErrors);
  },
  saveCreate: function(name, data) {
    var that = this;
    var dataObject = {};
    dataObject[name] = data;
    return this.send(this.urlMany(name), 'post', dataObject)
    .then(function(data) {
      return that.extractOne(name, data);
    }, this.extractErrors);
  }
});
