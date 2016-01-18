//localStorage.setItem("categories",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}')
var colorHash=new Array("Select Color","#e5e5ff","#ffe5f6","#c6ecc6","#ffffb3","#ffcccc","#ebccff","#fff2cc","#ccd9ff");
var colorName=new Array("Select Color","Lavender","Lavender Blush","Green","Yellow","Cosmos","Blue Chalk","Oasis","Hawkes Blue");
var Application=function(){
	this.categories=JSON.parse(localStorage.getItem("categories2"));
	if(!this.categories){
		localStorage.setItem("categories2",'{"c0":"All","c1":"Home","c2":"Work","c3":"Personal"}');
		this.categories=JSON.parse(localStorage.getItem("categories2"));
	}
	this.notes=JSON.parse(localStorage.getItem("notes2"));
	if(!this.notes)
	{
		localStorage.setItem("notes2",'{"count":0,"data":[],"last":0}');
		this.notes=JSON.parse(localStorage.getItem("notes2"));
	}
	this.n=0;
	this.currentCategory="c0";
	this.lineHeight=document.getElementById('line').clientHeight;
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
	this.adjustLine=function(){
		var noteHeight=document.getElementById('allNotes').clientHeight;
		//console.log(noteHeight,this.lineHeight);
		if(noteHeight<this.lineHeight)
		{
			//console.log("no change");
			document.getElementById('line').style.height=this.lineHeight;
		}
		else{
			console.log(document.getElementById('line').style.height,noteHeight);
			document.getElementById('line').style.height=noteHeight+"px";
		}
	}
	this.insertNoteInHTML=function(note){
		var obj=this;
		var base=document.getElementById('displayNotes');
		var fragment=document.createDocumentFragment();
		var div=document.createElement('div');
		div.setAttribute('class','note');
		div.setAttribute('id',note.id);
		fragment.appendChild(div);
		var contentDiv=document.createElement('div');
		contentDiv.innerHTML=note.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
		contentDiv.addEventListener('dblclick',function(){
			obj.startEditing(note);
			//console.log(note);
		});
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

		var checkboxDiv=document.createElement('div');
		var button=document.createElement('button');
		button.innerHTML="Checkbox";
		function temp2(note){
			button.addEventListener('click',function(){
				Notes.prototype.invertCheckBoxStatus.call(note);
			})
		}
		temp2(note);
		checkboxDiv.appendChild(button);
		butDiv.appendChild(checkboxDiv);

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
		this.adjustLine();
		if(note.checkboxStatus){
			Notes.prototype.addCheckboxes.call(note);
		}
	};
	this.insertCategoryInHTML=function(catCode){
		obj=this;
		var fragment=document.createDocumentFragment();
		var base=document.getElementById('displayCategories');
		var div=document.createElement('div');
		fragment.appendChild(div);
		var button=document.createElement('button');
		button.setAttribute('class','catButton');
		button.setAttribute('id','catButton'+catCode);
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
		//console.log(div);
		//div.childNodes[0].addEventListener('dblclick',function(){});
		var value=div.innerHTML.replace(/<br ?\/?>/g, "\n");
		//var value=div.innerHTML;
		console.log(value);
		div.innerHTML="";
		var textarea=document.createElement('textarea');
		textarea.setAttribute('style','font-size:1em;width:95%;height:20px;border:none;margin:8px auto 8px auto;border-bottom:1px #80e5ff solid;background-color:transparent;');
		textarea.value=note.content;
		div.appendChild(textarea);
		textarea.focus();
		textarea.select();
		textarea.addEventListener('blur',function(){
			console.log("blur");
			Notes.prototype.editNote.call(note);
		});
		textarea.addEventListener('keydown',function(event){
			var keyCode=event.keyCode?event.keyCode:event.which;
			if(keyCode==13){
				if(event.shiftKey)
				{
					//console.log("shift");
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
		//console.log(div);
	}
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
	localStorage.setItem("categories2",categoriesToSave);
};
//needs to be updated
Application.prototype.saveNotes=function(){
	var notesToSave=JSON.stringify(this.notes);
	//console.log(notesToSave);
	localStorage.setItem("notes2",notesToSave);
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
	keep.adjustLine();
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
Notes.prototype.editNote=function(){
	var note=this;
	var flag=false;
	var div=document.getElementById(note.id);
	var value=div.childNodes[0].childNodes[0].value;
	if(note.checkboxStatus==true){
		Notes.prototype.invertCheckBoxStatus.call(note);
		flag=true;
	}
	//console.log(div.childNodes[0].childNodes[0]);
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
			//console.log(note);
		});
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
		//console.log(newContent);
		//note.content=newContent.substring(0,newContent.length-1);
		note.checkboxStatus=false;
		Notes.prototype.removeCheckboxes.call(note);
		//document.getElementById(note.id).childNodes[0].innerHTML=note.content.replace(/(?:\r\n|\r|\n)/g, '<br>');;
		keep.saveNotes();
		console.log("changed to false");
	}
	else{
		var text=note.content.split('\n');
		//var newContent=document.createDocumentFragment();
		//var newContent="";
		var lengthOfData=0,lengthOfStoredData=0;
		for(var key in text){
			//newContent+="<input type=checkbox id="+key+" onclick=function("+key+"){console.log("+key+");}>"+text[key]+"\n";
			//var input=document.createElement('input');
			//input.type='checkbox';
			//newContent.appendChild(input);
			//newContent.appendChild(text[key]+"\n");
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
		//Notes.prototype.addEventsToCheckbox.call(note);
		//newContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
		//note.content=newContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
		//console.log(note.content);
		note.checkboxStatus=true;
		//document.getElementById(note.id).childNodes[0].innerHTML=note.content;
		keep.saveNotes();
		//console.log(note);
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
	div.addEventListener('click',function(event){
		//console.log(event.target,note);
		if(event.target.parentNode.parentNode.id==note.id && event.target.tagName=="INPUT"){
			note.checkboxData[event.target.id]=(note.checkboxData[event.target.id])?false:true;
			updateStructure(note);
			keep.saveNotes();
		}
	});
	//console.log(div.innerHTML.split('<br>'));
};

updateStructure=function(note){
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

Notes.prototype.removeCheckboxes=function(){
	var note=this;
	var div=document.getElementById(note.id).childNodes[0];
	div.innerHTML=note.content.replace(/(\n)/g,"<br>");
	console.log(div);
	//div.removeEventListener('click',testing);
};

Notes.prototype.updateCheckboxStatus=function(e){
	console.log(e);
}
function testing(){
	console.log("Removed");
}
document.getElementById('newCategory').addEventListener('click',newCategory);
document.getElementById('newNote').addEventListener('click',newNote);
var keep=new Application();
keep.populateCategories();
keep.populateNotes(keep.currentCategory);
bindReturnHandler('content','newNote');
bindReturnHandler('category','newCategory');
keep.updateCatButton();
keep.adjustLine();

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
			//event.preventDefault();
			if(event.shiftKey)
			{
				//console.log("shift");
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
	console.log(content);
	if(content!=""){
		var tempNote=new Notes(content);
		var tempJSONNote=tempNote;
		//tempJSONNote.content=tempJSONNote.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
		keep.notes.data.push(tempJSONNote);
		keep.notes.count++;
		keep.notes.last++;
		//keep.noOfNotes++;
		//keep.adjustLine();
		keep.saveNotes();
		if(keep.currentCategory==tempNote.category || keep.currentCategory=='c0')
			keep.insertNoteInHTML(tempNote);
		//console.log(keep.notes);
	}
	document.getElementById('content').value="";
}