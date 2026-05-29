var addBtn = document.getElementById('addBtn');
var closeBtn = document.getElementById('close-Btn');
var saveBtn = document.getElementById('save-btn');
var cancelBtn = document.getElementById('cancel-btn');
var deleteBtn = document.getElementById('delete-btn');
var contactBox = document.getElementById('addContact');
var favBtn = document.getElementById('favbtn');

addBtn.addEventListener('click', function () {
    contactBox.classList.remove('d-none');
});

var search = document.getElementById('search');
var fullName = document.getElementById('fullName');
var number = document.getElementById('phoneNumber');
var address = document.getElementById('address');
var email = document.getElementById('emailAddress');
var group = document.querySelector('select.form-control');
var note = document.getElementById('exampleFormControlTextarea1');
var contactTypes = Array.from(document.querySelectorAll('input[name="contactType"]'));

var contactList = JSON.parse(localStorage.getItem('allContacts')) || [];
var phoneError = document.getElementById('phoneError');
var emailError = document.getElementById('emailError');

number.addEventListener('input', function () {
    var phoneRegex = /^(?:\+2)?01[0125]\d{8}$/;
    if (phoneRegex.test(number.value)) {

        phoneError.classList.add('d-none');
    }
    else {

        phoneError.textContent = "Please enter a valid Egyptian phone number"
        phoneError.classList.remove('d-none');

    }
})
email.addEventListener('input', function () {

    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(email.value)) {

        emailError.classList.add('d-none');
    }
    else {

        emailError.textContent = "Please enter a valid email address"
        emailError.classList.remove('d-none');

    }
})




displayContacts(contactList);
displayEmergencyOnly(contactList);
displayFavoriteOnly(contactList);

var updatedIndex = null;
saveBtn.addEventListener('click', function (e) {


    if (fullName.value === "") {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: "Please enter a name for the contact",
            confirmButtonColor: "#f60e40"
        });
        return;
    }

    else if (number.value === "") {
        Swal.fire({
            icon: "error",
            title: "Missing Phone",
            text: "Please enter a phone number!",
            confirmButtonColor: "#f60e40"
        });
        return;
    }
    var isEmergencyChecked = false;
    var isFavoriteChecked = false;
    for (var i = 0; i < contactTypes.length; i++) {
        if (contactTypes[i].checked) {
            if (contactTypes[i].value === 'emergency') isEmergencyChecked = true;
            if (contactTypes[i].value === 'favorite') isFavoriteChecked = true;
        }
    }

    var user = {
        "Name": fullName.value,
        "phoneNumber": number.value,
        "Address": address.value,
        "Email": email.value,
        "Group": group.value,
        "Note": note.value,
        "isEmergency": isEmergencyChecked,
        "isFavorite": isFavoriteChecked
    };

    if (updatedIndex !== null) {
        contactList[updatedIndex] = user;
        updatedIndex = null;
    } else {
        contactList.push(user);
    }

    localStorage.setItem('allContacts', JSON.stringify(contactList));

    contactBox.classList.add('d-none');
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Contact has been updated successfuly",
        showConfirmButton: false,
        timer: 1500
    });

    displayContacts(contactList);
    displayEmergencyOnly(contactList);
    displayFavoriteOnly(contactList);
    clearContacts();
    e.stopPropagation();
});

cancelBtn.addEventListener('click', function () {
    contactBox.classList.add('d-none');
    clearContacts();
    updatedIndex = null;
});

closeBtn.addEventListener('click', function () {
    contactBox.classList.add('d-none');
    clearContacts();
    updatedIndex = null;
});

function toggleFavorite(index) {
    contactList[index].isFavorite = !contactList[index].isFavorite;
    localStorage.setItem('allContacts', JSON.stringify(contactList));
    displayContacts(contactList);
    displayEmergencyOnly(contactList);
    displayFavoriteOnly(contactList);
}

function toggleEmergency(index) {
    contactList[index].isEmergency = !contactList[index].isEmergency;
    localStorage.setItem('allContacts', JSON.stringify(contactList));
    displayContacts(contactList);
    displayEmergencyOnly(contactList);
    displayFavoriteOnly(contactList);
}

