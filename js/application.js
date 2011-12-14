var NotesApp = (function(){
	var App = {
		stores: {},
		views: {}
	};

	//Initialize localStorage Data Store
	App.stores.notes= new Store('notes');
	
	// Note Model
	var Note = Backbone.Model.extend({
		//use localStorage datasotre = table 2 dimension key & value
		localStorage: App.stores.notes,
		
		initialize:function(){
			if (!this.get('title')){
				this.set({title:"Note @"+ Date()})
			};
			if (!this.get('body')){
				this.set({body:"No content"})
			};
		}
	});
	
	// Note collection
	var NoteList= BackBone.Collection.extend({
		//this collection is composed of note objects
		model: Note,
		//Set the localStorage datastore
		localStorage: App.stores.notes,
		initialize: function(){
			var collection=this;//var that= this;
			
			//when localStorage updates, fetch data from the store
			this.localStorage.bind('update',function(){
				//fetch the collection
				collection.fetch();
			})
		}
	});
	// note view
	var NewFormView = Backbone.View.extend({
		events:{
			"submit form":"createNote"
		},
		createNote: function(event){
			var attrs=this.getAttributes();
			var note = new Note();
			
			note.set(attrs);
			note.save();
			
			// stop browser from submitting the form (or following links)
			event.preventDefault();
			
			//stop jQuery Mobile from doing its form magic
			event.stopPropagation();
			
			//close dialog
			$('.ui-dialog').dialog('close');
			this.reset();
		},
	
		getAttributes: function(){
			return{
				title: this.$('form [name="title"]').val(),
				body: this.$('form [name="body"]').val()
			}
		},
		reset: function(){
			this.$('input, textarea').val('');
		}
	});
	
	$(document).ready(function(){
		App.views.new_form = new NewFormView({
			el: $("div#new")
		});
	});
	
	
	
	
	window.Note=Note;
	return App;

})();