"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/partner.actions";

enum CallStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  CONNECTING = "connecting",
  FINISHED = "finished",
}

const ConversationComponent = ({
  partnerId,
  userName,
  userImage,
  subject,
  topic,
  name,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) lottieRef.current?.play();
      else lottieRef.current?.stop();
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    // Initialize the VAPI SDK
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      addToSessionHistory(partnerId);
    };
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error("Error in conversation:", error);
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const toggleMic = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const assistant = {
      variableValues: {
        subject,
        topic,
        style,
      },
      clientMessages: ["transcript"],
      serverMessages: [],
    };
    // @ts-expect-error
    vapi.start(configureAssistant(voice, style), assistant);
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    // save the conversation to history
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transaition-opacity duration-1000",
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-100"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoPlay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>
          <button
            className="btn-mic"
            onClick={toggleMic}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={`/icons/${isMuted ? "mic-off" : "mic-on"}.svg`}
              alt={isMuted ? "Mic Off" : "Mic On"}
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on Microphone" : "Turn off Microphone"}
            </p>
          </button>
          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Start Session"}
          </button>
        </div>
      </section>
      <section className="transcipt">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace("/[.,]/g", "")}: {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName} : {message.content}
                </p>
              );
            }
          })}
        </div>
        <div className="transcript-fade"></div>
      </section>
    </section>
  );
};

export default ConversationComponent;
