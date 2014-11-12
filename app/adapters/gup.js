import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Object.extend({
    endpoints: {
	publication:	{ path: 'publications'	}
    },
    findOne: function(name, id, params) {
	var that = this;
	return this.fetch(this.urlOne(name, id, params))
	    .then(function(data) {
		return that.extractOne(name, data);
	    });
    },
    findMany: function(name, params) {
	var that = this;
	return this.fetch(this.urlMany(name, params))
	    .then(function(data) {
		return that.extractMany(name, data);
	    });
    },
    fetch: function(url) {
	var headers = {};
	return Ember.$.ajax({
	    url: url,
	    method: 'get',
	    crossDomain: true,
	    type: 'json',
	    headers: headers
	});
    },
    send: function(url, method, data) {
	var headers = {};
	return Ember.$.ajax({
	    url: url,
	    method: method,
	    crossDomain: true,
	    type: 'json',
	    data: data,
	    headers: headers
	});
    },
    sendDelete: function(url) {
	var headers = {};
	return Ember.$.ajax({
	    url: url,
	    method: 'delete',
	    crossDomain: true,
	    type: 'json',
	    headers: headers
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
	var url = ENV.APP.serviceURL + '/' + this.endpoint(name).path + '/' + id;
	if(params) {
	    url += '?' + Ember.$.param(params);
	}
	return url;
    },
    urlMany: function(name, params) {
	var url = ENV.APP.serviceURL + '/' + this.endpoint(name).path;
	if(params) {
	    url += '?' + Ember.$.param(params);
	}
	return url;
    },
    extractOne: function(name, data) {
	var singularName = this.singular(name);
	data[singularName].meta = data.meta;
	return data[singularName];
    },
    extractMany: function(name, data) {
	var pluralName = this.plural(name);
	var list = data[pluralName];
	list.meta = data.meta;
	return list;
    },
    destroy: function(name, id) {
	return this.sendDelete(this.urlOne(name, id));
    },
    saveUpdate: function(name, id, data) {
	var that = this;
	var dataObject = {};
	dataObject[name] = data;
	return this.send(this.urlOne(name, id), 'put', dataObject)
	    .then(function(data) {
		return that.extractOne(name, data);
	    });
    },
    saveCreate: function(name, data) {
	var that = this;
	var dataObject = {};
	dataObject[name] = data;
	return this.send(this.urlMany(name), 'post', dataObject)
	    .then(function(data) {
		return that.extractOne(name, data);
	    });
    }
});

