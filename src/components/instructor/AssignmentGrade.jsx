import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();

  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(
        `${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const updateScore = (index, value) => {
    const updatedGrades = [...grades];

    updatedGrades[index] = {
      ...updatedGrades[index],
      score: value === '' ? null : Number(value),
    };

    setGrades(updatedGrades);
  };

  const saveGrades = async () => {
    setMessage('');

    const invalidScore = grades.some(
      grade =>
        grade.score !== null &&
        (grade.score < 0 || grade.score > 100)
    );

    if (invalidScore) {
      setMessage('Score must be between 0 and 100');
      return;
    }

    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(grades),
      });

      if (response.ok) {
        editClose();
      } else {
        const data = await response.json();
        setMessage(data);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const headers = [
    'gradeId',
    'student name',
    'student email',
    'score'
  ];

  return (
    <>
      <button id="gradeButton" onClick={editOpen}>
        Grade
      </button>

      <dialog ref={dialogRef}>
        <h2>{assignment.title}</h2>

        {message && <Messages msg={message} />}

        <table>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {grades.map((grade, index) => (
              <tr key={grade.gradeId}>
                <td>{grade.gradeId}</td>
                <td>{grade.studentName}</td>
                <td>{grade.studentEmail}</td>
                <td>
                  <input
                    id={`score-${grade.studentEmail}`}
                    type="number"
                    min="0"
                    max="100"
                    value={grade.score ?? ''}
                    onChange={event =>
                      updateScore(index, event.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {grades.length === 0 && !message && (
          <p>No students are enrolled in this section.</p>
        )}

        <button id="saveGradesButton" onClick={saveGrades}>
          Save
        </button>

        <button id="closeGradesButton" onClick={editClose}>
          Close
        </button>
      </dialog>
    </>
  );
};

export default AssignmentGrade;