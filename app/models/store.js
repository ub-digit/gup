import Ember from 'ember';

export default Ember.Object.extend({
    adapter: function() {
	return this.container.lookup('adapter:gup');
    },
    id: function(id_or_params) {
	if(typeof(id_or_params) === "number" || typeof(id_or_params) === "string") {
	    return id_or_params;
	} else if(typeof(id_or_params) === "object") {
	    return id_or_params.id;
	} else {
	    return null;
	}
    },
    params: function(id_or_params, maybe_params) {
	if(typeof(id_or_params) === "number" || typeof(id_or_params) === "string") {
	    return maybe_params;
	} else if(typeof(id_or_params) === "object") {
	    delete id_or_params.id;
	    return id_or_params;
	} else {
	    return null;
	}
    },
    find: function(name, id_or_params, maybe_params) {
	if(this.id(id_or_params)) {
	    return this.adapter().findOne(name, this.id(id_or_params), this.params(id_or_params, maybe_params));
	} else {
	    return this.adapter().findMany(name, this.params(id_or_params, maybe_params));
	}
    },
    save: function(name, model, params) {
	if(model.pubid) {
    console.log('model.pubid:'+ model.pubid);
	    return this.adapter().saveUpdate(name, model.pubid, model);
	} else {
    console.log('no model.pubid');
	    return this.adapter().saveCreate(name, model, params);
	}
    },
    destroy: function(name, id) {
	return this.adapter().destroy(name, id);
    }
});
