export default function(){
	this.transition(
	  this.fromRoute('publications.manage.dashboard'),
	  this.toRoute('publications.manage.show'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);


	this.transition(
	  this.fromRoute('publications.manage.dashboard'),
	  this.toRoute('publications.manage.new'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);

	this.transition(
	  this.fromRoute('publications.manage.dashboard'),
	  this.toRoute('publications.manage.import'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);

	this.transition(
	  this.fromRoute('publications.manage.dashboard'),
	  this.toRoute('publications.manage.fileimport'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);


	this.transition(
	  this.fromRoute('publications.manage.show'),
	  this.toRoute('publications.manage.show.edit'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);

	this.transition(
	  this.fromRoute('publications.manage.dashboard.drafts'),
	  this.toRoute('publications.manage.dashboard.published'),
	  this.use('fade', {duration: 200}),
	  this.reverse('fade', {duration: 200})
	);
}