import React, { Component, PureComponent, useState, useEffect } from 'react';

import './HomeCalendar.css'
import Workout from './dailyWO'
import Button from '@material-ui/core/Button';
import Paragraph from './Paragraph';
class HomeCalendar extends Component {
    constructor(props) {
        super(props);
        // this.load = this.load.bind(this);
        this.lol = this.lol.bind(this);
        this.lol2 = this.lol2.bind(this);
        this.closeWorkouts = this.closeWorkouts.bind(this);
        //this.handleDateClick = this.handleDateClick.bind(this);
    }
    state = {
        nav: 0,
        date: null,
        //monthAndYear: null,
        openWorkout: false,
    }
    //this.load = this.load.bind(this);
    //this.lol = this.lol.bind(this);
    //this.lol2 = this.lol2.bind(this);

    //this.fetchUserMeals = this.fetchUserMeals.bind(this);
    // this.load = this.load.bind(this);
//let nav = 0;
// let clicked = null;
//let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

//const calendar = document.getElementById('calendar');
// const newEventModal = document.getElementById('newEventModal');
// const deleteEventModal = document.getElementById('deleteEventModal');
// const backDrop = document.getElementById('modalBackDrop');
// const eventTitleInput = document.getElementById('eventTitleInput');
// const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// function openModal(date) {
//   clicked = date;

//   const eventForDay = events.find(e => e.date === clicked);

//   if (eventForDay) {
//     document.getElementById('eventText').innerText = eventForDay.title;
//     deleteEventModal.style.display = 'block';
//   } else {
//     newEventModal.style.display = 'block';
//   }

//   backDrop.style.display = 'block';
// }



// function closeModal() {
//   eventTitleInput.classList.remove('error');
//   newEventModal.style.display = 'none';
//   deleteEventModal.style.display = 'none';
//   backDrop.style.display = 'none';
//   eventTitleInput.value = '';
//   clicked = null;
//   load();
// }

// function saveEvent() {
//   if (eventTitleInput.value) {
//     eventTitleInput.classList.remove('error');

//     events.push({
//       date: clicked,
//       title: eventTitleInput.value,
//     });

//     localStorage.setItem('events', JSON.stringify(events));
//     closeModal();
//   } else {
//     eventTitleInput.classList.add('error');
//   }
// }

// function deleteEvent() {
//   events = events.filter(e => e.date !== clicked);
//   localStorage.setItem('events', JSON.stringify(events));
//   closeModal();
// }
lol2() {
    //this.state.nav++;
    // this.setState(({ nav }) => (
    //     {
    //       nav: nav--
    //     }
    //   ));
    this.setState({
        nav: this.state.nav-1,}, 
        function () {
            //alert("updated state lol2");
            //this.load();
        });
    //this.load();
}
lol() {
    //this.setState(nav: this.state.nav--);
    // this.setState(({ nav }) => (
    //     {
    //       nav: nav++
    //     }
    //   ));

      this.setState({
        nav: this.state.nav+1,}, 
        function () {
            //alert("updated state");
            //this.load();
        });
    //this.load();
}
initButtons() {
//   document.getElementById('nextButton').addEventListener('click', () => {
//     nav++;
//     load();
//   });

//   document.getElementById('backButton').addEventListener('click', () => {
//     nav--;
//     load();
//   });

//   document.getElementById('saveButton').addEventListener('click', saveEvent);
//   document.getElementById('cancelButton').addEventListener('click', closeModal);
//   document.getElementById('deleteButton').addEventListener('click', deleteEvent);
//   document.getElementById('closeButton').addEventListener('click', closeModal);
}


// useEffect(() => {
//     // Update the document title using the browser API
//     load();
//   });
  handleDateClick(date) {
              this.setState({
                  date: date,
                  openWorkout: true
              },
              function() {
                  //alert(date.day + " " + date.monthAndYear);
              }
              ); 
              
  }
  componentDidMount() {
    // this.load();
  }
  componentDidUpdate() {
    // this.load();
  }
  closeWorkouts() {
    if (document.getElementById("chart") != null) {
      document.getElementById("chart").style.display = "block";
    }
    this.setState({
        openWorkout: false
    }); 
  }
  render() {
        const dt = new Date();
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const arrayOfText = [];
        var thisMonth = new Date().getMonth();
        dt.setDate(1);
        dt.setMonth(thisMonth + this.state.nav);
      
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
      
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        console.log(daysInMonth);
        
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
        const monthAndYear = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
          const dayString = `${month + 1}/${i - paddingDays}/${year}`;
      
          if (i > paddingDays) {
           
            let dateObject = {
                day: i - paddingDays,
                monthAndYear: monthAndYear
            }
            arrayOfText.push(dateObject);
            
      
            // if (i - paddingDays === day && this.state.nav === 0) {
              
            // }
      
            
          } else {
            let dateObject = {
                day: 888,
                monthAndYear: monthAndYear
            }
            arrayOfText.push(dateObject);
          }
          
        }

        let elements = arrayOfText.map((item, i) => {
            const dayString = `${month + 1}/${item.day - paddingDays}/${year}`;
      
          if (item.day != 888) {
            
            return (
                
                <div className="day" key={item.day} onClick={this.handleDateClick.bind(this, item)}>
                    <strong>{item.day}</strong>
                </div>
            );  
      
            
          } else {
              
              return(
            <div className="day">
                   <div className="padding"></div>
            </div>);
          }
        });
      if (this.state.openWorkout == true && this.state.date != null) {
          return(<Workout date={this.state.date} closeWorkoutsFunction={this.closeWorkouts}/>);
      }
      else {

        return(
            <div>
            <div id="calendarcontainer">
      <div id="header">
        <div id="monthDisplay">
            {monthAndYear}
        </div>
        <div>
          <Button id="backButton" onClick={this.lol2}>Back</Button>
          <Button id="nextButton" onClick={this.lol}>Next</Button>
        </div>
      </div>

      <div id="weekdays">
        <div>Sunday</div>
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
      </div>

      <div id="calendar">
          {elements}
      </div>
    </div>

    

    <div id="modalBackDrop"></div>
    <script src="./script.js"></script>
    </div>
        );
      }
        
    }
}


export default HomeCalendar;
