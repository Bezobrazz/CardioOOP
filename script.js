'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    (this.coords = coords),
      (this.distance = distance),
      (this.duration = duration);
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calculatePace();
  }
  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  type = 'running';

  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
    this.calculateSpeed();
  }
  calculateSpeed() {
    this.speed = this.distance / this.duration / 60;
  }
}

// const running = new Running([39, 34], 12, 45, 7);
// const cycling = new Cycling([39, 34], 23, 80, 12);

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleClombeField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Can not get your position');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      `https://www.google.com.ua/maps/@${latitude},${longitude},16z?hl=ru`
    );

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleClombeField() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    const areNumbers = (...numbers) =>
      numbers.every(num => Number.isFinite(num));
    const areNumbersPositive = (...numbers) => numbers.every(num => num > 0);

    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // Create obj Running if workout is running
    if (type === 'running') {
      const temp = +inputTemp.value;
      // Check data validation
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(temp)
        !areNumbers(distance, duration, temp) ||
        !areNumbersPositive(distance, duration, temp)
      )
        return alert('Please enter a positive number');

      workout = new Running([lat, lng], distance, duration, temp);
    }

    // Create obj Cycling if workout is cycling
    if (type === 'cycling') {
      const climb = +inputClimb.value;
      // Check data validation
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(climb)
        !areNumbers(distance, duration, climb) ||
        !areNumbersPositive(distance, duration)
      )
        return alert('Please enter a positive number');

      workout = new Cycling([lat, lng], distance, duration, climb);
    }

    // Add new obj to workout arr
    this.#workouts.push(workout);
    console.log(workout);

    // Display workout on the map
    this.displayWorkout(workout);
    // Display workout in the list

    // Hide the form and clean inputs

    // Cleaning input value
    inputDistance.value =
      inputDuration.value =
      inputTemp.value =
      inputClimb.value =
        '';
  }

  displayWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
