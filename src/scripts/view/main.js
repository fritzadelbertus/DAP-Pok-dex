import $ from 'jquery';
import '../component/pokemon-list';
import '../component/pokemon-details';
import DataSource from '../data/datasource';
import localData from '../data/localdata';

const main = () => {
  const loadInitialData = async () => {
    const data = await DataSource.getAllPokemon();
    localData.countPokemon = data.count;
  };
  const renderPokemons = () => {
    const pokemonList = document.createElement('pokemon-list');
    $('.content-box').html('');
    $('.content-box').append(pokemonList);
    $('#main-header').addClass('in-home');
  };

  $('.search-btn').on('click', async () => {
    try {
      const keyword = $('#search-text').val();
      if (keyword === '') {
        renderPokemons();
        return;
      }
      const result = await DataSource.searchSpecificPokemon(keyword);
      const pokemonDetailsElement = document.createElement('pokemon-details');
      pokemonDetailsElement.pokemon = result;
      $('.content-box').html(pokemonDetailsElement);
      $('#search-text').val('');
      $('#main-header').removeClass('in-home');
    } catch (error) {
      $('.content-box').html(error.message);
    }
  });
  loadInitialData();
  renderPokemons();
  $('.pokedex-title').on('click', () => { renderPokemons(); });
  $('.home-btn').on('click', () => { renderPokemons(); });
};

export default main;
