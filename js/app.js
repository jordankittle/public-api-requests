/* Treehouse FSJS Techdegree - Jordan Kittle
 * Project 5 - Public API Requests
 * app.js */
var employeesList = [];
var employeesDisplayed = [];
const gallery = document.getElementById('gallery');
const search = document.querySelector('.search-container');

/**
 *Creates random list of employees
 *@return {array} An array of employee objects
 */
function showRandomEmployees(){
	//Set up the URL with desired options
	let randomUserUrl = 'https://randomuser.me/api/';
	let urlOptions = [
		'results=12',
		'nat=us',
		'exc=login'
		];
	randomUserUrl += '?'
	for(let i = 0; i < urlOptions.length; i++){
		randomUserUrl += '&';
		randomUserUrl += urlOptions[i];
	}

	//Fetch the data 
	fetch(randomUserUrl)
		.then(checkStatus)
		.then(result => result.json() )
		.then(data => employeesList = data.results.slice())
		.then(data => displayEmployees(data))
		.catch(error => console.log('Error: ', error) );

}

/**
 *Displays the list of employees
 *@param {array} An array of employee objects
 */
function displayEmployees(employees){
	employeesDisplayed = employees.slice();
	employees.forEach((employee) =>{
		const cardHTML = `
			<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
		`;
		gallery.insertAdjacentHTML('beforeend', cardHTML);
	});

}

/**
 *Handle a click on on employee and display the modal
 *
 */
 function selectEmployee(event){
	if(event.target !== gallery){
		let card;
		let tag = event.target.tagName;
		if(tag === 'IMG' || tag === 'H3' || tag === 'P'){
			card = event.target.parentNode.parentNode;
		} else if(event.target.className === 'card-info-container' || event.target.className === 'card-img-container'){
			card = event.target.parentNode;
		} else {
			card = event.target;
		}
		const employeeName = card.querySelector('.card-name').textContent;
		const employeeIndex = employeesList.findIndex((entry) => {
			const entryName = `${entry.name.first} ${entry.name.last}`;
			if(entryName === employeeName){
				return true;
			}
			return false;
		});
		const employee = employeesList[employeeIndex];
		displayModal(employee);

	}
 }





/**
 *Displays the modal
 *@param {object} An employee object
 */
function displayModal(employee){
	console.log('click ', employee);
	const bdaylong = new Date(employee.dob.date);
	const birthday = `${bdaylong.getMonth()}/${bdaylong.getDate()}/${bdaylong.getFullYear()}`;
	modal.style.display = 'block';
	const modalHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.city}</p>
                <hr>
                <p class="modal-text">${employee.phone}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}., ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthday}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
	`;
	modal.innerHTML = modalHTML;
	document.querySelector('body').appendChild(modal);
	const closeButton = modal.querySelector('#modal-close-btn');
	modal.addEventListener('click', modalClick);
	closeButton.addEventListener('click', closeModal);
	const index = getModalIndex();
	const previousButton = modal.querySelector('#modal-prev');
	const nextButton = modal.querySelector('#modal-next');
	if(index === 0){
		previousButton.style.visibility = 'hidden';
	}
	if( index === employeesDisplayed.length -1 ){
		nextButton.style.visibility = 'hidden';
	}
	if(index === 0 && index === employeesDisplayed.length -1 ){
		document.querySelector('.modal-btn-container').style.display = 'none';
	}


}

function getModalIndex(){
	let index;
	const currentEmployee = modal.querySelector('#name').textContent;
	for(let i = 0; i < employeesDisplayed.length; i++){
		let arrName = `${employeesDisplayed[i].name.first} ${employeesDisplayed[i].name.last}`;
		if(arrName === currentEmployee){
			index = i;
		}
	}
	return index;
}

function modalClick(event){
		const index = getModalIndex();
		const previousButton = modal.querySelector('#modal-prev');
		const nextButton = modal.querySelector('#modal-next');

		if(event.target.className === 'modal-container'){
			modal.removeEventListener('click', modalClick);
			modal.remove();

		}
		
		if(event.target === previousButton){
			modal.removeEventListener('click', modalClick);
			//modal.innerHTML = '';
			modal.remove();
			displayModal(employeesDisplayed[index - 1]);
		}
		if(event.target === nextButton){
			modal.removeEventListener('click', modalClick);
			//modal.innerHTML = '';
			modal.remove();
			displayModal(employeesDisplayed[index + 1]);
		}

	}

function closeModal(event){
	modal.removeEventListener('click', closeModal);
	modal.remove();
}

/**
 *Filters the list by the search input value
 *
 */
 function filterList(searchValue){
 	const filteredEmployees = employeesList.filter((employee) => {
 		const name = `${employee.name.first} ${employee.name.last}`;
 		if(name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1){
 			return true;
 		}
 		return false;
 	});
 	gallery.innerHTML = '';
 	displayEmployees(filteredEmployees);
 }



/**
 *Checks to see if response is ok
 *@return {promise} A resolved or rejected promise resulting from the call to the API
 */
function checkStatus(response){
	if(response.ok){
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}

showRandomEmployees();
//displayModal();



// ----------------------------
// Set gallery eventlistener, display search box, and modal
// ----------------------------

gallery.addEventListener('click', selectEmployee);

const searchForm = document.createElement('form');
searchForm.setAttribute('action', '#');
searchForm.setAttribute('method', 'get');

const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'search');
searchInput.setAttribute('id', 'search-input');
searchInput.setAttribute('class', 'search-input');
searchInput.setAttribute('placeholder', 'Search...');
searchForm.appendChild(searchInput);

submitHTML = `
	<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
`;
searchForm.insertAdjacentHTML('beforeend', submitHTML )


search.appendChild(searchForm);

search.addEventListener('submit', (event) => {
	event.preventDefault;
	filterList(searchInput.value);
});
search.addEventListener('keyup', (event) => {
	filterList(searchInput.value);
});
search.addEventListener('mouseout', (event) => {
	filterList(searchInput.value);
});

const modal = document.createElement('div');
	modal.className = 'modal-container';
	modal.style.display = 'hidden';
