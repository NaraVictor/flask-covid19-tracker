let totalElem = document.getElementById("total"),
	recoveredElem = document.getElementById("recovered"),
	activeElem = document.getElementById("active"),
	deathElem = document.getElementById("deaths"),
	countryElem = document.getElementById("country"),
	countriesElem = document.getElementById("countries"),
	tbl = document.getElementById("covid-table"),
	globalCount = document.getElementById("global-count");

let countriesList;

// Automatically loads Ghana's Covid-19 stats when page loads
window.onload = () => {
	getCountryData("Ghana", false);
	populateCountriesList(countriesList);
	populateTable(countriesList);
};

countriesElem.addEventListener("change", function () {
	getCountryData(this.value, true);
});

//fetch covid-19 data for a specific country
function getCountryData(country, state) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			countriesList = JSON.parse(xhr.response);
			let cty = countriesList.Countries.filter((c) => c.Country === country);
			if (cty.length == 0) {
				return countryNotFound(country);
			}

			displayCountryData(cty);
		}
	};

	xhr.open("GET", "https://api.covid19api.com/summary", state);
	xhr.send();
}

function displayCountryData(data) {
	countryElem.innerText = `${data[0].Country}'s Stats`;

	totalElem.innerText = data[0].TotalConfirmed;
	recoveredElem.innerText = data[0].TotalRecovered;
	deathElem.innerText = data[0].TotalDeaths;
	activeElem.innerText = data[0].NewConfirmed;
}

function countryNotFound(cty) {
	countryElem.innerText = `Country (${cty}) not found!`;
	countryElem.style.color = "red";
}

function populateTable(data) {
	let i = 1;
	tbl.innerHTML = data.Countries.map(
		(d) =>
			`
            <tr>
                <td>${i++}</td>
                <td>${d.Country}</td>
                <td>${d.TotalRecovered}</td>
                <td>${d.TotalConfirmed}</td>
                <td>${d.NewConfirmed}</td>
                <td>${d.TotalDeaths}</td>
            </tr>
            `
	).join("");
	globalCount.innerText = `(${i})`;
}

function populateCountriesList(data) {
	let list = data.Countries.map((c) => c.Country);
	countriesElem.innerHTML = list.map(
		(c) => `<option value="${c}">${c}</option>`
	);
}
