export const getData = async function (store) {

	const dataRequest = await fetch("data/services.json")
	const data = await dataRequest.json()

	const structuresRequest = await fetch("data/structures.json")
	const structures = await structuresRequest.json()

	store.commit('initializeData',data)
	store.commit('initializeStructuresData',structures)
	
	store.commit("endImport",true)

	return true
}