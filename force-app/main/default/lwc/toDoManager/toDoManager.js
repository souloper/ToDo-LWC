
import { LightningElement, track, api } from "lwc";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";
import addTodo from "@salesforce/apex/ToDoController.addTodo";


export default class toDoManager extends LightningElement {
  // standard public property to get component size
  // value can be SMALL, MEDIUM, LARGE based on current context
  @api flexipageRegionWidth;

  //reactive properties for time and greeting
  @track time = "8:22 AM";
  @track greeting = "Good Morning";

  @track todos = [];

  connectedCallback() {
    this.getTime();

    this.fetchTodos();

    
    // this.tempTODO(); 
    
    setInterval(() => {
      this.getTime();
    }, 1000 * 60);
  }

  
  getTime() {
    const date = new Date(); 
    const hour = date.getHours();
    const min = date.getMinutes();

    this.time = `${this.getHour(hour)}:${this.getDoubleDigit(
      min
    )} ${this.getMidDay(hour)}`;
    this.setGreeting(hour);
  }

  getHour(hour) {
    return hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
  }

  getDoubleDigit(digit) {
    return digit < 10 ? "0" + digit : digit;
  }

  getMidDay(hour) {
    return hour >= 12 ? "PM" : "AM";
  }

  setGreeting(hour) {
    if (hour < 12) {
      this.greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      this.greeting = "Good Afternoon";
    } else {
      this.greeting = "Good Evening";
    }
  }

  
  addTodoHandler() {
    const inputBox = this.template.querySelector("lightning-input");
    
    //create a new todo object based on input box value
    const todo = { todoName: inputBox.value, done: false };
    
    //call addtodo server method to add new todo object
    //serialize todo object before sending to server
    addTodo({ payload: JSON.stringify(todo) })
      .then(result => {
        if (result) {
          //fetch fresh list of todos
          this.fetchTodos();
        }
      })
      .catch(error => {
        console.error("Error in adding todo" + error);
      });

    inputBox.value = "";
  }

  /**
   * Fetch todos from server
   * This method only retrives todos for today
   */
  fetchTodos() {
    getCurrentTodos()
      .then(result => {
        if (result) {
          //update todos property with result
          this.todos = result;
        }
      })
      .catch(error => {
        console.error("Error in fetching todo" + error);
      });
  }

  /**
   * Fetch fresh list of todos once todo is updated
   * This method is called on update event
   */
  updateTodoHandler(event) {
    if (event) {
      this.fetchTodos();
    }
  }

  /**
   * Fetch fresh list of todos once todo is deleted
   * This method is called on delete event
   */
  deleteTodoHandler(event) {
    if (event) {
      this.fetchTodos();
    }
  }

  get upcomingTodos() {
    return this.todos && this.todos.length
      ? this.todos.filter(todo => !todo.done)
      : [];
  }

  get completedTodos() {
    return this.todos && this.todos.length
      ? this.todos.filter(todo => todo.done)
      : [];
  }

  //Get input box size based on current screen width
  get largePageSize() {
    return this.flexipageRegionWidth === "SMALL"
      ? "12"
      : this.flexipageRegionWidth === "MEDIUM"
      ? "8"
      : "6";
  }

  tempTODO(){
    const todos = [
        {
            todoId:0,
            todoName:"Wake Up",
            done: true,
            todoDate: new Date(),
        },
        {
            todoId:1,
            todoName:"Plan",
            done: false,
            todoDate: new Date(),
        },
        {
            todoId:2,
            todoName:"Eat Food",
            done: false,
            todoDate: new Date(),
        },
    ];
    this.todos = todos;
}

}
