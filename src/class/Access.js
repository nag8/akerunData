class Access{
  constructor(json){
    this.accessed_at = dayjs.dayjs(json.accessed_at);
    this.akerunName = json.akerun.name;
    this.userId = json.user?.id;
  }

  isSameAkerunName(name){
    return this.akerunName === name;
  }

  isSameDay(day){
    return this.accessed_at.isSame(day, 'd');
  }

  getUserId(){
    return this.userId;
  }
}