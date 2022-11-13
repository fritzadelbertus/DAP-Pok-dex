/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import $ from 'jquery';
import DataSource from '../data/datasource';
import './pokemon-item';
import webimg from '../images/pokeball.png';

class PokemonDetails extends HTMLElement {
  set pokemon(pokemon) {
    this._pokemon = pokemon;
    this.render();
  }

  renderAbout(species) {
    const abilities = this._pokemon.abilities.reduce((total, cur) => `${total}, ${cur.ability.name}`, '');
    const genus = species.genera.filter((language) => language.language.name === 'en');
    const innerHTML = `
      <p class="stat-name">Species</p><p>${genus[0].genus}</p>
      <p class="stat-name">Height</p><p>${this._pokemon.height / 10} m</p>
      <p class="stat-name">Weight</p><p>${this._pokemon.weight / 10} kg</p>
      <p class="stat-name">Abilities</p><p class="capitalize">${abilities.replace(', ', '').replace(/-/g, ' ')}</p>
      <p class='two-column'>Breeding</p>
      <p class="stat-name">Gender</p>
      <p class="gender-flex">
      ${species.gender_rate === -1 ? '<span>None</span>'
    : `<span>${species.gender_rate * 12.5}% <i class="fa-solid fa-venus"></i></span>
       <span>${(8 - species.gender_rate) * 12.5}% <i class="fa-solid fa-mars"></i></span>`}
      </p>
      <p class="stat-name">Egg Group</p><p class="capitalize">${species.egg_groups[0].name.replace(/-/g, ' ')}</p>
    `;
    $('.pokemon-info > article').html(innerHTML);
    $('.pokemon-info > article').removeClass();
    $('.pokemon-info > article').addClass('pokemon-details-about-article');
  }

  renderBaseStat() {
    const stats = this._pokemon.stats.reduce((total, cur) => `${total}
    <p>${cur.stat.name.replace('-', ' ').replace('ecial', '')}</p>
    <p>${cur.base_stat}</p>
    <div class="stat-bar" style="--i:${cur.base_stat};--col:${cur.base_stat >= 60 ? 'lightgreen' : 'lightcoral'}"></div>
    `, '');
    $('.pokemon-info > article').html(stats);
    $('.pokemon-info > article').removeClass();
    $('.pokemon-info > article').addClass('pokemon-details-basestat-article');
  }

  renderEvolution(evolutionInfo) {
    const traverse = (parent, result) => {
      if (parent === undefined) return;
      result.push(parent.species.name);
      parent.evolves_to.forEach((children) => { traverse(children, result); });
    };
    const pointer = evolutionInfo.chain;
    // eslint-disable-next-line prefer-const
    let evolutionList = [];
    $('.pokemon-info > article').html('');
    traverse(pointer, evolutionList);
    evolutionList.forEach((pokemon) => {
      const pokemonItemElement = document.createElement('pokemon-item');
      pokemonItemElement.pokemon = { name: pokemon };
      $('.pokemon-info > article').append(pokemonItemElement);
    });
    $('.pokemon-info > article').removeClass();
    $('.pokemon-info > article').addClass('pokemon-details-evolution-article');
  }

  renderMoves(moves) {
    $('.pokemon-info > article').html(moves);
    $('.pokemon-info > article').removeClass();
    $('.pokemon-info > article').addClass('pokemon-details-moves-article');
  }

  async render() {
    try {
      const makeId = (strId) => {
        let res = strId;
        while (res.length < 3) res = `0${res}`;
        return res;
      };
      let moves = '';
      this._pokemon.moves.forEach(async (move) => {
        const moveType = await DataSource.getMoveType(move.move.url);
        moves += `<span class="moves-tag ${moveType}-pokemon">${move.move.name.replace(/-/g, ' ')}</span>`;
      });
      const species = await DataSource.getSpeciesInfo(this._pokemon.species.url);
      const evolutionInfo = await DataSource.getEvolutionInfo(this._pokemon.species.url);
      const types = this._pokemon.types.reduce((total, cur) => `${total} <span class="type-tag">${cur.type.name}</span>`, '');
      this.innerHTML = `
      <header class="${this._pokemon.types[0].type.name}-pokemon">
        <h2 class="capitalize">${this._pokemon.name.replace(/-/g, ' ')}</h2>
        <p class="header-type">${types}<p>
        <p class="header-id">#${makeId(this._pokemon.id.toString())}</p>
        <img src="${webimg}" class="pokeball-png">
      </header>
      <div class="pokemon-img"><img src="${this._pokemon.sprites.other['official-artwork'].front_default}" alt="Image of${this._pokemon.name}"></div>
      <div class="pokemon-info">
        <ul>
          <li id="details-about-btn" class="active-details-btn">About</li>
          <li id="details-stats-btn">Base Stats</li>
          <li id="details-evo-btn">Evolution</li>
          ${this._pokemon.id < 1000 ? '<li id="details-move-btn">Moves</li>' : ''}
        </ul>
        <article></article>
      </div>
      `;
      this.renderAbout(species);
      this.classList.add(`${this._pokemon.types[0].type.name}-pokemon`);
      $('.pokemon-info > ul > #details-about-btn').on('click', (event) => {
        this.renderAbout(species);
        $('.pokemon-info > ul > li').removeClass('active-details-btn');
        event.target.classList.add('active-details-btn');
      });

      $('.pokemon-info > ul > #details-stats-btn').on('click', (event) => {
        this.renderBaseStat();
        $('.pokemon-info > ul > li').removeClass('active-details-btn');
        event.target.classList.add('active-details-btn');
      });

      $('.pokemon-info > ul > #details-evo-btn').on('click', (event) => {
        this.renderEvolution(evolutionInfo);
        $('.pokemon-info > ul > li').removeClass('active-details-btn');
        event.target.classList.add('active-details-btn');
      });

      $('.pokemon-info > ul > #details-move-btn').on('click', (event) => {
        this.renderMoves(moves);
        $('.pokemon-info > ul > li').removeClass('active-details-btn');
        event.target.classList.add('active-details-btn');
      });
    } catch (error) {
      this.innerHTML = error;
    }
  }
}

customElements.define('pokemon-details', PokemonDetails);
