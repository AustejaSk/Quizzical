import React from "react"
import "../index.css"

export default function QuestionsScreen({ question, id, correctAnswer, answers, checkAnswers }) {

    const styles = {
        correctAnswerStyle: {backgroundColor: "#94D7A2", border: "1px solid #94D7A2"},
        inCorrectAnswerStyle: {backgroundColor: "#F7D9DB", border: "1px solid #F7D9DB", color: "#8F94AF"},
        otherStyle: {border: "1px solid #A1A9CC", color: "#8F94AF"}
    }

    const selectedAnswer = document.querySelector(`input[name="${id}"]:checked`)

    const getCorrectStyles = (answerIndex) => {
        if (checkAnswers) {
            if (answers[answerIndex] === correctAnswer) {
                return styles.correctAnswerStyle
            } else if (selectedAnswer && selectedAnswer.value === answers[answerIndex]) {
                return styles.inCorrectAnswerStyle
            } else {
                return styles.otherStyle
            }
        }
    }

    return (
        <div>
            <h1 className="question-title">{question}</h1>
            <form>
                {answers.map((answer, index) => {
                    return (
                        <div key={`${index}-${id}`}>
                            <input
                                type="radio"
                                name={id}
                                id={`${index}-answer-${id}`}
                                value={answer}
                            />
                            <label
                                htmlFor={`${index}-answer-${id}`}
                                style={getCorrectStyles(index)}
                            >{answer}</label>
                        </div>
                    )
                })}
            </form>
            <hr />
        </div>
    )
}