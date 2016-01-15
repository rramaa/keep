//localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}')
var colorHash=new Array("Select Color","#e5e5ff","#ffe5f6","#c6ecc6","#ffffb3","#ffcccc","#ebccff","#fff2cc","#ccd9ff");
var colorName=new Array("Select Color","Lavender","Lavender Blush","Green","Yellow","Cosmos","Blue Chalk","Oasis","Hawkes Blue");
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories"));
	if(!this.categories){
		localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}');
		this.categories=JSON.parse(localStorage.getItem("categories"));
	}
	this.notes=JSON.parse(localStorage.getItem("notes"));
	if(!this.notes)
	{
		localStorage.setItem("notes",'{"count":0,"data":[],"last":0}');
		this.notes=JSON.parse(localStorage.getItem("notes"));
	}
	this.n=0;
	this.currentCategory="c0";
	this.insertNoteInHTML=function(note){
		var base=document.getElementById('displayNotes');
		var fragment=document.createDocumentFragment();
		var div=document.createElement('div');
		div.setAttribute('class','note');
		div.setAttribute('id',note.id);
		fragment.appendChild(div);
		var contentDiv=document.createElement('div');
		contentDiv.innerHTML=note.content;
		div.appendChild(contentDiv);

		
		var butDiv=document.createElement('div');
		var deleteDiv=document.createElement('div');
		var button=document.createElement('button');
		button.innerHTML='Delete';
		function temp1(note){
			button.addEventListener('click',function(){
				//note=Object.create(Notes,note);
				//console.log(note);
				//note.deleteNote();
				//debugger;
				//this.deleteNote();
				Notes.prototype.deleteNote.call(note);
			});
		}
		temp1(note);
		deleteDiv.appendChild(button);
		butDiv.appendChild(deleteDiv);

		var colorDiv=document.createElement('div');
		var dropdown=document.createElement('select');
		dropdown.setAttribute('id','colorChange'+note.id);
		for( var colors in colorHash){
			var option=document.createElement('option');
			option.setAttribute('id',colors);
			option.style.backgroundColor=colorHash[colors];
			option.innerHTML=colorName[colors];
			dropdown.appendChild(option);
		}
		(function(note){
			dropdown.addEventListener('change',function(){
				Notes.prototype.changeColor.call(note);
			});
		})(note);
		colorDiv.appendChild(dropdown);
		butDiv.appendChild(colorDiv);

		var catDiv=document.createElement('div');
		var dropdown=document.createElement('select');
		dropdown.setAttribute('id','catChange'+note.id);
		dropdown.setAttribute('class','catChange');
		var option=document.createElement('option');
		option.setAttribute('id',0);
		option.innerHTML='Select Categories';
		dropdown.appendChild(option);
		for(var cats in this.categories){
			if(cats!="c0"){
				var option=document.createElement('option');
				option.setAttribute('id',cats);
				option.innerHTML=this.categories[cats];
				dropdown.appendChild(option);
			}
		}
		(function(note){
			dropdown.addEventListener('change',function(){
				Notes.prototype.changeCategory.call(note);
			});
		})(note);
		if(note.category!=0)
			dropdown.selectedIndex=note.category.substring(1,2);
		catDiv.appendChild(dropdown);
		butDiv.appendChild(catDiv);
		div.appendChild(butDiv);

		div.setAttribute('style',"background-color:"+colorHash[note.color]);
		base.appendChild(fragment);
	};
	this.insertCategoryInHTML=function(catCode){
		obj=this;
		var fragment=document.createDocumentFragment();
		var base=document.getElementById('displayCategories');
		var div=document.createElement('div');
		fragment.appendChild(div);
		var button=document.createElement('button');
		button.setAttribute('class','catButton');
		button.innerHTML=this.categories[catCode];
		(function(catCode){
			button.addEventListener('click',function(){
				obj.viewCategory(catCode);
			});
		})(catCode);
		div.appendChild(button);
		base.appendChild(fragment);
	};
	this.removeNodeFromHTML=function(id){
		var child=document.getElementById(id);
		console.log(child.parentElement);
		child.parentElement.removeChild(child);
	};
};
Application.prototype.populateCategories=function(){
	var obj=this;
	var categories=this.categories;
	//console.log(categories);
	var base=document.getElementById('displayCategories');
	base.innerHTML="";
	for(var key in categories){
		keep.insertCategoryInHTML(key);
	}
	this.updateNoCat();
};
//needs to be updated
Application.prototype.populateNotes=function(){
	if(keep.notes.count>0){
		var base=document.getElementById('displayNotes');
		/*while(base.childNodes[7]){
			base.removeChild(base.childNodes[7]);
		}*/
		base.innerHTML="";
		for(var key in this.notes.data)
		{
			var note=this.notes.data[key];
			if(note){
				if(this.currentCategory==note.category || this.currentCategory=='c0')
				{
					this.insertNoteInHTML(note);
				}
			}
		}
	}
	else
		console.log("no note found");
	//console.log(keep.notes);
};
Application.prototype.saveCategories=function(){
	var categoriesToSave=JSON.stringify(this.categories);
	localStorage.setItem("categories",categoriesToSave);
};
//needs to be updated
Application.prototype.saveNotes=function(){
	var notesToSave=JSON.stringify(this.notes);
	console.log(notesToSave);
	localStorage.setItem("notes",notesToSave);
};
Application.prototype.updateNoCat=function(){
	var categories=this.categories;
	this.n=0;
	for(var key in categories){
		this.n++;
	}
};
Application.prototype.viewCategory=function(key){
	keep.currentCategory=key;
	this.populateNotes();
}
var keep=new Application();
keep.populateCategories();
keep.populateNotes(keep.currentCategory);
bindReturnHandler('content','newNote');
bindReturnHandler('category','newCategory')