document.getElementById('allContactsList').addEventListener('click', function (e) {
    var favButton = e.target.closest('.fav-btn');
    var emButton = e.target.closest('.card-btn');

    if (favButton) {
        var index = favButton.getAttribute('data-index');
        toggleFavorite(index);
    }
    if (emButton) {
        var index = emButton.getAttribute('data-index');
        toggleEmergency(index);
    }
});

function displayContacts(contactArray) {
    document.getElementById('contacts-length').innerHTML = contactArray.length;
    var emergencyCount = 0;
    var favoriteCount = 0;
    var cartona = '';

    if (contactArray != null && contactArray.length > 0) {
        for (var i = 0; i < contactArray.length; i++) {
            if (contactArray[i].isEmergency) emergencyCount++;
            if (contactArray[i].isFavorite) favoriteCount++;

            var contactNameArray = contactArray[i].Name.split(" ");
            var firstIntial = contactNameArray[0] ? contactNameArray[0].charAt(0) : "";
            var lastIntial = contactNameArray[1] ? contactNameArray[1].charAt(0) : "";
            var contactName = (firstIntial + lastIntial).toUpperCase();

            cartona += `<div class="col-12 col-md-6 mb-3">
    <div class="card-body bg-white border border-light-subtle rounded-4 shadow-sm d-flex flex-column justify-content-between h-100">
        <div class="contact-info p-3">
            <div class="top-info d-flex gap-4 align-items-center">
                <div class="contact-avatar border rounded-3 d-flex justify-content-center align-items-center position-relative"
                     style="width: 60px; height: 60px; background-color: #f60e40;">
                    <span class="text-white fw-bold">${contactName}</span>
                    
                    <div class="contact-type rounded-circle border border-2 border-white position-absolute bottom-0 end-0 ${contactArray[i].isEmergency ? 'd-flex' : 'd-none'} align-items-center justify-content-center"
                         style="width: 26px; height: 26px; background-color: #f60e40; transform:translate(25%,25%)">
                        <i class="fa-solid fa-heart-pulse text-white" style="font-size: 10px;"></i>
                    </div>
                    
                    <div class="contact-type rounded-circle border border-2 border-white position-absolute top-0 start-100 translate-middle ${contactArray[i].isFavorite ? 'd-flex' : 'd-none'} align-items-center justify-content-center"
                         style="width: 26px; height: 26px; background-color: #ffc107;">
                        <i class="fa-solid fa-star text-white" style="font-size: 10px;"></i>
                    </div>
                </div>
                
                <div class="contactName-number">
                    <h3 class="fw-semibold m-0 mb-1 fs-5">${contactArray[i].Name}</h3>
                    <div class="contact-number d-flex gap-3 align-items-center">
                        <div class="border rounded-3 d-flex justify-content-center align-items-center"
                             style="width: 30px; height: 30px; background-color: #dbeafe;">
                            <i class="fa-solid fa-phone" style="color: #427dfc;"></i>
                        </div>
                        <span class="text-muted small">${contactArray[i].phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="contact-body px-3 pb-3">
            <div class="email-section d-flex align-items-center gap-3 mb-2 ${contactArray[i].Email ? 'd-flex' : 'd-none'}">
                <div class="border rounded-3 d-flex justify-content-center align-items-center"
                     style="width: 30px; height: 30px; background-color: #ede9fe;">
                    <i class="fa-solid fa-envelope" style="color: #8126fe;"></i>
                </div>
                <span class="small text-muted">${contactArray[i].Email}</span>
            </div>
            
            <div class="location-section d-flex align-items-center gap-3 mb-3 ${contactArray[i].Address ? 'd-flex' : 'd-none'}">
                <div class="border rounded-3 d-flex justify-content-center align-items-center"
                     style="width: 30px; height: 30px; background-color: #d0fae5;">
                    <i class="fa-solid fa-location-dot" style="color: #039a68;"></i>
                </div>
                <span class="small text-muted">${contactArray[i].Address}</span>
            </div>
            
            <div class="badges-container d-flex gap-2 align-items-center flex-wrap" style="min-height: 32px;">
                <span class="group bg-danger px-3 py-1 text-white rounded-2 small ${contactArray[i].Group ? 'd-inline-block' : 'd-none'}">${contactArray[i].Group}</span>
                <span class="type bg-danger px-3 py-1 text-white rounded-2 small ${contactArray[i].isEmergency ? 'd-inline-block' : 'd-none'}">Emergency</span>
            </div>
        </div>
        
        <div class="card-footer d-flex align-items-center justify-content-between gap-3 p-3 mt-auto rounded-bottom-4 border-top border-light-subtle" style="background-color: #FAFBFC;">
            <div class="left-side d-flex gap-2">
                <button type="button" class="btn card-btn phone d-flex align-items-center justify-content-center"><i class="fa-solid fa-phone" style="color: green;"></i></button>
                <button type="button" class="btn card-btn email d-flex align-items-center justify-content-center ${contactArray[i].Email ? 'd-flex' : 'd-none'}"><i class="fa-solid fa-envelope" style="color: #8126fe;"></i></button>
            </div>
            <div class="right-side d-flex gap-2">
                <button type="button" class="btn fav-btn d-flex align-items-center justify-content-center" data-index="${i}">
                    <i class="${contactArray[i].isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'}" style="color: ${contactArray[i].isFavorite ? '#ffc107' : '#6c757d'};"></i>
                </button>
                <button type="button" class="btn card-btn d-flex align-items-center justify-content-center" data-index="${i}">
                    <i class="${contactArray[i].isEmergency ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'}" style="color: ${contactArray[i].isEmergency ? '#f60e40' : '#6c757d'}"></i>
                </button>
                <button type="button" class="btn update-btn d-flex align-items-center justify-content-center" onclick="updateContact(${i})"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn delete-btn d-flex align-items-center justify-content-center" onclick="deleteContacts(${i})"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    </div>
</div>`;
        }
        document.getElementById('allContactsList').innerHTML = cartona;
    } else {
        document.getElementById('allContactsList').innerHTML = `
            <div class=" p-5 d-flex flex-column align-items-center justify-content-center">
                <div class="text-center d-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px; border-radius: 20px; background-color: #e9ecef;">
                    <i class="fa-solid fa-address-book fs-2" style="color: #adb5bd;"></i>
                </div>
                <h5 class="fw-bold text-dark m-0 mb-1">No contacts found</h5>
                <p class="text-muted m-0 small">Click "Add Contact" to get started</p>
            </div>`;
    }

    document.getElementById('emergency-length').innerHTML = emergencyCount;
    document.getElementById('favorites-length').innerHTML = favoriteCount;
}

