var LOADER = {
    _element: document.getElementById('loading-indicator'),
    show() {
        this._element.classList.remove('hidden');
    },
    hide() {
        this._element.classList.add('hidden');
    }
}


var API = {
    _apiUrl: '',
    _onLoad: undefined,
    setDataSource: function(dataSourceUrl){
        this._apiUrl = dataSourceUrl;
    },
    load: function(onLoad){
        var _request = new XMLHttpRequest();

        _request.open('GET', this._apiUrl);
        _request.onload = function () {
            if (typeof onLoad === 'function') {
                onLoad(this.responseText);
            };
        };
        _request.send();
    },
    insert(obj, onSave){
        var _request = new XMLHttpRequest();
        _request.open('POST', this._apiUrl, true);

        _request.setRequestHeader('Content-type','application/json; charset=utf-8');

        _request.onload = function(){
            if (typeof onSave === 'function') {
                onSave(this.responseText);
            };
        };

        _request.send(JSON.stringify(obj));
    },
    delete(id, onDelete) {
        var _request = new XMLHttpRequest();
        _request.open('DELETE', this._apiUrl + '/' + id, true);

        _request.setRequestHeader('Content-type','application/json; charset=utf-8');

        _request.onload = function(){
            if (typeof onDelete === 'function') {
                onDelete(this.responseText);
            };
        };

        _request.send();
    },
    update(obj, onUpdate) {
        var _request = new XMLHttpRequest();
        _request.open('PUT', this._apiUrl + '/' + obj.id, true);

        _request.setRequestHeader('Content-type','application/json; charset=utf-8');

        _request.onload = function(){
            if (typeof onUpdate === 'function') {
                onUpdate(this.responseText);
            };
        };

        _request.send(JSON.stringify(obj));
    }
}


var TableData = {
    data: [],
    _order: null,
    _request: new XMLHttpRequest(),
    load: function(callback){
        var self = this;
        TableHTML.setLoading();
        TableHTML.empty();
        LOADER.show();
        API.load(function(response){
            data = JSON.parse(response);

            for(var i = 0; i < data.length; i++) {
                var user = data[i];
                self.insert(user.id, user.firstName, user.lastName, user.age);
            }

            TableHTML.populate();
            TableHTML.stopLoading();
            LOADER.hide();
        });
    },
    insert: function(id, firstName, lastName, age){
        var item = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            id: id
        };

        this.data.push(item);
        this.orderBy(this._order, true);
    },
    delete: function(id, onDelete) {
        API.delete(id, function(response){
            if(typeof onDelete === 'function') {
                onDelete(response);
            }
        });
    },
    empty: function(){
        this.data = [];
    },
    edit: function(obj, onUpdated){
        var self = this;
        API.update(obj, function(response){
            self.load();
            if(typeof onUpdated === 'function'){
                onUpdated(response);
            }
        });
    },
    orderBy: function(property, dontReverse) {
        this.data.sort(this['_sort_' + property]);
        if (this._order === property && !dontReverse) {
            this.data.reverse();
            this._order = undefined;
        } else {
            this._order = property;
        }
    },
    reorder(){
        if (!!this._order){
            this.orderBy(this._order, true);
        }
    },
    findById: function(id) {
        for(var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return this.data[i];
            }
        }
        return null;
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
    _sort_id: function(a, b) {
        return a.id - b.id;
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
    idEl: document.form.elements.id,
    empty: function(){
        this.formEl.reset();
        this.formEl.classList.remove('edit');
        this.firstNameEl.focus();
    },
    populateId: function(id) {
        var dataItem = TableData.findById(id);

        this.formEl.reset();
        this.formEl.classList.add('edit');
        
        this.firstNameEl.value = dataItem.firstName;
        this.lastNameEl.value = dataItem.lastName;
        this.ageEl.value = dataItem.age;
        this.idEl.value = dataItem.id;
    },
    insert: function() {
        var item = {
            firstName: this.firstNameEl.value,
            lastName: this.lastNameEl.value,
            age: parseInt(this.ageEl.value, 10)
        };

        TableData.insert(item.firstName, item.lastName, item.age);
        API.insert(item);

        TableHTML.populate();
        this.empty();
    },
    cancel: function() {
        this.empty();
        TableHTML.deselectAll();
        return false;
    },
    update: function() {
        var item = {
            firstName: this.firstNameEl.value,
            lastName: this.lastNameEl.value,
            age: parseInt(this.ageEl.value, 10),
            id: this.idEl.value
        };
        console.log('ITEM ID:', item.id);
        TableData.edit(item, function(){
            // console.log(TableData.data);
            // this.empty();
            // TableData.reorder();
            // TableHTML.populate();
        });
       

        return false;
    }
};