//NOTES Class
var Notes=function(content){
	this.id='n'+keep.notes.last;
	this.content=content;
	this.category=keep.currentCategory;
	this.color=Math.floor((Math.random()*8))+1;
};
Notes.prototype.deleteNote=function(){
	var toBeDeleted=this;
	for(var key in keep.notes.data)
	{
		//console.log(JSON.parse(keep.notes.data[key]),toBeDeleted);
		var note=keep.notes.data[key];
		//console.log(toBeDeleted);
		if(note && note.id==toBeDeleted.id)
		{
			//console.log(note.id);
			delete keep.notes.data[key];
			keep.removeNodeFromHTML(note.id);
			keep.notes.count--;
			keep.saveNotes();
		}
	}
	//keep.restructureNotes();
};
Notes.prototype.changeColor=function(){
	//console.log(this);
	var toBeChanged=this;
	var colorCode=document.getElementById('colorChange'+toBeChanged.id).selectedIndex;
	console.log(colorCode);
	for(var key in keep.notes.data)
	{
		var note=keep.notes.data[key];
		if(note && note.id==toBeChanged.id)
		{
			keep.notes.data[key].color=colorCode;
			var div=document.getElementById(note.id);
			div.setAttribute('style',"background-color:"+colorHash[colorCode]);
			keep.saveNotes();
		}
	}
	document.getElementById('colorChange'+toBeChanged.id).selectedIndex=0;
};
Notes.prototype.changeCategory=function(catCode){
	var toBeChanged=this;
	var catCode=document.getElementById('catChange'+toBeChanged.id).selectedIndex;
	console.log(catCode);
	if(catCode!=0){
		for(var key in keep.notes.data)
		{
			var note=keep.notes.data[key];
			if(note && note.id==toBeChanged.id)
			{
				keep.notes.data[key].category="c"+catCode;
				if(keep.currentCategory!=catCode && keep.currentCategory!='c0')
				{
					keep.removeNodeFromHTML(note.id);
				}
				keep.saveNotes();
			}
		}
	}
	//if(document.getElementById('catChange'+note.id))
	//	document.getElementById('catChange'+note.id).selectedIndex=0;
};

document.getElementById('newCategory').addEventListener('click',newCategory);
document.getElementById('newNote').addEventListener('click',newNote);


function newCategory(){
	var cat=document.getElementById("category").value;
	//console.log(keep.n);
	if(cat!=""){
		for(var key in keep.categories){
			if(keep.categories[key].toUpperCase()==cat.toUpperCase())
				return;
		}
		keep.categories["c"+keep.n]=cat;
		keep.saveCategories();
		parent=document.getElementById('categories');
		keep.insertCategoryInHTML("c"+keep.n);
		var dropdowns=document.getElementsByClassName('catChange');
		for(var key in dropdowns){
			if(isNaN(parseInt(key)))
				break;
			var option=document.createElement('option');
			option.setAttribute('id',"c"+keep.n);
			option.innerHTML=cat;
			dropdowns[key].appendChild(option);
		}
	}
	document.getElementById("category").value="";
}
function bindReturnHandler(inputId,buttonId){
	var element=document.getElementById(inputId);
	var button=document.getElementById(buttonId);
	element.addEventListener('keydown',function(event){
		var keyCode=event.keyCode?event.keyCode:event.which;
		if(keyCode==13)
			button.click();
			//event.preventDefault();
	});
}
function newNote(){
	var content=document.getElementById('content').value;
	if(content!=""){
		var tempNote=new Notes(content);
		var tempJSONNote=tempNote;
		keep.notes.data.push(tempJSONNote);
		keep.notes.count++;
		keep.notes.last++;
		//keep.noOfNotes++;
		adjustLine();
		keep.saveNotes();
		if(keep.currentCategory==tempNote.category || keep.currentCategory=='c0')
			keep.insertNoteInHTML(tempNote);
		//console.log(keep.notes);
	}
	document.getElementById('content').value="";
}