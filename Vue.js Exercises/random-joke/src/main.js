const app = new Vue({
	el: '#app',
	data: {
        title: "Ajax Vue Example (with Fetch API)",
        result: {"q":"Downloading Jokes...", "a":""},
        copyrightYear: 2020,
        copyrightName: "Joshua Fredrickson"
	},
    created(){
        this.search();
    },
	methods:{
	search(){
		//if (! this.term.trim()) return;
		fetch("https://cors-anywhere.herokuapp.com/http://igm.rit.edu/~acjvks/courses/2018-fall/330/php/get-a-joke.php")
		.then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {	
			console.log(json);
            this.result = json;
		});
	   } // end search
	} // end methods
});
