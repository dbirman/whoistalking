// const socket = io();

let info = {};
info.number = parseInt(document.getElementById('number').value);

function saveData(el) {
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
	console.log(values);
	info.faculty = parseInt(values[0]);
	info.pd = parseInt(values[1])-info.faculty;
	info.grad = parseInt(values[2])-info.faculty-info.pd;
	info.other = info.number-parseInt(values[2]);
	document.getElementById('faculty').innerHTML = info.faculty;
	document.getElementById('postdoc').innerHTML = info.pd;
	document.getElementById('grad').innerHTML = info.grad;
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
