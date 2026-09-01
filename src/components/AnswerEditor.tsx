"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Mic, MicOff, Paperclip, X, Loader2, ImageIcon, Sparkles } from "lucide-react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
  attachments: string[];
  onAttachmentsChange: (urls: string[]) => void;
  uploadPathPrefix: string;
  placeholder?: string;
  height?: number;
}

// SpeechRecognition isn't in the standard TS lib — browsers expose it as a global.
type SpeechRecognitionInstance = any;

export default function AnswerEditor({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  uploadPathPrefix,
  placeholder,
  height = 260,
}: AnswerEditorProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseTextRef = useRef("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    baseTextRef.current = value ? value + " " : "";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      if (finalTranscript) {
        baseTextRef.current = baseTextRef.current + finalTranscript;
      }
      onChange((baseTextRef.current + interimTranscript).trimStart());
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, value, onChange]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          setUploadError("Only image files (diagrams, scans, screenshots) can be attached.");
          continue;
        }
        const path = `${uploadPathPrefix}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploaded.push(url);
      }
      if (uploaded.length) onAttachmentsChange([...attachments, ...uploaded]);
    } catch (err) {
      console.error("Attachment upload failed:", err);
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (url: string) => {
    onAttachmentsChange(attachments.filter((a) => a !== url));
  };

  return (
    <div className="space-y-3" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={height}
        preview="edit"
        textareaProps={{ placeholder }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!speechSupported}
          title={speechSupported ? "Speak your answer" : "Speech recognition isn't supported in this browser"}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            isListening
              ? "bg-red-50 border-red-300 text-red-700 animate-pulse"
              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          {isListening ? "Stop dictation" : "Dictate answer"}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
          {uploading ? "Uploading..." : "Attach diagram / image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!speechSupported && (
          <span className="text-[11px] text-zinc-400">Voice input works in Chrome/Edge; type your answer here instead.</span>
        )}
      </div>

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

      {attachments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {attachments.map((url) => (
            <div key={url} className="relative group rounded-md overflow-hidden border border-zinc-200 bg-zinc-50">
              <img src={url} alt="Attached diagram" className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => removeAttachment(url)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isListening && (
        <p className="text-[11px] text-red-600 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Listening... speak clearly, punctuation is not automatic.
        </p>
      )}
      {attachments.length > 0 && (
        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" /> {attachments.length} image{attachments.length === 1 ? "" : "s"} attached
        </p>
      )}
    </div>
  );
}
