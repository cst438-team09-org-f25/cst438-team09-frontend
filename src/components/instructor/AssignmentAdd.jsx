import { useRef, useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo, secId, courseId }) => {
  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({
    title: '',
    dueDate: '',
  });

  const dialogRef = useRef();

  const editOpen = () => {
    setMessage('');
    setAssignment({
      title: '',
      dueDate: '',
    });

    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAssignment((previousAssignment) => ({
      ...previousAssignment,
      [name]: value,
    }));
  };

  const saveAssignment = async () => {
    setMessage('');

    if (assignment.title.trim() === '') {
      setMessage('Assignment title is required.');
      return;
    }

    if (assignment.dueDate === '') {
      setMessage('Assignment due date is required.');
      return;
    }

    const newAssignment = {
      id: 0,
      title: assignment.title.trim(),
      dueDate: assignment.dueDate,
      courseId,
      secId,
      secNo,
    };

    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        dialogRef.current.close();
        await onClose();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <>
      <button
        id="addAssignmentButton"
        type="button"
        onClick={editOpen}
      >
        Add Assignment
      </button>

      <dialog ref={dialogRef}>
        <h2>Add Assignment</h2>

        <Messages response={message} />

        <div>
          <label htmlFor="assignmentTitle">Title</label>
          <input
            id="assignmentTitle"
            name="title"
            type="text"
            maxLength="250"
            value={assignment.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="assignmentDueDate">Due Date</label>
          <input
            id="assignmentDueDate"
            name="dueDate"
            type="date"
            value={assignment.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <button id="closeAssignmentButton" type="button" onClick={editClose}>
            Close
          </button>

          <button id="saveAssignmentButton" type="button" onClick={saveAssignment}>
            Save
          </button>
        </div>
      </dialog>
    </>
  );
};

export default AssignmentAdd;
