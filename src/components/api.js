//create room
export const createRoomAPI = async (author) => {
  const response = await fetch(`http://localhost:5001/rooms`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ author }),
  });

  const res = await response.json();
  return res;
};

//fetch room details
export const fetchRoomAPI = async (roomId) => {
  const response = await fetch(`http://localhost:5001/rooms/${roomId}`, {
    method: "GET",
  });
  const res = await response.json();
  return res;
};

//join room
export const joinRoomAPI = async (roomId, participant) => {
  const response = await fetch(`http://localhost:5001/rooms/${roomId}/join`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ participant }),
  });

  const res = response.json();
  return res;
};

// send mail for connection
export const sendMail = async (send) => {
  const response = await fetch("http://localhost:5001/api/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(send),
  });
  const res = response.json();
  return res;
};
