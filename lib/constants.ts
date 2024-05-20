import type { Project } from '@/lib/schema';

export const baseUrl = 'https://made-showcase.vercel.app';

export const madeTemplateRepository = {
  owner: 'jvalue',
  repo: 'made-template',
};

export const semesters = ['ss23', 'ws23', 'ss24'];

export const ignoredReadmeHashes = [
  'c3f139485c56deb74b26a8f5388759401f1a78c1',
  '234fed9f530a7bb4cc19822e430195d636e638db',
  'ad13ff485fc9c66a3bdf33c75ab552696514b169',
];

// prettier-ignore
export const overrides: Record<string, Partial<Project>> = {
  // https://oss.cs.fau.de/2023/10/04/made-ss23-project-electromobility-and-charging-infrastructure-in-germany/
  'nmarkert/electromobility': {
    title: 'Electromobility and Charging Infrastructure in Germany',
    summary: 'The aim of this project is to investigate if there is a relationship between the charging point infrastructure and electromobility in Germany.',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
  },
  // https://oss.cs.fau.de/2023/10/04/made-ss23-project-correlation-between-rates-of-accidents-in-germany-and-munster-with-respect-to-bicycle-count-in-munster/
  'thesagni/2023-AMSE-Sagni': {
    title: 'Correlation between rates of accidents in Germany and Münster with respect to bicycle count in Münster',
    summary: 'Münster, a city in North Rhine-Westphalia, is the home to an estimated 500,000 bicycles. It is famous for its bike-friendly streets and is hence popularly known as the “Bicycle capital of Germany”.',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/04/made-winter-2023-24-project-london-urban-demographic-analysis/
  'julian-m10/made-2324': {
    title: 'London Urban Demographic Analysis',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_London-480x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/05/made-winter-2023-24-project-sentiment-driven-spotify-music-recommendation/
  'prantoamt/made-template' : {
    title: 'Sentiment-Driven Spotify Music Recommendation',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_Spotify-480x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/08/made-winter-2023-24-project-realistic-alternatives-substituting-the-worst-train-connections-with-electrified-highways/
  'LisaRebecca/data-engineering-showcase' : {
    title: 'Realistic Alternatives: Substituting the Worst Train Connections with Electrified Highways',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_Electrify-364x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/09/made-winter-2023-24-projects-analyzing-the-correlation-between-temperature-changes-and-food-price-inflation-in-selected-african-countries/
  'Zylesto/made-template' : {
    title: 'Analyzing the Correlation Between Temperature Changes and Food Price Inflation in Selected African Countries',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_Africafood-480x270.jpg',
  },
  // https://oss.cs.fau.de/2024/04/09/made-winter-2023-24-projects-brfc-behavior-risk-factors-cancer/
  'nilapalin/made-template' : {
    title: 'BRFC – Behavior Risk Factors & Cancer',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_Cancer-233x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/09/made-winter-2023-24-projects-association-between-newly-registered-passenger-cars-and-co2-emissions-in-the-eu/
  'rafoolin/made-template': {
    title: 'Association between Newly Registered Passenger Cars and CO2 emissions in the EU',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_co2-364x320.jpg',
  },
  // https://oss.cs.fau.de/2024/04/09/made-winter-2023-24-projects-impact-of-weather-on-daily-air-traffic-at-the-paphos-international-airport-cyprus/
  'abdulahad2307/made-template-Ahad' : {
    title: 'Impact of Weather on Daily Air Traffic at the Paphos International Airport, Cyprus',
    bannerUrl: 'https://oss.cs.fau.de/wp-content/uploads/2024/04/MADE_paphos.jpg',
  },
};
