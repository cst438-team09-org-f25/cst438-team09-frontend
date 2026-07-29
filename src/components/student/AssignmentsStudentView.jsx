import { useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const AssignmentsStudentView = () => {

  const [message, setMessage] = useState('');
  const [assignments, setAssignments] = useState([]);

  const fetchData = async ({ year, semester }) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments?year=${year}&semester=${semester}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const headers = ['Course ID', 'Assignment', 'Due Date', 'Section', 'Score'];

  return (
    <>
      <h3>Assignments</h3>
      <Messages response={message} />

      <SelectTerm buttonText="Get Assignments" onClick={fetchData} />

      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.assignmentId}>
              <td>{assignment.courseId}</td>
              <td>{assignment.title}</td>
              <td>{assignment.dueDate}</td>
              <td>{assignment.sectionId}</td>
              <td>{assignment.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AssignmentsStudentView;
