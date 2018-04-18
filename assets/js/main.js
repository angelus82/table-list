
var tableEl = document.querySelector('#left-panel > table > tbody');

var firstName = document.form.elements.first_name;
var lastName = document.form.elements.last_name;
var age = document.form.elements.age;
var currentRow;
var DATA = [];

var currentSortBy;
var currentSort;



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
    getDATA();
}

function deleteAll(){
    tableEl.innerHTML = '';
    cancelUpdate();
    getDATA();
}

function removeME(event) {
    var me = event.target.parentNode.parentNode;
    tableEl.removeChild(me);
    getDATA();
    event.stopPropagation();
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

    getDATA();
    return false;
}

function getDATA() {
    DATA = [];
    var rows = tableEl.getElementsByTagName('TR');
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var dataItem = {
            html: row.outerHTML,
            id: parseInt(row.getElementsByTagName('TD')[0].innerHTML, 10),
            firstName: row.getElementsByTagName('TD')[2].innerHTML,
            lastName: row.getElementsByTagName('TD')[3].innerHTML,
            age: parseInt(row.getElementsByTagName('TD')[4].innerHTML, 10)
        };

        DATA.push(dataItem);
    }

    if (!!currentSortBy) {
        sortData(currentSortBy);
    }

    console.log(DATA);
}



function sortAge(a, b) {
    return a.age - b.age;
}
function sortId(a, b) {
    return a.id - b.id;
}

function sortFirstName(a, b) {
    if (a.firstName < b.firstName)
        return -1
    if ( a.firstName > b.firstName)
        return 1

    return 0
}

function sortLastName(a, b) {
    if (a.lastName < b.lastName)
        return -1
    if ( a.lastName > b.lastName)
        return 1

    return 0
}



/* ----------------------- DEMO DATA ------------------------- */
_insertData(1, 'Damir', 'Secki', 40);
_insertData(2, 'Angela', 'Hernandez', 36);
_insertData(3, 'Istok', 'Secki', 36);
_insertData(4, 'Consuelo', 'Hernandez', 40);

currentSortBy = 'First Name';

getDATA();


function sortData(sortBy, event) {
    
    currentSortBy = sortBy;

    tableEl = document.querySelector('#left-panel > table > tbody');
    var headrow = document.querySelector('#left-panel > table > thead > tr');
    var ths = headrow.getElementsByTagName('TH');
    

    if (!!event) {
        var column = 0;

        for (var i = 0; i < ths.length; i++) {
            ths[i].classList.remove('sorted');
        }

        var me = event.target;
        me.classList.add('sorted');

        while( (me = me.previousSibling) != null )  {
            if (me.nodeName === 'TH') {
                column++;
            }
        }
    } else {
        var me, sortedCol;
        for (var i = 0; i < ths.length; i++) {
            me = ths[i];
            me.classList.remove('sorted');

            if (me.innerHTML === sortBy) {
                sortedCol = me;
                sortedCol.classList.add('sorted');
            }
        }
        column = 0;
        while( (sortedCol = sortedCol.previousSibling) != null )  {
            if (sortedCol.nodeName === 'TH') {
                column++;
            }
        }
    }


    if (sortBy === 'id') {
        DATA.sort(sortId);
    } else if (sortBy === 'age') {
        DATA.sort(sortAge);
    } else if (sortBy === 'firstName') {
        DATA.sort(sortFirstName);
    } else if (sortBy === 'lastName') {
        DATA.sort(sortLastName);
    }

    console.log('COLUMN', column);
    console.log('CURRENT', currentSort);

    if (column === currentSort) {
        currentSort = undefined;
        DATA.reverse();
    } else {
        currentSort = column;
    }

    var newHTML = '';

    for (var i = 0; i < DATA.length; i++) {
        var row = DATA[i];
        newHTML = newHTML + row.html;
    }

    tableEl.innerHTML = newHTML;
    
    var rows = tableEl.getElementsByTagName('TR');

    

    for (i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tds = row.getElementsByTagName('TD');

        for (var j = 0; j < tds.length; j++) {
            tds[j].classList.remove('sorted');
            if (j === column){
                tds[j].classList.add('sorted');
            }
        }
    }
}