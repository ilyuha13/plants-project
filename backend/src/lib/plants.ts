import _ from 'lodash'

export const plants = _.times(100, (i) => ({
  genus: `plant ${i} genus`,
  species: `plant ${i} species`,
  description: `plant ${i} description`,
  //   imgUrl: 'images/trough-the-mist.png',
  plantId: String(i),
}))
