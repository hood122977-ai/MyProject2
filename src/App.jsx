import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SPECIES = [
  "바바리마카크 (Barbary macaque)",
  "긴꼬리원숭이 (Long-tailed macaque)",
  "금빛털원숭이 (Golden snub-nosed)",
  "침팬지 (Chimpanzee)",
  "고릴라 (Gorilla)",
];

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const guidance = useMemo(
    () => [
      "정면에 가까운 사진일수록 좋아요.",
      "배경이 단순하면 정확도가 올라가요.",
      "이미지는 5MB 이하 권장.",
    ],
    []
  );

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("이미지 파일만 업로드해주세요.");
      return;
    }
    setError("");
    setResult(null);
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handlePredict = async () => {
    if (!file) {
      setError("먼저 원숭이 사진을 업로드해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    // TODO: 실제 모델/백엔드 연동 시 이 부분을 API 호출로 교체하세요.
    await new Promise((resolve) => setTimeout(resolve, 900));
    const choice = SPECIES[Math.floor(Math.random() * SPECIES.length)];
    const confidence = (Math.random() * 0.25 + 0.7).toFixed(2);
    setResult({ label: choice, confidence });
    setLoading(false);
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Monkey Species Classifier</p>
        <h1>원숭이 종 판별 데모</h1>
        <p className="sub">
          사진을 업로드하면 예측 결과를 보여드려요. 모델이 준비되지 않았다면
          우선은 샘플(모의) 결과로 동작합니다.
        </p>
      </header>

      <main className="grid">
        <section className="card upload-card">
          <h2>1) 사진 올리기</h2>
          <label className="dropzone">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="preview" />
            ) : (
              <div className="placeholder">
                <span role="img" aria-label="camera">
                  📷
                </span>
                <p>클릭해서 원숭이 사진을 선택하세요</p>
                <small>JPG, PNG 권장</small>
              </div>
            )}
          </label>
          <button className="primary" onClick={handlePredict} disabled={loading}>
            {loading ? "판별 중..." : "종 판별하기"}
          </button>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="card result-card">
          <h2>2) 결과</h2>
          {result ? (
            <div className="result">
              <p className="tag">예측</p>
              <p className="label">{result.label}</p>
              <p className="confidence">신뢰도: {result.confidence}</p>
            </div>
          ) : (
            <p className="muted">아직 결과가 없어요. 사진을 올려주세요.</p>
          )}
          <div className="hint">
            <p>사용 가이드</p>
            <ul>
              {guidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footnote">
        <p>
          실제 추론 모델이 준비되면 API 엔드포인트를 연결해 정확한 판별을
          수행할 수 있습니다. 필요하시면 백엔드 연동도 도와드릴게요!
        </p>
      </footer>
    </div>
  );
}

export default App;
