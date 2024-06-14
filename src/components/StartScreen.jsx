import React from "react"
import "../index.css"

export default function StartScreen({handleClick}) {
    return (
        <div className="start-screen-container">
            <h1>Quizzical</h1>
            <button className="start-quiz-btn" onClick={handleClick}>Start quiz</button>
        </div>
    )
}