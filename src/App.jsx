import { useState } from 'react'

export default function Game() {
  const [startGame, setStartGame] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [nCorrect, setNCorrect] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    setGameFinished(false)
    try {
      await fetchData()
      setStartGame(true)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFinish = () => {
    setStartGame(false)
    setGameFinished(true)

    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        setNCorrect((n) => n + 1)
      }
    }
    setAnswers([])
  }

  const fetchData = async () => {
    const response = await fetch('https://the-trivia-api.com/api/questions')
    const json = await response.json()
    setQuestions(json)
    setLoading(false)
  }

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center text-xl'>
        Loading...
      </div>
    )

  return (
    <main className='min-h-screen flex items-center justify-center bg-slate-100'>
      <div>
        {gameFinished && (
          <div className='bg-white border p-3 text-xl mb-10'>
            You got <strong>{nCorrect}</strong> out of{' '}
            <strong>{questions.length}</strong> questions correct!
          </div>
        )}
        {startGame ? (
          <Quiz
            questions={questions}
            onFinish={handleFinish}
            setAnswers={setAnswers}
          />
        ) : (
          <div className='text-center'>
            <p className='mb-5 text-xl text-slate-900'>
              10 question quiz. Give it your best shot!
            </p>
            <button
              className='bg-blue-700 text-slate-50 rounded px-3 py-2 text-xl hover:bg-blue-600'
              onClick={handleStart}
            >
              Start Quiz
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Quiz({ questions, onFinish, setAnswers }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const answer = e.target.elements.option.value
    setAnswers((answers) => [...answers, answer])

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((i) => i + 1)
    } else {
      setCurrentQuestion(0)
      onFinish()
    }
  }

  const { question, correctAnswer, incorrectAnswers } =
    questions[currentQuestion]

  const options = shuffleArray([correctAnswer, ...incorrectAnswers])

  return (
    <div>
      <div className='text-center text-xl mb-10'>
        {currentQuestion + 1} / {questions.length}
      </div>
      <div className='bg-white border p-10 rounded-lg max-w-xl'>
        <h2 className='font-bold text-xl'>
          {currentQuestion + 1}. {question}
        </h2>
        <form onSubmit={handleSubmit}>
          <ul className='space-y-3 m-10'>
            {options.map((option, i) => {
              return (
                <li className='text-lg' key={i}>
                  <input id={i} name='option' type='radio' value={option} />
                  <label className='ml-3' htmlFor={i}>
                    {option}
                  </label>
                </li>
              )
            })}
          </ul>
          <div className='text-center'>
            <button
              className='bg-blue-700 text-slate-50 rounded px-4 py-2 text-xl hover:bg-blue-600'
              type='submit'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
