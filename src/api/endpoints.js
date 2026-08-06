export const BASE_URL = 'https://rickandmortyapi.com/api';

export const STATUS_OPTIONS = ['alive', 'dead', 'unknown'];
export const GENDER_OPTIONS = ['female', 'male', 'genderless', 'unknown'];
export const SPECIES_OPTIONS = [
  'Human', 'Alien', 'Humanoid', 'Robot', 'Animal',
  'Mythological Creature', 'Poopybutthole', 'Cronenberg', 'Disease'
];

export const characterListUrl = (params) => 
  `${BASE_URL}/character?${new URLSearchParams(params).toString()}`;

export const characterUrl = (id) => `${BASE_URL}/character/${id}`;

export const charactersUrl = (ids) => `${BASE_URL}/character/${ids.join(',')}`;

export const episodesUrl = (ids) => `${BASE_URL}/episode/${ids.join(',')}`;