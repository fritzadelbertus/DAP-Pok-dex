import $ from 'jquery';
import DataSource from '../data/datasource';
import webimg from '../images/pokeball.png';

/* eslint-disable no-underscore-dangle */
class PokemonItem extends HTMLElement {
  set pokemon(pokemon) {
    this._pokemon = pokemon;
    this.render();
  }

  async render() {
    try {
      const info = await DataSource.searchPokemonInfo(this._pokemon.name);
      const types = info.types.reduce((total, cur) => `${total} <span class="type-tag">${cur.type.name}</span>`, '');
      this.innerHTML = `
        <img class="pokemon-image" src="${info.image}" alt="Image of ${this._pokemon.name}">
        <div class="pokemon-info-text">
          <h2 class="capitalize">${this._pokemon.name.toString().replace(/-/g, ' ')}</h2>
          <p>${types}</p>
        </div>
        <img src="${webimg}" class="pokeball-png">
      `;
      this.classList.add(`${info.types[0].type.name}-pokemon`);
      this.onclick = async () => {
        try {
          const result = await DataSource.searchSpecificPokemon(this._pokemon.name);
          const pokemonDetailsElement = document.createElement('pokemon-details');
          pokemonDetailsElement.pokemon = result;
          $('.content-box').html(pokemonDetailsElement);
          $('#main-header').removeClass('in-home');
        } catch (error) {
          $('.content-box').html(error.message);
        }
      };
    } catch (error) {
      this.innerHTML = error;
    }
  }
}

customElements.define('pokemon-item', PokemonItem);
