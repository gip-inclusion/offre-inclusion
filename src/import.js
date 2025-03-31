/* eslint-disable no-unused-vars, no-mixed-spaces-and-tabs */

import axios from 'axios'
export const getData = async function (store,param) {
	
	var API_KEY = process.env.VUE_APP_MB_API_KEY
	
	//var servicesBody = 'query=%7B%22database%22%3A+2%2C+%22type%22%3A+%22query%22%2C+%22query%22%3A+%7B%22source-table%22%3A+2052%2C+%22filter%22%3A+%5B%22starts-with%22%2C+%5B%22field%22%2C+59654%2C+%7B%22base-type%22%3A+%22type%2FText%22%7D%5D%2C+%22'+store.state.selectedDepartement+'%22%2C+%7B%22case-sensitive%22%3A+false%7D%5D%7D%7D'
	// const servicesOptions = {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-API-KEY': API_KEY}, data:servicesBody, url: 'https://stats.inclusion.beta.gouv.fr/api/dataset/json'};
	const servicesOptions = {
		method: 'GET',
		url: 'https://pilotage.inclusion.beta.gouv.fr/api/dataset/di_services?department='+store.state.selectedDepartement,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	try {
		const { data } = await axios.request(servicesOptions);
		store.commit('initializeData',data)
	} catch (error) {
		console.error(error);
	}
	
	//var structuresBody = 'query=%7B%22database%22%3A+2%2C+%22type%22%3A+%22query%22%2C+%22query%22%3A+%7B%22source-table%22%3A+2051%2C+%22filter%22%3A+%5B%22starts-with%22%2C+%5B%22field%22%2C+59588%2C+%7B%22base-type%22%3A+%22type%2FText%22%7D%5D%2C+%22'+store.state.selectedDepartement+'%22%2C+%7B%22case-sensitive%22%3A+false%7D%5D%7D%7D'
	//const structuresOptions = {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-API-KEY': API_KEY}, data:structuresBody, url: 'https://stats.inclusion.beta.gouv.fr/api/dataset/json'};

	const structuresOptions = {
		method: 'GET',
		url: 'https://pilotage.inclusion.beta.gouv.fr/api/dataset/di_structures?department='+store.state.selectedDepartement,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	try {
		const { data } = await axios.request(structuresOptions);
		store.commit('initializeStructuresData',data)
	} catch (error) {
		console.error(error);
	}

	//const dataRequest = await fetch("data/services.json")
	//const data = await dataRequest.json()

	//const structuresRequest = await fetch("data/structures.json")
	//const structures = await structuresRequest.json()
	//store.commit('initializeStructuresData',structures)

	// Soucis geoloc data :
	// Charente
	// Gard
	// Ille et Vilaine
	// Indre
	// Indre et Loire
	// Jura
	// Loire Atlantique
	// Puy de Dome
	// Pyrénées atlantiques
	// Rhone (pas de communes)
	// Métropole de Lyon (pas de communes)
	// Vienne
	// Val de Marne
	// Martinique
	// St-Pierre et Miquelon (pas de communes)
	// St Barthélemy (pas de communes)
	// Terres australes et antarctiques françaises (pas de communes)
	// Wallis et Futuna (pas de communes)
	// Polynésie française (pas de communes)
	// Ile de Clipperton (pas de communes)

	store.commit("endImport",true)

	return true
}