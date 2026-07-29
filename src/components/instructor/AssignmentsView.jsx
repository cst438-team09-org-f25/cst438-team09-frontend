import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;


const fetchAssignments = useCallback(async () => {
  setMessage('');

  try {
    const response = await fetch(
      `${GRADEBOOK_URL}/sections/${secNo}/assignments`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('jwt'),
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setAssignments(data);
    } else {
      const body = await response.json();
      setMessage(body);
    }
  } catch (err) {
    setMessage(err);
  }
}, [secNo]);

useEffect(() => {
  fetchAssignments();
}, [fetchAssignments]);

  const deleteAssignment = async (assignmentId) => {
    setMessage('');

    try {
      const response = await fetch(
        `${GRADEBOOK_URL}/assignments/${assignmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setMessage('Assignment deleted');
        await fetchAssignments();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const onDelete = (assignmentId) => {
    confirmAlert({
      title: 'Confirm assignment deletion',
      message: 'Do you really want to delete this assignment?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAssignment(assignmentId),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const headers = ['ID', 'Title', 'Due Date', '', '', ''];

  return (
    <div>
      <h3>
        Assignments for {courseId}, section {secNo}
      </h3>

      <Messages response={message} />

      <table className="Center">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>

              <td>
                <AssignmentUpdate
                  editAssignment={assignment}
                  onClose={fetchAssignments}
                />
              </td>

              <td>
                <button
                  type="button"
                  onClick={() => onDelete(assignment.id)}
                >
                  Delete
                </button>
              </td>

              <td>
                <AssignmentGrade assignment={assignment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignments.length === 0 && (
        <p>No assignments have been created for this section.</p>
      )}

      <AssignmentAdd
        secNo={secNo}
        secId={secId}
        courseId={courseId}
        onClose={fetchAssignments}
      />
    </div>
  );
};

export default AssignmentsView;