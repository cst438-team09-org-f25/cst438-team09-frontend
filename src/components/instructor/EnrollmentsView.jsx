import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
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
        setEnrollments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, []);

  const editChange = (event, enrollmentId) => {
    setEnrollments(enrollments.map((enrollment) =>
      enrollment.enrollmentId === enrollmentId
        ? { ...enrollment, grade: event.target.value }
        : enrollment
    ));
  }

  const saveGrades = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/enrollments`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(enrollments),
        }
      );
      if (response.ok) {
        setMessage('Grades saved');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.enrollmentId}>
              <td>{enrollment.enrollmentId}</td>
              <td>{enrollment.studentId}</td>
              <td>{enrollment.name}</td>
              <td>{enrollment.email}</td>
              <td>
                <input
                  type="text"
                  name="grade"
                  value={enrollment.grade || ''}
                  onChange={(event) => editChange(event, enrollment.enrollmentId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveGrades}>Save</button>
    </>
  );
}

export default EnrollmentsView;
