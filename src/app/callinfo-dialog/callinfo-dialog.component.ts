import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-callinfo-dialog',
  templateUrl: './callinfo-dialog.component.html',
  styleUrls: ['./callinfo-dialog.component.scss']
})
export class CallinfoDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<CallinfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private _snackBar: MatSnackBar
  ) { }

  public showCopiedSnackBar()
  {
    this._snackBar.open('Peer ID copied!','Dinh Hao',{duration:1000,horizontalPosition:'center',verticalPosition:'top'});
  }

  ngOnInit(): void {
  }

}
export interface DialogData {
  peerId?: string;
  joinCall: boolean
}
