var TableData = {
    data: [],
    _order: null,
    insert: function(firstName, lastName, age){
        var item = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            id: this._getNextId()
        };

        this.data.push(item);
        this.orderBy(this._order, true);
    },
    delete: function(id) {
        for(var i = 0; i < this.data.length; i++){
            if (this.data[i].id === id){
                //delete row
                var index = this.data.indexOf(this.data[i]);
                if (index > -1) {
                    this.data.splice(index, 1);
                }
            }
        }
    },
    empty: function(){
        this.data = [];
    },
    edit: function(id, obj){
        for(var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                var item = this.data[i];
                //edit data
                var properties = Object.getOwnPropertyNames(obj);
                for (var j = 0; j < properties.length; j++) {   
                    var value = obj[properties[j]];
                    var property = properties[j];

                    if (!!item[property]) {
                        item[property] = value;
                    }
                }
            }
        }
    },
    orderBy: function(property, dontReverse) {
        this.data.sort(this['_sort_' + property]);
        if (this._order === property && !dontReverse) {
            this.data.reverse();
        }
        this._order = property;
    },
    /* ------- PRIVATE FUNCTIONS ------------*/
    _getNextId: function() {

        var maxId = 0;
        for(var i = 0; i < this.data.length; i++){
            if (this.data[i].id > maxId) {
                maxId = this.data[i].id;
            }
        }

        return maxId + 1;
    },
    _sort_age: function(a, b) {
        return a.age - b.age;
    },
    _sort_firstName: function(a, b) {
        if (a.firstName < b.firstName)
            return -1
        if ( a.firstName > b.firstName)
            return 1

        return 0
    },
    _sort_lastName: function(a, b) {
        if (a.lastName < b.lastName)
            return -1
        if ( a.lastName > b.lastName)
            return 1

        return 0
    }
};


var FormHTML = {
    formEl: document.form,
    firstNameEl: document.form.elements.first_name,
    lastNameEl: document.form.elements.last_name,
    ageEl: document.form.elements.age,
    empty: function(){
        this.formEl.reset();
        this.firstNameEl.focus();
    }
};

var TableHTML = {
    tableEl: document.querySelector('#left-panel > table > tbody'),

    empty: function(){
        this.tableEl.innerHTML = '';
        TableData.empty();
    },
    populate: function() {
        this.tableEl.innerHTML = '';
        for (var i = 0; i < TableData.data.length; i++) {
            var item = TableData.data[i];
            this._insertRow(item);
        }
    },
    insert: function() {
        var item = {
            firstName: FormHTML.firstNameEl.value,
            lastName: FormHTML.lastNameEl.value,
            age: FormHTML.ageEl.value
        };

        TableData.insert(item.firstName, item.lastName, item.age);

        this.populate();
        FormHTML.empty();
    },

    /* ------- PRIVATE FUNCTIONS ------------*/
    _insertRow: function(item) {
        var row = `<tr onclick="editME(event)">
            <td>` + item.id + `</td>
            <td>-</td>
            <td>` + item.firstName + `</td>
            <td>` + item.lastName + `</td>
            <td>` + item.age + `</td>
            <td><button onclick="removeME(event)">X</button></td>
        </tr>`;
        this.tableEl.innerHTML =  this.tableEl.innerHTML + row;
    }
}



TableData.insert('Damir', 'Secki', 40);
TableData.insert('Angela', 'Hernandez', 36);
TableData.insert('Istok', 'Secki', 36);
TableData.insert('Consuelo', 'Hernandez', 40);

TableData.delete(2);

TableData.insert('Angela', 'Hernandez', 36);

TableData.edit(5, {lastName: 'TEST'});
TableData.edit(1, {age: 45});
TableData.edit(11, {age: 45});

// TableList.empty();

TableData.insert('Damir', 'Secki', 55);
TableData.insert('Damir', 'AAAA', 1);

TableData.orderBy('firstName');

console.log(TableData.data);
console.log(TableData._order);

console.log(TableData.data);



TableHTML.populate();
