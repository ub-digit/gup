export default function(){
	this.transition(
	  this.fromRoute('publications.manage.index'),
	  this.toRoute('publications.manage.show'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);
}