import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { CallService } from './call.service';
import { CallinfoDialogComponent, DialogData } from './callinfo-dialog/callinfo-dialog.component';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;

  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(public dialog: MatDialog, private callService: CallService) {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer()  as any;
  }

  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter((res: any) => !!res))
      .subscribe(stream => this.localVideo.nativeElement.srcObject = stream as unknown as MediaStream)
    this.callService.remoteStream$
      .pipe(filter((res: any) => !!res))
      .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream as unknown as MediaStream)
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  public showModal(joinCall: boolean): void {
    let dialogData: DialogData = joinCall ? ({ peerId: null, joinCall: true } as unknown as DialogData) : ({ peerId: this.peerId, joinCall: false } as DialogData);
    const dialogRef:MatDialogRef<CallinfoDialogComponent> = this.dialog.open(CallinfoDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap((peerId: string) =>
          joinCall ? of(this.callService.establishMediaCall(peerId)) : of(this.callService.enableCallAnswer())
        ),
      )
      .subscribe(_  => { });
  }

  public endCall() {
    this.callService.closeMediaCall();
  }
}

