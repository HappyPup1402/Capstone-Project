import React, {useEffect, useState} from "react";

export default function QuizQuestion({ questionNumber, addQuestionToQuiz }) {
    const [questionType, setQuestionType] = useState("");
    const [question, setQuestion] = useState("");
    const [selections, setSelections] = useState([]);
    const [answerKey, setAnswerKey] = useState("");

    // Function to convert selections array to a comma-separated string
    const getCommaSeparatedSelections = () => {
        return selections.join(", ");
    };

    // Add an effect to save the question automatically
    useEffect(() => {
        // Create a question object and send it to the parent component
        const questionData = {
            questionNumber,
            question,
            questionType,
            selections: getCommaSeparatedSelections(), // Store as comma-separated string
            answerKey,
        };

        addQuestionToQuiz(questionData);
    }, [questionNumber, question, questionType, selections, answerKey]);

    const handleAddOption = () => {
        setSelections([...selections, ""]);
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = [...selections];
        updatedOptions.splice(index, 1);
        setSelections(updatedOptions);
    };

    const updateOptionText = (index, text) => {
        const updatedOptions = [...selections];
        updatedOptions[index] = text;
        setSelections(updatedOptions);
    };



    return (
        <div className="createNewQuizBoxRowNewQuestion">
            <div className="question-number">Question: {questionNumber}</div>
            <input
                type="text"
                className="newQuizQuestion"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <select
                name="questionType"
                className="newQuizQuestionType"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
            >
                <option value="" disabled selected>Question Type</option>
                <option value="multipleChoice">Multiple Choice</option>
            </select>
            {questionType === "multipleChoice" && (
                <>
                    {selections.map((option, index) => (
                        <div key={index} className="createNewQuizBoxRowNewOption">
                            <input
                                type="text"
                                className="newQuizQuestionOption"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) =>
                                    updateOptionText(index, e.target.value)
                                }
                            />
                            <button onClick={() => handleRemoveOption(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button className="newQuizAddOption" onClick={handleAddOption}>Add Option</button>
                    <select
                        name="answerKey"
                        className="newQuizCorrectOption"
                        value={answerKey}
                        onChange={(e) => setAnswerKey(e.target.value)}
                    >
                        <option value="" disabled selected>
                            Select Correct Option
                        </option>
                        {selections.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}
