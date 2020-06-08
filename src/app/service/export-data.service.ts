import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExportDataService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    console.log(json);
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  initTitle(){
    return [
      'Tên người được bảo hiểm',
      'Ngày tháng năm sinh',
      'CMND',
      'Số hợp đồng',
      'Công ty bảo hiểm',
      'Mã Định Danh',
      'Ngày xảy ra sự kiện',
      'Ngày kết thúc sự kiện',
      'Chi phí phát sinh',
      'Chi phí bảo lãnh',
      'Loại hình bảo lãnh',
      'Chẩn đoán',
      'Case number',
      'Cơ sở y tế',
      'Thời gian bổ sung cuối cùng',
      'Thời gian xác nhận bảo lãnh',
      'Trạng Thái Bảo Lãnh',
      'Lý do từ chối',
      'Tên nhân viên xác nhận'
    ]
  }
}