var colorHash=new Array("red","blue","green","white","yellow");
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories"));
	this.notes=localStorage.getItem("notes");
};
Application.prototype.populateCategories=function(){
	var categories=this.categories;
	console.log(categories);
	for(var key in categories){
		console.log(categories[key]);
	}
};
//needs to be updated
Application.prototype.populateNotes=function(catCode){
	var notes=JSON.parse(this.notes);
	console.log(notes);
	for(var key in notes){
		console.log(notes[key]);
	}
};
Application.prototype.saveCategories=function(){
	var categoriesToSave=JSON.stringify(this.categories);
	localStorage.setItem("categories",categoriesToSave);
};
//needs to be updated
Application.prototype.saveNotes=function(){
	var notesToSave=JSON.stringify(this.notes);
	localStorage.setItem("notes",notesToSave);
};
var keep=new Application();
keep.populateCategories();
//keep.populateNotes(c0);


var Notes=function(content){
	this.content=content;
	this.category="c0";
	this.color=Math.floor((Math.random()*5));
};
Notes.prototype.deleteNote=function(){

};
Notes.prototype.changeColor=function(colorcode){

};
Notes.prototype.changeCategory=function(catCode){

};