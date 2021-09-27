/**
 * 이 파일은 미니톡 화면비우기 플러그인의 일부입니다. (https://www.minitalk.io)
 *
 * 채팅방을 비웁니다.
 * 
 * @file /plugins/clear/script.js
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @version 1.2.0
 * @modified 2021. 9. 27.
 */
if (Minitalk === undefined) return;

/**
 * 화면을 비우는 함수를 정의한다.
 */
me.clear = function(minitalk,from) {
	var $frame = $("div[data-role=frame]");
	var $main = $("main",$frame);
	var $chat = $("section[data-role=chat]",$main);
	if ($chat.length == 0) return;
	
	$chat.empty();
	if (from !== undefined) {
		minitalk.ui.printSystemMessage("info",from.nickname + "님이 화면을 비웠습니다.");
	} else {
		minitalk.ui.printSystemMessage("info","화면을 비웠습니다.");
	}
	
	// 새로고침했을때 이전대화를 가져오지 않도록 저장된 로그데이터를 비운다.
	var logs = Minitalk.session("logs") ? Minitalk.session("logs") : {};
	logs.ids = {};
	logs.messages = [];
	logs.latest = moment().valueOf();
	
	minitalk.session("logs",logs);
};

Minitalk.on("init",function(minitalk) {
	/**
	 * 툴바에 버튼을 추가한다.
	 */
	minitalk.ui.appendTool({
		tool:"clear",
		text:"화면비우기",
		iconClass:"mi mi-trash",
		handler:function(minitalk) {
			/**
			 * 채널관리자인 경우 전체접속자의 화면을 비울지 확인한다.
			 */
			if (minitalk.user.me.level == 9) {
				minitalk.ui.showAlert("안내","나의 채팅화면 비우기와 함께 전체 접속자의 채팅화면도 함께 비우시겠습니까?",[{
					text:"나만 비우기",
					class:"cancel",
					handler:function() {
						minitalk.ui.closeAlert();
						
						// 화면을 비운다.
						me.clear(minitalk);
					}
				},{
					text:"전체유저 비우기",
					handler:function() {
						// 서버에 프로토콜을 전송한다.
						minitalk.socket.sendProtocol("clear");
						minitalk.ui.closeAlert();
						
						// 화면을 비운다.
						me.clear(minitalk);
					}
				}]);
				
				return;
			}
			
			// 화면을 비운다.
			me.clear(minitalk);
		}
	});
	
	/**
	 * 프로토콜을 정의한다.
	 */
	minitalk.socket.setProtocol("clear",function(minitalk,data,to,from) {
		// 프로토콜을 전송한 유저가 관리자인지 확인한다.
		if (from.level !== 9) return;
		
		// 화면을 비운다.
		me.clear(minitalk,from);
	});
});