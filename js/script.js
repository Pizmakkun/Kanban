"use strict";

document.addEventListener('DOMContentLoaded', function () {
// funkcja generująca id z 10 losowo wybranych znaków;
	function randomString() {
		var chars = '0123456789abcdefghijklmnopqestuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var str = '';
		for (var i = 0; i < 10; i++) {
			str += chars[Math.floor(Math.random() * chars.length)];
		}
		return str;
	}

/*funkcja, która będzie pobireała templatkę HTML z pliku index.html, parsowała, renderowała z użyciem naszej biblioteki szablonów, a następnie zwracała gotowy rezultat*/

	function generateTemplate(name, data, basicElement) {
		var template = document.getElementbyId(name).innerHTML;
		var element = document.createElement(basicElement || 'div');
		
		Mustache.parse(template);
		element.innerHTML = Mustache.render(template, data);
		return element;
	}
// tworzenie klas: columny
	function Column(name) {
		var self = this;

		this.id = randomString(); //klasa ma id wygenerowane przez funkcje
		this.name = name;
		this.element = generateTemplate('column-template', { name: this.name }); //robi templatke
		//eventlistenery na skasowanie i stworzenie kolumny
		this.element.querySelector('.column').addEventListener('click', function (event) {
			if (event.target.classList.contains('btn-delete')) {
				self.removeColumn();
			}
			if (event.target.classList.contains('add-card')) {
				self.addCard(new Card(prompt('enter the name of the card'))); //funkcja prompt pobiera od usera nazwękolmny którą chce stworzyć
			}
		});
	}
// dodanie metody dla usunięcia i stworzenia kolumny;
	Column.prototype = {
		addCard: function(card) {
			this.element.querySelector('ul').appendChild(card.element);
		},
		removeColumn: function() {
			this.element.parentNode.removeChild(this.element);
		}
	};
	function Card(description) {
		var self = this;

		this.id = randomString();
		this.description = description;
		this.element = generateTemplate('card-template', { description: this.description }, 'li');
		this.element.querySelector('.card').addEventListener('click', function (event) {
			event.stopPropagation();

			if (event.target.classList.contains('btn-delete')) {
				self.removeCard();
			}
		});
	}
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
		}
	}
	var board = {
		name: 'Kanban Board',
		//metoda do tworzenia nowej kolumny podpięta do bezpośrednio do obiektu board: 
		addColumn: function(column) {
			this.element.appendChild(column.element);
			initSortable(column.id);
		},
		element: document.querySelector('#board .column-container')
	};
	// implementacja funkcji z biblioteki Sortable,  
	function initSortable(id) {
		var el = document.getElementbyID(id);
		var sortable = Sortable.create(el, {
			group: 'kanban',
			sort: true
		});
	}
	document.querySelector('#board .create-column').addEventListener('click', function() {
		var name = prompt('Enter a column name');
		var column = new Column(name);
		board.addColumn(column);
	});

//creating columns
var todoColumn = new Column('To do');
var doingColumn = new Column('Doing');
var doneColumn = new Column('Done');

//Adding columns to the board
board.addColumn(todoColumn);
board.addColumn(doingColumn);
board.addColumn(doneColumn);

//creating car
var card1 = new Card('New task');
var card2 = new Card('Create Kanban boards');

// adding Cards to columns
todoColumn.addCard(card1);
doingColumn.addCard(card2);
});