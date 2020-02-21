import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

import { ConfirmActionComponent } from '../../../sharing/modal/confirm-action/confirm-action.component';
import { CaseNumberComponent } from '../../../sharing/modal/case-number/case-number.component';
import { ReasonInputComponent } from '../../../sharing/modal/reason-input/reason-input.component';
import { CommentComponent } from '../../../sharing/modal/comment/comment.component';

import { TimelineOfRequestsService, Timer } from '../../../service/timeline-of-requests.service';
import { ConfirmService } from '../../../service/api/put/confirm.service';
import { RejectService } from '../../../service/api/put/reject.service';
import { LocalStorageService } from '../../../service/local-storage.service';
import { TraTuService } from '../../../service/tra-tu.service';
import { CopyService } from '../../../service/copy.service';
import { DelayActionService } from '../../../service/delay-action.service';
import { ListTicketsService } from '../../../service/list-tickets.service';
import { UpdateCasenumberService } from '../../../service/api/put/update-casenumber.service';

@Component({
  selector: 'app-proccess-the-requrements',
  templateUrl: './proccess-the-requrements.component.html',
  styleUrls: ['./proccess-the-requrements.component.scss']
})
export class ProccessTheRequrementsComponent implements OnInit {
  @ViewChild(MatMenuTrigger,{static:false}) contextMenu: MatMenuTrigger;
  @ViewChild('contentContainer', {static:false}) private contentContainer: ElementRef
  countDownTimer: Timer;
  processCases:any = [];

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value: number = 100;
  
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private timelineOfRequestsService: TimelineOfRequestsService,
    private confirmService: ConfirmService,
    private rejectService: RejectService,
    private localStorageService: LocalStorageService,
    public traTuService: TraTuService,
    private dialog: MatDialog,
    public copyService: CopyService,
    private delayActionService: DelayActionService,
    private listTicketsService: ListTicketsService,
    private updateCasenumberService: UpdateCasenumberService
  ) {
    this.listTicketsService.listenListTicket.subscribe(resTickets=>{
      if(resTickets){
        // console.log(resTickets);
        this.processCases = resTickets.filter(ticket=>{
          return ticket.costs.length===0 && ticket.insmart_status === 'TAKEN';
        });
        for(let processCase of this.processCases){
          processCase.countDown = this.timelineOfRequestsService.calcCountdown(15, processCase.created_at);
        }
      }
    })
  }

  ngOnInit() {}

  onRightClick(event: MouseEvent, element: any){
    event.preventDefault();
    console.log(element);
    
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'id': element };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  setCaseNumber(element){
    this.dialog.open(CaseNumberComponent,{data: element.note}).afterClosed().subscribe(caseNumber=>{
      let token = this.localStorageService.getLocalStorage('token');
      this.updateCasenumberService.insmartUpdateCaseNo(element.ID, caseNumber, token).subscribe(res=>{
        if(res.code === 200 && res.message==='OK'){
          this.listTicketsService.changePropertyTicket(res.data);
        }
      });
    })
  }

  addComment(ticket){
    this.dialog.open(CommentComponent,{
      data: ticket
    }).afterOpen().subscribe(status=>{
      console.log(status);
    })
  }

  confirm(element){
    let token = this.localStorageService.getLocalStorage('token');
    this.confirmService.insmartConfirm(element.ID, token).subscribe(response=>{
      if(response.code === 200 && response.message==='OK'){
        this.listTicketsService.changePropertyTicket(response.data);
      }
    });
  }

  reject(element){
    this.dialog.open(ReasonInputComponent).afterClosed().subscribe(reason=>{
      if(reason.length >10){
        let token = this.localStorageService.getLocalStorage('token');
        this.rejectService.insmartReject(element.ID, reason,token).subscribe(response=>{
          if(response.code === 200 && response.message==='OK'){
            this.listTicketsService.changePropertyTicket(response.data);
          }
        });
      }
    })
  }
  
}

interface Message{
  from:number;
  content:string;
  date:Date;
}