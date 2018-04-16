console.log('ITS WORKING');

var tableEl = document.querySelector('#left-panel > table > tbody');

var firstName = document.form.elements.first_name;
var lastName = document.form.elements.last_name;
var age = document.form.elements.age;

firstName.focus();


function insertData() {
    var rows = tableEl.getElementsByTagName('TR');
    var last = rows[rows.length - 1];
    console.log(rows, rows[0]);


    var tdID = last.getElementsByTagName('TD')[0];
    
    
    var id = parseInt(tdID.innerHTML, 10) + 1;
    
    

    var row = `<tr>
        <td>` + id + `</td>
        <td>-</td>
        <td>` + firstName.value + `</td>
        <td>` + lastName.value + `</td>
        <td>` + age.value + `</td>
        <td><button onclick="removeME(event)">X</button></td>
    </tr>`;

    tableEl.innerHTML = tableEl.innerHTML + row;

    firstName.value = '';
    lastName.value = '';
    age.value = '';
    document.form.reset();
    firstName.focus();

}

function deleteAll(){
    tableEl.innerHTML = '';
}

function removeME(event) {
    var me = event.target.parentNode.parentNode;
    tableEl.removeChild(me);
}


