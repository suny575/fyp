import React, { useState, useRef } from "react";

const FaultReportForm = () => {
  const [formData, setFormData] = useState({
    equipment: "",
    priority: "medium",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 📸 Handle Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // 🎙 Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // 🛑 Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      images,
      voiceNote: audioURL,
    };

    console.log("Submitting:", payload);
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Submit Equipment Fault</h3>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Equipment */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Equipment</label>
              <select
                name="equipment"
                className="form-select"
                value={formData.equipment}
                onChange={handleChange}
                required
              >
                <option value="">Choose equipment</option>
                <option value="ECG Machine">ECG Machine</option>
                <option value="X-Ray Unit">X-Ray Unit</option>
              </select>
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Priority Level</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Fault Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                placeholder="Describe the issue clearly..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* 📸 Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Attach Images (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImageChange}
              />
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            )}

            {/* 🎙 Voice Recording */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Voice Note (Optional)
              </label>

              <div className="d-flex align-items-center gap-3">
                {!recording ? (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={startRecording}
                  >
                    🎙 Start Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={stopRecording}
                  >
                    ⏹ Stop Recording
                  </button>
                )}

                {audioURL && <audio controls src={audioURL}></audio>}
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary px-4">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FaultReportForm;
