import { Component, OnInit } from '@angular/core';


const LOCAL_STORAGE_KEY = 'chess-game';
const RESET_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  playerTurn: string = '1';

  player1Frame: any;
  player2Frame: any;

  private storedGame: any = undefined;

  constructor(
  ) { }

  ngOnInit() {
    window.addEventListener("message", (e) => {
      this.messageReceived(e);
    });
    this.player1Frame = document.getElementById('player1-frame');
    this.player2Frame = document.getElementById('player2-frame');

    let storedGame: any = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedGame) {
      this.storedGame = JSON.parse(storedGame);
      if (this.storedGame.player === '1') {
        this.playerTurn = '2';
      }
    }
  }

  private messageReceived(event: MessageEvent) {
    if (event.data.type === 'ready') {
      if (event.data.player === '2') {
        this.player2Frame.contentWindow.postMessage(this.storedGame, "*");
      } else {
        this.player1Frame.contentWindow.postMessage(this.storedGame, "*");
      }
    }

    if (event.data.type === 'move') {
      this.playerTurn = event.data.player === '1' ? '2' : '1';
      if (event.data.player === '1') {
        this.player2Frame.contentWindow.postMessage(event.data, "*");
      } else {
        this.player1Frame.contentWindow.postMessage(event.data, "*");
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(event.data));
    }

    if (event.data.type === 'reset') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      this.playerTurn = '1';
      this.player1Frame.contentWindow.postMessage({
        type: 'move',
        fen: RESET_FEN,
      }, "*");
      this.player2Frame.contentWindow.postMessage({
        type: 'move',
        fen: RESET_FEN,
      }, "*");
    }
  }
}
