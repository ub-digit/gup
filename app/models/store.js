import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Object.extend({
  adapter: function() {


	  return getOwner(this).lookup('adapter:gup');
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
	  if(model.id) {
      console.log('model.id:'+ model.id);
	    return this.adapter().saveUpdate(name, model.id, model);
	  } else {
      console.log('no model.id');
	    return this.adapter().saveCreate(name, model, params);
	  }
  },
  destroy: function(name, id) {
	  return this.adapter().destroy(name, id);
  }
});