var TableHTML = {
    tableEl: document.querySelector('#left-panel > table > tbody'),

    empty: function(){
        this._emptyHTMLTable();
        TableData.empty();
    },
    populate: function() {
        this.tableEl.innerHTML = '';
        for (var i = 0; i < TableData.data.length; i++) {
            var item = TableData.data[i];
            this._insertRow(item);
        }
        FormHTML.empty();
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
    orderBy: function(property) {
        this._emptyHTMLTable();
        TableData.orderBy(property);
        this.selectColumn(property);
        this.populate();
    },
    editRow: function(id, event) {
        // POPULATE FORM
        FormHTML.populateId(id);

        // SELECT ACTIVE ROW IN THE TABLE
        this.deselectAll();
        var me = event.target.parentNode;
        me.classList.add('edit');
    },

    removeRow: function(id, event) {
        event.stopPropagation();

        
        var me = event.target.parentNode.parentNode;
        if (me.nodeName === 'TR') {
            this.deselectAll();
            // SELECT ACTIVE ROW IN THE TABLE
            me.classList.add('delete');
            var self = this; 
            window.setTimeout(function(){
                var doRemove = confirm('Are you sure you want to delete row with ID: '+id + '?');

                if(!doRemove) {
                    self.deselectAll();
                    return;
                }                
                // WE CAN DELETE
                TableData.delete(id, function(response){
                    self.tableEl.removeChild(me);
                });
                
            }, 50);
        }
        return false;
    },

    deselectAll: function() {
        var rows = this.tableEl.getElementsByTagName('TR');
        for(var i = 0; i < rows.length; i++){
            rows[i].classList.remove('edit');
            rows[i].classList.remove('delete');
        }
    },

    selectColumn: function(property) {
        var container = document.querySelector('#left-panel > table');
        var rows = container.getElementsByTagName('TR');
        window.setTimeout(function(){        
            for (i = 0; i < rows.length; i++) {
                var row = rows[i];
                var ths = row.getElementsByTagName('TH');
                var tds = row.getElementsByTagName('TD');

                var cells = [];
                for (var k = 0; k < ths.length; k++) {
                    cells.push(ths[k]);
                }
                for (var k = 0; k < tds.length; k++) {
                    cells.push(tds[k]);
                }
        
                for (var j = 0; j < cells.length; j++) {
                    cells[j].classList.remove('sorted');
                    if (cells[j].classList.contains('col_' + property)){
                        cells[j].classList.add('sorted');
                    }
                }
            }
        }, 0);
    },

    setLoading: function(){
        var table = document.querySelector('#left-panel > table');
        table.classList.add('loading');
    },
    stopLoading: function() {
        var table = document.querySelector('#left-panel > table');
        table.classList.remove('loading');
    },

    /* ------- PRIVATE FUNCTIONS ------------*/
    _insertRow: function(item) {
        var row = `<tr onclick="TableHTML.editRow('` + item.id + `', event)">
            <td class="col_photo">-</td>
            <td class="col_firstName">` + item.firstName + `</td>
            <td class="col_lastName">` + item.lastName + `</td>
            <td class="col_age">` + item.age + `</td>
            <td><button onclick="TableHTML.removeRow('` + item.id + `',event)" class="button red small action">X</button></td>
        </tr>`;
        this.tableEl.innerHTML =  this.tableEl.innerHTML + row;
    },
    _emptyHTMLTable(){
        this.tableEl.innerHTML = '';
    }
}


API.setDataSource('http://localhost:3000/api/authors');
TableData.load();


// setTimeout(function(){
//     API.insert({
//         firstName: 'test1',
//         lastName: 'test1',
//         age: 20
//     });
// }, 2000);
