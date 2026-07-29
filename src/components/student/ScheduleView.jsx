import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const prefetchEnrollments = ({ year, semester }) => {
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
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
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        setEnrollments(enrollments.filter((course) => course.enrollmentId !== enrollmentId));
        setMessage('Enrollment dropped');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onDrop = (enrollmentId) => {
    confirmAlert({
      title: "Confirm to drop",
      message: "Do you really want to drop this course?",
      buttons: [
        {
          label: "Yes",
          onClick: () => dropEnrollment(enrollmentId),
        },
        {
          label: "No",
        },
      ],
    });
  }


  const headings = ["Year", "Semester", "Course ID", "Section", "Title", "Building", "Room", "Meeting Time", "Action"];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
      <table className="Center">
        <thead>
          <tr>
            {headings.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((course) => (
            <tr key={course.enrollmentId}>
              <td>{course.year}</td>
              <td>{course.semester}</td>
              <td>{course.courseId}</td>
              <td>{course.sectionId}</td>
              <td>{course.title}</td>
              <td>{course.building}</td>
              <td>{course.room}</td>
              <td>{course.times}</td>
              <td><button onClick={() => onDrop(course.enrollmentId)}>Drop</button></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );

}

export default ScheduleView;
