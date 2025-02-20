import axios from 'axios'

export const getData = async function (store) {

	const dataRequest = await fetch("data/services.json")
	const data = await dataRequest.json()

	const structuresRequest = await fetch("data/structures.json")
	const structures = await structuresRequest.json()

	store.commit('initializeData',data)
	store.commit('initializeStructuresData',structures)
	
	var API_KEY = process.env.VUE_APP_MB_API_KEY
	
	const options = {method: 'POST', headers: {'Content-Type': 'application/json', 'X-API-KEY': API_KEY}, url: 'https://stats.inclusion.beta.gouv.fr/api/card/5707/query/json'};

	try {
		const { data } = await axios.request(options);
		console.log(data);
	} catch (error) {
		console.error(error);
	}
	
	store.commit("endImport",true)

	return true
}