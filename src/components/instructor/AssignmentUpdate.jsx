import { useRef, useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {
  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState(editAssignment);

  const dialogRef = useRef();

  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
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

  const updateAssignment = async () => {
    setMessage('');

    if (assignment.title.trim() === '') {
      setMessage('Assignment title is required.');
      return;
    }

    if (assignment.dueDate === '') {
      setMessage('Assignment due date is required.');
      return;
    }

    const updatedAssignment = {
      ...assignment,
      title: assignment.title.trim(),
    };

    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(updatedAssignment),
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
      <button type="button" onClick={editOpen}>
        Edit
      </button>

      <dialog ref={dialogRef}>
        <h2>Update Assignment</h2>

        <Messages response={message} />

        <div>
          <label htmlFor={`assignmentTitle-${editAssignment.id}`}>
            Title
          </label>
          <input
            id={`assignmentTitle-${editAssignment.id}`}
            name="title"
            type="text"
            maxLength="250"
            value={assignment.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor={`assignmentDueDate-${editAssignment.id}`}>
            Due Date
          </label>
          <input
            id={`assignmentDueDate-${editAssignment.id}`}
            name="dueDate"
            type="date"
            value={assignment.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="button" onClick={editClose}>
            Close
          </button>

          <button type="button" onClick={updateAssignment}>
            Save
          </button>
        </div>
      </dialog>
    </>
  );
};

export default AssignmentUpdate;
