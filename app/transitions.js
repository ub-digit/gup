export default function(){
this.transition(
	  this.fromRoute('foo'),
	  this.toRoute('bar'),
	  this.use('toLeft', {duration: 300}),
	  this.reverse('toRight', {duration: 300})
	);
}