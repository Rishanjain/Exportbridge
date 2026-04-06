import { useState, useRef, useEffect } from "react";

const STEPS = [
  {
    id: "business",
    key: "businessProfile",
    question: "🏢 Apna Business Profile batao\n(e.g., Small garment manufacturer from Surat, 5 saal ka experience, 50 employees)",
    placeholder: "Business ka description likho...",
  },
  {
    id: "product",
    key: "product",
    question: "📦 Kaunsa Product export karna chahte ho?\n(e.g., Cotton Sarees, Leather Bags, Spices, Software Services)",
    placeholder: "Product ka naam aur details likho...",
  },
  {
    id: "market",
    key: "market",
    question: "🌍 Kaunse Market / Country mein export karna chahte ho?\n(e.g., USA, Germany, UAE, Japan)",
    placeholder: "Target market/country likho...",
  },
];

const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "10px 0" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#00d4aa",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
      @keyframes fadeSlide {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scorePop {
        0% { transform: scale(0.5); opacity: 0; }
        60% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes barGrow {
        from { width: 0%; }
        to { width: var(--target-width); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.3); }
        50% { box-shadow: 0 0 0 10px rgba(0,212,170,0); }
      }
    `}</style>
  </div>
);

const ScoreCard = ({ score, breakdown }) => {
  const color = score >= 70 ? "#00d4aa" : score >= 45 ? "#f5a623" : "#e74c3c";
  const label = score >= 70 ? "High Potential ✅" : score >= 45 ? "Moderate Risk ⚠️" : "Challenging ❌";

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f2027, #1a3a4a)",
      border: `1px solid ${color}40`,
      borderRadius: 16,
      padding: 24,
      marginTop: 8,
      animation: "scorePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      boxShadow: `0 8px 32px ${color}20`,
    }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Export Success Probability
        </div>
        <div style={{
          fontSize: 64,
          fontWeight: 900,
          color,
          lineHeight: 1,
          fontFamily: "'Courier New', monospace",
        }}>
          {score}%
        </div>
        <div style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 600,
          color,
          background: `${color}15`,
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: 20,
        }}>
          {label}
        </div>
      </div>

      <div style={{ background: "#0008", borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{
          height: "100%",
          borderRadius: 8,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          "--target-width": `${score}%`,
          animation: "barGrow 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s both",
        }} />
      </div>

      {breakdown && (
        <div style={{ display: "grid", gap: 10 }}>
          {breakdown.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#ffffff08",
              padding: "10px 14px",
              borderRadius: 10,
              borderLeft: `3px solid ${item.score >= 70 ? "#00d4aa" : item.score >= 45 ? "#f5a623" : "#e74c3c"}`,
            }}>
              <span style={{ color: "#ccc", fontSize: 13 }}>{item.factor}</span>
              <span style={{
                fontWeight: 700,
                fontSize: 13,
                color: item.score >= 70 ? "#00d4aa" : item.score >= 45 ? "#f5a623" : "#e74c3c",
                fontFamily: "monospace",
              }}>
                {item.score}/100
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ExportChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! 🙏 Main hoon **ExportAI** — tumhara Export Success Advisor.\n\nMain tumhare business ke liye export success probability calculate karunga.\n\nShuru karte hain! 👇",
    },
    { role: "bot", text: STEPS[0].question, isQuestion: true, stepIndex: 0 },
  ]);
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text, extra = {}) => {
    setMessages((prev) => [...prev, { role: "bot", text, ...extra }]);
  };


  const callClaudeAPI = async (data) => {
  const prompt = `You are an expert international trade consultant.
Business Profile: ${data.businessProfile}
Product: ${data.product}
Target Market: ${data.market}

Respond ONLY with valid JSON (no markdown):
{
  "score": <0-100>,
  "summary": "<2-3 line Hindi-English summary>",
  "breakdown": [
    {"factor": "Market Demand", "score": <0-100>, "note": "<short note>"},
    {"factor": "Product Competitiveness", "score": <0-100>, "note": "<short note>"},
    {"factor": "Business Readiness", "score": <0-100>, "note": "<short note>"},
    {"factor": "Regulatory Ease", "score": <0-100>, "note": "<short note>"},
    {"factor": "Profit Potential", "score": <0-100>, "note": "<short note>"}
  ],
  "topOpportunity": "<1 line>",
  "topRisk": "<1 line>",
  "nextStep": "<1 line>"
}`;

  const API_KEY = "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"; 
  // const API_KEY = process.env.REACT_APP_GROQ_KEY; 

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
  });

  const result = await response.json();
  const raw = result.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

  const handleSend = async () => {
    if (!input.trim() || isTyping || done) return;

    const userText = input.trim();
    setInput("");

    // Adding user message
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    const updatedData = { ...formData, [STEPS[stepIndex].key]: userText };
    setFormData(updatedData);

    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800));

    if (stepIndex < STEPS.length - 1) {
      const next = stepIndex + 1;
      setStepIndex(next);
      addBotMessage(STEPS[next].question, { isQuestion: true, stepIndex: next });
      setIsTyping(false);
    } else {
      // All inputs collected — calling API
      addBotMessage("✨ Sab information mil gayi! Ab main analysis kar raha hoon...\n\n🔍 Global trade data check kar raha hoon\n📊 Market conditions evaluate kar raha hoon\n🧮 Success score calculate kar raha hoon...");
      setIsTyping(false);

      await new Promise((r) => setTimeout(r, 1500));
      setIsTyping(true);

      try {
        const result = await callClaudeAPI(updatedData);
        setScoreData(result);
        setIsTyping(false);

        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "📊 **Analysis Complete!** Yeh raha tumhara Export Success Report:", isResult: true },
          { role: "bot", isScoreCard: true, scoreData: result },
          {
            role: "bot",
            text: `💡 **Summary:** ${result.summary}\n\n🚀 **Top Opportunity:** ${result.topOpportunity}\n\n⚠️ **Main Risk:** ${result.topRisk}\n\n✅ **Agle Kadam:** ${result.nextStep}`,
          },
          {
            role: "bot",
            text: "Koi aur product ya market ke liye analysis chahiye? Page refresh karo aur dobara try karo! 🔄",
          },
        ]);
        setDone(true);
      } catch (err) {
        setIsTyping(false);
        addBotMessage("⚠️ Kuch technical issue aa gaya. Thodi der baad try karo.");
      }
    }
  };

  const formatText = (text) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} style={{ color: "#00d4aa" }}>{part.slice(2, -2)}</strong>
        : part.split("\n").map((line, j) => (
          <span key={j}>{line}{j < part.split("\n").length - 1 && <br />}</span>
        ))
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #050e1a 0%, #0b1d2e 50%, #071520 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Georgia', serif",
      color: "#e8e8e8",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        maxWidth: 680,
        padding: "20px 16px 0",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          background: "linear-gradient(135deg, #0f2a3a, #1a3d52)",
          borderRadius: 16,
          border: "1px solid #00d4aa30",
          marginBottom: 16,
          boxShadow: "0 4px 24px #00d4aa10",
          animation: "pulse 3s infinite",
        }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00d4aa, #0099cc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}>🚢</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: 0.5 }}>ExportAI — Success Advisor</div>
            <div style={{ fontSize: 12, color: "#00d4aa", letterSpacing: 1 }}>● ONLINE • AI-Powered Analysis</div>
          </div>
          <div style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#aaa",
            textAlign: "right",
            lineHeight: 1.6,
          }}>
            Step {Math.min(stepIndex + 1, 3)}/3
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        width: "100%",
        maxWidth: 680,
        flex: 1,
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflowY: "auto",
        paddingBottom: 120,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeSlide 0.35s ease forwards",
          }}>
            {msg.isScoreCard ? (
              <div style={{ width: "100%" }}>
                <ScoreCard score={msg.scoreData.score} breakdown={msg.scoreData.breakdown} />
              </div>
            ) : (
              <div style={{
                maxWidth: msg.role === "user" ? "75%" : "88%",
                padding: msg.role === "user" ? "11px 16px" : "13px 18px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #005f8a, #00d4aa)"
                  : msg.isQuestion
                    ? "linear-gradient(135deg, #162535, #1e3448)"
                    : msg.isResult
                      ? "linear-gradient(135deg, #1a2f1f, #1e3d26)"
                      : "#111e2e",
                border: msg.isQuestion ? "1px solid #00d4aa40"
                  : msg.isResult ? "1px solid #00d4aa60"
                    : "1px solid #ffffff08",
                fontSize: 14,
                lineHeight: 1.7,
                color: "#e5e5e5",
                boxShadow: msg.role === "user" ? "0 2px 12px #00d4aa20" : "none",
              }}>
                {formatText(msg.text)}
                {msg.isQuestion && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: "#00d4aa90",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    ✏️ Neeche type karo
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", animation: "fadeSlide 0.3s ease forwards" }}>
            <div style={{
              padding: "10px 18px",
              background: "#111e2e",
              border: "1px solid #ffffff08",
              borderRadius: "4px 18px 18px 18px",
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      {!done && (
        <div style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          maxWidth: 680,
          padding: "12px 16px 20px",
          background: "linear-gradient(to top, #050e1a 70%, transparent)",
        }}>
          <div style={{
            display: "flex",
            gap: 10,
            background: "#0f1f30",
            borderRadius: 16,
            border: "1px solid #00d4aa30",
            padding: "8px 8px 8px 16px",
            boxShadow: "0 -4px 24px #00000060",
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder={stepIndex < STEPS.length ? STEPS[stepIndex].placeholder : ""}
              rows={2}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e5e5e5",
                fontSize: 14,
                resize: "none",
                fontFamily: "'Georgia', serif",
                lineHeight: 1.6,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: input.trim() && !isTyping
                  ? "linear-gradient(135deg, #00d4aa, #0099cc)"
                  : "#1e3448",
                border: "none",
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
                alignSelf: "flex-end",
              }}
            >
              ➤
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: "#ffffff30", marginTop: 8 }}>
            Enter dbaao ya button click karo • Powered by Claude AI
          </div>
        </div>
      )}
    </div>
  );
}
