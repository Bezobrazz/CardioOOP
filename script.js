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
    e.preventDefault();

    // Cleaning input value
    inputDistance.value =
      inputDuration.value =
      inputTemp.value =
      inputClimb.value =
        '';

    // Marker visiualisation
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
