/* eslint-disable no-underscore-dangle */
import $ from 'jquery';
import DataSource from '../data/datasource';
import './pokemon-item';
import localData from '../data/localdata';

class PokemonList extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  async render() {
    this._pokemons = await DataSource.getAllPokemon(localData.currentTab);
    this.innerHTML = `
    <div>
    <button class="first-pokemon-list pokemon-list-btn"><i class="fa-solid fa-backward"></i></button>
    <button class="prev-pokemon-list pokemon-list-btn"><i class="fa-solid fa-play play-rotate"></i></button>
    <p>${this._pokemons.results.length + (localData.currentTab * 20)} out of ${localData.countPokemon} Pokemons</p>
    <button class="next-pokemon-list pokemon-list-btn"><i class="fa-solid fa-play"></i></button>
    <button class="last-pokemon-list pokemon-list-btn"><i class="fa-solid fa-forward"></i></button>
    </div>
    `;
    this._pokemons.results.forEach((pokemon) => {
      const pokemonItemElement = document.createElement('pokemon-item');
      pokemonItemElement.pokemon = pokemon;
      this.appendChild(pokemonItemElement);
    });

    $('.next-pokemon-list').on('click', async () => {
      if (localData.currentTab * 20 < localData.countPokemon - 20) {
        localData.currentTab += 1;
        this.render();
      }
    });
    $('.prev-pokemon-list').on('click', async () => {
      if (localData.currentTab > 0) {
        localData.currentTab -= 1;
        this.render();
      }
    });
    $('.last-pokemon-list').on('click', async () => {
      localData.currentTab = Math.floor(localData.countPokemon / 20);
      this.render();
    });
    $('.first-pokemon-list').on('click', async () => {
      localData.currentTab = 0;
      this.render();
    });
  }
}

customElements.define('pokemon-list', PokemonList);
