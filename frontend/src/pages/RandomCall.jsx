import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FaMicrophone, FaSpinner, FaPhoneSlash, FaPhone } from "react-icons/fa";

const socket = io("http://localhost:5001");
const APP_ID = "665f7a8ddf874c68a762eeb828338b90";

const RandomCall = () => {
  const [status, setStatus] = useState("idle");
  const [partnerId, setPartnerId] = useState(null);
  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const remoteAudioTrackRef = useRef(null);

  const joinChannel = async (channelName, token, uid) => {
    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      await client.join(APP_ID, channelName, token, uid);

      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;
      await client.publish(localAudioTrack);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          remoteAudioTrackRef.current = user.audioTrack;
          user.audioTrack.play();
          setStatus("connected");
        }
      });

      client.on("user-left", () => {
        setStatus("partnerLeft");
        leaveChannel();
      });
    } catch (error) {
      console.error("Error joining channel:", error);
      setStatus("error");
    }
  };

  const leaveChannel = () => {
    if (clientRef.current) clientRef.current.leave();
    if (localAudioTrackRef.current) localAudioTrackRef.current.close();
    if (remoteAudioTrackRef.current) remoteAudioTrackRef.current.stop();

    clientRef.current = null;
    localAudioTrackRef.current = null;
    remoteAudioTrackRef.current = null;

    socket.emit("leaveCall");
  };

  const endCall = () => {
    leaveChannel();
    socket.emit("endCall", { partnerId });
    setStatus("idle");
    setPartnerId(null);
  };

  const startRandomCall = () => {
    setStatus("searching");
    socket.emit("randomCall");
  };

  useEffect(() => {
    socket.on("callMatched", ({ channelName, token, uid, partnerId }) => {
      setPartnerId(partnerId);
      joinChannel(channelName, token, uid);
    });

    socket.on("callEnded", ({ initiator }) => {
      setStatus(initiator ? "idle" : "partnerLeft");
      leaveChannel();
    });

    return () => {
      leaveChannel();
      socket.off("callMatched");
      socket.off("callEnded");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <h2 className="text-4xl font-extrabold mb-10 drop-shadow-xl text-center">
        🎙️ Random Voice Chat
      </h2>

      {status === "idle" && (
        <button
          onClick={startRandomCall}
          className="px-8 py-4 bg-green-500 text-xl font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all duration-200"
        >
          <FaPhone className="inline-block mr-2" /> Start Random Call
        </button>
      )}

      {status === "searching" && (
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-md w-full">
          <FaSpinner className="animate-spin text-3xl mb-4" />
          <p className="text-lg">Looking for someone to chat with...</p>
          <button
            onClick={leaveChannel}
            className="mt-6 px-6 py-2 bg-red-500 rounded-full font-semibold hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {status === "connected" && (
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-md w-full">
          <p className="mb-4 text-xl">You're now connected 🎧</p>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl shadow-lg mb-4">
            <FaMicrophone />
          </div>
          <button
            onClick={endCall}
            className="px-6 py-2 bg-red-500 rounded-full font-semibold hover:bg-red-600 transition"
          >
            <FaPhoneSlash className="inline-block mr-2" /> End Call
          </button>
        </div>
      )}

      {status === "partnerLeft" && (
        <div className="text-center bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-md w-full">
          <p className="mb-4 text-red-300 font-bold">Your partner has left the call 💔</p>
          <button
            onClick={() => {
              setStatus("idle");
              setPartnerId(null);
            }}
            className="px-6 py-2 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RandomCall;
