function refreshDataSheet(){
  const akerunManager = new AkerunManager();
  const today = dayjs.dayjs().locale('ja');

  const accessList = akerunManager.getAccessList(1000).filter(a => a.isSameDay(today));
  const akerunUserList = akerunManager.getUserList().filter(akerunUser => {
    akerunUser.findSetAccessLog(accessList);
    return akerunUser.isExistMail() && akerunUser.isOffice(today);
  });

  let sheetEmailList = getMemberEmailList();

  const addUserList = akerunUserList.filter(user => !sheetEmailList.some(se => user.isSameEmail(se)));
  if(addUserList.length){

    const transpose = matrix => matrix[0].map((_, i) => matrix.map(row => row[i]));
    
    BaseLibrary.setList(
      SHEET.data,
      SHEET.data.row.email,
      sheetEmailList.length + 1,
      transpose(addUserList.map(user => user.getOutList()))
    );

    sheetEmailList = getMemberEmailList();
  }
  [...new Array(SHEET.data.column.data - 1)].forEach(_ => sheetEmailList.shift());

  BaseLibrary.setList(
    SHEET.data,
    getdayList().findIndex(d => d.isSame(today, 'day')) + SHEET.data.row.data,
    SHEET.data.column.data,
    [sheetEmailList.map(email => akerunUserList.some(user => user.isSameEmail(email)) ? '出' : '')]
  );  
}


function tokenRefresh(){
  const akerunManager = new AkerunManager();
  akerunManager.refreshToken();
}
sheet.js
const SHEET = {
  data: {
    name: 'data',
    row: {
      email: 1,
      data: 3,
    },
    column: {
      day: 1,
      data: 4,
    },
  },
};


function getEmailListFromDataSheet(){
  return Shomin.getSheetData(SHEET.data).map(row => row[SHEET.data.column.email - 1]);
}

function getdayList(){
  return Shomin.getSheetData(SHEET.data).map(row => dayjs.dayjs(row[SHEET.data.column.day - 1]));
}

function getMemberEmailList(){
  return Shomin.getSheetDataFull(SHEET.data)[SHEET.data.row.email - 1];
}
