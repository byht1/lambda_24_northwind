type Region =
  | 'Western Europe'
  | 'Eastern Europe'
  | 'North America'
  | 'Central America'
  | 'South America';

export const getRegion = (country: string): Region | null => {
  const westernEuropeCountries = [
    'Germany',
    'UK',
    'Sweden',
    'France',
    'Spain',
    'Switzerland',
    'Austria',
    'Italy',
    'Portugal',
    'Ireland',
    'Belgium',
    'Norway',
    'Denmark',
    'Finland',
  ];

  const easternEuropeCountries = ['Poland'];

  const northAmericaCountries = ['USA', 'Canada'];

  const centralAmericaCountries = ['Mexico'];

  const southAmericaCountries = ['Argentina', 'Brazil', 'Venezuela'];

  if (westernEuropeCountries.includes(country)) {
    return 'Western Europe';
  }

  if (easternEuropeCountries.includes(country)) {
    return 'Eastern Europe';
  }

  if (northAmericaCountries.includes(country)) {
    return 'North America';
  }

  if (centralAmericaCountries.includes(country)) {
    return 'Central America';
  }

  if (southAmericaCountries.includes(country)) {
    return 'South America';
  }

  return null;
};
