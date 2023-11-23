export type RuntimeEnvironment = 
	"node" 
| 	"web"
;

export class LocalProcess {
	imageName: string;
	memUsage: number;
	pid: number;
	sessionName: string;
	sessionNumber: number;
}

export type NetStatState =
	"CLOSED"	 		//Indicates that the server has received an ACK signal (to acknowledge receipt of a packet) from the client and the connection is closed.
|	"CLOSE_WAIT"	 	//Indicates that the server has received the first FIN signal (to acknowledge there is no more data to be sent) from the client and the connection is in the process of closing.
|	"ESTABLISHED"	 	//Indicates that the server received the SYN signal (synchronize, this signal is only sent in the first packet) from the client and the session is established.
|	"FIN_WAIT_1"	 	//Indicates that the connection is still active but not currently being used.
|	"FIN_WAIT_2"	 	//Indicates that the client just received acknowledgement of the first FIN signal from the server.
|	"LAST_ACK"	 		//Indicates that the server is in the process of sending it's own FIN signal.
|	"LISTENING"	 		//Indicates that the server is ready to accept a connection.
|	"SYN_RECEIVED"	 	//Indicates that the server just received a SYN signal from the client.
|	"SYN_SEND"	 		//Indicates that this connection is open and active.
|	"TIME_WAIT"	 		//Indicates that the client recognises the connection as active, but not currently being used.
;

export class LocalInstance {
	protocol: "TCP" | "UDP";
	local: {
		port: number,
		address: string
	};
	remote: {
		port: number,
		address: string
	};
	state: NetStatState;
	pid: number;
}