import React, { useState, useEffect } from "react"
import "../index.css"
import { nanoid } from "nanoid"
import { decode } from "html-entities"
import StartScreen from "././StartScreen"
import QuestionScreen from "./QuestionScreen"

export default function App() {
    
    const [questions, setQuestions] = useState([])
    const [gameStarted, setGameStarted] = useState(false)
    const [checkAnswers, setCheckAnswers] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)
    const [loading, setLoading] = useState("")
    const [error, setError] = useState(null)

    const fetchData = () => {
        if (gameStarted) {
            setLoading(true)
            setError(null)
            fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
                .then(res => res.ok ? res.json() : Promise.reject(new Error(`HTTP error! status: ${res.status}`)))
                .then(data => {
                    if (data.results.length === 0) {
                        setError("We are out of questions, please try again later.")    
                    } else {
                        const newQuestionsArray = (
                            data.results.map(question => {
                                const id = nanoid()
                                const answersArray = question.incorrect_answers.map(answer => decode(answer))
                                const randomIndex = Math.floor(Math.random() * (answersArray.length + 1))
                                const correctAnswer = decode(question.correct_answer)
                                answersArray.splice(randomIndex, 0, correctAnswer)
                                return {
                                    ...question,
                                    id: id,
                                    key: id,
                                    question: decode(question.question),
                                    correctAnswer: correctAnswer,
                                    answers: answersArray
                                }
                            })
                        )
                        setQuestions(newQuestionsArray)
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    console.error(err)
                    setError("Failed to fetch questions. Please check your connection and try again.")
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        fetchData()
    }, [gameStarted])

    const startNewGame = () => {
        setGameStarted(true)
        setCorrectCount(0)
        setCheckAnswers(false)
        fetchData()
    }

    const handleCheckAnswers = () => {
        let totalAnswersCount = 0
        let correctAnswersCount = 0
        questions.forEach(question => {
            const selectedAnswer = document.querySelector(`input[name="${question.id}"]:checked`)
            if (selectedAnswer) {
                totalAnswersCount++
                if (selectedAnswer.value === question.correctAnswer) {
                    correctAnswersCount++
                }
            }
        })
        setCorrectCount(correctAnswersCount)

        if (totalAnswersCount === questions.length) {
            setCheckAnswers(true)
        }
    }

    const getQuestionScreenEl = (
        questions.map(question => {
            return (
                <QuestionScreen
                    key={question.key}
                    id={question.id}
                    question={question.question}
                    correctAnswer={question.correctAnswer}
                    answers={question.answers}
                    checkAnswers={checkAnswers}
                />
            )
        })
    )

    const messageEl = (
        <div className="message-container"><h1>{error ? error : "Loading questions..."}</h1></div>
    )

    return (
        <main>
            {error || loading ?  messageEl :
            gameStarted ? 
            <div className="questions-screen-container">
                <div className="questions-container">
                    {getQuestionScreenEl}
                </div>
                {checkAnswers ? 
                    <div className="bottom-container">
                        <h2 className="score-text">You scored {correctCount}/{questions.length} correct answers</h2>
                        <button className="questions-btn" onClick={startNewGame}>Play again</button>
                    </div>
                    : <button className="questions-btn" id="checkBtn" onClick={handleCheckAnswers}>Check answers</button>}
            </div>
            : <StartScreen handleClick={startNewGame}/>}
        </main>
    )
}