function updateContact(index) {
    updatedIndex = index;
    contactBox.classList.remove('d-none');
    fullName.value = contactList[index].Name;
    number.value = contactList[index].phoneNumber;
    address.value = contactList[index].Address;
    email.value = contactList[index].Email;
    group.value = contactList[index].Group;
    note.value = contactList[index].Note;

    for (var i = 0; i < contactTypes.length; i++) {
        if (contactTypes[i].value === 'emergency') {
            contactTypes[i].checked = contactList[index].isEmergency;
        }
        if (contactTypes[i].value === 'favorite') {
            contactTypes[i].checked = contactList[index].isFavorite;
        }
    }
}

function deleteContacts(index) {
    var currentName = contactList[index].Name;

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            cancelButton: "btn btn-danger mx-2",
            confirmButton: "btn btn-success mx-2",
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Delete Contact?",
        text: `Are you sure you want to delete ${currentName}? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "cancel",
        reverseButtons: false
    }).then((result) => {
        if (result.isConfirmed) {
            contactList.splice(index, 1);
            localStorage.setItem('allContacts', JSON.stringify(contactList));
            displayContacts(contactList);
            displayEmergencyOnly(contactList);
            displayFavoriteOnly(contactList);
            Swal.fire({
                title: "Deleted!",
                text: "Contact has been deleted",
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

function clearContacts() {
    fullName.value = "";
    number.value = "";
    address.value = "";
    email.value = "";
    group.selectedIndex = 0;
    note.value = "";
    for (var i = 0; i < contactTypes.length; i++) {
        contactTypes[i].checked = false;
    }
}

function displayEmergencyOnly(contactArray) {
    var cartona = '';
    var hasEmergency = false;

    for (var i = 0; i < contactArray.length; i++) {
        if (contactArray[i].isEmergency === true) {
            hasEmergency = true;
            var contactNameArray = contactArray[i].Name.split(" ");
            var firstIntial = contactNameArray[0] ? contactNameArray[0].charAt(0) : "";
            var lastIntial = contactNameArray[1] ? contactNameArray[1].charAt(0) : "";
            var contactName = (firstIntial + lastIntial).toUpperCase();

            cartona += `
                <div class="emergency-body text-center text-secondary fw-semibold mb-2">
                    <div class="inner d-flex gap-2 justify-content-between p-3 rounded-4 border border-light-subtle" id="emergencyContacts">
                        <div class="rightSide d-flex gap-2">
                            <div class="emergency-box text-center d-flex align-items-center justify-content-center bg-total">${contactName}</div>
                            <div class="emergency-content text-start">
                                <p class="m-0 text-black ">${contactArray[i].Name}</p>
                                <span class="fs-6 text-muted">${contactArray[i].phoneNumber}</span>
                            </div>
                        </div>
                        <div class="leftSide">
                            <div class="number-box text-center d-flex align-items-center justify-content-center bg-total">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    }
    if (!hasEmergency) {
        document.getElementById('emergencyBodyList').innerHTML = `<div class="text-muted small py-3 text-center">No emergency contacts yet</div>`;
    } else {
        document.getElementById('emergencyBodyList').innerHTML = cartona;
    }
}

