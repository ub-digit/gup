export default function(){
	this.transition(
	  this.fromRoute('publications.manage.index'),
	  this.toRoute('publications.manage.show'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);
	this.transition(
	  this.fromRoute('publications.manage.show'),
	  this.toRoute('publications.manage.show.edit'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);
}