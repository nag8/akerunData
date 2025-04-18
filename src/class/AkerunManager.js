class AkerunManager{
  constructor(){
    this.clientId = PropertiesService.getScriptProperties().getProperty('clientId');
    this.clientSecret = PropertiesService.getScriptProperties().getProperty('clientSecret');
    this.organizationId = PropertiesService.getScriptProperties().getProperty('organizationId');
    this.token = {
      access: PropertiesService.getScriptProperties().getProperty('accessToken'),
      refresh: PropertiesService.getScriptProperties().getProperty('refreshToken'),
    };
  }

  getAkerunList(){
    // https://developers.akerun.com/#authentication

    const options = {
      headers : {
        'Authorization': `Bearer ${this.token.access}`,
      },
      method : 'get',
    };
  
    let res = UrlFetchApp.fetch(`https://api.akerun.com/v3/organizations/${this.organizationId}/akeruns`, options);
    res = JSON.parse(res);
    return res.akeruns.map(json => new Akerun(json));
  }


  getAccessListAllDay(day){
    // https://developers.akerun.com/#list-access
    const dayText = day.format('YYYY-MM-DD');

    const options = {
      method: 'get',
      headers : {
        'Authorization': `Bearer ${this.token.access}`,
      },
    };

    let accessList = [];
    let lastId = undefined;

    while(true){
      let url = `https://api.akerun.com/v3/organizations/${this.organizationId}/accesses`
        + `?limit=1000&datetime_after=${dayText}T00%3A00%3A00%2B09%3A00&datetime_before=${dayText}T23%3A59%3A59%2B09%3A00`
        + `&sort_by=id&sort_order=asc`
        + (!lastId ? '' : `&id_after=${lastId}`);
     
      let res = UrlFetchApp.fetch(url, options);
      res = JSON.parse(res);
      accessList = accessList.concat(res.accesses.map(json => new Access(json))).filter(a => a.isExistUserId());
      if(res.accesses.length < 1000){
        break;
      }
      lastId = res.accesses[res.accesses.length - 1].id;
    }
    return accessList;
  }

  getUserList(){
    // https://developers.akerun.com/#user
    const options = {
      headers : {
        'Authorization': `Bearer ${this.token.access}`,
      },
      method : 'get',
    };
  
    let res = UrlFetchApp.fetch(`https://api.akerun.com/v3/organizations/${this.organizationId}/users?limit=1000`, options);
    res = JSON.parse(res);
    return res.users.map(json => new User(json));
  }

  refreshToken(){
    // https://developers.akerun.com/#access-token

    const options = {
      'method' : 'post',
      'contentType' : 'application/json',
      'payload' : JSON.stringify({
        'grant_type': 'refresh_token',
        'client_id': this.clientId,
        'client_secret': this.clientSecret,
        'refresh_token': this.token.refresh,
      }),
    };
  
    let res = UrlFetchApp.fetch('https://api.akerun.com/oauth/token', options);
    res = JSON.parse(res);
    this.token.access = res.access_token;
    this.token.refresh = res.refresh_token;

    PropertiesService.getScriptProperties().setProperties({
      'accessToken': res.access_token,
      'refreshToken': res.refresh_token,
    });
  }
}