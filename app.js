const url = 'https://api.covid19api.com/';
const searchInput = document.querySelector('.searchInput');
const searchButton = document.querySelector('.searchButton');
const resultsSection = document.querySelector('.results-section');
const deathsValueElement = document.querySelector('.deaths-value');
const confirmedValueElement = document.querySelector('.confirmed-value');
const recoveredValueElement = document.querySelector('.recovered-value');
const countryHeading = document.querySelector('.display-country');
const confirmedIncrease = document.querySelector('.confirmed-increase');
const recoveredIncrease = document.querySelector('.recovered-increase');
const deathsIncrease = document.querySelector('.deaths-increase');
const lastUpdatedElement = document.querySelector('.last-updated');
const spinner = document.querySelector('.loading');
const notFound = document.querySelector('.notFound');
const dataBars = document.querySelectorAll('.data-bar');
const dayLabels = document.querySelectorAll('.day');
const ctx = document.getElementById('myChart').getContext('2d');
let dataBarOffset = 0;

function createChart(labels, deaths, confirmed, recovered) {
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [{
        label: 'Deaths',
        backgroundColor: 'transparent',
        borderColor: '#D92818',
        data: deaths
      }, {
        label: 'Confirmed',
        backgroundColor: 'transparent',
        borderColor: '#F29F05',
        data: confirmed
      }, {
        label: 'Recovered',
        backgroundColor: 'transparent',
        borderColor: '#5EAE01',
        data: recovered
      }]
    },

    // Configuration options go here
    options: {}
  });
}



dataBars.forEach(bar => {
  bar.style['margin-left'] = `${40 - dataBarOffset}px`;
  dataBarOffset += 0.5;
});

function handleDate(dateString) {
  const year = dateString.substr(0, 4);
  const month = dateString.substr(5, 2);
  const day = dateString.substr(8, 2);
  const time = dateString.substr(11, 5);
  result = `Last updated ${day}/${month}/${year} at ${time} GMT`
  return result;
}

function createGraph(data) {
  console.log(data);
  const length = data.length;
  const stepValue = Math.floor((length - 1) / 10);
  const labels = [];
  const deathsData = data.map(item => {
    return item.Deaths;
  })
  const confirmedData = data.map(item => {
    return item.Confirmed;
  })
  const recoveredData = data.map(item => {
    return item.Recovered;
  })
  const combined = [
    data[stepValue],
    data[stepValue * 2],
    data[stepValue * 3],
    data[stepValue * 4],
    data[stepValue * 5],
    data[stepValue * 6],
    data[stepValue * 7],
    data[stepValue * 8],
    data[stepValue * 9],
    data[length - 1]
  ];
  let i = 0;
  const topConfirmed = Math.round(combined[9].Confirmed / 50000) * 50000 + 50000;

  for (let i = 1; i < data.length; i++) {
    labels.push(i);
  }


  // dayLabels.forEach(day => {
  //   day.textContent = labels[i];
  //   i++;
  // });
  createChart(labels, deathsData, confirmedData, recoveredData);
  console.log(labels, combined);
}

function handleData(data) {
  if (data.message === 'Not Found') {
    spinner.style.display = 'none';
    notFound.style.display = 'block';
    return;
  }
  const latestData = data[data.length - 1];
  const previousDay = data[data.length - 2];
  notFound.style.display = 'none';
  resultsSection.classList.remove('hidden');
  deathsValueElement.innerHTML = latestData.Deaths;
  confirmedValueElement.innerHTML = latestData.Confirmed;
  recoveredValueElement.innerHTML = latestData.Recovered;
  countryHeading.innerHTML = latestData.Country;
  deathsIncrease.innerHTML = latestData.Deaths - previousDay.Deaths;
  confirmedIncrease.innerHTML = latestData.Confirmed - previousDay.Confirmed;
  recoveredIncrease.innerHTML = latestData.Recovered - previousDay.Recovered;
  lastUpdatedElement.innerHTML = handleDate(latestData.Date);
  spinner.style.display = 'none';
  createGraph(data);
}

async function getData(url) {
  resultsSection.classList.add('hidden');
  spinner.style.display = 'block';
  const data = await fetch(url).then(res => {
    return res.json();
  });
  handleData(data);
}

searchButton.addEventListener('click', e => {
  const searchValue = searchInput.value;
  searchInput.value = '';
  const extendedURL = `${url}total/dayone/country/${searchValue}`;
  getData(extendedURL);
})

window.addEventListener('keydown', e => {
  if (e.keyCode === 13) {
    const searchValue = searchInput.value;
    searchInput.value = '';
    const extendedURL = `${url}total/dayone/country/${searchValue}`;
    getData(extendedURL);
  }
})