function displayFavoriteOnly(contactArray) {
    var cartona = '';
    var hasFavorite = false;

    for (var i = 0; i < contactArray.length; i++) {
        if (contactArray[i].isFavorite === true) {
            hasFavorite = true;
            var contactNameArray = contactArray[i].Name.split(" ");
            var firstIntial = contactNameArray[0] ? contactNameArray[0].charAt(0) : "";
            var lastIntial = contactNameArray[1] ? contactNameArray[1].charAt(0) : "";
            var contactName = (firstIntial + lastIntial).toUpperCase();

            cartona += `
                <div class="favorite-body text-center text-secondary fw-semibold mb-2">
                    <div class="inner d-flex gap-2 justify-content-between p-3 rounded-4 border border-light-subtle" id="favoriteContacts">
                        <div class="rightSide d-flex gap-2">
                            <div class="favorite-box text-center d-flex align-items-center justify-content-center bg-total">${contactName}</div>
                            <div class="favorite-content text-start">
                                <p class="m-0 text-black ">${contactArray[i].Name}</p>
                                <span class="fs-6 text-muted">${contactArray[i].phoneNumber}</span>
                            </div>
                        </div>
                        <div class="leftSide">
                            <div class="number-box text-center d-flex align-items-center justify-content-center bg-total">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    }
    if (!hasFavorite) {
        document.getElementById('favoriteBodyList').innerHTML = `<div class="text-muted small py-3 text-center">No favorite contacts yet</div>`;
    } else {
        document.getElementById('favoriteBodyList').innerHTML = cartona;
    }
}

search.addEventListener('input', function () {
    searchContact(search.value);
});

function searchContact(searchItem) {
    var term = searchItem.toLowerCase().trim();
    var searchArray = [];

    for (var i = 0; i < contactList.length; i++) {
        var name = contactList[i].Name.toLowerCase();
        var phone = contactList[i].phoneNumber;
        if (name.includes(term) || phone.includes(term)) {
            searchArray.push(contactList[i]);
        }
    }
    displayContacts(searchArray);
}