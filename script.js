//localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}')
var Color=function(name,hash){
	this.name=name;
	this.hash=hash;
}
var Colors=[];
//adding colors
Colors.push(new Color("Select Color",""));
Colors.push(new Color("Lavender","#e5e5ff"));
Colors.push(new Color("Lavender Blush","#ffe5f6"));
Colors.push(new Color("Green","#c6ecc6"));
Colors.push(new Color("Yellow","#ffffb3"));
Colors.push(new Color("Cosmos","#ffcccc"));
Colors.push(new Color("Blue Chalk","#ebccff"));
Colors.push(new Color("Oasis","#fff2cc"));
Colors.push(new Color("Hawkes Blue","#ccd9ff"));
//Check for mobile
var isMobile=( navigator.userAgent.match(/Android/i)
		 || navigator.userAgent.match(/webOS/i)
		 || navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i)
		 || navigator.userAgent.match(/BlackBerry/i)
		 || navigator.userAgent.match(/Windows Phone/i))?true:false;
//
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories"));
	if(!this.categories){
		var defaultCategories=function(){
			this.c0="All";
			this.c1="Home";
			this.c2="Work";
			this.c3="Personal";
		}
		this.categories=new defaultCategories();
		localStorage.setItem("categories",JSON.stringify(this.categories));
	}
	this.notes=JSON.parse(localStorage.getItem("notes"));
	if(!this.notes)
	{
		var defaultNotes=function(){
			this.count=0;
			this.last=0;
			this.data=[];
		}
		this.notes=new defaultNotes();
		localStorage.setItem("notes",JSON.stringify(this.notes));
	}
	this.n=0;//number of categories
	this.currentCategory="c0";
	this.escapeHtml=function(text) {
	  var map = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#039;'
	  };
	  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	this.unescapeHtml=function(text) {
	  return text.replace(/(&lt;)/g,'<').replace(/(&gt;)/g,'>').replace(/(&amp;)/g,'&').replace(/(&quot;)/g,'\"').replace(/(&#039;)/g,'\'');
	}
		var createHTMLNode=function(tag,id,Class,innerContent,bgColor){
			var element=document.createElement(tag);
			if(id)
				element.setAttribute('id',id);
			if(Class)
				element.setAttribute('class',Class);
			if(innerContent)
				element.innerHTML=innerContent;
			if(bgColor)
				element.style.backgroundColor=bgColor;
			return element;
		}
	this.insertNoteInHTML=function(note){
		var obj=this;
		var base=document.getElementById('displayNotes');
		var fragment=document.createDocumentFragment();
		var div=createHTMLNode('div',note.id,'note',null,Colors[note.color].hash);
		fragment.appendChild(div);
		var contentDiv=createHTMLNode('div',null,null,note.content.replace(/(?:\r\n|\r|\n)/g, '<br>'));
		contentDiv.addEventListener('dblclick',function(){
			obj.startEditing(note);
		});
		if(isMobile){
    		var pressTimer;
			contentDiv.addEventListener('mousedown',function(){
				pressTimer=window.setTimeout(function(){
					console.log("mousedown");
					obj.startEditing(note);
				},300);
			});
			contentDiv.addEventListener('mouseup',function(){
				window.clearTimeout(pressTimer);
			});
  		}
		div.appendChild(contentDiv);


		var butDiv=createHTMLNode('div');
		var deleteDiv=createHTMLNode('div');
		var button=createHTMLNode('button','delete',null,'Delete');
		function temp1(note){
			button.addEventListener('click',function(){
				Notes.prototype.deleteNote.call(note);
			});
		}
		temp1(note);
		deleteDiv.appendChild(button);
		butDiv.appendChild(deleteDiv);

		var checkboxDiv=createHTMLNode('div');
		var button=createHTMLNode('button','checkbox',null,'Checkbox');
		function temp2(note){
			button.addEventListener('click',function(){
				Notes.prototype.invertCheckBoxStatus.call(note);
			})
		}
		temp2(note);
		checkboxDiv.appendChild(button);
		butDiv.appendChild(checkboxDiv);

		var colorDiv=createHTMLNode('div');
		var dropdown=createHTMLNode('select','colorChange'+note.id);
		for( var key in Colors){
			var option=createHTMLNode('option',key,null,Colors[key].name,Colors[key].hash);
			dropdown.appendChild(option);
		}
		(function(note){
			dropdown.addEventListener('change',function(){
				Notes.prototype.changeColor.call(note);
			});
		})(note);
		colorDiv.appendChild(dropdown);
		butDiv.appendChild(colorDiv);
		
		var catDiv=createHTMLNode('div');
		var dropdown=createHTMLNode('select','catChange'+note.id,'catChange');
		var option=createHTMLNode('option',0,null,'Select Categories');
		dropdown.appendChild(option);
		for(var cats in this.categories){
			if(cats!="c0"){
				var option=createHTMLNode('option',cats,null,this.categories[cats]);
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
		base.appendChild(fragment);
		if(note.checkboxStatus){
			Notes.prototype.addCheckboxes.call(note);
		}
	};
	this.insertCategoryInHTML=function(catCode){
		obj=this;
		var fragment=document.createDocumentFragment();
		var base=document.getElementById('displayCategories');
		var div=createHTMLNode('div');
		fragment.appendChild(div);
		var button=createHTMLNode('button','catButton'+catCode,'catButton',this.categories[catCode]);
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
	this.updateCatButton=function(){
		var buttons=document.getElementsByClassName('catButton');
		for(var key in buttons){
			if(isNaN(parseInt(key)))
				break;
			buttons[key].style.backgroundColor="#E0EBFF";
			buttons[key].style.border="2px #EDFFED outset";
		}
		document.getElementById('catButton'+keep.currentCategory).style.border="2px #EDFFED inset";
		document.getElementById('catButton'+keep.currentCategory).style.backgroundColor="#BDD4FD";
	};
	this.startEditing=function(note){
		var div=document.getElementById(note.id).childNodes[0];
		div.innerHTML="";
		var textarea=document.createElement('textarea');
		textarea.setAttribute('style','font-size:1em;width:95%;height:20px;border:none;margin:8px auto 8px auto;border-bottom:1px #80e5ff solid;background-color:transparent;');
		textarea.value=keep.unescapeHtml(note.content);
		div.appendChild(textarea);
		textarea.focus();
		textarea.select();
		div.removeEventListener('click',updateNoteCheckboxStatus);
		textarea.addEventListener('blur',function(){
			console.log("blur");
			Notes.prototype.editNote.call(note);
		});
		textarea.addEventListener('keydown',function(event){
			var keyCode=event.keyCode?event.keyCode:event.which;
			if(keyCode==13 && !(isMobile)){
				if(event.shiftKey)
				{
					event.stopPropagation();
				}
				else{
					console.log('enter');
					textarea.blur();
					event.preventDefault();
				}
			}
			else if(keyCode==27){
				textarea.value=note.content;
				textarea.blur();
			}
		});
	}
};
Application.prototype.populateCategories=function(){
	var obj=this;
	var categories=this.categories;
	var base=document.getElementById('displayCategories');
	base.innerHTML="";
	for(var key in categories){
		keep.insertCategoryInHTML(key);
	}
	this.updateNoCat();
};
Application.prototype.populateNotes=function(){
	if(keep.notes.count>0){
		var base=document.getElementById('displayNotes');
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
};
Application.prototype.saveCategories=function(){
	var categoriesToSave=JSON.stringify(this.categories);
	localStorage.setItem("categories",categoriesToSave);
};
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
Application.prototype.viewCategory=function(key){
	keep.currentCategory=key;
	this.populateNotes();
	this.updateCatButton();
}
//NOTES Class
var Notes=function(content){
	this.id='n'+keep.notes.last;
	this.content=content;
	this.category=keep.currentCategory;
	this.color=Math.floor((Math.random()*8))+1;
	this.checkboxStatus=false;
	this.checkboxData=[];
};
Notes.prototype.deleteNote=function(){
	var toBeDeleted=this;
	for(var key in keep.notes.data)
	{
		var note=keep.notes.data[key];
		if(note && note.id==toBeDeleted.id)
		{
			delete keep.notes.data[key];
			keep.removeNodeFromHTML(note.id);
			keep.notes.count--;
			keep.saveNotes();
		}
	}
};
Notes.prototype.changeColor=function(){
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
			div.setAttribute('style',"background-color:"+Colors[colorCode].hash);
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
};
Notes.prototype.editNote=function(){
	var note=this;
	var flag=false;
	var div=document.getElementById(note.id);
	var value=div.childNodes[0].childNodes[0].value;
	if(note.checkboxStatus==true){
		Notes.prototype.invertCheckBoxStatus.call(note);
		flag=true;
	}
	if(value=="")
	{
		Notes.prototype.deleteNote.call(note);
	}
	else{
		value=keep.escapeHtml(value.trim()).replace(/\n/g, "<br>");
		if(div.childNodes[0])
			div.removeChild(div.childNodes[0]);
		var contentDiv=document.createElement('div');
		contentDiv.innerHTML=value;
		contentDiv.addEventListener('dblclick',function(){
			obj.startEditing(note);
		});
		if(isMobile){
    		var pressTimer;
			contentDiv.addEventListener('mousedown',function(){
				pressTimer=window.setTimeout(function(){
					console.log("mousedown");
					obj.startEditing(note);
				},300);
			});
			contentDiv.addEventListener('mouseup',function(){
				window.clearTimeout(pressTimer);
			});
  		}
		value=value.replace(/<br>/g,"\n");
		div.insertBefore(contentDiv,div.firstChild);
		for(var key in keep.notes.data){
			if(keep.notes.data[key])
			{
				if(keep.notes.data[key].id==note.id)
				{
					keep.notes.data[key].content=value;
					keep.saveNotes();
				}
			}
		}
	}
	console.log(flag);
	if(flag){
		Notes.prototype.invertCheckBoxStatus.call(note);
	}
	console.log(value);
};
Notes.prototype.invertCheckBoxStatus=function(){
	var note=this;
	if(note.checkboxStatus)
	{
		note.checkboxStatus=false;
		Notes.prototype.removeCheckboxes.call(note);
		keep.saveNotes();
		console.log("changed to false");
	}
	else{
		var text=note.content.split('\n');
		var lengthOfData=0,lengthOfStoredData=0;
		for(var key in text){
			if(note.checkboxData[key]!=false && note.checkboxData[key]!=true){
				note.checkboxData[key]=false;
			}
			lengthOfData++;
		}
		lengthOfStoredData=note.checkboxData.length;
		if(lengthOfData<lengthOfStoredData){
			note.checkboxData.splice(lengthOfData);
		}
		lengthOfStoredData=note.checkboxData.length;
		console.log(lengthOfData,lengthOfStoredData);
		Notes.prototype.addCheckboxes.call(note);
		note.checkboxStatus=true;
		keep.saveNotes();
	}
};
Notes.prototype.addCheckboxes=function(){
	var note=this;
	var div=document.getElementById(note.id).childNodes[0];
	var content=note.content.split("\n");
	//console.log(div);
	var newContentTrue="",newContentFalse="";
	for(var key in content){
		if(note.checkboxData[key])
			newContentTrue+="<input type=checkbox checked id="+key+"><span class=completed>"+content[key]+"</span><br>";
		else
			newContentFalse+="<input type=checkbox id="+key+">"+content[key]+"<br>";
	}
	if(newContentTrue!="")
		div.innerHTML=newContentFalse+"<span>Completed Tasks</span><br>"+newContentTrue;
	else
		div.innerHTML=newContentFalse+newContentTrue;
		div.addEventListener('click',updateNoteCheckboxStatus);
};
updateStructure=function(note){
	console.log('asd');
	var div=document.getElementById(note.id).childNodes[0];
	var content=note.content.split("\n");
	var newContentTrue="",newContentFalse="";
	for(var key in content){
		if(note.checkboxData[key])
			newContentTrue+="<input type=checkbox checked id="+key+"><span class=completed>"+content[key]+"</span><br>";
		else
			newContentFalse+="<input type=checkbox id="+key+">"+content[key]+"<br>";
	}
	if(newContentTrue!="")
		div.innerHTML=newContentFalse+"<span>Completed Tasks</span><br>"+newContentTrue;
	else
		div.innerHTML=newContentFalse+newContentTrue;
}
function updateNoteCheckboxStatus(event){
	for(var key in keep.notes.data){
		if(keep.notes.data[key]){
			if(keep.notes.data[key].id==event.target.parentNode.parentNode.id){
				keep.notes.data[key].checkboxData[event.target.id]=(keep.notes.data[key].checkboxData[event.target.id])?false:true;
				updateStructure(keep.notes.data[key]);
				keep.saveNotes();
				break;
			}
		}
	}
};
Notes.prototype.removeCheckboxes=function(){
	var note=this;
	var div=document.getElementById(note.id).childNodes[0];
	div.innerHTML=note.content.replace(/(\n)/g,"<br>");
	console.log(div);
	//here
	div.removeEventListener('click',updateNoteCheckboxStatus);
};
document.getElementById('newCategory').addEventListener('click',newCategory);
document.getElementById('newNote').addEventListener('click',newNote);
var keep=new Application();
keep.populateCategories();
keep.populateNotes(keep.currentCategory);
bindReturnHandler('content','newNote');
bindReturnHandler('category','newCategory');
keep.updateCatButton();
function newCategory(){
	var cat=document.getElementById("category").value;
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
		keep.updateCatButton();
	}
	document.getElementById("category").value="";
}
function bindReturnHandler(inputId,buttonId){
	var element=document.getElementById(inputId);
	var button=document.getElementById(buttonId);
	element.addEventListener('keydown',function(event){
		var keyCode=event.keyCode?event.keyCode:event.which;
		if(keyCode==13){
			if(event.shiftKey)
			{
				event.stopPropagation();
			}
			else{
				event.preventDefault();
				button.click();
				document.getElementById('content').value="";
			}
		}
	});
}
function newNote(){
	var content=document.getElementById('content').value.trim();
	content=keep.escapeHtml(content);
	if(content!=""){
		var tempNote=new Notes(content);
		keep.notes.data.push(tempNote);
		keep.notes.count++;
		keep.notes.last++;
		keep.saveNotes();
		if(keep.currentCategory==tempNote.category || keep.currentCategory=='c0')
			keep.insertNoteInHTML(tempNote);
	}
	document.getElementById('content').value="";
}