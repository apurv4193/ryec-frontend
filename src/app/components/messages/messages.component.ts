import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { HttpService, CommonService, MessageService } from './../../services';
import { environment } from '../../../environments/environment.prod';
import { ThreandListRes, ThreadUserRes, ThreadMessageListRes, MessageListRes } from './../../class/data.model';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'ryec-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

    threadList: ThreadUserRes[] = [];
    currentPage = 1;
    conversionList: any;
    thread_id = 0;
    loggedUserId = 0;
    message_text = '';
    messageArr: Array<{ date: string, data: any }> = [];
    isConversionOpened: boolean = false;
    isMoreThread: boolean = false;
    isMoreMessage: boolean = false;
    messagePageNumber = 1;
    interval: any;
    tempMsg = {};
    loadPreviousData = false;
    @ViewChild('msg_div') private myScrollContainer: PerfectScrollbarComponent;

    constructor(
        private httpS: HttpService,
        private cS: CommonService,
        private ref: ChangeDetectorRef,
        private mS: MessageService) {
        const userDetail = this.cS.getUserDetails();
        if (userDetail) {
            this.loggedUserId = userDetail.id;
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    chatDrawer() {
        this.isConversionOpened = !this.isConversionOpened;
    }

    scrollToBottom(): void {
        try {
            //this.myScrollContainer.directiveRef.scrollToBottom();
            //this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    scrollToTop(): void {
        try {
            //this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    ngOnInit() {
        this.mS.setMessageCount(0);
        this.getThreadListForChat();
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    /**
    * Get threadlist(Inbox listing data) from server
    */
    getThreadListForChat() {
        this.messageArr = [];
        this.tempMsg = {};
        const apiUrl = environment.RYEC_API_URL + 'getThreadListing';
        const postJson = { page: this.currentPage }

        this.httpS.post(apiUrl, postJson).subscribe((res: ThreandListRes) => {
            if (res.status === 1) {
                for (let i of res.data) {
                    if (this.threadList.length === 0) {
                        i.unread_count = <any>0;
                    }
                    this.threadList.push(i);
                }

                this.isMoreThread = res['loadMore'];
                if (this.threadList.length > 0) {
                    this.thread_id = this.threadList[0]['id'];
                    if (localStorage.getItem('thread_id') === <any>0 || localStorage.getItem('thread_id') === undefined || localStorage.getItem('thread_id') === null || localStorage.getItem('thread_id') === '') {
                        this.getThreadMessages(this.threadList[0]['id']);
                    } else {
                        this.getThreadMessages(<any>localStorage.getItem('thread_id'));
                        localStorage.removeItem('thread_id');
                    }
                }
            }
            this.cS.scrollTop();
        }, err => {
            if (err.error) {
                console.log(err.error);
            }
        });
    }

    loadPrevious() {
        this.currentPage++;
        this.scrollToTop();
        this.getThreadListForChat();
    }

    loadPreviousMessage() {
        this.messagePageNumber++;
        this.loadPreviousData = true;
        this.getThreadMessages(this.thread_id);
    }
    /**
    *Get thread messages list for business list
    */
    getThreadMessages(threadId: number) {
        this.thread_id = threadId;
        const apiUrl = environment.RYEC_API_URL + 'getThreadMessages';
        const postJson = { page: this.messagePageNumber, thread_id: threadId }

        this.httpS.post(apiUrl, postJson).subscribe((res: ThreadMessageListRes) => {
            if (res.status == 1) {
                this.isMoreMessage = res['loadMore'];
                this.conversionList = <any>res.data;
                let ind = this.conversionList.messages.length - 1;
                for (let x in this.conversionList.messages) {
                    console.log(x);
                    let myFormattedDate = '';
                    const datePipe = new DatePipe('en-US');
                    myFormattedDate = <any>datePipe.transform(this.conversionList.messages[ind]['timestamp'], 'd MMMM yyyy');
                    let s: MessageListRes[] = [];
                    if (this.tempMsg[myFormattedDate] != undefined) {
                        if (this.loadPreviousData) {
                            this.tempMsg[myFormattedDate].unshift(this.conversionList.messages[ind]);
                        } else {
                            this.tempMsg[myFormattedDate].push(this.conversionList.messages[ind]);
                        }
                    } else {
                        s.push(this.conversionList.messages[ind]);
                        this.tempMsg[myFormattedDate] = s;
                    }
                    ind--;
                }

                for (let x in this.tempMsg) {
                    let temp = {
                        date: x,
                        data: this.tempMsg[x]
                    };
                    this.messageArr.push(temp);
                }

                setTimeout(() => {
                    this.ref.detectChanges();
                    if (this.loadPreviousData) {
                        this.myScrollContainer.directiveRef.scrollToTop(500);
                    } else {
                        this.myScrollContainer.directiveRef.scrollToBottom();
                    }
                }, 500);
            }
        }, err => {
            if (err.error) {
                console.log(err.error);
            }
        })
    }

    /**
    *Open chat window for selected thread id
    * @param threadId 
    */
    openChatWindow(threadId: number, index: number) {
        this.chatDrawer();
        this.tempMsg = {};
        this.currentPage = 1;
        this.messageArr = [];
        this.loadPreviousData = false;
        this.threadList[index]['unread_count'] = <any>0;
        this.getThreadMessages(threadId);
    }

    /**
    * Send Message 
    */
    sendMessage() {
        if (this.message_text != '') {
            const apiUrl = environment.RYEC_API_URL + 'sendEnquiryMessage';
            const postJson = { message: this.message_text, thread_id: this.thread_id }

            this.httpS.post(apiUrl, postJson).subscribe((res: any) => {
                if (res.status === 1) {
                    let myFormattedDate = '';
                    const datePipe = new DatePipe('en-US');
                    myFormattedDate = <any>datePipe.transform(new Date(), 'd MMMM yyyy');
                    this.tempMsg[myFormattedDate].push();

                    let s: MessageListRes[] = [];
                    if (this.tempMsg[myFormattedDate] != undefined) {
                        this.tempMsg[myFormattedDate].push({
                            id: 0,
                            message: this.message_text,
                            posted_by: this.loggedUserId,
                            timestamp: Date.now()
                        });

                    } else {
                        s.push({
                            id: 0,
                            message: this.message_text,
                            posted_by: this.loggedUserId,
                            timestamp: Date.now()
                        });
                        this.tempMsg[myFormattedDate] = s;
                    }
                    this.message_text = '';
                    setTimeout(() => {
                        this.myScrollContainer.directiveRef.scrollToBottom();
                    }, 500);
                }
            }, err => {
                if (err.error) {
                    console.log(err.error);
                }
            })
        }
    }
}
