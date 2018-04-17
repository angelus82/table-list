console.log('ITS WORKING');

var tableEl = document.querySelector('#left-panel > table > tbody');

var firstName = document.form.elements.first_name;
var lastName = document.form.elements.last_name;
var age = document.form.elements.age;

var currentRow;

firstName.focus();


function _insertData(id, firstName, lastName, age) {
    var row = `<tr onclick="editME(event)">
        <td>` + id + `</td>
        <td>-</td>
        <td>` + firstName + `</td>
        <td>` + lastName + `</td>
        <td>` + age + `</td>
        <td><button onclick="removeME(event)">X</button></td>
    </tr>`;

    tableEl.innerHTML = tableEl.innerHTML + row;   
}

function insertData() {
    var rows = tableEl.getElementsByTagName('TR');
    var last = rows[rows.length - 1];

    if (typeof last === 'undefined') {
        var id = 1;
    } else {
        var tdID = last.getElementsByTagName('TD')[0];
        var id = parseInt(tdID.innerHTML, 10) + 1;
    }
    
    _insertData(id, firstName.value, lastName.value, age.value);
    document.form.reset();
    firstName.focus();
}

function deleteAll(){
    tableEl.innerHTML = '';
    cancelUpdate();
}

function removeME(event) {
    var me = event.target.parentNode.parentNode;
    tableEl.removeChild(me);
}

function editME(event) {
    var rows = tableEl.getElementsByTagName('TR');
    var me = event.target.parentNode;

    currentRow = me;

    for(var i = 0; i < rows.length; i++){
        rows[i].classList.remove('edit');
    }

    me.classList.add('edit');

    var id = me.getElementsByTagName('TD')[0].innerHTML;
    var dataItem = {
        id: me.getElementsByTagName('TD')[0].innerHTML,
        firstName: me.getElementsByTagName('TD')[2].innerHTML,
        lastName: me.getElementsByTagName('TD')[3].innerHTML,
        age: me.getElementsByTagName('TD')[4].innerHTML
    };
    console.log(dataItem);
    document.form.reset();
    document.form.classList.add('edit');
    
    firstName.value = dataItem.firstName;
    lastName.value = dataItem.lastName;
    age.value = dataItem.age;
}

function cancelUpdate(){
    var rows = tableEl.getElementsByTagName('TR');
    for(var i = 0; i < rows.length; i++){
        rows[i].classList.remove('edit');
    }
    document.form.reset();
    document.form.classList.remove("edit");
    currentRow = null;

    return false;
}

function updateItem() {
    currentRow.getElementsByTagName('TD')[2].innerHTML = firstName.value;
    currentRow.getElementsByTagName('TD')[3].innerHTML = lastName.value;
    currentRow.getElementsByTagName('TD')[4].innerHTML = age.value;

    return false;
}



/* ----------------------- DEMO DATA ------------------------- */
_insertData(1, 'Damir', 'Secki', 40);
_insertData(2, 'Angela', 'Hernandez', 36);
_insertData(3, 'Istok', 'Secki', 36);
_insertData(4, 'Consuelo', 'Hernandez', 40);

