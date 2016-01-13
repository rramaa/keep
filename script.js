//localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}')
var colorHash=new Array("red","blue","green","white","yellow");
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories"));
	if(!this.categories){
		localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}');
		location.reload();
	}
	this.notes=localStorage.getItem("notes");
	this.n=0;
};
Application.prototype.populateCategories=function(){
	obj=this;
	var categories=this.categories;
	console.log(categories);
	var fragment=document.createDocumentFragment();
	var table=document.createElement("table");
	fragment.appendChild(table);
	for(var key in categories){
		var row=document.createElement("tr");
		var data=document.createElement("td");
		var button=document.createElement("button");
		button.innerHTML=categories[key];
		console.log(key);
		//needs to be understood
		(function(key){
			button.addEventListener('click',function(){
				obj.populateNotes(key);
			});
		})(key);
		//
		data.appendChild(button);
		row.appendChild(data);
		table.appendChild(row);
		console.log(categories[key]);
	}
	var base=document.getElementById('categories');
	base.appendChild(fragment);
	this.updateNoCat();
};
//needs to be updated
Application.prototype.populateNotes=function(catCode){
	//var notes=JSON.parse(this.notes);
	console.log(catCode);
	//for(var key in notes){
	//	console.log(notes[key]);
	//}
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
Application.prototype.updateNoCat=function(){
	var categories=this.categories;
	this.n=0;
	for(var key in categories){
		this.n++;
	}
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


function newCategory(){
	var cat=document.getElementById("category").value;
	console.log(keep.n);
	keep.categories["c"+keep.n]=cat;
	keep.saveCategories();
	parent=document.getElementById('categories');
	keep.populateCategories();
	parent.removeChild(parent.childNodes[7]);
}