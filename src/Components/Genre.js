import React from 'react';
import Player from './Player';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';
import AccountCall from '../Models/AccountCall';

let Napster;

const rand = (max, min) => {
  return Math.floor(Math.random() * Math.floor(max) + (typeof min !== 'undefined' ? min : 0));
}

let rand1
let rand2

export default class Genre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      genres: [],
      tracks: [],
      queue: [],
      queueHolder: [],
      selectedTrack: {},
      playing: false,
      shuffle: false,
      isShowing: false,
      currentTime: 0,
      totalTime: 0,
      currentTrackId: "",
      repeat: false,
      autoplay: false,
      del: false
    };
  }

  componentDidMount() {
    this.loadGenres(this.props.token);
    Napster = window.Napster;
    AccountCall.getAccount(this.props.token)
      .then(account => {
        console.log(account.isCurrentSubscriptionPayable)
        this.setState({ del: !account.isCurrentSubscriptionPayable });
      })
  }

  loadGenres(token) {
    GenreCalls.getGenres(token)
      .then(albums => {
        this.setState({ albums });

        rand1 = rand(albums.length)

        while (!rand2 || rand2 === rand1) {
          rand2 = rand(albums.length)
        }

        this.setState({ genres: [albums[rand1]] });
        TrackCalls.getTracks(token, albums[rand2].links.tracks.href).then(tracks => {
          if (this.state.tracks !== tracks) {
            this.setState({ tracks });
          }
        })
      })
  }

  chooseTrackList(token, url) {
    rand2 = rand1

    while (rand2 === rand1) {
      rand1 = rand(this.state.albums.length)
    }

    this.setState({ genres: [this.state.albums[rand1]] });

    return TrackCalls.getTracks(token, url)
      .then(tracks => {
        if (this.state.tracks !== tracks) {
          this.setState({ tracks });
        }
      })
      .catch(err => Error(err, "Loading Tracks"));
  }

  select(track) {
    this.setState({ selectedTrack: track }, () => {
      Napster.player.play(track.id);
      this.isPlaying(true);
      this.setState({ currentTrackId: track.id });
      const inQueue = this.state.queue.find(tr => track.id === tr.id);
      if (!inQueue) {
        this.setState({ queueHolder: this.state.tracks });
        this.setState({ queue: this.state.tracks }, () => {
          if (this.state.shuffle) {
            const shuffledQueue = [...this.state.queue].sort(() => Math.random() - 0.5);
            this.updateQueue(shuffledQueue);
          }
        });
      }
    });
  }

  isPlaying = cmd => {
    this.setState({ playing: cmd });
    if (cmd === true) {
      Napster.player.on('playtimer', e => {
        console.log(e)
        this.setState({
          currentTime: e.data.currentTime,
          totalTime: e.data.totalTime
        });
        if (this.state.repeat) {
          if (Math.floor(this.state.currentTime) === this.state.totalTime) {
            Napster.player.play(this.state.selectedTrack.id);
          }
        }
        if (this.state.autoplay) {
          if (Math.floor(this.state.currentTime) > 31 + rand(10)) {
            Napster.player.play(this.state.tracks[rand(this.state.tracks.length)].id);
          }
        }
      });
    }
  }

  currentTrack = id => { this.setState({ currentTrackId: id }); }

  isShuffled = cmd => { this.setState({ shuffle: cmd }); }

  updateQueue = newQueue => { this.setState({ queue: newQueue }); }

  songMovement = index => { this.setState({ selectedTrack: index }); }

  songRepeat = cmd => { this.setState({ repeat: cmd }); }

  trackAutoplay = cmd => { this.setState({ autoplay: cmd }); }

  showQueue = () => {
    if (this.state.selectedTrack.type === "track") {
      if (this.state.isShowing === false) {
        this.setState({ isShowing: true });
      } else {
        this.setState({ isShowing: false });
      }
    } else {
      return "";
    }
  }

  render() {
    const genreList = this.state.genres.map(genre => (
      <div role="button" tabIndex={0} className="genre-btn" key={genre.id} onClick={() => { this.chooseTrackList(this.props.token, genre.links.tracks.href); }} onKeyPress={this.handleKeyPress}>
        <h3>{genre.name.toUpperCase()}</h3>
      </div>
    ));

    const trackList = this.state.tracks.map(track => (
      <div role="button" tabIndex={0} id="track" className="content" style={{ display: (this.state.isShowing ? 'none' : 'content') }} key={track.id} onClick={() => { this.select(track); }} onKeyPress={this.handleKeyPress}>
        <div className="text">
          <h3><strong>{track.name}</strong></h3>
          <p>{track.artistName}</p>
        </div>
      </div>
    ));

    const queueList = this.state.queue.map(track => (
      <div role="button" tabIndex={0} id="queue" className="content" style={{ display: (this.state.isShowing ? 'content' : 'none') }} key={track.id} onClick={() => { this.select(track); }} onKeyPress={this.handleKeyPress}>
        <div className="text">
          <h3><strong>{track.name}</strong></h3>
          <p>{track.artistName}</p>
        </div>
      </div>
    ));

    return (

      <div id="parent">
        <div id="narrow">
          <Player
            selectedTrack={this.state.selectedTrack}
            playing={this.state.playing}
            shuffle={this.state.shuffle}
            updateQueue={this.updateQueue}
            songMovement={this.songMovement}
            queue={this.state.queue}
            queueHolder={this.state.queueHolder}
            showQueue={this.showQueue}
            isPlaying={this.isPlaying}
            isShuffled={this.isShuffled}
            isShowing={this.state.isShowing}
            currentTime={this.state.currentTime}
            totalTime={this.state.totalTime}
            currentTrackId={this.state.currentTrackId}
            currentTrack={this.currentTrack}
            songRepeat={this.songRepeat}
            repeat={this.state.repeat}
            trackAutoplay={this.trackAutoplay}
          />
          {this.state.isShowing && (
            <div align="center" id="queue">
              <p className="queue">Your Queue</p>
              {queueList}
            </div>
          )}
          {!this.state.isShowing && (<div align="center" id="track">{trackList}</div>)}
        </div>
        <div id="wide">
          {this.state.del && <div id="del">DEL</div>}
          <h1 className="header">WELCOME</h1>
          <h2 className="message">Select any genre to start listening!</h2>
          <br />
          <ul>{genreList}</ul>
        </div>
      </div>
    );
  }
}
