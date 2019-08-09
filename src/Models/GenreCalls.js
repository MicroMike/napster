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
let count = 0
const promises = []

const getAlbum = (access_token, url) => {
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
}

GenreCalls.getGenres = function getGenres(access_token) {
  while (ids[count]) {
    const url = "https://api.napster.com/v2.2/albums/Alb." + ids[count];
    promises.push(getAlbum(access_token, url))
    count++
  }

  return Promise.all(promises)
};


export default GenreCalls;
