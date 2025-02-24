/* eslint-disable no-unused-vars, no-mixed-spaces-and-tabs */

import axios from 'axios'
export const getData = async function (store) {

	const dataRequest = await fetch("data/services.json")
	const data = await dataRequest.json()

	const structuresRequest = await fetch("data/structures.json")
	const structures = await structuresRequest.json()

	store.commit('initializeData',data)
	store.commit('initializeStructuresData',structures)
	
	var API_KEY = process.env.VUE_APP_MB_API_KEY

	//var body = "{\"database\":2,\"type\":\"query\",\"query\":{\"source-table\":2052,\"filter\":[\"starts-with\",[\"field\",59654,{\"base-type\":\"type/Text\"}],\"974\",{\"case-sensitive\":false}]},\"parameters\":[]}"
	var body = 'query=%7B%22database%22%3A2%2C%22type%22%3A%22query%22%2C%22query%22%3A%7B%22source-table%22%3A2052%2C%22filter%22%3A%5B%22starts-with%22%2C%5B%22field%22%2C59654%2C%7B%22base-type%22%3A%22type%2FText%22%7D%5D%2C%22974%22%2C%7B%22case-sensitive%22%3Afalse%7D%5D%7D%2C%22middleware%22%3A%7B%22js-int-to-string%3F%22%3Atrue%2C%22userland-query%3F%22%3Atrue%2C%22add-default-userland-constraints%3F%22%3Atrue%7D%7D&visualization_settings=%7B%22column_settings%22%3A%7B%7D%2C%22table.pivot%22%3Afalse%2C%22table.pivot_column%22%3A%22prise_rdv%22%2C%22table.cell_column%22%3A%22longitude%22%2C%22table.columns%22%3A%5B%7B%22name%22%3A%22id%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22structure_id%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22source%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22nom%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22presentation_resume%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22presentation_detail%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22types%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22thematiques%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22prise_rdv%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22frais%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22frais_autres%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22profils%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22profils_precisions%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22pre_requis%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22cumulable%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22justificatifs%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22formulaire_en_ligne%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22commune%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22code_postal%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22code_insee%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22adresse%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22complement_adresse%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22longitude%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22latitude%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22recurrence%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22date_creation%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22date_suspension%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22lien_source%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22telephone%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22courriel%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22contact_public%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22date_maj%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22modes_accueil%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22zone_diffusion_type%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22zone_diffusion_code%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22zone_diffusion_nom%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22contact_nom_prenom%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%22page_web%22%2C%22enabled%22%3Atrue%7D%2C%7B%22name%22%3A%'
	
	const options = {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-API-KEY': API_KEY}, data:body, url: 'https://stats.inclusion.beta.gouv.fr/api/dataset/json'};
	
	try {
		const { data } = await axios.request(options);
		console.log(data);
	} catch (error) {
		console.error(error);
	}
	
	store.commit("endImport",true)

	return true
}