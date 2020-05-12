Vue.component('joke-footer',{
	template: `<footer class="muted" style="text-align:center">
		   &copy; 2018 Ace Coder
		   </footer>`
});

Vue.component('joke-footer-2',{
	props: ['year','name'],
	template: `<footer class="muted" style="text-align:center">
		   &copy; {{ year }} {{ name }}
		   </footer>`
});

Vue.component('joke-display',{
    props:['joke'],
    template:`<div><p><b>{{joke.q}}</b></p><p><em>{{joke.a}}</em></p></div>`
});