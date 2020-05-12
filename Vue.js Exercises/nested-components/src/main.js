let app = new Vue({
	el: '#root',
	data: {
		newName: "",
        names: ["Adam","Betty","Charlie","Doris"],
        title: "We Happy Guests"
	},
	methods:{
		addName(){
			if (!this.newName) return;
			this.names.push(this.newName);
			this.newName = "";
		}
	}
});

