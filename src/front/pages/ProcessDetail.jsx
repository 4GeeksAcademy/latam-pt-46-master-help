import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProcessDetail = () => {
  const { id } = useParams();
  const [process, setProcess] = useState(null);
  const [steps, setSteps] = useState([]);

  const fetchProcessDetail = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/process/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setProcess(data.process);
    setSteps(data.steps);
  };

  useEffect(() => {
    fetchProcessDetail();
  }, []);

  return (
    <div className="container">
      <h2>Proceso: {process?.name}</h2>
      <h4>Categoría: {process?.category}</h4>

      <div>
        {steps.map((step, idx) => (
          <div key={idx} style={{ marginBottom: "20px" }}>
            <h5>
              Paso {idx + 1}: {step.label}
            </h5>

            {step.type === "TEXT" && <p>{step.content}</p>}

            {step.type === "VIDEO_URL" && (
              <iframe
                src={step.content}
                width="560"
                height="315"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`video-${idx}`}
              ></iframe>
            )}

            {step.type === "IMAGE" && (
              <img src={step.content} alt="Paso imagen" width="300" />
            )}

            {step.type === "PDF" && (
              <a href={step.content} target="_blank" rel="noreferrer">
                Ver PDF
              </a>
            )}

            {step.type === "VIDEO" && (
              <video width="320" controls>
                <source src={step.content} type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessDetail;
