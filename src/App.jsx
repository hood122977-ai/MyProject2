import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [species, setSpecies] = useState("");
  const [memo, setMemo] = useState("");
  const [observedAt, setObservedAt] = useState("");
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    if (!file || !species || !observedAt) {
      setError("사진, 종 이름, 관찰 날짜는 필수입니다.");
      return;
    }

    // 파일을 base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      const newRecord = {
        id: Date.now(),
        name: species,
        species,
        memo,
        observedAt,
        imageUrl: reader.result, // base64 이미지 저장
      };

      setRecords((prev) => [newRecord, ...prev]);

      // 초기화
      setFile(null);
      setPreviewUrl("");
      setSpecies("");
      setMemo("");
      setObservedAt("");
      setError("");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>🐒 원숭이 관찰 기록</h1>
        <p className="sub">관찰한 원숭이를 자유롭게 기록하세요</p>
      </header>

      <main className="grid">
        <section className="card upload-card">
          <h2>관찰 기록 작성</h2>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {previewUrl && (
            <img src={previewUrl} alt="preview" className="preview" />
          )}

          <input
            type="text"
            placeholder="원숭이 종 이름 (직접 입력)"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />

          <input
            type="date"
            value={observedAt}
            onChange={(e) => setObservedAt(e.target.value)}
          />

          <textarea
            placeholder="관찰 메모 (선택)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <button className="primary" onClick={handleSave}>
            기록 저장
          </button>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="card">
          <h2>관찰 기록 목록</h2>
          {records.length === 0 && <p>아직 기록이 없습니다.</p>}
          {records.map((record) => (
            <button
              key={record.id}
              onClick={() => setSelected(record)}
              className="record-button"
            >
              {record.name}
            </button>
          ))}
        </section>

        {selected && (
          <section className="card result-card">
            <h2>상세 정보</h2>
            <div className="result">
              <img src={selected.imageUrl} alt="" className="preview" />
              <p className="label">{selected.species}</p>
              <p className="confidence">관찰 날짜: {selected.observedAt}</p>
              {selected.memo && (
                <p className="confidence">메모: {selected.memo}</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
