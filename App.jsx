import { useState } from 'react';
import './App.css';

const questions = [
  {
    id: 1,
    text: 'On a first date, I’d prefer:',
    options: [
      { text: 'Deep conversation over dinner', trait: 'grounded' },
      { text: 'Shared activity like a walk or museum', trait: 'curious' },
      { text: 'Something spontaneous and fun', trait: 'bold' },
      { text: 'Low-key coffee, no pressure', trait: 'loyal' }
    ]
  },
];

const archetypeMap = {
  grounded: 'The Grounded Companion',
  curious: 'The Curious Explorer',
  bold: 'The Bold Connector',
  loyal: 'The Loyal Architect'
};

export default function App() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (qid, trait) => {
    setAnswers(prev => ({ ...prev, [qid]: trait }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions.');
      return;
    }

    setLoading(true);
    const res = await fetch('https://your-backend.up.railway.app/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-xl p-4">
      <h1 className="text-2xl font-bold mb-4">Find Your Dating Archetype</h1>
      {!result ? (
        <div>
          {questions.map(q => (
            <div key={q.id} className="mb-6">
              <p className="font-semibold mb-2">{q.text}</p>
              {q.options.map(opt => (
                <label key={opt.text} className="block">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    onChange={() => handleSelect(q.id, opt.trait)}
                    checked={answers[q.id] === opt.trait}
                  />{' '}
                  {opt.text}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'See My Result'}
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">You are: {archetypeMap[result.archetype]}</h2>
          <p className="mt-2">{result.description}</p>
        </div>
      )}
    </div>
  );
}