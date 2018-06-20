class Highscore {

	protected _highScoreList:any;

	constructor() {

		this._highScoreList = this.getCookie('highscore')

		if (this._highScoreList === null) {
			this.setCookie('highscore', [1203,1234,1238], 300)
		}

		this._highScoreList = this.getCookie('highscore').split(',')
	}

	setCookie(name:string, value:Array<number>, days:number) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	}

	protected getCookie(name:string):any {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}
}