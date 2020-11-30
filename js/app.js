/* Treehouse FSJS Techdegree - Jordan Kittle
 * Project 5 - Public API Requests
 * app.js */

const gallery = document.getElementById('gallery');

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
		.then(data => employees = data.results)
		.then(data => displayEmployees(data))
		.catch(error => console.log('Error: ', error) );

}

/**
 *Displays the list of employees
 *@param {array} An array of employee objects
 */
function displayEmployees(employees){
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
		gallery.insertAdjacentHTML('beforeend', cardHTML)
	});
}

/**
 *Displays the modal
 *@param {object} An employee object
 */
function displayModal(){
	const modal = document.createElement('div');
	modal.className = 'modal-container';
	modal.style.display = '';
	const modalHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                <h3 id="name" class="modal-name cap">name</h3>
                <p class="modal-text">email</p>
                <p class="modal-text cap">city</p>
                <hr>
                <p class="modal-text">(555) 555-5555</p>
                <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
        </div>

        // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
	`;
	modal.innerHTML = modalHTML;
	document.querySelector('body').appendChild(modal);

}

function checkStatus(response){
	if(response.ok){
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}

showRandomEmployees();
//displayModal();
