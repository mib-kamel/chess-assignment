import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MoveChange, NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-board-component',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('board', { static: false }) boardManager!: NgxChessBoardView;

  @Output() newItemEvent = new EventEmitter<string>();

  lightDisabled = true;
  darkDisabled = true;
  isMyTurn = false;

  private player = undefined;
  private parentWindow: any = undefined;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.player = params['player'];
      });

    window.addEventListener("message", (e) => {
      this.messageReceived(e);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.player === '2') {
        this.boardManager.reverse();
        this.darkDisabled = false;
      } else {
        this.lightDisabled = false;
        this.isMyTurn = true;
      }
      this.parentWindow = window.parent;
      this.parentWindow.postMessage({
        type: 'ready',
        player: this.player
      }, "*");
    });
  }

  public moveCallback(move: MoveChange): void {
    if (move.checkmate) {
      if (confirm("Check Mate! ... Start a new Game?") === true) {
        this.boardManager.reset();

        this.parentWindow.postMessage({
          type: 'reset'
        }, "*");
      }
      return;
    }

    const fen = this.boardManager.getFEN();
    this.parentWindow.postMessage({
      type: 'move',
      player: this.player,
      fen: fen
    }, "*");
  }

  private messageReceived(event: MessageEvent) {
    if (event?.data?.type === 'move') {
      this.boardManager.setFEN(event.data.fen);

      if (this.player === '2') {
        this.boardManager.reverse();
      }
    }
  }

}
