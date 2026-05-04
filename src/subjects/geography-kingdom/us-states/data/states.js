/**
 * US States Data
 * Includes all 50 states + DC with capitals, population, motto, and state bird
 */

export const US_STATES = [
  { id: 'al', name: 'Alabama', capital: 'Montgomery', population: '5,024,279', motto: 'Audemus jura nostra defendere', bird: 'Northern Flicker' },
  { id: 'ak', name: 'Alaska', capital: 'Juneau', population: '733,406', motto: 'North to the future', bird: 'Willow Ptarmigan' },
  { id: 'az', name: 'Arizona', capital: 'Phoenix', population: '7,151,502', motto: 'Ditat Deus', bird: 'Cactus Wren' },
  { id: 'ar', name: 'Arkansas', capital: 'Little Rock', population: '3,011,524', motto: 'Regnat Populus', bird: 'Northern Mockingbird' },
  { id: 'ca', name: 'California', capital: 'Sacramento', population: '39,538,223', motto: 'Eureka', bird: 'California Quail' },
  { id: 'co', name: 'Colorado', capital: 'Denver', population: '5,773,714', motto: 'Nil sine numine', bird: 'Lark Bunting' },
  { id: 'ct', name: 'Connecticut', capital: 'Hartford', population: '3,625,216', motto: 'Qui transtulit sustinet', bird: 'American Robin' },
  { id: 'de', name: 'Delaware', capital: 'Dover', population: '990,837', motto: 'Liberty and independence', bird: 'Delaware Blue Hen' },
  { id: 'fl', name: 'Florida', capital: 'Tallahassee', population: '22,610,726', motto: 'In God we trust', bird: 'Northern Mockingbird' },
  { id: 'ga', name: 'Georgia', capital: 'Atlanta', population: '10,711,908', motto: 'Wisdom, justice, and moderation', bird: 'Northern Mockingbird' },
  { id: 'hi', name: 'Hawaii', capital: 'Honolulu', population: '1,435,138', motto: 'The life of the land is perpetuated in righteousness', bird: 'Nene' },
  { id: 'id', name: 'Idaho', capital: 'Boise', population: '1,939,033', motto: 'Esto perpetua', bird: 'Mountain Bluebird' },
  { id: 'il', name: 'Illinois', capital: 'Springfield', population: '12,549,689', motto: 'State sovereignty, national union', bird: 'Northern Mockingbird' },
  { id: 'in', name: 'Indiana', capital: 'Indianapolis', population: '6,862,199', motto: 'The crossroads of America', bird: 'Northern Cardinal' },
  { id: 'ia', name: 'Iowa', capital: 'Des Moines', population: '3,190,369', motto: 'Our liberties we prize', bird: 'Eastern Goldfinch' },
  { id: 'ks', name: 'Kansas', capital: 'Topeka', population: '2,937,880', motto: 'Ad astra per aspera', bird: 'Western Meadowlark' },
  { id: 'ky', name: 'Kentucky', capital: 'Frankfort', population: '4,505,836', motto: 'United we stand, divided we fall', bird: 'Northern Cardinal' },
  { id: 'la', name: 'Louisiana', capital: 'Baton Rouge', population: '4,657,757', motto: 'Union, justice, and confidence', bird: 'Northern Mockingbird' },
  { id: 'me', name: 'Maine', capital: 'Augusta', population: '1,344,212', motto: 'Dirigo', bird: 'Black-capped Chickadee' },
  { id: 'md', name: 'Maryland', capital: 'Annapolis', population: '6,177,224', motto: 'Fatti maschii, parole femine', bird: 'Baltimore Oriole' },
  { id: 'ma', name: 'Massachusetts', capital: 'Boston', population: '7,029,917', motto: 'By the sword we seek peace, but peace only under liberty', bird: 'Black-capped Chickadee' },
  { id: 'mi', name: 'Michigan', capital: 'Lansing', population: '10,037,261', motto: 'Si quaeris peninsulam amoenam circumspice', bird: 'American Robin' },
  { id: 'mn', name: 'Minnesota', capital: 'Saint Paul', population: '5,737,915', motto: 'L\'Étoile du Nord', bird: 'Common Loon' },
  { id: 'ms', name: 'Mississippi', capital: 'Jackson', population: '2,939,690', motto: 'By valor and arms', bird: 'Northern Mockingbird' },
  { id: 'mo', name: 'Missouri', capital: 'Jefferson City', population: '6,196,156', motto: 'Salus populi suprema lex esto', bird: 'Northern Cardinal' },
  { id: 'mt', name: 'Montana', capital: 'Helena', population: '1,084,225', motto: 'Oro y plata', bird: 'Western Meadowlark' },
  { id: 'ne', name: 'Nebraska', capital: 'Lincoln', population: '1,961,504', motto: 'Equality before the law', bird: 'Western Meadowlark' },
  { id: 'nv', name: 'Nevada', capital: 'Carson City', population: '3,177,772', motto: 'All for our country', bird: 'Mountain Bluebird' },
  { id: 'nh', name: 'New Hampshire', capital: 'Concord', population: '1,402,054', motto: 'Live free or die', bird: 'Purple Finch' },
  { id: 'nj', name: 'New Jersey', capital: 'Trenton', population: '9,290,841', motto: 'Liberty and prosperity', bird: 'American Goldfinch' },
  { id: 'nm', name: 'New Mexico', capital: 'Santa Fe', population: '2,117,522', motto: 'Crescit eundo', bird: 'Greater Roadrunner' },
  { id: 'ny', name: 'New York', capital: 'Albany', population: '19,571,216', motto: 'Ever upward', bird: 'Eastern Bluebird' },
  { id: 'nc', name: 'North Carolina', capital: 'Raleigh', population: '10,701,022', motto: 'Esse quam videri', bird: 'Northern Cardinal' },
  { id: 'nd', name: 'North Dakota', capital: 'Bismarck', population: '780,588', motto: 'Liberty and union now and forever', bird: 'Western Meadowlark' },
  { id: 'oh', name: 'Ohio', capital: 'Columbus', population: '11,785,869', motto: 'With God, all things are possible', bird: 'Northern Cardinal' },
  { id: 'ok', name: 'Oklahoma', capital: 'Oklahoma City', population: '3,959,353', motto: 'Labor omnia vincit', bird: 'Scissor-tailed Flycatcher' },
  { id: 'or', name: 'Oregon', capital: 'Salem', population: '4,246,155', motto: 'Alis volat propriis', bird: 'Western Meadowlark' },
  { id: 'pa', name: 'Pennsylvania', capital: 'Harrisburg', population: '12,961,683', motto: 'Virtue, liberty, and independence', bird: 'Northern Mockingbird' },
  { id: 'ri', name: 'Rhode Island', capital: 'Providence', population: '1,095,962', motto: 'Hope', bird: 'Rhode Island Red' },
  { id: 'sc', name: 'South Carolina', capital: 'Columbia', population: '5,373,555', motto: 'Dum spiro spero', bird: 'Northern Mockingbird' },
  { id: 'sd', name: 'South Dakota', capital: 'Pierre', population: '887,770', motto: 'Under God the people rule', bird: 'Ring-necked Pheasant' },
  { id: 'tn', name: 'Tennessee', capital: 'Nashville', population: '7,126,489', motto: 'Agriculture and commerce', bird: 'Northern Mockingbird' },
  { id: 'tx', name: 'Texas', capital: 'Austin', population: '30,029,728', motto: 'Friendship', bird: 'Northern Mockingbird' },
  { id: 'ut', name: 'Utah', capital: 'Salt Lake City', population: '3,417,734', motto: 'Industry', bird: 'California Gull' },
  { id: 'vt', name: 'Vermont', capital: 'Montpelier', population: '643,077', motto: 'Freedom and unity', bird: 'Hermit Thrush' },
  { id: 'va', name: 'Virginia', capital: 'Richmond', population: '8,631,393', motto: 'Sic Semper Tyrannis', bird: 'Northern Mockingbird' },
  { id: 'wa', name: 'Washington', capital: 'Olympia', population: '7,812,880', motto: 'By the sword we seek peace, but peace only under liberty', bird: 'Willow Goldfinch' },
  { id: 'wv', name: 'West Virginia', capital: 'Charleston', population: '1,770,071', motto: 'Montani semper liberi', bird: 'Northern Mockingbird' },
  { id: 'wi', name: 'Wisconsin', capital: 'Madison', population: '5,910,726', motto: 'Forward', bird: 'American Robin' },
  { id: 'wy', name: 'Wyoming', capital: 'Cheyenne', population: '580,447', motto: 'Equal rights', bird: 'Western Meadowlark' },
  { id: 'dc', name: 'District of Columbia', capital: 'Washington', population: '689,545', motto: 'Justice for all', bird: 'Wood Thrush' },
];

export function getStateById(id) {
  return US_STATES.find(state => state.id === id);
}

export function getStateByName(name) {
  return US_STATES.find(state => state.name.toLowerCase() === name.toLowerCase());
}

export function getAllStates() {
  return US_STATES;
}
