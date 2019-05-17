const socket = io();

let info = {};
info.number = parseInt(document.getElementById('number').value);

function sendData() {
	info.timestamps = timestamps;
	info.groups = groups;
	info.talking = talking;

	socket.emit('data',info);
	// send information to the server, which will over-write whatever is currently saved on the server
}

function saveData(el,parent_id,next_id) {
	info[el.id] = el.value;
	if (!el.changed && el.nodeName=="SELECT") {
		el.changed = true;
		el.remove(0);
	}
	if (el.id=="number") {
		val = parseInt(el.value);
		slider.noUiSlider.updateOptions({
			range:{
				'min':0,
				'max':val
			}
		});
	}
	// if this has a parent element with class block-future, change to block-past
	document.getElementById(parent_id).classList.remove('block-center')
	document.getElementById(parent_id).classList.add('block-past')
	document.getElementById(next_id).classList.remove('block-future')
	document.getElementById(next_id).classList.remove('block-future-big')
	document.getElementById(next_id).classList.add('block-center')
}

function start() {
	saveData(document.getElementById('number'),'chooser-perc','events');
}

var slider = document.getElementById('range');

noUiSlider.create(slider, {
  start: [2, 5, 8],
  connect: true,
  step:1,
  range: {
      'min': 0,
      'max': 10
  }
});

var connect = slider.querySelectorAll('.noUi-connect');
var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

slider.noUiSlider.on('update',updateNumbers)

function updateNumbers() {
	values = slider.noUiSlider.get();
	info.faculty = parseInt(values[0]);
	info.pd = parseInt(values[1])-info.faculty;
	info.grad = parseInt(values[2])-info.faculty-info.pd;
	info.other = info.number-parseInt(values[2]);
	document.getElementById('faculty').innerHTML = info.faculty;
	document.getElementById('postdoc').innerHTML = info.pd;
	document.getElementById('grad').innerHTML = info.grad;
}

let timestamps = [];
let groups = [];
let talking = [];

function event() {
	// timestamp
	timestamps.push(Date.now());

	// add group
	groups.push(cGroup);

	// add who is talking
	talking.push(cTalk);

	setColors();
	sendData();
}

let cGroup;
let groupNames = ['Professor','Postdoc','Student'];
function switchGroup(val) {
	cGroup = val;
	event();
}

let cTalk;
let talkNames = ['Nobody','Male','Female','Non-binary'];
function switchTalk(val) {
	cTalk = val;
	event();
}

let cRace;
let raceNames = ['White','Asian','African American','Hispanic/Latino','Other']

function setColors() {
	var el = document.getElementById('whoistalking');
	if (cTalk==0) {
		el.innerHTML = talkNames[cTalk];
	} else if (cTalk==-1) {
		// this is the speaker
		el.innerHTML = 'the speaker';
	} else {
		el.innerHTML = talkNames[cTalk] + ' ' + groupNames[cGroup];
	}
}

// add event listeners
window.addEventListener('keydown',keyEvent);

function keyEvent(event) {
	if (any(event.keyCode,[37,38,39,40,49,50,51])) {
		event.preventDefault();
	}
	switch (event.keyCode) {
		case 37:
			document.getElementById('bl').click();
			break;
		case 38:
			document.getElementById('bu').click();
			break;
		case 39:
			document.getElementById('br').click();
			break;
		case 40:
			document.getElementById('bd').click();
			break;
		case 49:
			document.getElementById('b1').click();
			break;
		case 50:
			document.getElementById('b2').click();
			break;
		case 51:
			document.getElementById('b3').click();
			break;
	}
}

function any(val,array) {
	for (var ai=0;ai<array.length;ai++) {
		if (val==array[ai]) {return true;}
	}
	return false;
}

// function processForm() {
// 	let code = document.getElementById("pass").value;
// 	console.log(code);
// 	socket.emit('code',code);

// 	document.getElementById("login").style.display="none";
// 	document.getElementById("cpaper").style.display="";
// 	document.getElementById("responses").style.display="";

// 	return false;
// }

// function sendResponse(id,success) {
// 	info = {};
// 	info.success = success;
// 	info.id = id;
// 	socket.emit('response',info);
// }

// function addPaper() {
// 	let info = {};
// 	info.title = document.getElementById("title").value;
// 	document.getElementById("title").value = '';
// 	let authors = document.getElementById("authors").value;
// 	let authorsArray = authors.replace(/\s/g, "").split(",");
// 	info.authors = authorsArray;
// 	document.getElementById("authors").value = '';
// 	info.year = parseInt(document.getElementById("year").value);
// 	document.getElementById("year").value = '';
// 	info.journal = document.getElementById("journal").value;
// 	document.getElementById("journal").value = '';
// 	info.tweet = document.getElementById("tweet").value;
// 	document.getElementById("tweet").value = '';
// 	console.log(info);
// 	socket.emit('addPaper',info);
// 	document.getElementById("add-paper").style.display='none';

// 	return false;
// }
