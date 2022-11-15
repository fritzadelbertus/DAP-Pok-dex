// DataSource URLS
// https://pokeapi.co/api/v2/pokemon/ - Data for All Pokemon
// https://pokeapi.co/api/v2/pokemon/{{pokemon name}} - Data for one pokemon
// https://pokeapi.co/api/v2/pokemon-species/{{id}} - Data for pokemon's species and evolution chain
// https://pokeapi.co/api/v2/move/ - Data for pokemon move's type

class DataSource {
  static async searchSpecificPokemon(pokemonName) {
    try {
      const pokeName = pokemonName.toLowerCase().replace(' ', '-');
      const baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
      const responseJson = await fetch(baseUrl).then((response) => response.json());
      if (responseJson) return Promise.resolve(responseJson);
      return Promise.reject(new Error(`${pokemonName} has not yet been discovered!`));
    } catch (error) {
      return Promise.reject(new Error(`${pokemonName} has not yet been discovered!`));
    }
  }

  static async searchPokemonInfo(pokemonName) {
    try {
      const pokeName = pokemonName.toLowerCase();
      const baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
      const responseJson = await fetch(baseUrl).then((response) => response.json());
      if (responseJson) {
        const { types, sprites } = responseJson;
        const info = { types, image: sprites.other['official-artwork'].front_default };
        return Promise.resolve(info);
      }
      return Promise.reject(new Error(`${pokemonName} has not yet been discovered!`));
    } catch (error) {
      return Promise.reject(new Error(`${pokemonName} has not yet been discovered!`));
    }
  }

  static async getAllPokemon(index) {
    try {
      const baseUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${index * 20}&limit=20`;
      const responseJson = await fetch(baseUrl).then((response) => response.json());
      if (responseJson) return Promise.resolve(responseJson);
      return Promise.reject(new Error('The Pokemons Runaway! Please Refresh the Page.'));
    } catch (error) {
      return Promise.reject(new Error('The Pokemons Runaway! Please Refresh the Page.'));
    }
  }

  static async getSpeciesInfo(url) {
    try {
      const responseJson = await fetch(url).then((response) => response.json());
      if (responseJson) return Promise.resolve(responseJson);
      return Promise.reject(new Error('Can\'t find the species... Please Refresh the Page.'));
    } catch (error) {
      return Promise.reject(new Error('Can\'t find the species... Please Refresh the Page.'));
    }
  }

  static async getEvolutionInfo(url) {
    try {
      const responseJson = await fetch(url).then((response) => response.json());
      if (!responseJson) return Promise.reject(new Error('Lost in the pokedex... Please Refresh the Page.'));
      const evolutionList = await fetch(responseJson.evolution_chain.url).then((res) => res.json());
      if (!evolutionList) return Promise.reject(new Error('Lost in the pokedex... Please Refresh the Page.'));
      return Promise.resolve(evolutionList);
    } catch (error) {
      return Promise.reject(new Error('Lost in the pokedex... Please Refresh the Page.'));
    }
  }

  static async getMoveType(url) {
    try {
      const responseJson = await fetch(url).then((response) => response.json());
      if (responseJson) return Promise.resolve(responseJson.type.name);
      return Promise.reject(new Error('Lost in the pokedex... Please Refresh the Page.'));
    } catch (error) {
      return Promise.reject(new Error('Lost in the pokedex... Please Refresh the Page.'));
    }
  }
}

export default DataSource;
