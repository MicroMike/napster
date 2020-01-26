const GenreCalls = {};
const ids = [
  '313031837',
  '366684444',
  '385444725',
  '390623666',
  '394090486',
  '395149855',
]

GenreCalls.getGenres = function getGenres(access_token) {
  const promises = []

  for (let aId of ids) {
    const url = "https://api.napster.com/v2.2/albums/Alb." + aId;

    promises.push(new Promise(r => {
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
    }))
  }

  return Promise.all(promises)
};


export default GenreCalls;
