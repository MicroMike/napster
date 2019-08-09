const GenreCalls = {};
const ids = [
  '389842349',
  '313031837',
  '366684444',
  '385444725',
  '390623666',
  '394090486',
  '395149855',
]

const rand = (max, min) => {
  return Math.floor(Math.random() * Math.floor(max) + (typeof min !== 'undefined' ? min : 0));
}

GenreCalls.getGenres = function getGenres(access_token) {
  const url = "https://api.napster.com/v2.2/albums/Alb." + ids[rand(ids.length)];

  return new Promise(r => {
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(result => result.json())
      .then(result => { r(result.albums[0]); })
      .catch(err => Error(err, "Loading Genres"));
  })
};


export default GenreCalls;
