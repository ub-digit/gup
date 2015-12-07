import Ember from 'ember';
export default Ember.Component.extend({

  tagName: 'nav',
  classNames: ['center-content'],

  pageArray: function() {
    var pagePadding = 3; //Pages showing around current selection and at start/end
    var pArray = [];
    var i;
    var p;
    if((4*pagePadding+1) > (this.get('pagination.pages') - 2)) {
      for(i=0;i<this.get('pagination.pages');i++) {
        p = {page: i+1};
        if(this.get('pagination.page') === i+1) {
          p['active'] = true;
        }
        pArray.push(p);
      }
      return Ember.ArrayProxy.create({content: Ember.A(pArray)});
    } else {
      var tmpArray = [];
      var current_page = this.get('pagination.page') - 1;
      var max_page = this.get('pagination.pages') - 1;
      for(i=0;i<max_page+1;i++) {
        if((i <= (pagePadding-1)) ||
          ((i >= (current_page - pagePadding)) && (i <= (current_page + pagePadding))) ||
          (i >= (max_page - (pagePadding - 1)))) {
          p = {page: i+1};
        if(this.get('pagination.page') === i+1) {
          p['active'] = true;
        }
        tmpArray.push(p);
      } else {
        tmpArray.push({spacer: true});
      }
    }
    var lastSpacer = false;
    tmpArray.forEach(function(item) {
      if(lastSpacer && item.spacer) { return; }
      pArray.push(item);
      lastSpacer = item.spacer;
    });
    return Ember.ArrayProxy.create({content: Ember.A(pArray)});
  }
}.property('pagination.pages', 'pagination.page'),
});
