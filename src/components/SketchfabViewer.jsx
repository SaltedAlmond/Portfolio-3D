import { useEffect, useRef } from "react";

export default function SketchfabViewer({ modelUid }) {
  const iframeRef = useRef();

  useEffect(() => {
    // You can use Sketchfab API here later if needed
  }, [modelUid]);

  if (!modelUid) return null; // Safety check

  return (
    <div className="absolute inset-0 z-30 flex justify-center items-center">
      <iframe
        ref={iframeRef}
        title="Sketchfab Model Viewer"
        src={`https://sketchfab.com/models/${modelUid}/embed?autostart=1&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0&ui_settings=1`}
        allow="autoplay; fullscreen; vr"
        allowFullScreen
        className="w-[2000px] h-[1000px] max-h-[90vh]"
      ></iframe>
    </div>
  );
}
