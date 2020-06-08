import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  contentToDoLists: any = contentToDoLists;
  constructor() { }

  ngOnInit() {
  }

}

const contentToDoLists = [
  { id: 0, title: 'Ngày mai sẽ khác', content: 'Sẽ khác vào ngày mai' },
  { id: 1, title: 'Ngày mai bắt đầu từ hôm nay', content: 'Phải có hôm nay rồi mới có ngày mai' },
  { id: 2, title: 'Ngày hôm qua bắt đầu từ hôm nay', content: 'Sẽ là ngày hôm nay nếu qua hết đi ngày hôm qua' },
  { id: 3, title: 'Dòng thời gian trước đây', content: 'Trước đây hay gì đi chăng nữa thì vẫn là dòng thời gian' },
  { id: 4, title: 'Ngày hôm nay là món quà', content: 'Món quà là ngày hôm nay' }
];
