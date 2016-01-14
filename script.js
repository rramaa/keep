//localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}')
var colorHash=new Array("Select Color","Red","Blue","Green","White","Yellow");
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories"));
	if(!this.categories){
		localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}');
		location.reload();
	}
	this.notes=JSON.parse(localStorage.getItem("notes"));
	if(!this.notes)
	{
		localStorage.setItem("notes",'{"number":0}');
		location.reload();
	}
	this.n=0;
	this.noOfNotes=this.notes['number'];
	this.currentCategory="c0";
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
		data.setAttribute('class','catButton');
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
	if(keep.notes['number']>0){
		var base=document.getElementById('allNotes');
		while(base.firstChild){
			base.removeChild(base.firstChild);
		}
		for(var key in keep.notes)
		{
			if(key!='number' && (catCode==keep.notes[key]['category'] || catCode=='c0'))
			{
				var fragment=document.createDocumentFragment();
				var div=document.createElement('div');
				div.setAttribute('class','note');
				fragment.appendChild(div);
				var table=document.createElement('table');
				var row=document.createElement('tr');
				var data=document.createElement('td');
				data.setAttribute('colspan','3');
				data.innerHTML=keep.notes[key]['content'];
				row.appendChild(data);
				table.appendChild(row);

				
				var row=document.createElement('tr');
				var data=document.createElement('td');
				var button=document.createElement('button');
				button.innerHTML='Delete';
				data.appendChild(button);
				row.appendChild(data);

				var data=document.createElement('td');
				var dropdown=document.createElement('select');
				dropdown.setAttribute('id','colorChange');
				for( var colors in colorHash){
					var option=document.createElement('option');
					option.setAttribute('id',colors);
					option.innerHTML=colorHash[colors];
					dropdown.appendChild(option);
				}
				data.appendChild(dropdown);
				row.appendChild(data);

				var data=document.createElement('td');
				var dropdown=document.createElement('select');
				dropdown.setAttribute('id','catChange');
				var option=document.createElement('option');
				option.setAttribute('id',0);
				option.innerHTML='Select Categories';
				dropdown.appendChild(option);
				for(var cats in this.categories){
					var option=document.createElement('option');
					option.setAttribute('id',cats);
					option.innerHTML=this.categories[cats];
					dropdown.appendChild(option);
				}
				data.appendChild(dropdown);
				row.appendChild(data);

				table.appendChild(row);
				div.appendChild(table);
				div.setAttribute('style',"background-color:"+colorHash[keep.notes[key]['color']])
				base.appendChild(fragment);
			}
		}
	}
	else
		console.log("no note found");
	console.log(keep.notes);
};
Application.prototype.saveCategories=function(){
	var categoriesToSave=JSON.stringify(this.categories);
	localStorage.setItem("categories",categoriesToSave);
};
//needs to be updated
Application.prototype.saveNotes=function(){
	this.notes['number']=this.noOfNotes;
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
keep.populateNotes(keep.currentCategory);


var Notes=function(content){
	this.content=content;
	this.category="c0";
	this.color=Math.floor((Math.random()*5))+1;
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
	document.getElementById("category").value="";
}


function newNote(){
	var content=document.getElementById('content').value;
	var tempNote=new Notes(content);
	var tempJSONNote='{"content":"'+tempNote.content+'","color":"'+tempNote.color+'","category":"'+tempNote.category+'"}';
	if(keep.noOfNotes==0)
	{
		keep.notes='{"n0":'+tempJSONNote+'}';
		keep.notes=JSON.parse(keep.notes);
	}
	else
		keep.notes["n"+keep.noOfNotes]=JSON.parse(tempJSONNote);
	keep.noOfNotes++;
	keep.saveNotes();
	keep.populateNotes(keep.currentCategory);
	console.log(keep.notes);
	document.getElementById('content').value="";
}

