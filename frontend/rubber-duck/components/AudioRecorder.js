import React, { useRef, useState } from 'react';
import { useButton } from '@react-aria/button';
import Button from './Button'

const API_ENDPOINT = "http://127.0.0.1:8000/api/critique";
function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const mediaRecorderRef = useRef(null);

  const buttonRef = useRef();
  const { buttonProps } = useButton(
    {
      onPress: () => {
        if (recording) {
          stopRecording();
        } else {
          startRecording();
        }
      },
    },
    buttonRef
  );

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, blobPropertyBag: { type: "audio/mp3" }});

      mediaRecorderRef.current = new MediaRecorder(stream);
      const handleDataAvailable = (event) => {
          const audioBlob = event.data;
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
      };
      mediaRecorderRef.current.removeEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }

  async function stopRecording() {
    if (mediaRecorderRef.current) {
      const handleStop = async () => {
        await pushToWhisper(audioUrl);
      };
      mediaRecorderRef.current.removeEventListener('stop', handleStop);
      mediaRecorderRef.current.addEventListener('stop', handleStop);
      setRecording(false);
      mediaRecorderRef.current.stop();
    }
  }

  async function pushToWhisper(audioBlob) {
    try {
      const response_og = await fetch(audioUrl);
      const audioBlob = await response_og.blob();
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      console.log(formData);

      if (response.ok) {
        console.log('Audio successfully sent to the API');
        setApiResponse(response.json());
      } else {
        console.error('Error sending audio to the API:', response.statusText);
      }
    } catch (err) {
          console.error('Error sending audio to the API:', err);
    }
  }

  return (
    <div class="flex flex-col items-center">
      <button
      class="bg-white text-black p-2.5 w-fit mt-9"
      {...buttonProps} ref={buttonRef}>
        <img src="http://pngimg.com/uploads/rubber_duck/rubber_duck_PNG41.png" alt="my image"/>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioUrl && !recording && (
        <audio controls>
          <source src={audioUrl} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}
      {apiResponse && (
        <div>
          {apiResponse.message ? (
              <p>Success: {apiResponse.message}</p>
            ) : (
              <p>Error: {apiResponse.error}</p>
            )
          }
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
