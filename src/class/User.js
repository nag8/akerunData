class User{
  constructor(json){
    this.id = json.id;
    this.name = json.name;
    this.mail = json.mail;
    this.accessList = [];
  }

  isSameId(id){
    return this.id === id;
  }

  isSameEmail(email){
    return this.mail === email;
  }

  isExistMail(){
    return typeof this.mail === 'string' && this.mail.length > 0;
  }

  findSetAccessLog(accessList){
    this.accessList = accessList.filter(access => this.isSameId(access.getUserId()));
  }

  isOffice(day){
    return this.accessList.some(access => access.isSameDay(day));
  }

  getEmail(){
    return this.mail;
  }

  getOutList(){
    return [
      this.mail,
      this.name
    ];
  }
}